# TASK SPECIFICATION: Local Database Setup (Docker + PostgreSQL pgvector)

## 🤖 CRITICAL INSTRUCTION FOR AI AGENT

\*\*USE INSTALLED SKILLS:\*\* You are running via Orca automation. 

1. \*\*GIT FLOW:\*\* Buat branch `chore/local-db-setup` SEBELUM melakukan perubahan.

2. Buat file `docker-compose.yml` di root directory.

3. Update file `.env.example` untuk mencerminkan koneksi database lokal.

4. Stage dan commit (`git add .` dan `git commit -m "chore: add docker-compose for local postgres db"`).

5. \*\*FINAL PUSH (CRITICAL):\*\* Pindah ke `main` (`git checkout main`), merge (`git merge chore/local-db-setup`), dan \*\*WAJIB eksekusi `git push origin main`\*\*.

---

## Context &amp; Objective

Environment Supabase saat ini disuspend, sehingga tim Frontend membutuhkan database lokal untuk melanjutkan testing. Kita akan menggunakan Docker Compose untuk menjalankan PostgreSQL lokal. Host menggunakan OrbStack, sehingga standar eksekusi tetap menggunakan `docker compose`. Kita langsung menggunakan image `pgvector` sebagai persiapan fitur AI.

---

## Task Checklist

- \[ \] \*\*1. Buat `docker-compose.yml`\*\*

  - Buat file di root project (sejajar dengan `package.json`) dengan isi persis seperti ini:

    \`\`\`yaml

    version: '3.8'

    

    services:

      db:

        image: pgvector/pgvector:pg16

        container\_name: simanis-db

        environment:

          POSTGRES\_USER: postgres

          POSTGRES\_PASSWORD: postgres

          POSTGRES\_DB: simanis

        ports:

          - "5432:5432"

        volumes:

          - simanis\_db\_data:/var/lib/postgresql/data

        restart: unless-stopped

    volumes:

      simanis\_db\_data:

    \`\`\`

- \[ \] \*\*2. Update `.env.example`\*\*

  - Jadikan koneksi lokal sebagai default di `.env.example`:

    `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simanis"`

  - Biarkan variabel Supabase yang lama (`SUPABASE_URL`, dll), tapi tambahkan komentar `# Production/Staging Supabase Config` di atasnya.

---

## Execution Target

Eksekusi pembuatan file `docker-compose.yml` dan modifikasi `.env.example`. Pastikan tidak merusak file lain, lalu push langsung ke origin/main.