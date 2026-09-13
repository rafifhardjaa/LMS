# TASK SPECIFICATION: Supabase Storage Integration (File Uploads)

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

**USE INSTALLED SKILLS:** You are running via Orca automation. 

1. **GIT FLOW:** Buat branch `feature/storage-upload` SEBELUM menulis kode.

2. Gunakan terminal untuk menginstal `@supabase/supabase-js` jika belum ada di `package.json` `bun add @supabase/supabase-js`).

3. Buat service untuk Supabase Storage dan buat endpoint upload.

4. Stage dan commit perubahan `git add .` dan `git commit -m "feat: add file upload endpoint via supabase storage"`).

5. **FINAL PUSH (CRITICAL):** Pindah ke branch main `git checkout main`), gabungkan perubahan `git merge feature/storage-upload`), dan **WAJIB eksekusi `git push origin main`** agar hasil kerjamu langsung tersimpan di repository utama.

---

## Context &amp; Objective

Frontend (Next.js) membutuhkan endpoint khusus untuk mengunggah file (gambar profil, dokumen materi, file tugas). Karena kita menggunakan Supabase, file fisik harus diunggah ke Supabase Storage, dan API kita hanya akan mengembalikan Public URL dari file tersebut untuk disimpan ke dalam database.

---

## Technical Constraints &amp; Standards

1. **Framework**: ElysiaJS + `@supabase/supabase-js`.

2. **Environment Variables**: Gunakan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` (atau Service Role Key) yang sudah ada di `.env`.

3. **Storage Bucket**: Asumsikan nama bucket di Supabase adalah `uploads` (pastikan bucket ini diset public di dashboard Supabase nanti).

4. **Validation**: Gunakan TypeBox untuk memvalidasi input `multipart/form-data`.

5. **Response Standard**: `{ "success": true, "message": "...", "data": { "fileUrl": "..." } }`

---

## Task Checklist: Upload Route `src/routes/uploads.ts`)

- [ ] **1. Setup Supabase Client**

  - Buat file `src/utils/supabase.ts` (jika belum ada) untuk inisialisasi client Supabase menggunakan kredensial dari `.env`.

- [ ] **2. Endpoint `POST /api/v1/uploads`**

  - **Auth**: Authenticated (Semua Role bisa upload).

  - **Body Schema**: `t.Object({ file: t.File() })` (Elysia mendukung `t.File()` untuk multipart).

  - **Logic**:

    1. Terima file dari request.

    2. Buat nama file unik (misal: gabungkan [`Date.now](http://Date.now)()` atau `uuid` dengan nama file asli agar tidak bentrok).

    3. Upload file fisik tersebut ke Supabase Storage pada bucket `uploads`.

    4. Ambil Public URL dari file yang baru saja diunggah.

    5. Return Public URL tersebut di dalam response JSON.

- [ ] **3. Mount Route**

  - Import dan daftarkan `uploads` route ini ke dalam `src/index.ts`.

- [ ] **Validasi Ukuran File**: Tolak file jika ukurannya melebihi 10MB `file.size > 1 * 1024 * 1024`) dengan response error yang jelas.

---

## Execution Target

Eksekusi instalasi dependency, pembuatan endpoint upload, dan pastikan route terdaftar di index. Validasi menggunakan TypeScirpt, lalu selesaikan dengan **Push ke origin/main** sesuai instruksi Git Flow.



// Contoh validasi sederhana di endpoint upload Elysia

if (file.size &gt; 5  *1024*  1024) { // Batas 5 MB

  return { success: false, message: "Ukuran file terlalu besar! Maksimal 10 MB." }

}