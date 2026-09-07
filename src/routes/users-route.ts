import { Elysia, t } from "elysia";
import { createUser, loginUser, logoutUser } from "../services/users-services";
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
        throw error;
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, status }) => {
      try {
        const token = await loginUser(body);
        return status(200, { data: token });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Email atau password salah"
        ) {
          return status(401, { error: "Email atau password salah" });
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
  });
