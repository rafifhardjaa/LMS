import { Elysia } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { listTeachers } from "../services/master-data-service";
import { handleError } from "../utils/response";

export const teachersRoute = new Elysia({ prefix: "/api/v1/teachers" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listTeachers(query.q);
        return status(200, { success: true, message: "Teachers retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Teachers"],
        summary: "List guru beserta jumlah mapel dan kelas yang diampu",
        security: [{ BearerAuth: [] }],
      },
    }
  );
