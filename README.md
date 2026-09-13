# LMS Frontend

Frontend untuk aplikasi Learning Management System (LMS) yang dibangun menggunakan **Next.js 16**, **TypeScript**, dan **Tailwind CSS**.

---

## Teknologi yang Digunakan

- [Next.js 16](https://nextjs.org) — Framework React
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com) — Styling
- [Supabase](https://supabase.com) — Autentikasi & Storage
- [TanStack Query](https://tanstack.com/query) — State management & fetching data
- [Zustand](https://zustand-demo.pmnd.rs) — Global state
- [Shadcn/UI](https://ui.shadcn.com) — Komponen UI
- [Recharts](https://recharts.org) — Grafik & chart
- [Framer Motion](https://www.framer.com/motion) — Animasi

---

## Prasyarat

Pastikan perangkat kamu sudah terinstal:

- [Node.js](https://nodejs.org) versi **18** ke atas
- [npm](https://www.npmjs.com) (sudah termasuk saat install Node.js)
- [Git](https://git-scm.com)

---

## Cara Setup dari Awal

### 1. Clone Repository

```bash
git clone https://github.com/rafifhardjaa/LMS.git
cd LMS
git checkout frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses [http://localhost:3001](http://localhost:3001).

> Frontend berjalan di port **3001**, sedangkan backend berjalan di port **3000**.

---

## Struktur Folder

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
│   ├── supabase/         # Konfigurasi Supabase client
│   └── providers/        # React providers
├── hooks/                # Custom React hooks
├── public/               # Aset statis
└── middleware.ts         # Middleware autentikasi
```

---

## Scripts yang Tersedia

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan server development di port 3001 |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan hasil build production |
| `npm run lint` | Cek kode dengan ESLint |

---

## Kontribusi

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
