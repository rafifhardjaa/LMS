# LMS Sem5 — Learning Management System API

Backend REST API untuk LMS, dibangun dengan [Bun](https://bun.com), [Elysia](https://elysiajs.com), [Drizzle ORM](https://orm.drizzle.team), dan PostgreSQL (bisa pakai Supabase).

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
2. Database PostgreSQL. Paling mudah: buat project gratis di [Supabase](https://supabase.com) → ambil **Connection String** (mode Session/Transaction, port 5432).

## Cara Menjalankan (5 menit)

```bash
# 1. Clone & masuk folder
git clone <url-repo-ini>
cd LMS_Sem5

# 2. Install dependency
bun install

# 3. Setup environment
cp .env.example .env
```

Isi file `.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=isi_dengan_string_acak_minimal_32_karakter
PORT=3000
```

```bash
# 4. Sinkronkan schema ke database (5 tabel SIMANIS: users, roles, user_roles, subjects, modules)
bun run db:push

# 5. Jalankan server (watch mode)
bun run dev
```

Server jalan di `http://localhost:3000` (atau sesuai `PORT`).

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

## Scripts

| Command | Fungsi |
| --- | --- |
| `bun run dev` | Jalankan server + auto-reload (`src/index.ts`) |
| `bun run db:push` | Push schema Drizzle ke database (`drizzle-kit push`) |

## Troubleshooting

- `DATABASE_URL is not defined` / gagal konek DB → pastikan `.env` ada dan `DATABASE_URL` benar. Di Supabase, ganti `[YOUR-PASSWORD]` dengan password DB project kamu.
- `JWT_SECRET` kosong → isi string acak, server butuh ini untuk plugin `@elysiajs/jwt`.
- Port 3000 dipakai → ganti `PORT` di `.env` (misal `PORT=3001`), lalu buka `http://localhost:3001/swagger`.
- `bun run db:push` gagal → pastikan DB bisa diakses publik (cek firewall/host) dan connection string pakai port 5432.
- Setelah logout token masih bisa dipakai → itu normal, auth memakai JWT stateless (logout = buang token di sisi klien).
