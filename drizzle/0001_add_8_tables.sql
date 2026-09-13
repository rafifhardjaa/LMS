-- Add 8 new tables for LMS SIMANIS

CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL REFERENCES "modules"("id") ON DELETE CASCADE,
	"title" varchar(150) NOT NULL,
	"content" text,
	"video_url" text,
	"attachment_url" text,
	"order_index" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"subject_id" uuid NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
	"status" varchar(20) DEFAULT 'active',
	"enrolled_at" timestamp DEFAULT now()
);

CREATE TABLE "lesson_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL REFERENCES "enrollments"("id") ON DELETE CASCADE,
	"lesson_id" uuid NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp
);

CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL REFERENCES "modules"("id") ON DELETE CASCADE,
	"created_by" uuid REFERENCES "users"("id") ON DELETE SET NULL,
	"title" varchar(150) NOT NULL,
	"description" text,
	"due_date" timestamp,
	"max_score" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "assignment_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL REFERENCES "assignments"("id") ON DELETE CASCADE,
	"student_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"file_url" text NOT NULL,
	"attempt_number" integer DEFAULT 1,
	"submitted_at" timestamp DEFAULT now()
);

CREATE TABLE "grades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL REFERENCES "assignment_attempts"("id") ON DELETE CASCADE,
	"score" integer NOT NULL,
	"feedback" text,
	"graded_by" uuid REFERENCES "users"("id") ON DELETE SET NULL,
	"graded_at" timestamp DEFAULT now()
);

CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
	"student_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"title" varchar(150) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50),
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
