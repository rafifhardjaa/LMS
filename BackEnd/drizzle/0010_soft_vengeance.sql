CREATE TABLE "course_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"meeting_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"objective" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"teacher_id" uuid,
	"meeting_number" integer NOT NULL,
	"meeting_date" date NOT NULL,
	"day" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "course_code" varchar(50);--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "source_subject_code" varchar(50);--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "fase" varchar(5);--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "subject_group" varchar(50);--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "meeting_count" integer DEFAULT 16;--> statement-breakpoint
ALTER TABLE "course_materials" ADD CONSTRAINT "course_materials_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_meetings" ADD CONSTRAINT "course_meetings_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_meetings" ADD CONSTRAINT "course_meetings_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_meetings" ADD CONSTRAINT "course_meetings_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "course_materials_unique_idx" ON "course_materials" USING btree ("subject_id","meeting_number");--> statement-breakpoint
CREATE INDEX "course_materials_subject_idx" ON "course_materials" USING btree ("subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_meetings_unique_idx" ON "course_meetings" USING btree ("subject_id","class_id","meeting_number");--> statement-breakpoint
CREATE INDEX "course_meetings_class_subject_idx" ON "course_meetings" USING btree ("class_id","subject_id");--> statement-breakpoint
CREATE INDEX "course_meetings_teacher_idx" ON "course_meetings" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "course_meetings_date_idx" ON "course_meetings" USING btree ("meeting_date");--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_course_code_unique_idx" ON "subjects" USING btree ("course_code");