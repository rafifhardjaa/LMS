import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { usersRoute } from "./routes/users-route";
import { authRoute } from "./routes/auth-route";
import { adminUsersRoute } from "./routes/admin-users-route";
import { subjectsRoute } from "./routes/subjects-route";
import { modulesRoute } from "./routes/modules-route";
import { discussionsRoute } from "./routes/discussions-route";
import { lessonsRoute } from "./routes/lessons-route";
import { enrollmentsRoute } from "./routes/enrollments-route";
import { reviewsRoute } from "./routes/reviews";
import { notificationsRoute } from "./routes/notifications";
import { progressRoute } from "./routes/progress";
import { uploadsRoute } from "./routes/uploads";

const documentation = {
  info: {
    title: "SiManis LMS API",
    version: "1.0.0",
    description: `
## SiManis — Learning Management System API

REST API untuk platform manajemen pembelajaran SMK Mataram.
Mendukung manajemen siswa, guru, mata pelajaran, modul, lesson, enrollment, review, notifikasi, progress, dan upload file.

### Autentikasi
Gunakan \`POST /api/v1/auth/login\` (identifier = email atau nomor induk) untuk mendapatkan JWT token, lalu klik tombol **Authorize 🔒** di atas dan masukkan:
\`\`\`
Bearer <token>
\`\`\`

Registrasi mandiri hanya untuk siswa dan harus cocok dengan roster sekolah.
Akun guru dibuat oleh admin melalui \`POST /api/v1/admin/users\`.

### Role
| Role  | Keterangan            |
|-------|-----------------------|
| admin | Akses penuh           |
| guru  | Buat & kelola konten  |
| siswa | Baca konten & enroll  |
    `.trim(),
    contact: {
      name: "Tim RPL SMK Mataram",
      email: "dev@smkmataram.sch.id",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http" as const,
        scheme: "bearer" as const,
        bearerFormat: "JWT",
        description: "JWT token dari endpoint login. Format: `Bearer <token>`",
      },
    },
  },
  security: [{ BearerAuth: [] }],
  tags: [
    { name: "Auth", description: "Registrasi, login, profil, dan logout" },
    { name: "Admin", description: "Manajemen akun guru & siswa (admin)" },
    { name: "Subjects", description: "Manajemen mata pelajaran" },
    { name: "Modules", description: "Manajemen modul dalam mata pelajaran" },
    { name: "Lessons", description: "Manajemen lesson dalam modul" },
    { name: "Enrollments", description: "Pendaftaran siswa ke mata pelajaran" },
    { name: "Reviews", description: "Ulasan siswa terhadap mata pelajaran" },
    { name: "Notifications", description: "Notifikasi pengguna" },
    { name: "Progress", description: "Tracking progress belajar siswa" },
    { name: "Uploads", description: "Upload dan akses file" },
  ],
};

// ── CORS ─────────────────────────────────────────────────────────────
// Hanya origin frontend yang dikonfigurasi yang boleh memanggil API dari
// browser. Origin tambahan (mis. preview deployment) dapat didaftarkan
// lewat CORS_ORIGINS, dipisah koma.
const appUrl = (process.env.APP_URL ?? "http://localhost:3001").replace(
  /\/+$/,
  ""
);
const allowedOrigins = [
  ...new Set(
    [appUrl, ...(process.env.CORS_ORIGINS ?? "").split(",")]
      .map((origin) => origin.trim().replace(/\/+$/, ""))
      .filter(Boolean)
  ),
];

const app = new Elysia()
  .use(cors({ origin: allowedOrigins }))
  .use(swagger({ path: "/docs", documentation }))
  .use(swagger({ path: "/swagger", documentation }))
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .get("/", () => ({ status: "ok" }))
  .use(usersRoute)
  .use(authRoute)
  .use(adminUsersRoute)
  .use(subjectsRoute)
  .use(modulesRoute)
  .use(discussionsRoute)
  .use(lessonsRoute)
  .use(enrollmentsRoute)
  .use(reviewsRoute)
  .use(notificationsRoute)
  .use(progressRoute)
  .use(uploadsRoute)
  .listen(Number(process.env.PORT) || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
