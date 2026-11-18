import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  listCourseMaterials,
  listCourseMeetings,
} from "../services/course-detail-service";
import { handleError } from "../utils/response";

export const courseDetailRoute = new Elysia({
  prefix: "/api/v1/course-details",
})
  .use(authMiddleware)
  .get(
    "/:subjectId/meetings",
    async ({ params, query, user, status }: any) => {
      try {
        const classId = query.classId || query.class_id;
        if (!classId) {
          return status(400, {
            success: false,
            message: "classId wajib diisi",
          });
        }

        const teacherId =
          user?.role === "guru"
            ? user.id
            : query.teacherId || query.teacher_id || null;

        const data = await listCourseMeetings({
          subjectId: params.subjectId,
          classId,
          teacherId,
        });

        return status(200, {
          success: true,
          message: "Course meetings retrieved",
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
        tags: ["Course Detail"],
        summary: "Daftar pertemuan course untuk satu kelas",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
        teacherId: t.Optional(t.String()),
        teacher_id: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:subjectId/materials",
    async ({ params, status }: any) => {
      try {
        const data = await listCourseMaterials(params.subjectId);
        return status(200, {
          success: true,
          message: "Course materials retrieved",
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
        tags: ["Course Detail"],
        summary: "Daftar materi pertemuan course",
        security: [{ BearerAuth: [] }],
      },
    }
  );
