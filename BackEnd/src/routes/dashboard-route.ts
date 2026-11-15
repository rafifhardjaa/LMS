import { Elysia } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { getDashboardStats } from "../services/dashboard-service";
import { handleError } from "../utils/response";

export const dashboardRoute = new Elysia({ prefix: "/api/v1/dashboard" })
  .use(authMiddleware)
  .get(
    "/stats",
    async ({ status }: any) => {
      try {
        const data = await getDashboardStats();
        return status(200, { success: true, message: "Dashboard stats", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Dashboard"],
        summary:
          "Statistik dashboard (kesiapan data, beban mengajar, tutupan jadwal, distribusi siswa)",
        security: [{ BearerAuth: [] }],
      },
    }
  );
