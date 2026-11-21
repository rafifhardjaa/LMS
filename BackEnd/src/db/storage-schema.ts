import {
  bigint,
  boolean,
  customType,
  foreignKey,
  index,
  integer,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  text,
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

export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id").notNull(),
  classId: uuid("class_id").notNull(),
  meetingId: uuid("meeting_id").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  deadlineAt: timestamp("deadline_at", { withTimezone: true }).notNull(),
  createdBy: uuid("created_by"),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  meetingIdx: index("assignments_meeting_idx").on(table.meetingId),
  meetingTypeIdx: index("assignments_meeting_type_idx").on(
    table.meetingId,
    table.type,
  ),
  subjectClassIdx: index("assignments_subject_class_idx").on(
    table.subjectId,
    table.classId,
  ),
  teacherIdx: index("assignments_teacher_idx").on(table.createdBy),
  meetingOrderIdx: index("assignments_meeting_order_idx").on(
    table.meetingId,
    table.orderIndex,
  ),
}));

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
    assignmentId: uuid("assignment_id"),
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
    score: numeric("score", { precision: 5, scale: 2 }),
    gradingStatus: varchar("grading_status", { length: 16 })
      .default("pending")
      .notNull(),
    gradedAt: timestamp("graded_at", { withTimezone: true }),
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

export const siswaUpAssignmentTugas = siswaStorage.table(
  "up_assignment_tugas",
  submissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("siswa_up_assignment_tugas_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("siswa_up_assignment_tugas_student_idx").on(
      table.studentId,
    ),
    meetingIdx: index("siswa_up_assignment_tugas_meeting_idx").on(
      table.meetingId,
    ),
    assignmentStudentIdx: index(
      "siswa_up_assignment_tugas_assignment_student_idx",
    ).on(table.assignmentId, table.studentId),
  }),
);
export const siswaUpAssignmentKuis = siswaStorage.table(
  "up_assignment_kuis",
  submissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("siswa_up_assignment_kuis_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("siswa_up_assignment_kuis_student_idx").on(
      table.studentId,
    ),
    meetingIdx: index("siswa_up_assignment_kuis_meeting_idx").on(
      table.meetingId,
    ),
    assignmentStudentIdx: index(
      "siswa_up_assignment_kuis_assignment_student_idx",
    ).on(table.assignmentId, table.studentId),
  }),
);

export const guruAssignmentTugas = guruStorage.table(
  "assignment_tugas",
  teacherSubmissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("guru_assignment_tugas_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("guru_assignment_tugas_student_idx").on(table.studentId),
    meetingIdx: index("guru_assignment_tugas_meeting_idx").on(table.meetingId),
    studentFileIdx: index("guru_assignment_tugas_student_file_idx").on(
      table.studentFileId,
    ),
    assignmentIdx: index("guru_assignment_tugas_assignment_idx").on(
      table.assignmentId,
    ),
    studentFileFk: foreignKey({
      columns: [table.studentFileId],
      foreignColumns: [siswaUpAssignmentTugas.id],
      name: "guru_assignment_tugas_student_file_fk",
    }).onDelete("cascade"),
  }),
);
export const guruAssignmentKuis = guruStorage.table(
  "assignment_kuis",
  teacherSubmissionColumns(),
  (table) => ({
    submissionIdx: uniqueIndex("guru_assignment_kuis_submission_idx").on(
      table.submissionId,
    ),
    studentIdx: index("guru_assignment_kuis_student_idx").on(table.studentId),
    meetingIdx: index("guru_assignment_kuis_meeting_idx").on(table.meetingId),
    studentFileIdx: index("guru_assignment_kuis_student_file_idx").on(
      table.studentFileId,
    ),
    assignmentIdx: index("guru_assignment_kuis_assignment_idx").on(
      table.assignmentId,
    ),
    studentFileFk: foreignKey({
      columns: [table.studentFileId],
      foreignColumns: [siswaUpAssignmentKuis.id],
      name: "guru_assignment_kuis_student_file_fk",
    }).onDelete("cascade"),
  }),
);
