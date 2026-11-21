-- Data contoh untuk halaman teacher/manage-task
-- Target: Lina Ramadhan (d47cf47f-...), course pertama: LTJBL-XII-TJKT / XII TJKT D
-- Jalankan terhadap STORAGE_DATABASE_URL.

DELETE FROM guru.assignment_tugas
WHERE assignment_id IN (
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003'
);

DELETE FROM guru.assignment_kuis
WHERE assignment_id IN (
  '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);

DELETE FROM siswa.up_assignment_tugas
WHERE assignment_id IN (
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003'
);

DELETE FROM siswa.up_assignment_kuis
WHERE assignment_id IN (
  '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);

DELETE FROM public.assignments
WHERE id IN (
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);

INSERT INTO public.assignments (
  id, subject_id, class_id, meeting_id, type, title, description,
  start_at, deadline_at, created_by, order_index
) VALUES
  (
    '10000000-0000-4000-8000-000000000001',
    '0b7e5da8-4518-40a8-8e3f-3b9bea90c2b0',
    '47045d0e-d2b2-4a65-8653-c88644e00bfa',
    'bb57614c-f6ac-4830-879c-db49dc71a12f',
    'tugas',
    'Tugas 1: Konfigurasi VLAN',
    'Konfigurasi VLAN dan trunking pada topologi jaringan kelas.',
    '2026-11-10 08:00:00+07',
    '2026-11-18 23:59:00+07',
    'd47cf47f-9d75-4856-855c-fa88f1f9e08d',
    1
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '0b7e5da8-4518-40a8-8e3f-3b9bea90c2b0',
    '47045d0e-d2b2-4a65-8653-c88644e00bfa',
    'b3b7832c-bd00-4280-bf7f-0a28a34557a4',
    'tugas',
    'Tugas 2: Routing Statis',
    'Konfigurasi routing statis antar tiga jaringan.',
    '2026-11-18 08:00:00+07',
    '2026-11-24 23:59:00+07',
    'd47cf47f-9d75-4856-855c-fa88f1f9e08d',
    2
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    '0b7e5da8-4518-40a8-8e3f-3b9bea90c2b0',
    '47045d0e-d2b2-4a65-8653-c88644e00bfa',
    '74eac605-61a6-4c11-b8bd-b61c89514481',
    'tugas',
    'Tugas 3: Network Monitoring',
    'Analisis monitoring trafik dan dokumentasi hasil pengukuran.',
    '2026-11-20 08:00:00+07',
    '2026-12-05 23:59:00+07',
    'd47cf47f-9d75-4856-855c-fa88f1f9e08d',
    3
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    '0b7e5da8-4518-40a8-8e3f-3b9bea90c2b0',
    '47045d0e-d2b2-4a65-8653-c88644e00bfa',
    'b3b7832c-bd00-4280-bf7f-0a28a34557a4',
    'kuis',
    'Kuis 1: Dasar TCP/IP',
    'Kuis singkat mengenai addressing, subnetting, dan protokol TCP/IP.',
    '2026-11-17 08:00:00+07',
    '2026-11-22 23:59:00+07',
    'd47cf47f-9d75-4856-855c-fa88f1f9e08d',
    4
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    '0b7e5da8-4518-40a8-8e3f-3b9bea90c2b0',
    '47045d0e-d2b2-4a65-8653-c88644e00bfa',
    '74eac605-61a6-4c11-b8bd-b61c89514481',
    'kuis',
    'Kuis 2: Keamanan Jaringan',
    'Kuis mengenai firewall, ACL, dan praktik keamanan jaringan.',
    '2026-11-21 08:00:00+07',
    '2026-12-10 23:59:00+07',
    'd47cf47f-9d75-4856-855c-fa88f1f9e08d',
    5
  );

WITH students(id, ordinal) AS (
  VALUES
    ('fb86b076-1db0-4d47-8078-70a25902ac10'::uuid, 1),
    ('0effa0fe-c637-4531-a307-f2e4e8723f0e'::uuid, 2),
    ('134ddd70-3282-49af-acec-8dd46b9a86dd'::uuid, 3),
    ('95a7a4ce-3519-4ab2-8bce-a80ef106e6b2'::uuid, 4),
    ('50837078-c8b3-4631-be29-bd4d227a96a8'::uuid, 5),
    ('6798dfdc-8768-4f04-84c2-b5353dbe01e3'::uuid, 6),
    ('cdaa5243-4603-418a-a4d4-15cd0e425932'::uuid, 7),
    ('55be79f0-3433-46a2-93ef-dd7176b35151'::uuid, 8),
    ('b4efb865-bbad-4363-810f-477e093acde8'::uuid, 9),
    ('12295908-a4d7-4195-ba68-d7da304e0ba9'::uuid, 10),
    ('abd3fb91-0424-442c-a5b6-944e1b072a18'::uuid, 11),
    ('6bf032f2-d50c-4281-93ba-36b085062366'::uuid, 12),
    ('f8a2567f-4a47-48cf-b956-165b6cd822db'::uuid, 13),
    ('aec41192-8c3e-48d9-a1cf-881e714a64d0'::uuid, 14),
    ('cdd8e450-1ad2-44e1-a3f2-11622af6559c'::uuid, 15),
    ('d7e97777-380a-4f86-b06c-856124c57817'::uuid, 16),
    ('43b79e31-141f-4efc-91ef-dd5b50b85ceb'::uuid, 17),
    ('927dd24b-182f-4d98-a061-019f475713a9'::uuid, 18),
    ('de57dc87-01e3-4432-826f-26960b87d18e'::uuid, 19),
    ('b2d3c2e3-5990-423f-9f3b-77e22aa8981c'::uuid, 20)
),
assignments(seq, assignment_id, meeting_id, title, type, student_limit) AS (
  VALUES
    (1, '10000000-0000-4000-8000-000000000001'::uuid, 'bb57614c-f6ac-4830-879c-db49dc71a12f'::uuid, 'Tugas 1: Konfigurasi VLAN', 'tugas', 18),
    (2, '10000000-0000-4000-8000-000000000002'::uuid, 'b3b7832c-bd00-4280-bf7f-0a28a34557a4'::uuid, 'Tugas 2: Routing Statis', 'tugas', 15),
    (3, '10000000-0000-4000-8000-000000000003'::uuid, '74eac605-61a6-4c11-b8bd-b61c89514481'::uuid, 'Tugas 3: Network Monitoring', 'tugas', 12),
    (4, '10000000-0000-4000-8000-000000000004'::uuid, 'b3b7832c-bd00-4280-bf7f-0a28a34557a4'::uuid, 'Kuis 1: Dasar TCP/IP', 'kuis', 16),
    (5, '10000000-0000-4000-8000-000000000005'::uuid, '74eac605-61a6-4c11-b8bd-b61c89514481'::uuid, 'Kuis 2: Keamanan Jaringan', 'kuis', 10)
),
prepared AS (
  SELECT
    a.seq,
    a.assignment_id,
    a.meeting_id,
    a.type,
    s.id AS student_id,
    s.ordinal,
    replace(lower(a.title), ' ', '-') || '-' || lpad(s.ordinal::text, 2, '0') || '.pdf' AS filename,
    ('20000000-0000-4000-8000-' || lpad(to_hex(a.seq), 4, '0') || lpad(to_hex(s.ordinal), 8, '0'))::uuid AS submission_id,
    now() - ((s.ordinal - 1) % 8) * interval '1 day' AS submitted_at,
    CASE
      WHEN s.ordinal % 7 = 0 THEN 'revision'
      WHEN s.ordinal % 5 = 0 THEN 'pending'
      ELSE 'graded'
    END AS grading_status,
    CASE
      WHEN s.ordinal % 7 = 0 THEN (55 + s.ordinal % 20)::numeric
      WHEN s.ordinal % 5 = 0 THEN NULL
      ELSE (78 + s.ordinal % 20)::numeric
    END AS score,
    decode('255044462d312e340a25e2e3cfd30a0a', 'hex') AS file_data
  FROM assignments a
  JOIN students s ON s.ordinal <= a.student_limit
),
inserted_siswa_tugas AS (
  INSERT INTO siswa.up_assignment_tugas (
    id, filename, mime_type, size_bytes, checksum_sha256, uploaded_by,
    uploader_role, meeting_id, student_id, submission_id, submitted_at,
    assignment_id, data
  )
  SELECT
    ('30000000-0000-4000-8000-' || lpad(to_hex(seq), 4, '0') || lpad(to_hex(ordinal), 8, '0'))::uuid,
    filename,
    'application/pdf',
    16,
    repeat('a', 64),
    student_id,
    'siswa'::public.uploader_role,
    meeting_id,
    student_id,
    submission_id,
    submitted_at,
    assignment_id,
    file_data
  FROM prepared
  WHERE type = 'tugas'
  RETURNING id, submission_id
),
inserted_siswa_kuis AS (
  INSERT INTO siswa.up_assignment_kuis (
    id, filename, mime_type, size_bytes, checksum_sha256, uploaded_by,
    uploader_role, meeting_id, student_id, submission_id, submitted_at,
    assignment_id, data
  )
  SELECT
    ('30000000-0000-4000-8000-' || lpad(to_hex(seq), 4, '0') || lpad(to_hex(ordinal), 8, '0'))::uuid,
    filename,
    'application/pdf',
    16,
    repeat('a', 64),
    student_id,
    'siswa'::public.uploader_role,
    meeting_id,
    student_id,
    submission_id,
    submitted_at,
    assignment_id,
    file_data
  FROM prepared
  WHERE type = 'kuis'
  RETURNING id, submission_id
),
inserted_guru_tugas AS (
  INSERT INTO guru.assignment_tugas (
    id, filename, mime_type, size_bytes, checksum_sha256, uploaded_by,
    uploader_role, meeting_id, student_id, submission_id, submitted_at,
    assignment_id, student_file_id, score, grading_status, graded_at
  )
  SELECT
    ('40000000-0000-4000-8000-' || lpad(to_hex(p.seq), 4, '0') || lpad(to_hex(p.ordinal), 8, '0'))::uuid,
    p.filename,
    'application/pdf',
    16,
    repeat('a', 64),
    p.student_id,
    'siswa'::public.uploader_role,
    p.meeting_id,
    p.student_id,
    p.submission_id,
    p.submitted_at,
    p.assignment_id,
    s.id,
    p.score,
    p.grading_status,
    CASE WHEN p.grading_status = 'pending' THEN NULL ELSE now() END
  FROM inserted_siswa_tugas s
  JOIN prepared p ON p.submission_id = s.submission_id
  RETURNING id
),
inserted_guru_kuis AS (
  INSERT INTO guru.assignment_kuis (
    id, filename, mime_type, size_bytes, checksum_sha256, uploaded_by,
    uploader_role, meeting_id, student_id, submission_id, submitted_at,
    assignment_id, student_file_id, score, grading_status, graded_at
  )
  SELECT
    ('40000000-0000-4000-8000-' || lpad(to_hex(p.seq), 4, '0') || lpad(to_hex(p.ordinal), 8, '0'))::uuid,
    p.filename,
    'application/pdf',
    16,
    repeat('a', 64),
    p.student_id,
    'siswa'::public.uploader_role,
    p.meeting_id,
    p.student_id,
    p.submission_id,
    p.submitted_at,
    p.assignment_id,
    s.id,
    p.score,
    p.grading_status,
    CASE WHEN p.grading_status = 'pending' THEN NULL ELSE now() END
  FROM inserted_siswa_kuis s
  JOIN prepared p ON p.submission_id = s.submission_id
  RETURNING id
)
SELECT
  (SELECT count(*) FROM inserted_siswa_tugas) AS tugas_submissions,
  (SELECT count(*) FROM inserted_siswa_kuis) AS kuis_submissions,
  (SELECT count(*) FROM inserted_guru_tugas) AS tugas_grading_rows,
  (SELECT count(*) FROM inserted_guru_kuis) AS kuis_grading_rows;
