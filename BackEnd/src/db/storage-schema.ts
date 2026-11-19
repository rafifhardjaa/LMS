import {
  bigint,
  boolean,
  customType,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgSchema,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Uint8Array; driverData: Uint8Array }>({
  dataType() {
    return "bytea";
  },
});

export const guruStorage = pgSchema("guru");
export const siswaStorage = pgSchema("siswa");

export const uploaderRoleEnum = pgEnum("uploader_role", [
  "admin",
  "guru",
  "siswa",
]);

export const uploadedFiles = pgTable("uploaded_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 127 }).notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  uploadedBy: uuid("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

function metadataColumns() {
  return {
    id: uuid("id").defaultRandom().primaryKey(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 127 }).notNull(),
    size: bigint("size_bytes", { mode: "number" }).notNull(),
    checksumSha256: varchar("checksum_sha256", { length: 64 }).notNull(),
    uploadedBy: uuid("uploaded_by").notNull(),
    uploaderRole: uploaderRoleEnum("uploader_role").notNull(),
    meetingId: uuid("meeting_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    deletedBy: uuid("deleted_by"),
  };
}

function fileColumns() {
  return {
    ...metadataColumns(),
    data: bytea("data").notNull(),
  };
}

function submissionMetaColumns() {
  return {
    ...metadataColumns(),
    studentId: uuid("student_id").notNull(),
    submissionId: uuid("submission_id").notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  };
}

function submissionColumns() {
  return {
    ...submissionMetaColumns(),
    data: bytea("data").notNull(),
  };
}

function teacherSubmissionColumns() {
  return {
    ...submissionMetaColumns(),
    studentFileId: uuid("student_file_id").notNull(),
  };
}

export const guruUploadsMateri = guruStorage.table(
  "uploads_materi",
  fileColumns(),
  (table) => ({
    meetingIdx: index("guru_uploads_materi_meeting_idx").on(table.meetingId),
    uploaderIdx: index("guru_uploads_materi_uploader_idx").on(table.uploadedBy),
    deletedIdx: index("guru_uploads_materi_deleted_idx").on(table.isDeleted),
  }),
);
export const guruUploadsTugas = guruStorage.table(
  "uploads_tugas",
  fileColumns(),
  (table) => ({
    meetingIdx: index("guru_uploads_tugas_meeting_idx").on(table.meetingId),
    uploaderIdx: index("guru_uploads_tugas_uploader_idx").on(table.uploadedBy),
    deletedIdx: index("guru_uploads_tugas_deleted_idx").on(table.isDeleted),
  }),
);
export const guruUploadsKuis = guruStorage.table(
  "uploads_kuis",
  fileColumns(),
  (table) => ({
    meetingIdx: index("guru_uploads_kuis_meeting_idx").on(table.meetingId),
    uploaderIdx: index("guru_uploads_kuis_uploader_idx").on(table.uploadedBy),
    deletedIdx: index("guru_uploads_kuis_deleted_idx").on(table.isDeleted),
  }),
);

export const siswaUpSubmissionTugas = siswaStorage.table(
  "up_submission_tugas",
  submissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("siswa_up_submission_tugas_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("siswa_up_submission_tugas_student_idx").on(
      table.studentId,
    ),
    meetingIdx: index("siswa_up_submission_tugas_meeting_idx").on(
      table.meetingId,
    ),
  }),
);
export const siswaUpSubmissionKuis = siswaStorage.table(
  "up_submission_kuis",
  submissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("siswa_up_submission_kuis_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("siswa_up_submission_kuis_student_idx").on(
      table.studentId,
    ),
    meetingIdx: index("siswa_up_submission_kuis_meeting_idx").on(
      table.meetingId,
    ),
  }),
);

export const guruSubmissionTugas = guruStorage.table(
  "submission_tugas",
  teacherSubmissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("guru_submission_tugas_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("guru_submission_tugas_student_idx").on(table.studentId),
    meetingIdx: index("guru_submission_tugas_meeting_idx").on(table.meetingId),
    studentFileIdx: index("guru_submission_tugas_student_file_idx").on(
      table.studentFileId,
    ),
    studentFileFk: foreignKey({
      columns: [table.studentFileId],
      foreignColumns: [siswaUpSubmissionTugas.id],
      name: "guru_submission_tugas_student_file_fk",
    }).onDelete("cascade"),
  }),
);
export const guruSubmissionKuis = guruStorage.table(
  "submission_kuis",
  teacherSubmissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("guru_submission_kuis_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("guru_submission_kuis_student_idx").on(table.studentId),
    meetingIdx: index("guru_submission_kuis_meeting_idx").on(table.meetingId),
    studentFileIdx: index("guru_submission_kuis_student_file_idx").on(
      table.studentFileId,
    ),
    studentFileFk: foreignKey({
      columns: [table.studentFileId],
      foreignColumns: [siswaUpSubmissionKuis.id],
      name: "guru_submission_kuis_student_file_fk",
    }).onDelete("cascade"),
  }),
);
