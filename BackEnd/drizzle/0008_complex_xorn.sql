ALTER TABLE "users" ADD COLUMN "nisn" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "jenis_kelamin" varchar(1);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tempat_lahir" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "angkatan" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_nisn_unique" UNIQUE("nisn");