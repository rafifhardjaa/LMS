import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  listStudentCourseMeetings,
  listStudentCourseParticipants,
} from "../services/student-course-service";
import { handleError } from "../utils/response";

export const studentCourseRoute = new Elysia({
  prefix: "/api/v1/student-courses",
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

        const data = await listStudentCourseMeetings({
          userId: user.id,
          subjectId: params.subjectId,
          classId,
        });

        return status(200, {
          success: true,
          message: "Student course meetings retrieved",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      detail: {
        tags: ["Student Course"],
        summary: "Daftar pertemuan course untuk siswa",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ subjectId: t.String() }),
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:subjectId/participants",
    async ({ query, user, status }: any) => {
      try {
        const classId = query.classId || query.class_id;
        if (!classId) {
          return status(400, {
            success: false,
            message: "classId wajib diisi",
          });
        }

        const data = await listStudentCourseParticipants({
          userId: user.id,
          classId,
        });

        return status(200, {
          success: true,
          message: "Student course participants retrieved",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      detail: {
        tags: ["Student Course"],
        summary: "Daftar peserta course untuk siswa",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ subjectId: t.String() }),
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
      }),
    }
  );
