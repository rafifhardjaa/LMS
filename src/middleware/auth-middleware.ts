import { Elysia } from "elysia";
import { getCurrentUser } from "../services/users-services";

// Plugin Elysia (pola fungsi) yang memvalidasi Bearer Token ke tabel
// sessions dan menginjeksi { user, session } ke context route terproteksi.
export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ headers, status }) => {
    const authorization = headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw status(401, { error: "Unauthorized" });
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      throw status(401, { error: "Unauthorized" });
    }

    try {
      const user = await getCurrentUser(token);
      return {
        user,
        session: { token },
      };
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        throw status(401, { error: "Unauthorized" });
      }
      throw err;
    }
  });
