import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { listJadwalPelajaran } from "../services/master-data-service";
import { handleError } from "../utils/response";

export const jadwalPelajaranRoute = new Elysia({ prefix: "/api/v1/jadwal-pelajaran" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listJadwalPelajaran({
          classId: query.classId,
          gradeLevelId: query.gradeLevelId,
          majorId: query.majorId,
          hari: query.hari,
        });
        return status(200, { success: true, message: "Jadwal pelajaran retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Jadwal Pelajaran"],
        summary: "List jadwal pelajaran",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        gradeLevelId: t.Optional(t.String()),
        majorId: t.Optional(t.String()),
        hari: t.Optional(t.String()),
      }),
    }
  );