CREATE TYPE "public"."uploader_role" AS ENUM('admin', 'guru', 'siswa');--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" RENAME COLUMN "size" TO "size_bytes";--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ALTER COLUMN "uploaded_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ALTER COLUMN "meeting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ALTER COLUMN "submission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" RENAME COLUMN "size" TO "size_bytes";--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ALTER COLUMN "uploaded_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ALTER COLUMN "meeting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ALTER COLUMN "submission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" RENAME COLUMN "size" TO "size_bytes";--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ALTER COLUMN "uploaded_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ALTER COLUMN "meeting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" RENAME COLUMN "size" TO "size_bytes";--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ALTER COLUMN "uploaded_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ALTER COLUMN "meeting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" RENAME COLUMN "size" TO "size_bytes";--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ALTER COLUMN "uploaded_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ALTER COLUMN "meeting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" RENAME COLUMN "size" TO "size_bytes";--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ALTER COLUMN "uploaded_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ALTER COLUMN "meeting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ALTER COLUMN "submission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" RENAME COLUMN "size" TO "size_bytes";--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ALTER COLUMN "uploaded_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ALTER COLUMN "meeting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ALTER COLUMN "submission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "checksum_sha256" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "uploader_role" "uploader_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "submitted_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD COLUMN "student_file_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "checksum_sha256" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "uploader_role" "uploader_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "submitted_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "student_file_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ADD COLUMN "checksum_sha256" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ADD COLUMN "uploader_role" "uploader_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "guru"."uploads_kuis" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ADD COLUMN "checksum_sha256" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ADD COLUMN "uploader_role" "uploader_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "guru"."uploads_materi" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ADD COLUMN "checksum_sha256" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ADD COLUMN "uploader_role" "uploader_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "checksum_sha256" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "uploader_role" "uploader_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "submitted_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "checksum_sha256" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "uploader_role" "uploader_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "submitted_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" ADD CONSTRAINT "guru_submission_kuis_student_file_fk" FOREIGN KEY ("student_file_id") REFERENCES "siswa"."up_submission_kuis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD CONSTRAINT "guru_submission_tugas_student_file_fk" FOREIGN KEY ("student_file_id") REFERENCES "siswa"."up_submission_tugas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "guru_submission_kuis_submission_idx" ON "guru"."submission_kuis" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "guru_submission_kuis_student_idx" ON "guru"."submission_kuis" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "guru_submission_kuis_meeting_idx" ON "guru"."submission_kuis" USING btree ("meeting_id");--> statement-breakpoint
CREATE INDEX "guru_submission_kuis_student_file_idx" ON "guru"."submission_kuis" USING btree ("student_file_id");--> statement-breakpoint
CREATE UNIQUE INDEX "guru_submission_tugas_submission_idx" ON "guru"."submission_tugas" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "guru_submission_tugas_student_idx" ON "guru"."submission_tugas" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "guru_submission_tugas_meeting_idx" ON "guru"."submission_tugas" USING btree ("meeting_id");--> statement-breakpoint
CREATE INDEX "guru_submission_tugas_student_file_idx" ON "guru"."submission_tugas" USING btree ("student_file_id");--> statement-breakpoint
CREATE INDEX "guru_uploads_kuis_meeting_idx" ON "guru"."uploads_kuis" USING btree ("meeting_id");--> statement-breakpoint
CREATE INDEX "guru_uploads_kuis_uploader_idx" ON "guru"."uploads_kuis" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "guru_uploads_kuis_deleted_idx" ON "guru"."uploads_kuis" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "guru_uploads_materi_meeting_idx" ON "guru"."uploads_materi" USING btree ("meeting_id");--> statement-breakpoint
CREATE INDEX "guru_uploads_materi_uploader_idx" ON "guru"."uploads_materi" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "guru_uploads_materi_deleted_idx" ON "guru"."uploads_materi" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "guru_uploads_tugas_meeting_idx" ON "guru"."uploads_tugas" USING btree ("meeting_id");--> statement-breakpoint
CREATE INDEX "guru_uploads_tugas_uploader_idx" ON "guru"."uploads_tugas" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "guru_uploads_tugas_deleted_idx" ON "guru"."uploads_tugas" USING btree ("is_deleted");--> statement-breakpoint
CREATE UNIQUE INDEX "siswa_up_submission_kuis_submission_idx" ON "siswa"."up_submission_kuis" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "siswa_up_submission_kuis_student_idx" ON "siswa"."up_submission_kuis" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "siswa_up_submission_kuis_meeting_idx" ON "siswa"."up_submission_kuis" USING btree ("meeting_id");--> statement-breakpoint
CREATE UNIQUE INDEX "siswa_up_submission_tugas_submission_idx" ON "siswa"."up_submission_tugas" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "siswa_up_submission_tugas_student_idx" ON "siswa"."up_submission_tugas" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "siswa_up_submission_tugas_meeting_idx" ON "siswa"."up_submission_tugas" USING btree ("meeting_id");--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" DROP COLUMN "data";--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" DROP COLUMN "data";