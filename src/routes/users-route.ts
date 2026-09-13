import { Elysia, t } from "elysia";
import {
  buildLoginPayload,
  createUser,
  logoutUser,
  updateUserProfile,
} from "../services/users-services";
import { authMiddleware } from "../middleware/auth-middleware";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, status }) => {
      try {
        await createUser(body);
        return status(201, { data: "OK" });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Email sudah terdaftar"
        ) {
          return status(400, { error: "Email sudah terdaftar" });
        }
        if (error instanceof Error && error.message === "Role tidak valid") {
          return status(400, { error: "Role tidak valid" });
        }
        if (error instanceof Error && error.message === "Nama wajib diisi") {
          return status(400, { error: "Nama wajib diisi" });
        }
        throw error;
      }
    },
    {
      body: t.Object({
        full_name: t.Optional(t.String()),
        name: t.Optional(t.String()),
        email: t.String(),
        password: t.String(),
        role: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        avatar_url: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/login",
    // `jwt` berasal dari plugin @elysiajs/jwt yang diregistrasi di
    // src/index.ts sebelum usersRoute di-mount.
    async ({ body, status, jwt }: any) => {
      try {
        const payload = await buildLoginPayload(body);
        const token = await jwt.sign(payload);
        return status(200, { data: token });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Email atau password salah"
        ) {
          return status(401, { error: "Email atau password salah" });
        }
        if (error instanceof Error && error.message === "Akun tidak aktif") {
          return status(403, { error: "Akun tidak aktif" });
        }
        throw error;
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .use(authMiddleware)
  .get("/current", async ({ user, status }) => {
    return status(200, { data: user });
  })
  .delete("/logout", async ({ session, status }) => {
    await logoutUser(session.token);
    return status(200, { data: "OK" });
  })
  .put(
    "/profile",
    async ({ body, user, status }: any) => {
      try {
        const updated = await updateUserProfile(user.id, {
          fullName: body.fullName,
          phone: body.phone,
          avatarUrl: body.avatarUrl,
        });
        return status(200, {
          success: true,
          message: "Profil berhasil diperbarui",
          data: updated,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "User tidak ditemukan"
        ) {
          return status(404, { success: false, message: error.message });
        }
        throw error;
      }
    },
    {
      body: t.Object({
        fullName: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        avatarUrl: t.Optional(t.String()),
      }),
    }
  );
