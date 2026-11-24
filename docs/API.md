# SiManis LMS — Referensi API

Dokumentasi lengkap seluruh endpoint backend SiManis LMS. Sumber kebenaran adalah
route Elysia di `BackEnd/src/routes/*.ts` dan `BackEnd/src/index.ts`.

- Base URL development: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs` atau `http://localhost:3000/swagger`
- Frontend memanggil API lewat BFF same-origin Next.js (`/api/v1/*`), bukan langsung ke backend.

## Konvensi

### Autentikasi

Endpoint bertanda **Bearer** wajib mengirim header:

```
Authorization: Bearer <token>
```

Token didapat dari `POST /api/v1/auth/login`. Endpoint bertanda **—** bersifat publik
(beberapa di antaranya dibatasi rate limit).

### Role

| Role | Keterangan |
|---|---|
| `admin` | Akses penuh, termasuk seluruh operasi tulis master data |
| `guru` | Kelola konten ajar, tugas, nilai, dan presensi kelas yang diampu |
| `siswa` | Baca konten, enroll, kumpulkan tugas, dan tulis ulasan |

Kolom **Auth** pada tabel di bawah menyebut role yang diizinkan. `semua` berarti
`admin`, `guru`, dan `siswa` (tetap wajib Bearer).

### Format respons

Sukses:

```json
{ "success": true, "message": "...", "data": {} }
```

Gagal:

```json
{ "success": false, "message": "..." }
```

Sebagian endpoint lama (auth/users) mengembalikan `{ data: ... }` tanpa `success`;
lihat catatan pada tabel terkait.

### Alias parameter

Banyak endpoint menerima **camelCase** dan **snake_case** untuk field yang sama,
misalnya `majorId` atau `major_id`, `classId` atau `class_id`. Dokumentasi memakai
camelCase; alias snake_case tetap diterima.

### Kode error umum

| Status | Arti |
|---|---|
| `400` | Validasi gagal (field wajib, UUID tidak valid, konflik data) |
| `401` | Token tidak ada / tidak valid / kedaluwarsa |
| `403` | Role tidak diizinkan atau bukan pengampu/wali kelas terkait |
| `404` | Data tidak ditemukan |
| `429` | Rate limit terlampaui |

---

## Health

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/` | — | — | Health check, mengembalikan `{ status: "ok" }` |

---

## Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | — | `role: "siswa"` → `{ email, nomor_induk, tanggal_lahir }`; `role: "guru"` → `{ fullName, nomor_induk, tanggal_lahir, email?, major?, ... }` | Registrasi mandiri. Siswa wajib cocok dengan roster sekolah; guru masuk alur verifikasi admin. Rate limited |
| `POST` | `/api/v1/auth/activate` | — | `{ token, password }` | Aktivasi akun dari token email + buat password. Respons `data` = user |
| `POST` | `/api/v1/auth/login` | — | `{ identifier, password }` | `identifier` = email atau nomor induk. Respons `data` = JWT + flag `must_change_password`. Rate limited |
| `POST` | `/api/v1/auth/forgot-password` | — | `{ identifier }` | Kirim tautan reset password ke email. Rate limited |
| `POST` | `/api/v1/auth/reset-password` | — | `{ token, password }` | Buat password baru dari token email. Rate limited |
| `PUT` | `/api/v1/auth/password` | semua | `{ current_password, new_password }` | Ganti password user login; password lama wajib benar. Respons `data` = JWT baru |

## Users — `/api/v1/users`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/users/current` | semua | — | Profil user yang sedang login. Respons `{ data: user }` |
| `DELETE` | `/api/v1/users/logout` | semua | — | Logout. Respons `{ data: "OK" }` |
| `PUT` | `/api/v1/users/profile` | semua | `{ fullName?, phone?, avatarUrl? }` | Perbarui profil user login |

## Admin Users — `/api/v1/admin/users`

Seluruh endpoint pada grup ini **admin only**.

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/admin/users/roster` | admin | — | Daftar siswa yang belum menyelesaikan aktivasi |
| `POST` | `/api/v1/admin/users/import` | admin | `{ activate?: boolean, students: studentRow[] }` | Impor roster siswa; `activate=true` langsung mengaktifkan dengan password default |
| `POST` | `/api/v1/admin/users` | admin | `{ full_name, nomor_induk, tanggal_lahir, role: "guru" \| "siswa", kelas?, email? }` | Buat satu akun guru/siswa, langsung aktif dengan password default |
| `POST` | `/api/v1/admin/users/:id/activate` | admin | params `{ id }` | Aktifkan siswa roster dengan password default |
| `POST` | `/api/v1/admin/users/:id/reset-password` | admin | params `{ id }` | Reset password user ke password default |

---

## Subjects — `/api/v1/subjects`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/subjects` | semua | query `majorId`, `gradeLevelId`, `semester`, `q`, `includeInactive=true` | List mata pelajaran, terfilter sesuai peran |
| `GET` | `/api/v1/subjects/stats` | admin, guru | — | Statistik mapel: total, aktif, kejuruan & umum |
| `GET` | `/api/v1/subjects/:id` | semua | params `{ id }` | Detail satu mata pelajaran |
| `POST` | `/api/v1/subjects` | **admin** | `{ name, code, description?, capaianPembelajaran?, majorId?, gradeLevelId?, semester?, isActive? }` | Buat mata pelajaran |
| `PUT` | `/api/v1/subjects/:id` | admin | semua field opsional (sama seperti POST) | Perbarui mata pelajaran |
| `DELETE` | `/api/v1/subjects/:id` | admin | params `{ id }` | Hapus mata pelajaran |

> Pembuatan mapel hanya untuk `admin` (`subjects-route.ts`), bukan `admin, guru`.

## Majors — `/api/v1/majors`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/majors` | semua | query `includeInactive=true` | List jurusan |
| `POST` | `/api/v1/majors` | admin | `{ code, name, isActive? }` | Buat jurusan |
| `PUT` | `/api/v1/majors/:id` | admin | `{ code?, name?, isActive? }` | Perbarui jurusan |
| `DELETE` | `/api/v1/majors/:id` | admin | params `{ id }` | Hapus jurusan |

## Grade Levels — `/api/v1/grade-levels`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/grade-levels` | semua | query `includeInactive=true` | List tingkatan kelas (X, XI, XII) |
| `POST` | `/api/v1/grade-levels` | admin | `{ code, name, isActive? }` | Buat tingkatan kelas |
| `PUT` | `/api/v1/grade-levels/:id` | admin | `{ code?, name?, isActive? }` | Perbarui tingkatan kelas |
| `DELETE` | `/api/v1/grade-levels/:id` | admin | params `{ id }` | Hapus tingkatan kelas |

## Classes — `/api/v1/classes`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/classes` | semua | query `majorId`, `gradeLevelId`, `q`, `includeInactive=true` | List kelas/rombel, termasuk `advisorId`, `advisorName`, `studentCount`, `teacherCount` |
| `GET` | `/api/v1/classes/:id` | semua | params `{ id }` | Detail satu kelas |
| `POST` | `/api/v1/classes` | admin | `{ name, section, majorId, gradeLevelId, capacity?, isActive? }` | Buat kelas. Nama unik per jurusan + tingkatan |
| `PUT` | `/api/v1/classes/:id` | admin | `{ name?, section?, majorId?, gradeLevelId?, capacity?, isActive? }` | Perbarui kelas |
| `PUT` | `/api/v1/classes/:id/advisor` | admin | `{ advisorId: string \| null }` | Tetapkan / ganti / lepas wali kelas (lihat catatan di bawah) |
| `DELETE` | `/api/v1/classes/:id` | admin | params `{ id }` | Hapus kelas |

### Penetapan wali kelas

`PUT /api/v1/classes/:id/advisor` adalah endpoint yang dipakai halaman
**admin → Wali Kelas**.

- `advisorId` berisi UUID user; kirim `null` untuk **melepas** wali kelas.
- User yang ditunjuk **wajib memiliki role `guru`**; admin/siswa ditolak (`400`).
- **Satu guru hanya boleh menjadi wali satu kelas.** Jika guru sudah menjadi wali
  di kelas lain, request ditolak `400` dengan pesan menyebut kelas tersebut.
- Respons `data` adalah objek kelas terbaru (termasuk `advisorId`/`advisorName`).
- Kelas tanpa wali membuat guru non-wali tidak bisa membuka presensi/rekap rapor
  kelas itu (lihat `attendance` dan aturan wali kelas).

## Teachers — `/api/v1/teachers`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/teachers` | admin, guru | query `q`, `statusFilter` | List guru + jumlah mapel dan kelas yang diampu |
| `GET` | `/api/v1/teachers/stats` | admin, guru | — | Statistik guru: total, aktif, mapel & kelas diampu |
| `POST` | `/api/v1/teachers` | admin | `{ fullName, nomorInduk, tanggalLahir, email?, majorId?, gradeLevelId?, subjectId? }` | Buat guru baru. Respons memuat `id`, `kodeGuru`, `defaultPassword` |
| `PUT` | `/api/v1/teachers/:id` | admin | `{ fullName, nomorInduk, tanggalLahir, email?, isActive?, majorId? }` | Perbarui data guru |
| `DELETE` | `/api/v1/teachers/:id` | admin | params `{ id }` | Hapus guru beserta penugasan dan data turunannya |

## Students — `/api/v1/students`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/students` | admin, guru | query `q`, `classId`, `majorId`, `gradeLevelId`, `status` | List siswa, terfilter sesuai peran dan kelas |
| `GET` | `/api/v1/students/stats` | admin, guru | — | Statistik siswa |
| `GET` | `/api/v1/students/:id` | admin, guru | params `{ id }` | Detail siswa |
| `POST` | `/api/v1/students` | admin | `{ fullName, nomorInduk, nisn?, jenisKelamin?, tempatLahir?, tanggalLahir?, angkatan?, email?, classId?, isActive?, password? }` | Buat siswa |
| `PUT` | `/api/v1/students/:id` | admin | `{ fullName?, nisn?, jenisKelamin?, tempatLahir?, tanggalLahir?, angkatan?, email?, classId?, isActive? }` | Perbarui siswa. `classId: null` mengeluarkan siswa dari rombel |
| `DELETE` | `/api/v1/students/:id` | admin | params `{ id }` | Hapus siswa |

## Teacher Assignments — `/api/v1/teacher-assignments`

Tiga sub-grup: penugasan mapel (`/subjects`), penugasan kelas (`/classes`), dan
penugasan gabungan mapel+kelas (root). Semua operasi tulis **admin only**;
pembacaan untuk `admin, guru`.

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/teacher-assignments/subjects` | admin, guru | query `teacherId`, `subjectId`, `section` | List penugasan guru ke mata pelajaran |
| `POST` | `/api/v1/teacher-assignments/subjects` | admin | `{ teacherId?, subjectId? }` | Tugaskan guru ke mata pelajaran |
| `PUT` | `/api/v1/teacher-assignments/subjects/:id` | admin | `{ teacherId, subjectId }` | Perbarui penugasan mapel |
| `DELETE` | `/api/v1/teacher-assignments/subjects/:id` | admin | params `{ id }` | Hapus penugasan mapel |
| `GET` | `/api/v1/teacher-assignments/classes` | admin, guru | query `teacherId`, `classId` | List penugasan guru ke kelas |
| `POST` | `/api/v1/teacher-assignments/classes` | admin | `{ teacherId?, classId? }` | Tugaskan guru ke kelas |
| `DELETE` | `/api/v1/teacher-assignments/classes/:id` | admin | params `{ id }` | Hapus penugasan kelas |
| `GET` | `/api/v1/teacher-assignments` | admin, guru | query `teacherId`, `subjectId`, `classId` | List penugasan guru per mapel **dan** kelas |
| `POST` | `/api/v1/teacher-assignments` | admin | `{ teacherId?, subjectId?, classId? }` | Tugaskan guru ke mapel + kelas (dipakai dialog Penempatan Guru) |
| `PUT` | `/api/v1/teacher-assignments/:id` | admin | `{ teacherId?, subjectId?, classId? }` | Perbarui penugasan mapel + kelas |
| `DELETE` | `/api/v1/teacher-assignments/:id` | admin | params `{ id }` | Hapus penugasan mapel + kelas |

> Untuk `guru`, filter `teacherId` dipaksa ke identitas user yang login.

---

## Jadwal Pelajaran — `/api/v1/jadwal-pelajaran`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/jadwal-pelajaran` | semua | query `classId`, `gradeLevelId`, `majorId`, `hari`, `teacherId`, `activeOnly` | List sesi jadwal pelajaran |
| `GET` | `/api/v1/jadwal-pelajaran/stats` | admin, guru | — | Statistik jadwal: total sesi, bentrok, kelas terisi |
| `POST` | `/api/v1/jadwal-pelajaran` | admin | `{ classId, subjectId, teacherId?, hari, sesi, durasi? }` | Buat sesi jadwal |
| `PUT` | `/api/v1/jadwal-pelajaran/:id` | admin | `{ classId?, subjectId?, teacherId?, hari?, sesi?, durasi? }` | Perbarui sesi jadwal |
| `DELETE` | `/api/v1/jadwal-pelajaran/:id` | admin | params `{ id }` | Hapus sesi jadwal |

## Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | admin, guru | — | Statistik dashboard: kesiapan data, beban mengajar, tutupan jadwal, distribusi siswa |

## Attendance — `/api/v1/attendance`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/attendance/dates` | admin, guru | query `classId` (**wajib**) | Daftar tanggal Senin–Jumat dari periode akademik aktif + mapel dari jadwal mingguan kelas |
| `GET` | `/api/v1/attendance/me` | siswa | — | Rekap kehadiran harian siswa untuk periode aktif |
| `PUT` | `/api/v1/attendance/me` | siswa | `{ date, status: hadir\|sakit\|izin, note? }` | Siswa mencatat presensi sendiri (hanya sekali per tanggal) |
| `GET` | `/api/v1/attendance/records` | admin, guru | query `classId`, `date` | Catatan kehadiran kelas per tanggal |
| `PUT` | `/api/v1/attendance/records` | admin, guru | `{ classId, date, records: [{ studentId, status, note? }] }` | Simpan/upsert catatan kehadiran (`hadir\|sakit\|izin\|alpa`) |
| `POST` | `/api/v1/attendance/sessions` | admin, guru | `{ classId, date }` | Buka/buka ulang sesi presensi kelas |
| `GET` | `/api/v1/attendance/sessions` | admin, guru | query `classId`, `date` | Status sesi (`isOpen`, `openedAt`, `closesAt`) |
| `DELETE` | `/api/v1/attendance/sessions` | admin, guru | query `classId`, `date` | Tutup sesi presensi (dipakai tombol Batal guru) |

> Untuk role `guru`, service menolak kelas yang `advisorId`-nya bukan user tersebut
> (`403` — "Hanya wali kelas yang dapat membuka presensi kelas ini"). `admin` bypass.
> Tanggal harus weekday dan berada di dalam periode akademik aktif.
> Sesi presensi aktif selama **60 menit** sejak dibuka; guru dan siswa hanya bisa
> menyimpan catatan kehadiran selama sesi aktif. Buka ulang akan mengatur ulang jendela 1 jam.

## Academic Periods — `/api/v1/academic-periods`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/academic-periods` | admin, guru | — | Daftar periode akademik |
| `POST` | `/api/v1/academic-periods` | admin | `{ name, startDate, endDate, isActive? }` | Buat periode |
| `PUT` | `/api/v1/academic-periods/:id` | admin | `{ name?, startDate?, endDate?, isActive? }` | Perbarui periode |
| `POST` | `/api/v1/academic-periods/:id/activate` | admin | — | Aktifkan satu periode (lainnya nonaktif) |

---

## Course Details — `/api/v1/course-details`

Seluruh endpoint grup ini untuk `admin, guru`. Untuk role `guru`, `teacherId`
selalu dipaksa ke user yang login.

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/course-details/:subjectId/meetings` | admin, guru | query `classId` (**wajib**), `teacherId` | Daftar pertemuan course untuk satu kelas |
| `POST` | `/api/v1/course-details/:subjectId/meetings` | admin, guru | `{ classId, meetingNumber, meetingDate, title, objective, teacherId? }` | Tambah pertemuan. `meetingDate` format `YYYY-MM-DD`, nomor pertemuan unik |
| `PUT` | `/api/v1/course-details/:subjectId/meetings/:meetingNumber` | admin, guru | `{ classId, meetingDate?, title?, objective?, teacherId? }` | Perbarui pertemuan |
| `DELETE` | `/api/v1/course-details/:subjectId/meetings/:meetingNumber` | admin, guru | query `classId`, `teacherId` | Hapus pertemuan |
| `GET` | `/api/v1/course-details/:subjectId/materials` | admin, guru | params `{ subjectId }` | Daftar materi pertemuan course |

## Assignments (Tugas & Kuis) — `/api/v1/course-details/:subjectId/assignments`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/course-details/:subjectId/assignments` | semua | query `classId`, `meetingId`, `type` (`tugas` \| `kuis`) | Daftar tugas/kuis pada pertemuan |
| `POST` | `/api/v1/course-details/:subjectId/assignments` | admin, guru | `{ classId, meetingId, type, title, description?, startAt?, deadlineAt }` | Buat tugas/kuis. `deadlineAt` wajib dan harus setelah `startAt` |
| `GET` | `/api/v1/course-details/:subjectId/assignments/:id` | semua | params `{ subjectId, id }` | Detail satu assignment |
| `GET` | `/api/v1/course-details/:subjectId/assignments/:id/summary` | semua | params `{ subjectId, id }` | Ringkasan pengumpulan per assignment |
| `GET` | `/api/v1/course-details/:subjectId/assignments/:id/grading` | admin, guru | params `{ subjectId, id }` | Daftar submission yang perlu/baru dinilai |
| `PUT` | `/api/v1/course-details/:subjectId/assignments/:id/grading/:submissionId` | admin, guru | `{ score: 0-100, status: "pending" \| "graded" \| "revision" }` | Simpan nilai satu submission |
| `PUT` | `/api/v1/course-details/:subjectId/assignments/:id` | admin, guru | `{ classId?, meetingId?, type?, title?, description?, startAt?, deadlineAt? }` | Perbarui tugas/kuis |
| `DELETE` | `/api/v1/course-details/:subjectId/assignments/:id` | admin, guru | params `{ subjectId, id }` | Hapus tugas/kuis dari pertemuan |

> Untuk mengirim file jawaban sebagai siswa lewat API (tanpa UI), lihat
> **Submit tugas/kuis sebagai siswa (tanpa UI)** pada bagian Uploads.

---

## Modules — `/api/v1/modules`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/modules` | semua | query `subject_id` | List modul dalam mata pelajaran |
| `GET` | `/api/v1/modules/:moduleId` | semua | params `{ moduleId }` | Detail modul + subject & guru |
| `POST` | `/api/v1/modules` | admin, guru | `{ subject_id, title, description?, order_index? }` | Buat modul |
| `PUT` | `/api/v1/modules/:moduleId` | admin, guru pemilik | field opsional (sama seperti POST) | Perbarui modul |
| `DELETE` | `/api/v1/modules/:moduleId` | admin, guru pemilik | params `{ moduleId }` | Hapus modul |

## Lessons — `/api/v1/lessons`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `POST` | `/api/v1/lessons` | admin, guru | `{ module_id, title, content?, video_url?, attachment_url?, order_index? }` | Buat lesson dalam modul |
| `GET` | `/api/v1/lessons/module/:moduleId` | semua | params `{ moduleId }` | List lesson berdasarkan modul |

## Discussions — `/api/v1/modules/:moduleId/discussions`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/modules/:moduleId/discussions` | semua | params `{ moduleId }` | List pertanyaan + balasan |
| `POST` | `/api/v1/modules/:moduleId/discussions` | siswa | `{ body }` (maks. 2000 karakter) | Buat pertanyaan diskusi |
| `POST` | `/api/v1/modules/:moduleId/discussions/:discussionId/replies` | admin, guru | `{ body }` | Balas pertanyaan diskusi |

## Enrollments — `/api/v1/enrollments`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `POST` | `/api/v1/enrollments` | siswa | `{ subject_id }` | Daftar (enroll) ke mata pelajaran |
| `GET` | `/api/v1/enrollments/my-courses` | semua | — | List mata pelajaran yang diikuti user login |
| `PATCH` | `/api/v1/enrollments/:id/status` | admin, guru | `{ status }` | Perbarui status enrollment (mis. `active`) |

## Progress — `/api/v1/progress`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `POST` | `/api/v1/progress/lesson/:lessonId` | siswa | params `{ lessonId }` | Tandai lesson selesai atau batalkan |
| `GET` | `/api/v1/progress/subject/:subjectId` | admin, guru, siswa | params `{ subjectId }` | Persentase lesson selesai di satu mapel |
| `GET` | `/api/v1/progress/module/:moduleId` | siswa | params `{ moduleId }` | Persentase lesson selesai di satu modul |

> Progress dihitung untuk user login dan hanya tersedia bila enrollment berstatus `active`.

## Reviews — `/api/v1/reviews`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `POST` | `/api/v1/reviews` | siswa | `{ subjectId, rating: 1-5, comment? }` | Tambah ulasan mata pelajaran |
| `GET` | `/api/v1/reviews/subject/:subjectId` | semua | params `{ subjectId }` | List ulasan per mata pelajaran |
| `DELETE` | `/api/v1/reviews/:id` | admin | params `{ id }` | Hapus ulasan |

## Notifications — `/api/v1/notifications`

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `GET` | `/api/v1/notifications` | semua | — | List notifikasi user login |
| `PATCH` | `/api/v1/notifications/read-all` | semua | — | Tandai semua notifikasi sudah dibaca |
| `PATCH` | `/api/v1/notifications/:id/read` | semua | params `{ id }` | Tandai satu notifikasi sudah dibaca |

---

## Uploads — `/api/v1/uploads`

Batas ukuran file **10 MB**. MIME yang diterima: PDF, DOCX, XLSX, CSV, ZIP, RAR.

Slot penyimpanan pertemuan (`:slot`): `materi`, `tugasFile`, `tugasSubmission`,
`kuisFile`, `kuisSubmission`.

| Method | Endpoint | Auth | Body / Query | Keterangan |
|---|---|---|---|---|
| `POST` | `/api/v1/uploads` | semua | multipart `{ file }` | Upload file umum |
| `POST` | `/api/v1/uploads/storage/:slot` | semua (aturan slot) | multipart `{ file, meetingId, submissionId?, studentId?, assignmentId? }` | Upload ke slot pertemuan. Slot non-submission menolak `siswa`; slot submission wajib `assignmentId` valid |
| `GET` | `/api/v1/uploads/storage/:slot` | semua | query `meetingId` (**wajib**) | Metadata file per slot. Slot submission membaca mirror guru, `fileUrl` menunjuk file siswa |
| `DELETE` | `/api/v1/uploads/storage/:slot/:id` | semua (aturan slot) | params `{ slot, id }` | Hard delete file; baris mirror guru ikut terhapus via FK cascade |
| `GET` | `/api/v1/uploads/:id` | semua | params `{ id }` | Ambil (stream) file berdasarkan ID |
| `GET` | `/api/v1/uploads/storage/:slot/:id` | semua | params `{ slot, id }` | Ambil (stream) file slot pertemuan |

### Submit tugas/kuis sebagai siswa (tanpa UI)

Backend sudah menerima pengumpulan file siswa; yang belum tersedia hanya form di UI siswa.
Contoh berikut bisa dipakai sementara.

**1. Login dan simpan JWT**

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"NIS_ATAU_EMAIL","password":"PASSWORD"}'
# -> { "success": true, "data": "<JWT>", "must_change_password": false, ... }

export TOKEN='<JWT dari field data>'
```

Jika `must_change_password: true`, ganti password dulu lewat
`PUT /api/v1/auth/password` — jika tidak, endpoint upload akan ditolak `403`.

**2. Cari `assignmentId` dan `meetingId`**

```bash
curl -s \
  'http://localhost:3000/api/v1/course-details/SUBJECT_UUID/assignments?classId=CLASS_UUID&meetingId=MEETING_UUID&type=tugas' \
  -H "Authorization: Bearer $TOKEN"
```

Endpoint ini mengizinkan role `siswa`. Jika `meetingId` belum diketahui, minta dari guru:
endpoint daftar pertemuan `/api/v1/course-details/:subjectId/meetings` hanya untuk
`admin`/`guru`.

**3. Upload file jawaban**

Langsung ke backend (port `3000`):

```bash
curl -X POST 'http://localhost:3000/api/v1/uploads/storage/tugasSubmission' \
  -H "Authorization: Bearer $TOKEN" \
  -F 'file=@/path/jawaban.pdf;type=application/pdf' \
  -F 'meetingId=MEETING_UUID' \
  -F 'assignmentId=ASSIGNMENT_UUID'
```

Atau lewat BFF frontend (port `3001`) memakai cookie `lms_token`:

```bash
curl -X POST 'http://localhost:3001/api/v1/uploads/storage/tugasSubmission' \
  -b 'lms_token=JWT' \
  -F 'file=@/path/jawaban.pdf;type=application/pdf' \
  -F 'meetingId=MEETING_UUID' \
  -F 'assignmentId=ASSIGNMENT_UUID'
```

Gunakan slot `kuisSubmission` untuk kuis. **Jangan** pakai `POST /api/v1/uploads`
(generic) — itu flow upload lain, bukan pengumpulan tugas.

Respons sukses `201`:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "fileUrl": "http://localhost:3000/api/v1/uploads/storage/tugasSubmission/<id>",
    "submissionId": "...",
    "assignmentId": "...",
    "checksumSha256": "...",
    "sizeBytes": 12345
  }
}
```

**Field & aturan penting**

| Field | Wajib | Catatan |
|---|---|---|
| `file` | ya | Maks. 10 MB; PDF, DOCX, XLSX, CSV, ZIP, RAR |
| `meetingId` | ya | UUID pertemuan yang harus ada di database |
| `assignmentId` | ya untuk slot submission | UUID tugas/kuis yang harus ada di database |
| `submissionId` | tidak | Jika kosong, server membuat UUID baru |
| `studentId` | tidak | Diabaikan untuk `siswa`; diambil dari JWT |

**Keterbatasan saat ini**

- Backend tidak mengecek bahwa `assignmentId` benar-benar milik `meetingId` yang dikirim.
- Tidak ada pengecekan deadline, enrollment, atau kesesuaian slot `tugas`/`kuis`.
- Tidak ada deduplikasi: upload ulang selalu membuat baris `submissionId` baru.
- Kirim `submissionId` yang sama hanya jika memang ingin menimpa — tabellanya memiliki
  unique constraint dan duplikasi akan menyebabkan error.

---

## Ringkasan cakupan

| Grup | Jumlah endpoint |
|---|---|
| Health | 1 |
| Auth | 6 |
| Users | 3 |
| Admin Users | 5 |
| Subjects | 6 |
| Majors | 4 |
| Grade Levels | 4 |
| Classes | 6 |
| Teachers | 5 |
| Students | 6 |
| Teacher Assignments | 11 |
| Jadwal Pelajaran | 5 |
| Dashboard | 1 |
| Attendance | 1 |
| Course Details | 5 |
| Assignments | 8 |
| Modules | 5 |
| Lessons | 2 |
| Discussions | 3 |
| Enrollments | 3 |
| Progress | 3 |
| Reviews | 3 |
| Notifications | 3 |
| Uploads | 6 |
| **Total** | **105** |

> Saat menambah atau mengubah route, perbarui dokumen ini **dan** metadata
> `detail` pada route terkait agar Swagger tetap sinkron.
