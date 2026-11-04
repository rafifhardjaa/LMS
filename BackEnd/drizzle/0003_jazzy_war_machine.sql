CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"section" varchar(5) NOT NULL,
	"major_id" uuid NOT NULL,
	"grade_level_id" uuid NOT NULL,
	"capacity" integer DEFAULT 10 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grade_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "grade_levels_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "majors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "majors_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "teacher_classrooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_code_unique";--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "major_id" uuid;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "grade_level_id" uuid;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "semester" varchar(20) DEFAULT 'Ganjil' NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "academic_year" varchar(20) DEFAULT '2026/2027' NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "class_id" uuid;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_grade_level_id_grade_levels_id_fk" FOREIGN KEY ("grade_level_id") REFERENCES "public"."grade_levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_classrooms" ADD CONSTRAINT "teacher_classrooms_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_classrooms" ADD CONSTRAINT "teacher_classrooms_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "classes_major_idx" ON "classes" USING btree ("major_id");--> statement-breakpoint
CREATE INDEX "classes_grade_level_idx" ON "classes" USING btree ("grade_level_id");--> statement-breakpoint
CREATE INDEX "classes_name_idx" ON "classes" USING btree ("name","major_id","grade_level_id");--> statement-breakpoint
CREATE INDEX "grade_levels_code_idx" ON "grade_levels" USING btree ("code");--> statement-breakpoint
CREATE INDEX "majors_code_idx" ON "majors" USING btree ("code");--> statement-breakpoint
CREATE INDEX "teacher_classrooms_teacher_idx" ON "teacher_classrooms" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_classrooms_class_idx" ON "teacher_classrooms" USING btree ("class_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_classrooms_unique_idx" ON "teacher_classrooms" USING btree ("teacher_id","class_id");--> statement-breakpoint
CREATE INDEX "teacher_subjects_teacher_idx" ON "teacher_subjects" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_subjects_subject_idx" ON "teacher_subjects" USING btree ("subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_subjects_unique_idx" ON "teacher_subjects" USING btree ("teacher_id","subject_id");--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_grade_level_id_grade_levels_id_fk" FOREIGN KEY ("grade_level_id") REFERENCES "public"."grade_levels"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subjects_code_idx" ON "subjects" USING btree ("code","grade_level_id","semester","academic_year");--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_code_unique_idx" ON "subjects" USING btree ("code","grade_level_id","semester","academic_year");--> statement-breakpoint
CREATE INDEX "subjects_major_idx" ON "subjects" USING btree ("major_id");--> statement-breakpoint
CREATE INDEX "subjects_grade_level_idx" ON "subjects" USING btree ("grade_level_id");