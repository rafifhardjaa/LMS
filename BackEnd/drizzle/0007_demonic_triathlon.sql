CREATE TABLE "teaching_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jadwal_pelajaran" ADD COLUMN "teacher_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kode_guru" varchar(50);--> statement-breakpoint
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teaching_assignments" ADD CONSTRAINT "teaching_assignments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "teaching_assignments_teacher_idx" ON "teaching_assignments" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teaching_assignments_subject_idx" ON "teaching_assignments" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "teaching_assignments_class_idx" ON "teaching_assignments" USING btree ("class_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teaching_assignments_unique_idx" ON "teaching_assignments" USING btree ("teacher_id","subject_id","class_id");--> statement-breakpoint
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "jadwal_pelajaran_teacher_hari_sesi_idx" ON "jadwal_pelajaran" USING btree ("teacher_id","hari","sesi");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_kode_guru_unique" UNIQUE("kode_guru");