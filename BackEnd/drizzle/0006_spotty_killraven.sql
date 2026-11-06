CREATE TABLE "jadwal_pelajaran" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"grade_level_id" uuid NOT NULL,
	"major_id" uuid NOT NULL,
	"hari" varchar(10) NOT NULL,
	"sesi" integer NOT NULL,
	"mulai" time NOT NULL,
	"selesai" time NOT NULL,
	"durasi" integer NOT NULL,
	"bentrok_kelas" integer DEFAULT 0,
	"durasi_lebih_dari_90" integer DEFAULT 0,
	"di_luar_jam_kerja" integer DEFAULT 0,
	"jatuh_di_istirahat" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_grade_level_id_grade_levels_id_fk" FOREIGN KEY ("grade_level_id") REFERENCES "public"."grade_levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "jadwal_pelajaran_class_hari_sesi_idx" ON "jadwal_pelajaran" USING btree ("class_id","hari","sesi");--> statement-breakpoint
CREATE INDEX "jadwal_pelajaran_subject_idx" ON "jadwal_pelajaran" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "jadwal_pelajaran_major_idx" ON "jadwal_pelajaran" USING btree ("major_id");