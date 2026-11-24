INSERT INTO "academic_periods" ("name", "start_date", "end_date", "is_active")
VALUES ('Ganjil 2026/2027', '2026-07-20', '2026-11-10', true)
ON CONFLICT ("name") DO UPDATE
SET "start_date" = excluded."start_date",
    "end_date" = excluded."end_date",
    "is_active" = excluded."is_active",
    "updated_at" = now();