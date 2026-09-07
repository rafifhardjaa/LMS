import { Elysia, t } from "elysia";
import {
  createUser,
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/users-services";

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
  .get("/current", async ({ headers, status }) => {
    const authorization = headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return status(401, { error: "Unauthorized" });
    }
    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      return status(401, { error: "Unauthorized" });
    }
    try {
      const user = await getCurrentUser(token);
      return status(200, { data: user });
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        return status(401, { error: "Unauthorized" });
      }
      throw error;
    }
  })
  .delete("/logout", async ({ headers, status }) => {
    const authorization = headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return status(401, { error: "Unauthorized" });
    }
    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      return status(401, { error: "Unauthorized" });
    }
    try {
      await logoutUser(token);
      return status(200, { data: "OK" });
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        return status(401, { error: "Unauthorized" });
      }
      throw error;
    }
  });
