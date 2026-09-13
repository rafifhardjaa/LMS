# TASK SPECIFICATION: Learning Progress Tracking &amp; Profile Management

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

**USE INSTALLED SKILLS:** You are running via Orca automation. 

1. **GIT FLOW:** Create a new branch `feature/progress-profile` BEFORE writing any code.

2. Read `src/db/schema.ts` to understand `lessonProgress` and `users` tables.

3. Write the code, run TypeScript checks, and mount routes in `src/index.ts`.

4. Stage and commit changes `git add .` dan `git commit -m "feat: add lesson progress and profile updates"`).

5. **FINAL PUSH (CRITICAL):** Pindah ke branch main `git checkout main`), gabungkan perubahan `git merge feature/progress-profile`), dan **WAJIB eksekusi `git push origin main`** agar hasil kerjamu langsung tersimpan di repository utama.

---

## Context &amp; Objective

Membangun endpoint untuk pelacakan progres belajar siswa (menandai materi selesai) dan endpoint untuk memperbarui data profil pengguna (nama, nomor telepon, avatar).

---

## Technical Constraints &amp; Standards

1. **Framework**: ElysiaJS + Drizzle ORM.

2. **Validation**: Gunakan TypeBox.

3. **Response Standard**: `{ "success": true/false, "message": "...", "data": ... }`

---

## Task Checklist 1: Progress Routing `src/routes/progress.ts`)

- [ ] *`POST /api/v1/progress/lesson/:lessonId`**

  - **Auth**: SISWA

  - **Logic**: Cek apakah data di tabel `lessonProgress` untuk `lessonId` dan `enrollmentId` siswa ini sudah ada. Jika belum, insert dengan `isCompleted = true` dan `completedAt = now()`. Jika sudah ada, toggle statusnya.

- [ ] *`GET /api/v1/progress/subject/:subjectId`**

  - **Auth**: Authenticated (SISWA, GURU, ADMIN)

  - **Logic**: Hitung persentase penyelesaian. Hitung total materi (lessons) yang ada di `subjectId` tersebut, lalu bandingkan dengan jumlah materi yang sudah `isCompleted = true` oleh siswa yang sedang login. Return persentase (0-100%).

---

## Task Checklist 2: User Profile Update (Update `src/routes/users.ts`)

- [ ] *`PUT /api/v1/users/profile`**

  - **Auth**: Authenticated (Semua Role)

  - **Body Schema**: `{ fullName: t.Optional(t.String()), phone: t.Optional(t.String()), avatarUrl: t.Optional(t.String()) }`

  - **Logic**: Update baris pada tabel `users` milik user yang sedang login berdasarkan JWT token.

---

## Execution Target

Eksekusi pembuatan *controller/route* di atas sekarang, pastikan *routing* di-mount di index, dan selesaikan dengan **Push ke origin/main** sesuai instruksi Git Flow di atas.