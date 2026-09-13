# TASK SPECIFICATION: Endpoints for Reviews &amp; Notifications

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

**USE INSTALLED SKILLS:** You are running via an automated pipeline (Orca). Read `src/db/schema.ts` to understand the `reviews` and `notifications` tables. Create the necessary route files, mount them in `src/index.ts`, and run terminal commands to check for TypeScript errors. Do not wait for user prompts.

---

## Context &amp; Objective

Tabel database untuk `reviews` dan `notifications` sudah tersedia. Tugas Anda adalah membuat REST API endpoints untuk fitur Ulasan (Siswa menilai mata pelajaran, Admin melakukan moderasi) dan Notifikasi (Melihat dan menandai notifikasi telah dibaca).

---

## Technical Constraints &amp; Standards

1. **Framework**: ElysiaJS + Drizzle ORM.

2. **Validation**: Gunakan TypeBox `t.Object`, `t.String`, `t.Number`, dll) untuk validasi body request.

3. **Response Standard**:

   - Success: `{ "success": true, "message": "...", "data": ... }`

   - Error: `{ "success": false, "message": "..." }`

4. **Auth Guard**: Gunakan JWT auth &amp; pastikan RBAC diimplementasikan sesuai role.

---

## Task Checklist 1: Reviews Routing `src/routes/reviews.ts`)

- [ ] *`POST /api/v1/reviews`**

  - **Auth**: SISWA

  - **Body Schema**: `{ subjectId: t.String(), rating: t.Number() (minimal 1, maksimal 5), comment: t.Optional(t.String()) }`

  - **Logic**: Insert ulasan baru ke tabel `reviews`. Ambil `studentId` dari user yang sedang login. Pastikan satu siswa hanya bisa me-review satu mata pelajaran satu kali (opsional, cek duplikasi).

- [ ] *`GET /api/v1/reviews/subject/:subjectId`**

  - **Auth**: Authenticated (ADMIN, GURU, SISWA)

  - **Logic**: Ambil daftar ulasan untuk suatu mata pelajaran tertentu.

- [ ] *`DELETE /api/v1/reviews/:id`**

  - **Auth**: ADMIN

  - **Logic**: Hapus ulasan berdasarkan ID (Fungsi Moderasi Admin).

---

## Task Checklist 2: Notifications Routing `src/routes/notifications.ts`)

- [ ] *`GET /api/v1/notifications`**

  - **Auth**: Authenticated (Semua Role)

  - **Logic**: Ambil daftar notifikasi milik user yang sedang login `userId` = user JWT ID). Urutkan dari yang paling baru `createdAt` descending).

- [ ] *`PATCH /api/v1/notifications/:id/read`**

  - **Auth**: Authenticated (Semua Role)

  - **Logic**: Update `isRead` menjadi `true` pada notifikasi dengan ID tersebut. Pastikan notifikasi tersebut memang milik user yang sedang login.

- [ ] *`PATCH /api/v1/notifications/read-all`**

  - **Auth**: Authenticated (Semua Role)

  - **Logic**: Update semua notifikasi milik user yang sedang login menjadi `isRead = true`.

---

## Execution Target

1. Buat file `src/routes/reviews.ts` dan `src/routes/notifications.ts`.

2. Import dan daftarkan kedua route tersebut ke dalam `src/index.ts`.

3. Validasi kode dengan menjalankan perintah TypeScript compiler (misal: `bun run check`).