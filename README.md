# SiManis — Learning Management System

![Bun](https://img.shields.io/badge/Bun-1.4+-black?logo=bun)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

Platform manajemen pembelajaran (LMS) untuk SMK Mataram — mencakup manajemen siswa, guru, mata pelajaran, modul, dan bimbingan konseling.

---

## Struktur Proyek

```
LMS/
├── BackEnd/      # REST API — Bun + Elysia + Drizzle ORM
├── FrontEnd/     # Web App — Next.js 16 + Tailwind CSS
└── README.md
```

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | [Bun](https://bun.sh) v1.4+ |
| Backend Framework | [Elysia](https://elysiajs.com) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Database | PostgreSQL (via [Supabase](https://supabase.com) atau Docker) |
| Frontend Framework | [Next.js 16](https://nextjs.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Components | [Shadcn/UI](https://ui.shadcn.com) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs) + [TanStack Query](https://tanstack.com/query) |
| Animation | [Framer Motion](https://www.framer.com/motion) |

---

## Prasyarat

- [Bun](https://bun.sh) v1.4+
- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop) — database PostgreSQL 16 dijalankan lewat `docker compose`

---

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/rafifhardjaa/LMS.git
cd LMS
```

### 2. Setup BackEnd

```bash
cd BackEnd

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env — minimal ganti JWT_SECRET
```

Contoh isi `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simanis
STORAGE_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storage_simanis
JWT_SECRET=isi_string_acak_minimal_32_karakter
PORT=3000
```

```bash
# Nyalakan PostgreSQL (sekali saja untuk container + volume-nya)
docker compose up -d

# Terapkan migrasi ke kedua database
bun run db:migrate

# Isi data awal (opsional, untuk development)
bun run seed

# Jalankan server (watch mode)
bun run dev
```

> Langkah migrasi + seed bisa disingkat jadi satu perintah: `bun run db:setup`.

Server berjalan di `http://localhost:3000`.
Swagger UI tersedia di `http://localhost:3000/swagger`.

### 3. Setup FrontEnd

```bash
cd FrontEnd

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Pastikan NEXT_PUBLIC_API_URL mengarah ke backend

# Jalankan development server
npm run dev
```

Frontend berjalan di `http://localhost:3001`.

### Troubleshooting Database

**Gejala 1:** `bun run db:migrate` gagal dengan pesan `database "storage_simanis" does not exist`.

**Gejala 2:** `psql`/DBeaver hanya menampilkan database `simanis`; `storage_simanis` tidak ada atau ada tapi tanpa tabel.

Kedua gejala punya sebab yang sama: container PostgreSQL hanya membuat `simanis` (dari `POSTGRES_DB`), sedangkan `storage_simanis` dibuat oleh script di `BackEnd/initdb/`. Script init **hanya dijalankan saat volume database masih kosong**, jadi mesin yang volume-nya sudah terbentuk sebelum perubahan ini tidak mendapat database kedua.

Solusinya, dari folder `BackEnd`:

```bash
# Buang volume lama lalu buat ulang dari nol (data lokal akan hilang)
docker compose down -v
docker compose up -d

# Terapkan migrasi + data awal
bun run db:setup
```

Setelah itu `docker exec simanis-db psql -U postgres -lqt` harus menampilkan `simanis` **dan** `storage_simanis`.

Kalau DBeaver masih hanya menampilkan satu database, aktifkan opsi **Show all databases** di *Connection settings → PostgreSQL* pada koneksi tersebut.

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | — | Registrasi siswa (wajib cocok dengan roster admin) |
| `POST` | `/api/v1/auth/activate` | — | Aktivasi akun + buat password dari token email |
| `POST` | `/api/v1/auth/login` | — | Login (`identifier` = email atau nomor induk) → JWT |
| `POST` | `/api/v1/auth/forgot-password` | — | Kirim tautan reset ke email |
| `POST` | `/api/v1/auth/reset-password` | — | Buat password baru dari token email |
| `PUT` | `/api/v1/auth/password` | Bearer | Ganti password (password lama wajib benar) |
| `GET` | `/api/v1/users/current` | Bearer | Data user aktif |
| `DELETE` | `/api/v1/users/logout` | Bearer | Logout (hapus token di klien) |

### Admin — `/api/v1/admin/users` (khusus admin)

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/v1/admin/users` | Buat satu akun guru/siswa (langsung aktif, password default) |
| `POST` | `/api/v1/admin/users/import` | Impor roster siswa (atau langsung aktifkan) |
| `GET` | `/api/v1/admin/users/roster` | Siswa yang belum menyelesaikan aktivasi |
| `POST` | `/api/v1/admin/users/:id/activate` | Aktifkan siswa roster dengan password default |
| `POST` | `/api/v1/admin/users/:id/reset-password` | Reset password user ke password default |

### Subjects — `/api/v1/subjects`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `POST` | `/api/v1/subjects` | admin, guru | Buat mata pelajaran |
| `GET` | `/api/v1/subjects` | semua | List mata pelajaran |
| `PUT` | `/api/v1/subjects/:id` | admin | Update mata pelajaran |
| `DELETE` | `/api/v1/subjects/:id` | admin | Hapus mata pelajaran |

### Modules — `/api/v1/modules`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `POST` | `/api/v1/modules` | admin, guru | Buat modul |
| `GET` | `/api/v1/modules` | semua | List modul (filter `?subject_id=`) |
| `GET` | `/api/v1/modules/:moduleId` | semua | Detail modul + subject & guru |
| `PUT` | `/api/v1/modules/:moduleId` | admin, guru pemilik | Update modul |
| `DELETE` | `/api/v1/modules/:moduleId` | admin, guru pemilik | Hapus modul |

### Discussions - `/api/v1/modules/:moduleId/discussions`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `GET` | `/api/v1/modules/:moduleId/discussions` | siswa enrolled, guru pemilik, admin | List pertanyaan + balasan |
| `POST` | `/api/v1/modules/:moduleId/discussions` | siswa enrolled | Buat pertanyaan (maks. 2000 karakter) |
| `POST` | `/api/v1/modules/:moduleId/discussions/:discussionId/replies` | guru pemilik, admin | Balas pertanyaan |

### Progress — `/api/v1/progress`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `POST` | `/api/v1/progress/lesson/:lessonId` | siswa enrolled | Tandai lesson selesai atau batalkan |
| `GET` | `/api/v1/progress/subject/:subjectId` | siswa enrolled | Persentase lesson selesai di satu mapel |
| `GET` | `/api/v1/progress/module/:moduleId` | siswa enrolled | Persentase lesson selesai di satu modul |

> Progress dihitung untuk user yang login dan hanya tersedia jika enrollment-nya
> berstatus `active`.

> Role yang tersedia: `admin` \| `guru` \| `siswa`

Data seed development menyertakan subject **Informatika & Sains Komputasi**, modul
**Algoritma Pemrograman & Optimasi Big-O**, enrollment `siswa@simanis.com` dan
`siswa4@simanis.com`, serta dua diskusi contoh beserta balasan guru.

---

## Autentikasi & Akun

### Login

Login memakai salah satu identitas:

- **email** terdaftar, atau
- **nomor induk** — NIS untuk siswa, NIP untuk guru.

```json
POST /api/v1/auth/login
{ "identifier": "1023014587", "password": "15082010999" }
```

Role **selalu dibaca dari database**, tidak pernah dari input klien. JWT berlaku 7 hari dan membawa `tv` (token version); setiap password diganti/direset, versi naik dan semua token lama otomatis ditolak.

### Siapa yang boleh mendaftar

| Jalur | Siapa | Cara |
|---|---|---|
| Publik | **Siswa saja** | `POST /api/v1/auth/register` — hanya berhasil jika NIS + tanggal lahir cocok dengan roster yang diimpor admin |
| Admin | Guru & siswa | `POST /api/v1/admin/users` atau `POST /api/v1/admin/users/import` |

Tidak ada endpoint publik yang menerima field `role`; akun guru tidak bisa dibuat lewat registrasi mandiri.

### Password awal (tanpa input satu per satu)

Akun yang dibuat admin langsung aktif dengan password default yang diturunkan dari data siswa:

```
DDMMYYYY + 3 digit terakhir nomor induk
```

Contoh: lahir **15 Agustus 2010**, NIS `...4587` → `150820104587`.
Admin tidak perlu mengetik password; nilai yang sama dikembalikan pada response pembuatan/import untuk dibagikan ke siswa.

Password ini hanya berlaku sampai login pertama. Selama `password_changed_at` masih kosong, backend menolak semua endpoint selain ganti password & data sesi dengan `403 password_change_required`, sehingga siswa wajib membuat password sendiri.

### Dua alur akun siswa

1. **Roster + aktivasi mandiri** — admin mengimpor daftar siswa (`activate: false`). Siswa mendaftar dengan NIS + tanggal lahir + email, lalu membuka tautan aktivasi dari email untuk membuat password.
2. **Langsung aktif** — admin mengimpor dengan `activate: true` (atau membuat satu akun). Siswa login memakai password default, lalu wajib menggantinya.

### Lupa password

`POST /api/v1/auth/forgot-password` mengirim tautan reset (berlaku 1 jam, sekali pakai) ke email pemilik akun. Respons selalu sama agar keberadaan akun tidak bocor. Admin juga dapat mereset password user ke password default lewat `POST /api/v1/admin/users/:id/reset-password`.

### Konfigurasi email

Email dipakai untuk tautan aktivasi & reset. Isi `.env`:

```bash
APP_URL=http://localhost:3001        # base URL frontend untuk tautan email

# Opsi budget 0: Gmail app-password (~500 email/hari) atau Brevo free (~300/hari)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=akun.sekolah@gmail.com
SMTP_PASS=app-password-16-digit
SMTP_FROM="SiManis LMS <akun.sekolah@gmail.com>"
```

Untuk development tanpa akun SMTP, set `MAIL_DEV=true` — tautan aktivasi/reset dicetak ke console server sehingga alur tetap bisa diuji.

---

## Struktur Folder

### BackEnd

```
BackEnd/
├── src/
│   ├── index.ts              # Entry point
│   ├── routes/               # Definisi endpoint Elysia
│   ├── services/             # Business logic
│   ├── middleware/           # Auth middleware (JWT)
│   └── db/
│       ├── index.ts          # Koneksi database simanis
│       ├── storage.ts        # Koneksi database storage_simanis
│       ├── schema.ts         # Definisi tabel (Drizzle)
│       ├── storage-schema.ts # Definisi tabel storage
│       ├── migrate.ts        # Runner migrasi kedua database
│       └── seed.ts           # Data awal
├── drizzle/                  # Migrasi SQL — database simanis
├── drizzle-storage/          # Migrasi SQL — database storage_simanis
├── initdb/                   # Script init container PostgreSQL
├── drizzle.config.ts         # Konfigurasi Drizzle Kit (simanis)
├── drizzle.storage.config.ts # Konfigurasi Drizzle Kit (storage_simanis)
├── docker-compose.yml        # PostgreSQL 16 → simanis + storage_simanis
└── package.json
```

### FrontEnd

```
FrontEnd/
├── app/                      # Halaman (Next.js App Router)
│   ├── admin/                # Dashboard admin
│   ├── teacher/              # Dashboard guru
│   ├── student/              # Dashboard siswa
│   └── auth/                 # Login & register
├── components/               # Komponen UI
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   └── ui/                   # Komponen Shadcn
├── lib/
│   ├── api/                  # API client
│   ├── store/                # Zustand state
│   └── providers/            # React providers
├── hooks/                    # Custom hooks
└── middleware.ts             # Auth middleware Next.js
```

---

## Database & Migrasi

Satu server PostgreSQL menyimpan **dua database**:

| Database | Isi | Config Drizzle | Folder migrasi |
|---|---|---|---|
| `simanis` | data utama (users, subjects, modules, lessons, enrollments, ...) | `drizzle.config.ts` | `BackEnd/drizzle/` |
| `storage_simanis` | file upload (`uploaded_files`) | `drizzle.storage.config.ts` | `BackEnd/drizzle-storage/` |

Database-nya dibuat otomatis oleh `BackEnd/initdb/01-create-storage-db.sql` ketika volume Docker masih kosong; tabelnya dibuat oleh file migrasi yang ter-commit di repo. Karena itu **jangan** membuat tabel manual di DBeaver/psql — perubahan schema harus lewat migrasi supaya semua orang mendapat struktur yang sama.

### Setelah mengubah schema

```bash
cd BackEnd

# 1. Generate file migrasi dari schema.ts
bun run db:generate

# 2. Terapkan ke database
bun run db:migrate

# 3. Commit folder drizzle/ beserta meta/ — tanpa ini, mesin lain tidak ikut berubah
```

Untuk tabel storage (`src/db/storage-schema.ts`), langkah 1 diganti dengan `bun run db:generate:storage` (output ke `drizzle-storage/`).

`bun run db:push` hanya untuk eksperimen lokal: ia menyamakan database langsung tanpa menghasilkan file migrasi, sehingga tidak bisa direproduksi di mesin lain. Jangan dipakai sebagai alur utama.

### Backup database

```bash
cd BackEnd
bun run db:backup
# -> backups/simanis-YYYYMMDD-HHMMSS.dump
# -> backups/storage_simanis-YYYYMMDD-HHMMSS.dump
```

Backup memakai `pg_dump -Fc` dari container PostgreSQL. Restore:

```bash
docker exec -i simanis-db pg_restore -U postgres -d simanis --clean --if-exists < backups/simanis-YYYYMMDD-HHMMSS.dump
```

Folder `BackEnd/backups/` tidak ikut di-commit.

---

## Scripts

### BackEnd

| Command | Fungsi |
|---|---|
| `bun run dev` | Jalankan server + auto-reload |
| `bun run db:migrate` | Terapkan migrasi ke database `simanis` dan `storage_simanis` |
| `bun run db:generate` | Buat file migrasi baru dari `src/db/schema.ts` |
| `bun run db:generate:storage` | Buat file migrasi baru dari `src/db/storage-schema.ts` |
| `bun run db:setup` | `db:migrate` lalu `seed` |
| `bun run db:backup` | Backup `simanis` + `storage_simanis` ke `BackEnd/backups/` |
| `bun run db:push` | Push schema langsung tanpa file migrasi (dev cepat) |
| `bun run seed` | Isi data awal ke database |

> Jalankan semua perintah database dari folder `BackEnd`.

### FrontEnd

| Command | Fungsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | Cek kode dengan ESLint |

---

## Alur Kontribusi

```
feature/nama-fitur  →  dev  →  staging  →  main
```

1. Buat branch dari `dev`:
   ```bash
   git checkout dev
   git checkout -b feature/nama-fitur
   ```

2. Commit perubahan:
   ```bash
   git add .
   git commit -m "feat: deskripsi singkat perubahan"
   ```

3. Push dan buat Pull Request ke `dev`:
   ```bash
   git push -u origin feature/nama-fitur
   ```

4. Setelah review → merge ke `dev` → `staging` → `main`

### Konvensi Commit Message

| Prefix | Kegunaan |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Bug fix |
| `chore:` | Maintenance, config |
| `refactor:` | Refactoring kode |
| `docs:` | Perubahan dokumentasi |

---

## Troubleshooting

- **`DATABASE_URL is not defined`** → Pastikan file `.env` sudah ada dan `DATABASE_URL` terisi dengan benar.
- **`bun run db:push` gagal** → Cek koneksi database, pastikan host & password PostgreSQL sudah benar.
- **`JWT_SECRET` kosong** → Wajib diisi, server tidak bisa berjalan tanpa ini.
- **Port 3000 sudah dipakai** → Ganti `PORT` di `.env` (misal `PORT=3001`).
- **Token masih valid setelah logout** → Normal — logout hanya menghapus token di klien. Token otomatis dicabut saat password diganti/direset.
- **`403 password_change_required`** → Akun masih memakai password awal. Ganti lewat `PUT /api/v1/auth/password` (halaman `/auth/change-password` di frontend).
- **Tautan aktivasi/reset tidak masuk email** → Untuk development set `MAIL_DEV=true` dan lihat console server. Untuk produksi, cek `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` dan folder spam.
- **Login gagal padahal password default benar** → Pastikan tanggal lahir di data sekolah berformat `YYYY-MM-DD` dan nomor induk minimal 3 digit; password = `DDMMYYYY` + 3 digit terakhir nomor induk.

---

## License

MIT © 2026 SMK Mataram
