import { Elysia } from "elysia";
import { getCurrentUserById } from "../services/users-services";

// Plugin Elysia (pola fungsi) yang memvalidasi JWT dari header
// `Authorization: Bearer <token>` dan menginjeksi { user, session }
// ke context route terproteksi. Token TIDAK pernah dibaca dari
// query parameters.
export const authMiddleware = (app: Elysia) =>
  // `jwt` didekorasikan oleh plugin @elysiajs/jwt di src/index.ts;
  // diketik `any` karena instance route didefinisikan standalone.
  app.derive(async ({ headers, status, jwt }: any) => {
    const authorization: unknown = headers["authorization"];
    if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
      throw status(401, { error: "Unauthorized" });
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      throw status(401, { error: "Unauthorized" });
    }

    const payload = await jwt?.verify(token);
    if (!payload || typeof payload !== "object" || !payload.sub) {
      throw status(401, { error: "Unauthorized" });
    }

    try {
      const user = await getCurrentUserById(String(payload.sub));
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
