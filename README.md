# LMS Sem5 — Learning Management System API

Backend REST API untuk LMS, dibangun dengan [Bun](https://bun.com), [Elysia](https://elysiajs.com), [Drizzle ORM](https://orm.drizzle.team), dan PostgreSQL (Docker lokal).

## Fitur

Auth User (`/api/users`):

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| `GET` | `/` | — | Health check → `{ "status": "ok" }` |
| `POST` | `/api/users` | — | Register (`full_name`, `email`, `password`, `role?`, `phone?`, `avatar_url?`) |
| `POST` | `/api/users/login` | — | Login → `{ "data": "<JWT>" }` |
| `GET` | `/api/users/current` | Bearer token | Ambil user yang sedang login |
| `DELETE` | `/api/users/logout` | Bearer token | Logout (stateless) → `{ "data": "OK" }` |

- `role` opsional saat register: `admin` \| `guru` \| `siswa` (default: `siswa`). Alias `teacher`/`student` tetap diterima.
- Login mengembalikan JWT dengan payload `{ sub, email, role }` (role diambil via JOIN `user_roles` + `roles`).
- Route terproteksi memakai header `Authorization: Bearer <token>` murni (token tidak dibaca dari query param).

Subjects (`/api/subjects`):

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| `POST` | `/api/subjects` | admin, guru | Buat mapel (`name`, `code`, `description?`), `created_by` dari JWT |
| `GET` | `/api/subjects` | semua role login | List + `created_by_name` (JOIN users) |
| `PUT` | `/api/subjects/:id` | admin | Update mapel |
| `DELETE` | `/api/subjects/:id` | admin | Hapus mapel |

Modules (`/api/modules`):

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| `POST` | `/api/modules` | admin, guru | Buat modul (`subject_id`, `title`, `description?`, `order_index?`), `teacher_id` dari JWT |
| `GET` | `/api/modules?subject_id=xxx` | semua role login | List + filter opsional, JOIN subjects & users (`subject_name`, `teacher_name`) |
| `PUT` | `/api/modules/:id` | admin / guru pemilik | Update modul milik sendiri |
| `DELETE` | `/api/modules/:id` | admin / guru pemilik | Hapus modul milik sendiri |

- Role guard (`requireRole`) menolak dengan `403 {"error":"Akses ditolak: Peran tidak valid"}` bila role di luar daftar yang diizinkan.
- Dokumentasi interaktif (Swagger UI) tersedia tanpa setup tambahan.

## Prasyarat

1. [Bun](https://bun.sh) v1.4+ terinstall (`bun --version`).
2. [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) terinstall.

## Cara Menjalankan (Docker & Local DB)

```bash
# 1. Jalankan database PostgreSQL lokal (pgvector via Docker Compose)
docker compose up -d

# 2. Install dependencies backend
bun install

# 3. Setup environment backend (.env sudah di-default ke docker)
cp .env.example .env

# 4. Sinkronkan schema ke database
bun run db:push

# 5. Jalankan server backend (watch mode)
bun run dev:backend
```

Server backend berjalan di `http://localhost:3000`.

---

## Cara Menjalankan Frontend

Masuk ke direktori `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:3001`.

> Cek cepat: buka `http://localhost:3000/` → harusnya `{ "status": "ok" }`.

## Lihat & Coba API di Swagger UI

Tidak perlu Postman untuk eksplorasi awal:

- Swagger UI: **http://localhost:3000/swagger**
- Alternatif: **http://localhost:3000/docs** (isi sama)

Di halaman itu kamu bisa:

1. Lihat semua endpoint + schema body.
2. Klik **Try it out** → **Execute** untuk menembak API langsung dari browser.
3. Untuk endpoint gembok (`/current`, `/logout`), klik tombol **Authorize** 🔓 dan isi `Bearer <token>` (token didapat dari login).

## Contoh Alur via curl

```bash
# Register
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Budi","email":"budi@mail.com","password":"rahasia123","role":"siswa"}'

# Login (simpan tokennya)
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"budi@mail.com","password":"rahasia123"}'
# → {"data":"<TOKEN>"}

# Ganti <TOKEN> dengan token dari login
TOKEN=<TOKEN>

# Current user
curl http://localhost:3000/api/users/current \
  -H "Authorization: Bearer $TOKEN"

# Logout
curl -X DELETE http://localhost:3000/api/users/logout \
  -H "Authorization: Bearer $TOKEN"
```

Error umum:

- `400 {"error":"Email sudah terdaftar"}` → pakai email lain.
- `400 {"error":"Role tidak valid"}` → role harus `admin`/`guru`/`siswa` (atau alias `teacher`/`student`).
- `401 {"error":"Email atau password salah"}` / `{"error":"Unauthorized"}` → cek email/password atau token Bearer.

## Struktur Proyek

```
src/
├── index.ts                  # Entry point: Elysia + cors + swagger (/docs, /swagger) + jwt + routes
├── routes/
│   └── users-route.ts        # Routing Elysia (prefix /api/users)
├── services/
│   └── users-services.ts     # Logic bisnis: createUser, buildLoginPayload, getCurrentUserById, logoutUser
├── middleware/
│   └── auth-middleware.ts    # Verifikasi JWT dari header Bearer → inject { user, session }
└── db/
    ├── index.ts              # Koneksi drizzle + postgres-js
    └── schema.ts             # Skema SIMANIS: users, roles, user_roles, subjects, modules + relations
drizzle.config.ts             # Config drizzle-kit (schema + DATABASE_URL)
```

Pola nambah fitur baru: tulis logic di `services/`, daftarkan route di `routes/`, proteksi route dengan `.use(authMiddleware)` (tidak perlu parsing `Authorization` manual).

## Scripts (Backend)

| Command | Fungsi |
| --- | --- |
| `docker compose up -d` | Menyalakan local PostgreSQL + pgvector container |
| `docker compose down` | Mematikan local database container |
| `bun run dev:backend` | Jalankan server backend + auto-reload (`src/index.ts`) |
| `bun run db:push` | Push schema Drizzle ke database (`drizzle-kit push`) |
| `bun run seed` | Seed data awal ke database |

## Troubleshooting

- `DATABASE_URL is not defined` / gagal konek DB → Pastikan container Docker berjalan (`docker compose ps`) dan `.env` ada dengan `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simanis"`.
- Port 5432 tabrakan → Pastikan service PostgreSQL lokal host tidak sedang jalan.
- `JWT_SECRET` kosong → isi string acak, server butuh ini untuk plugin `@elysiajs/jwt`.
- Port 3000 dipakai → ganti `PORT` di `.env` (misal `PORT=3002`), sesuaikan `NEXT_PUBLIC_API_URL` di `frontend/.env`.
- `bun run db:push` gagal → cek apakah docker postgres sudah healthy (`docker compose logs db`).


---

## LMS Frontend

Frontend untuk aplikasi Learning Management System (LMS) yang dibangun menggunakan **Next.js 16**, **TypeScript**, dan **Tailwind CSS**.

---

### Teknologi yang Digunakan

- [Next.js 16](https://nextjs.org) — Framework React
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com) — Styling
- [TanStack Query](https://tanstack.com/query) — State management & fetching data
- [Zustand](https://zustand-demo.pmnd.rs) — Global state
- [Shadcn/UI](https://ui.shadcn.com) — Komponen UI
- [Recharts](https://recharts.org) — Grafik & chart
- [Framer Motion](https://www.framer.com/motion) — Animasi

---

### Prasyarat

Pastikan perangkat kamu sudah terinstal:

- [Node.js](https://nodejs.org) versi **18** ke atas
- [npm](https://www.npmjs.com) (sudah termasuk saat install Node.js)
- [Git](https://git-scm.com)

---

### Cara Setup dari Awal

#### 1. Clone Repository

```bash
git clone https://github.com/rafifhardjaa/LMS.git
cd LMS
git checkout frontend
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses [http://localhost:3001](http://localhost:3001).

> Frontend berjalan di port **3001**, sedangkan backend berjalan di port **3000**.

---

### Struktur Folder

```
frontend/
├── app/                  # Halaman (App Router Next.js)
│   ├── admin/            # Halaman khusus admin
│   ├── teacher/          # Halaman khusus guru
│   ├── student/          # Halaman khusus siswa
│   ├── auth/             # Halaman login & register
│   └── layout.tsx        # Layout utama
├── components/           # Komponen UI
│   ├── admin/            # Komponen khusus admin
│   ├── teacher/          # Komponen khusus guru
│   ├── student/          # Komponen khusus siswa
│   └── ui/               # Komponen umum (Shadcn)
├── lib/                  # Utilitas & konfigurasi
│   ├── api/              # Fungsi pemanggilan API
│   ├── store/            # Zustand global state
│   └── providers/        # React providers
├── hooks/                # Custom React hooks
├── public/               # Aset statis
└── middleware.ts         # Middleware autentikasi
```

---

### Scripts yang Tersedia

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan server development di port 3001 |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan hasil build production |
| `npm run lint` | Cek kode dengan ESLint |

---

### Kontribusi

1. Buat branch baru dari `frontend`:
   ```bash
   git checkout frontend
   git checkout -b nama-fitur-kamu
   ```
2. Lakukan perubahan dan commit:
   ```bash
   git add .
   git commit -m "feat: deskripsi perubahan"
   ```
3. Push ke GitHub:
   ```bash
   git push origin nama-fitur-kamu
   ```
4. Buat Pull Request ke branch `frontend`.
