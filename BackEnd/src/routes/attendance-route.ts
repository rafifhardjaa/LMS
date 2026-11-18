import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { listAttendanceDates } from "../services/attendance-service";
import { handleError } from "../utils/response";

export const attendanceRoute = new Elysia({
  prefix: "/api/v1/attendance",
})
  .use(authMiddleware)
  .get(
    "/dates",
    async ({ query, user, status }: any) => {
      try {
        const classId = query.classId || query.class_id;
        if (!classId) {
          return status(400, {
            success: false,
            message: "classId wajib diisi",
          });
        }

        const data = await listAttendanceDates({ classId, actor: user });
        return status(200, {
          success: true,
          message: "Attendance dates retrieved",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Attendance"],
        summary: "Daftar tanggal presensi per kelas",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
      }),
    }
  );
