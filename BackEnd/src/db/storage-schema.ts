import {
  customType,
  integer,
  pgSchema,
  pgTable,
  timestamp,
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

export const uploadedFiles = pgTable("uploaded_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 127 }).notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  uploadedBy: uuid("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

function fileColumns() {
  return {
    id: uuid("id").defaultRandom().primaryKey(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 127 }).notNull(),
    size: integer("size").notNull(),
    data: bytea("data").notNull(),
    uploadedBy: uuid("uploaded_by"),
    meetingId: uuid("meeting_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  };
}

function submissionColumns() {
  return {
    ...fileColumns(),
    studentId: uuid("student_id"),
    submissionId: uuid("submission_id"),
  };
}

export const guruUploadsMateri = guruStorage.table("uploads_materi", fileColumns);
export const guruUploadsTugas = guruStorage.table("uploads_tugas", fileColumns);
export const guruSubmissionTugas = guruStorage.table(
  "submission_tugas",
  submissionColumns,
);
export const guruUploadsKuis = guruStorage.table("uploads_kuis", fileColumns);
export const guruSubmissionKuis = guruStorage.table(
  "submission_kuis",
  submissionColumns,
);

export const siswaUpSubmissionTugas = siswaStorage.table(
  "up_submission_tugas",
  submissionColumns,
);
export const siswaUpSubmissionKuis = siswaStorage.table(
  "up_submission_kuis",
  submissionColumns,
);
