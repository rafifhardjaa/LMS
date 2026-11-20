CREATE TABLE "public"."assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"meeting_id" uuid NOT NULL,
	"type" varchar(10) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"start_at" timestamp with time zone NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	"created_by" uuid,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "assignments_meeting_idx" ON "public"."assignments" USING btree ("meeting_id");--> statement-breakpoint
CREATE INDEX "assignments_meeting_type_idx" ON "public"."assignments" USING btree ("meeting_id","type");--> statement-breakpoint
CREATE INDEX "assignments_subject_class_idx" ON "public"."assignments" USING btree ("subject_id","class_id");--> statement-breakpoint
CREATE INDEX "assignments_teacher_idx" ON "public"."assignments" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "assignments_meeting_order_idx" ON "public"."assignments" USING btree ("meeting_id","order_index");--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" RENAME TO "up_assignment_tugas";--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" RENAME TO "up_assignment_kuis";--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" RENAME TO "assignment_tugas";--> statement-breakpoint
ALTER TABLE "guru"."submission_kuis" RENAME TO "assignment_kuis";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_tugas_submission_idx" RENAME TO "siswa_up_assignment_tugas_submission_idx";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_tugas_student_idx" RENAME TO "siswa_up_assignment_tugas_student_idx";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_tugas_meeting_idx" RENAME TO "siswa_up_assignment_tugas_meeting_idx";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_tugas_assignment_student_idx" RENAME TO "siswa_up_assignment_tugas_assignment_student_idx";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_kuis_submission_idx" RENAME TO "siswa_up_assignment_kuis_submission_idx";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_kuis_student_idx" RENAME TO "siswa_up_assignment_kuis_student_idx";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_kuis_meeting_idx" RENAME TO "siswa_up_assignment_kuis_meeting_idx";--> statement-breakpoint
ALTER INDEX "siswa"."siswa_up_submission_kuis_assignment_student_idx" RENAME TO "siswa_up_assignment_kuis_assignment_student_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_tugas_submission_idx" RENAME TO "guru_assignment_tugas_submission_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_tugas_student_idx" RENAME TO "guru_assignment_tugas_student_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_tugas_meeting_idx" RENAME TO "guru_assignment_tugas_meeting_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_tugas_student_file_idx" RENAME TO "guru_assignment_tugas_student_file_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_tugas_assignment_idx" RENAME TO "guru_assignment_tugas_assignment_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_kuis_submission_idx" RENAME TO "guru_assignment_kuis_submission_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_kuis_student_idx" RENAME TO "guru_assignment_kuis_student_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_kuis_meeting_idx" RENAME TO "guru_assignment_kuis_meeting_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_kuis_student_file_idx" RENAME TO "guru_assignment_kuis_student_file_idx";--> statement-breakpoint
ALTER INDEX "guru"."guru_submission_kuis_assignment_idx" RENAME TO "guru_assignment_kuis_assignment_idx";--> statement-breakpoint
ALTER TABLE "guru"."assignment_tugas" RENAME CONSTRAINT "guru_submission_tugas_student_file_fk" TO "guru_assignment_tugas_student_file_fk";--> statement-breakpoint
ALTER TABLE "guru"."assignment_kuis" RENAME CONSTRAINT "guru_submission_kuis_student_file_fk" TO "guru_assignment_kuis_student_file_fk";
