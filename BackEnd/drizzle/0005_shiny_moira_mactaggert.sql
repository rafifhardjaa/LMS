DROP INDEX "subjects_code_idx";--> statement-breakpoint
DROP INDEX "subjects_code_unique_idx";--> statement-breakpoint
CREATE INDEX "subjects_code_idx" ON "subjects" USING btree ("code","grade_level_id","semester");--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_code_unique_idx" ON "subjects" USING btree ("code","grade_level_id","semester");--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "academic_year";