# TASK SPECIFICATION: CORS Setup &amp; Database Seeding

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

**USE INSTALLED SKILLS:** 

1. **GIT FLOW:** Buat branch `chore/cors-and-seed`.

2. Gunakan skill terminal untuk install plugin CORS Elysia jika belum ada `bun add @elysiajs/cors`).

3. Tulis kode seeder di `src/db/seed.ts`.

4. Stage dan commit perubahan `git add .` dan `git commit -m "chore: add cors and db seeder"`).

5. **FINAL PUSH (CRITICAL):** Setelah commit selesai, pindah ke branch main `git checkout main`), gabungkan perubahan `git merge chore/cors-and-seed`), dan **WAJIB eksekusi `git push origin main`** agar hasil kerjamu langsung tersimpan di repository utama.

---

## Context &amp; Objective

Frontend akan menggunakan Next.js. Untuk mendukung integrasi, API harus mengizinkan CORS. Selain itu, dibutuhkan script seeder untuk mengisi data dummy awal (Users, Roles, Subjects, Modules) agar frontend dapat langsung melakukan fetching data.

---

## Task Checklist 1: Setup CORS `src/index.ts`)

- [ ] Install `@elysiajs/cors` menggunakan terminal.

- [ ] Import dan gunakan plugin `cors()` di instance utama Elysia di `src/index.ts`. Pastikan CORS di-mount sebelum route lain agar berlaku global.

## Task Checklist 2: Database Seeder `src/db/seed.ts`)

- [ ] Buat file `src/db/seed.ts`.

- [ ] **Logic Seeder**:

  1. Bersihkan tabel terkait (users, roles, subjects, modules) secara berurutan.

  2. Insert 3 Role standar ke tabel `roles`: 'admin', 'guru', 'siswa'.

  3. Insert 3 User dummy ke tabel `users` (password gunakan plain text 'password123' sementara).

     - 1 Admin ([admin@simanis.com](mailto:admin@simanis.com))

     - 1 Guru ([guru@simanis.com](mailto:guru@simanis.com))

     - 1 Siswa ([siswa@simanis.com](mailto:siswa@simanis.com))

  4. Assign role masing-masing user ke tabel `user_roles`.

  5. Insert 1 Mata Pelajaran dummy (misal: "Matematika Dasar") yang dibuat oleh Admin/Guru.

  6. Insert 1 Modul dummy di bawah mata pelajaran tersebut.

- [ ] Buat script eksekusi di `package.json` (tambahkan `"seed": "bun run src/db/seed.ts"` di bagian `scripts`).

---

## Execution Target

Silakan eksekusi instalasi CORS, penyesuaian `index.ts`, dan pembuatan script `seed.ts`. Jalankan seeder via terminal `bun run seed`) untuk memastikan tidak ada error foreign key. Setelah berhasil, pastikan kamu melakukan **Push ke origin/main** sesuai instruksi Git Flow di atas.