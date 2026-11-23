ALTER TABLE "guru"."uploads_kuis" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
ALTER TABLE "guru"."uploads_tugas" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
CREATE INDEX "guru_uploads_kuis_assignment_idx" ON "guru"."uploads_kuis" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "guru_uploads_tugas_assignment_idx" ON "guru"."uploads_tugas" USING btree ("assignment_id");