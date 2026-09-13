# TASK SPECIFICATION: Codebase Audit, Debugging, &amp; Refactoring

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

**USE INSTALLED SKILLS:** You are running via Orca automation. 

1. **GIT FLOW:** Buat branch `chore/audit-refactor` SEBELUM melakukan perubahan kode.

2. Gunakan skill membaca file untuk meninjau seluruh kode di dalam direktori `src/` (terutama `src/routes`, `src/index.ts`, dan `src/db`).

3. Lakukan refactoring, perbaiki bug, dan pastikan konsistensi.

4. Jalankan pengecekan TypeScript `bun run check` atau sejenisnya) untuk memastikan tidak ada error.

5. Stage dan commit perubahan `git add .` dan `git commit -m "chore: audit and refactor codebase"`).

6. **FINAL PUSH (CRITICAL):** Pindah ke branch main `git checkout main`), gabungkan perubahan `git merge chore/audit-refactor`), dan **WAJIB eksekusi `git push origin main`**.

---

## Context &amp; Objective

Sebelum integrasi dengan frontend (Next.js), seluruh codebase REST API LMS SIMANIS harus diaudit. Tujuannya adalah merapikan kode (refactor), memastikan penanganan error yang konsisten, dan menambal celah keamanan pada logika RBAC atau validasi input.

---

## Task Checklist: Audit &amp; Refactor Target

- [ ] **1. Standardize Error Handling (Try-Catch)**

  - Pastikan SELURUH endpoint dibungkus dengan error handling yang aman.

  - Jika terjadi error database atau internal, jangan bocorkan error stack trace ke response. Return format standar: `{ "success": false, "message": "Internal Server Error" }`.

- [ ] **2. RBAC &amp; Auth Guard Verification**

  - Cek ulang semua route. Pastikan endpoint sensitif (seperti Create/Update/Delete mata pelajaran, modul, tugas, nilai) benar-benar memverifikasi JWT dan mengecek role user (ADMIN/GURU/SISWA) dengan ketat.

- [ ] **3. Code DRY (Don't Repeat Yourself)**

  - Jika ada logika query Drizzle atau validasi yang diulang-ulang di beberapa file, ekstrak menjadi fungsi helper/utility di folder `src/utils/` atau `src/services/`.

- [ ] **4. TypeScript Type Safety**

  - Pastikan tidak ada variabel dengan tipe `any`. Semua response dan body request harus tervalidasi menggunakan TypeBox Elysia.

- [ ] **5. Clean Up Imports &amp; Dead Code**

  - Hapus semua `console.log()` yang tersisa dari proses debugging sebelumnya.

  - Hapus import library atau variabel yang tidak digunakan (unused imports).

---

## Execution Target

Lakukan audit menyeluruh pada codebase. Perbaiki bagian yang kotor atau rawan bug. Pastikan aplikasi tetap bisa berjalan normal (tidak breaking) dengan menjalankan script start/check sebelum melakukan push ke origin/main.