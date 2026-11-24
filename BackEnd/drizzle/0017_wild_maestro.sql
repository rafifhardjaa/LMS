CREATE TABLE "student_subject_grades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"academic_period_id" uuid NOT NULL,
	"tugas_score" numeric(5, 2),
	"kuis_score" numeric(5, 2),
	"uts_score" numeric(5, 2),
	"uas_score" numeric(5, 2),
	"final_score" numeric(5, 2),
	"tugas_count" integer DEFAULT 0 NOT NULL,
	"kuis_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject_grade_weights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"academic_period_id" uuid NOT NULL,
	"tugas_weight" numeric(5, 2) DEFAULT 20 NOT NULL,
	"kuis_weight" numeric(5, 2) DEFAULT 20 NOT NULL,
	"uts_weight" numeric(5, 2) DEFAULT 30 NOT NULL,
	"uas_weight" numeric(5, 2) DEFAULT 30 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_subject_grades" ADD CONSTRAINT "student_subject_grades_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_subject_grades" ADD CONSTRAINT "student_subject_grades_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_subject_grades" ADD CONSTRAINT "student_subject_grades_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_subject_grades" ADD CONSTRAINT "student_subject_grades_academic_period_id_academic_periods_id_fk" FOREIGN KEY ("academic_period_id") REFERENCES "public"."academic_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_grade_weights" ADD CONSTRAINT "subject_grade_weights_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_grade_weights" ADD CONSTRAINT "subject_grade_weights_academic_period_id_academic_periods_id_fk" FOREIGN KEY ("academic_period_id") REFERENCES "public"."academic_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "student_subject_grades_student_subject_period_unique" ON "student_subject_grades" USING btree ("student_id","subject_id","academic_period_id");--> statement-breakpoint
CREATE INDEX "student_subject_grades_class_subject_period_idx" ON "student_subject_grades" USING btree ("class_id","subject_id","academic_period_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subject_grade_weights_subject_period_unique" ON "subject_grade_weights" USING btree ("subject_id","academic_period_id");