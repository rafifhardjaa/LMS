CREATE TABLE "assignments" (
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
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_meeting_id_course_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."course_meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assignments_meeting_idx" ON "assignments" USING btree ("meeting_id");--> statement-breakpoint
CREATE INDEX "assignments_meeting_type_idx" ON "assignments" USING btree ("meeting_id","type");--> statement-breakpoint
CREATE INDEX "assignments_subject_class_idx" ON "assignments" USING btree ("subject_id","class_id");--> statement-breakpoint
CREATE INDEX "assignments_teacher_idx" ON "assignments" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "assignments_meeting_order_idx" ON "assignments" USING btree ("meeting_id","order_index");