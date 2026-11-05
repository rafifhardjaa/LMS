import { Elysia, t } from "elysia";
import { enforceRateLimit, getClientIp } from "../lib/rate-limit";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  activateAccount,
  changePassword,
  loginWithIdentifier,
  registerStudent,
  registerTeacher,
  requestPasswordReset,
  resetPassword,
} from "../services/auth-service";
import { handleError } from "../utils/response";

const REGISTER_WINDOW = 15 * 60 * 1000;
const LOGIN_WINDOW = 60 * 1000;
const LOGIN_IDENTIFIER_WINDOW = 5 * 60 * 1000;
const EMAIL_WINDOW = 15 * 60 * 1000;

export const authRoute = new Elysia({ prefix: "/api/v1/auth" })
  .post(
    "/register",
    async ({ body, request, server, status }: any) => {
      try {
        enforceRateLimit(
          `register:${getClientIp(request, server)}`,
          30,
          REGISTER_WINDOW
        );

        if (body.role === "guru") {
          await registerTeacher({
            fullName: body.fullName,
            nomorInduk: body.nomor_induk,
            tanggalLahir: body.tanggal_lahir,
            email: body.email ?? null,
            major: body.major ?? null,
            gradeLevel: body.gradeLevel ?? null,
            subject: body.subject ?? null,
            role: "guru",
          });
          return status(201, {
            success: true,
            message:
              "Guru baru dibuat dan siap diaktifkan. Cek email untuk kata sandi awal.",
          });
        } else {
          await registerStudent({
            email: body.email,
            nomorInduk: body.nomor_induk,
            tanggalLahir: body.tanggal_lahir,
          });
          return status(201, {
            success: true,
            message:
              "Registrasi berhasil. Cek email untuk tautan aktivasi akun.",
          });
        }
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Registrasi (siswa atau guru)",
        description:
          "Siswa: hanya bila nomor induk + tanggal lahir cocok dengan roster yang diimpor admin.\nGuru: dibuat oleh admin sekolah, dilengkapi dengan data guru dan kelas/mata pelajaran.",
      },
      body: t.Union([
        t.Object({
          email: t.String(),
          nomor_induk: t.String(),
          tanggal_lahir: t.String(),
          role: t.Literal("siswa"),
        }),
        t.Object({
          fullName: t.String(),
          nomor_induk: t.String(),
          tanggal_lahir: t.String(),
          email: t.Optional(t.Union([t.String(), t.Null()])),
          major: t.Optional(t.Union([t.String(), t.Null()])),
          gradeLevel: t.Optional(t.Union([t.String(), t.Null()])),
          subject: t.Optional(t.Union([t.String(), t.Null()])),
          role: t.Literal("guru"),
        }),
      ]),
    }
  )
  .post(
    "/activate",
    async ({ body, request, server, status }) => {
      try {
        enforceRateLimit(
          `activate:${getClientIp(request, server)}`,
          30,
          EMAIL_WINDOW
        );
        const user = await activateAccount(body);
        return status(200, {
          success: true,
          message: "Akun berhasil diaktivasi. Silakan login.",
          data: user,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Aktivasi akun & buat password",
        description:
          "Memakai token dari email aktivasi. Token hanya berlaku 24 jam dan sekali pakai.",
      },
      body: t.Object({
        token: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, jwt, request, server, status }: any) => {
      try {
        enforceRateLimit(
          `login:ip:${getClientIp(request, server)}`,
          30,
          LOGIN_WINDOW
        );
        enforceRateLimit(
          `login:id:${String(body.identifier).trim().toLowerCase()}`,
          5,
          LOGIN_IDENTIFIER_WINDOW
        );
        const { claims, mustChangePassword } = await loginWithIdentifier(body);
        const token = await jwt.sign(claims);
        return status(200, {
          success: true,
          message: "Login berhasil",
          data: token,
          must_change_password: mustChangePassword,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Login — email atau nomor induk",
        description:
          "Body `identifier` dapat berupa email terdaftar atau nomor induk (NIS/NIP). Role diambil dari akun, bukan dari input klien.",
      },
      body: t.Object({
        identifier: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/forgot-password",
    async ({ body, request, server, status }) => {
      try {
        enforceRateLimit(
          `forgot:${getClientIp(request, server)}`,
          10,
          EMAIL_WINDOW
        );
        await requestPasswordReset(body.identifier);
        return status(200, {
          success: true,
          message:
            "Jika identitas terdaftar, tautan reset password sudah dikirim ke email.",
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Lupa password — kirim tautan reset",
        description:
          "Selalu memberi respons yang sama agar tidak membocorkan status pendaftaran sebuah email/NIS.",
      },
      body: t.Object({ identifier: t.String() }),
    }
  )
  .post(
    "/reset-password",
    async ({ body, request, server, status }) => {
      try {
        enforceRateLimit(
          `reset:${getClientIp(request, server)}`,
          30,
          EMAIL_WINDOW
        );
        await resetPassword(body);
        return status(200, {
          success: true,
          message:
            "Password berhasil direset. Semua sesi lama telah diakhiri, silakan login.",
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Reset password dengan token email",
        description: "Token hanya berlaku 1 jam dan sekali pakai.",
      },
      body: t.Object({
        token: t.String(),
        password: t.String(),
      }),
    }
  )
  .use(authMiddleware)
  .put(
    "/password",
    async ({ body, user, jwt, status }: any) => {
      try {
        const claims = await changePassword(user.id, {
          currentPassword: body.current_password,
          newPassword: body.new_password,
        });
        const token = await jwt.sign(claims);
        return status(200, {
          success: true,
          message: "Password berhasil diganti",
          data: token,
          must_change_password: false,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Ganti password (user login)",
        description:
          "Password lama wajib benar. Token baru dikembalikan agar sesi ini tetap aktif; sesi lain otomatis berakhir.",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        current_password: t.String(),
        new_password: t.String(),
      }),
    }
  );
