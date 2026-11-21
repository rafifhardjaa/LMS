ALTER TABLE "guru"."assignment_kuis" ADD COLUMN "score" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "guru"."assignment_kuis" ADD COLUMN "grading_status" varchar(16) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."assignment_kuis" ADD COLUMN "graded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "guru"."assignment_tugas" ADD COLUMN "score" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "guru"."assignment_tugas" ADD COLUMN "grading_status" varchar(16) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "guru"."assignment_tugas" ADD COLUMN "graded_at" timestamp with time zone;