import { Elysia } from "elysia";
import { canonicalRole } from "../services/role-service";
import { getSessionUserById } from "../services/users-services";

// Endpoint yang tetap boleh diakses saat user masih memakai password
// default (password_changed_at NULL).
const MUST_CHANGE_ALLOWED_PATHS = new Set([
  "/api/v1/auth/password",
  "/api/v1/users/current",
  "/api/v1/users/logout",
]);

// Plugin Elysia (pola fungsi) yang memvalidasi JWT dari header
// `Authorization: Bearer <token>` dan menginjeksi { user, session }
// ke context route terproteksi. Token TIDAK pernah dibaca dari
// query parameters.
export const authMiddleware = (app: Elysia) =>
  // `jwt` didekorasikan oleh plugin @elysiajs/jwt di src/index.ts;
  // diketik `any` karena instance route didefinisikan standalone.
  app.derive(async ({ headers, status, jwt, request }: any) => {
    console.log("[authMiddleware] incoming:", request?.method, request?.url, "jwt:", !!jwt, "status:", typeof status);
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
      const user = await getSessionUserById(String(payload.sub));

      // Token lama (tanpa tv) dan token yang diterbitkan sebelum password
      // diganti/direset langsung ditolak.
      if (typeof payload.tv !== "number" || payload.tv !== user.tokenVersion) {
        throw status(401, {
          error: "Sesi berakhir. Silakan login kembali.",
        });
      }

      if (
        user.must_change_password &&
        !MUST_CHANGE_ALLOWED_PATHS.has(new URL(request.url).pathname)
      ) {
        throw status(403, {
          error: "Password harus diganti terlebih dahulu",
          code: "password_change_required",
        });
      }

      // tokenVersion hanya untuk pengecekan internal, tidak diekspos ke route.
      const { tokenVersion: _tokenVersion, ...publicUser } = user;

      return {
        user: publicUser,
        session: { token },
      };
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        throw status(401, { error: "Unauthorized" });
      }
      // Log error yang tidak terduga (mis. database down / tabel belum ada)
      console.error("[authMiddleware] unexpected error:", err);
      throw err;
    }
  });

// Role guard (wajib dipasang setelah authMiddleware): 403 bila role user di luar allowedRoles.
export function requireRole(allowedRoles: string[]) {
  const allowed = new Set(allowedRoles.map((role) => canonicalRole(role)));
  return ({ user, status }: any) => {
    if (!user || !allowed.has(canonicalRole(user.role))) {
      throw status(403, { error: "Akses ditolak: Peran tidak valid" });
    }
  };
}

export { canonicalRole } from "../services/role-service";
