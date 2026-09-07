import { Elysia, t } from "elysia";
import { createUser } from "../services/users-services";

export const usersRoute = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, status }) => {
    try {
      await createUser(body);
      return status(201, { data: "OK" });
    } catch (error) {
      if (error instanceof Error && error.message === "Email sudah terdaftar") {
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
);
