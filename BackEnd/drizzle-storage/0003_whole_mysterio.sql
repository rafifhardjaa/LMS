ALTER TABLE "guru"."submission_kuis" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
ALTER TABLE "guru"."submission_tugas" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_kuis" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
ALTER TABLE "siswa"."up_submission_tugas" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
CREATE INDEX "guru_submission_kuis_assignment_idx" ON "guru"."submission_kuis" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "guru_submission_tugas_assignment_idx" ON "guru"."submission_tugas" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "siswa_up_submission_kuis_assignment_student_idx" ON "siswa"."up_submission_kuis" USING btree ("assignment_id","student_id");--> statement-breakpoint
CREATE INDEX "siswa_up_submission_tugas_assignment_student_idx" ON "siswa"."up_submission_tugas" USING btree ("assignment_id","student_id");