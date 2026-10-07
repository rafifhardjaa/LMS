# TASK SPECIFICATION: Fix Supabase Env Validation &amp; Error Handling

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

\*\*USE INSTALLED SKILLS:\*\* You are running via automation.

1. \*\*GIT FLOW:\*\* Buat branch `fix/env-supabase-setup` SEBELUM melakukan perubahan.

2. Modifikasi file `.env.example` dan `src/utils/supabase.ts`.

3. Stage dan commit (`git add .` dan `git commit -m "fix: handle missing supabase env vars gracefully and update env.example"`).

4. \*\*FINAL PUSH (CRITICAL):\*\* Pindah ke `main` (`git checkout main`), merge (`git merge fix/env-supabase-setup`), dan \*\*WAJIB eksekusi `git push origin main`\*\*.

---

## Context &amp; Objective

Saat tim Frontend menjalankan server backend secara lokal, server mengalami crash (Exit 1) pada proses booting dengan error `supabaseUrl is required` dari library `@supabase/supabase-js`. Hal ini terjadi karena developer Frontend belum memiliki `SUPABASE_URL` dan `SUPABASE_KEY` di file `.env` lokal mereka. 

Tujuan task ini adalah membuat error menjadi lebih informatif bagi developer lain dan memastikan `.env.example` memiliki panduan variabel yang lengkap.

---

## Task Checklist

- \[ \] \*\*1. Update `.env.example`\*\*

  - Pastikan file ini memiliki template variabel Supabase yang jelas. Tambahkan baris berikut jika belum ada:

    \`\`\`env

    # Supabase Config (Wajib diisi untuk fitur Storage/Upload, minta nilainya ke Backend)

    SUPABASE\_URL="\[[https://your-project-id.supabase.co\](https://your-project-id.supabase.co)](https://your-project-id.supabase.co](https://your-project-id.supabase.co))"

    SUPABASE\_KEY="your-anon-or-service-key"

    \`\`\`

- \[ \] \*\*2. Update `src/utils/supabase.ts`\*\*

  - Bungkus atau validasi inisialisasi `createClient` dari Supabase.

  - Tambahkan pengecekan nilai environment variable sebelum `createClient` dipanggil.

  - Jika `process.env.SUPABASE_URL` atau key-nya `undefined`, lakukan `console.warn` dengan pesan instruksi yang jelas (misal: "⚠️ WARNING: SUPABASE\_URL atau SUPABASE\_KEY tidak ditemukan di .env. Server tetap berjalan namun fitur Storage akan gagal").

  - Pastikan server tidak langsung hard-crash di awal booting hanya karena env ini hilang.

---

## Execution Target

Modifikasi `.env.example` dan `src/utils/supabase.ts`, pastikan server Elysia tetap bisa melakukan proses `bun run dev` dengan mulus meski environment variabel Supabase masih kosong (hanya memunculkan warning), lalu push perubahannya ke origin/main.