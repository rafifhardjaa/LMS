import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createCourseMeeting,
  deleteCourseMeeting,
  listCourseMaterials,
  listCourseMeetings,
  updateCourseMeeting,
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
  .post(
    "/:subjectId/meetings",
    async ({ params, body, user, status }: any) => {
      try {
        const teacherId = user?.role === "guru" ? user.id : body.teacherId ?? null;
        const data = await createCourseMeeting({
          subjectId: params.subjectId,
          classId: body.classId,
          teacherId,
          meetingNumber: body.meetingNumber,
          meetingDate: body.meetingDate,
          title: body.title,
          objective: body.objective,
        });
        return status(201, {
          success: true,
          message: "Pertemuan berhasil ditambahkan",
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
        summary: "Tambah pertemuan course",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        classId: t.String(),
        meetingNumber: t.Number(),
        meetingDate: t.String(),
        title: t.String(),
        objective: t.String(),
        teacherId: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:subjectId/meetings/:meetingNumber",
    async ({ params, body, user, status }: any) => {
      try {
        const teacherId = user?.role === "guru" ? user.id : body.teacherId ?? null;
        const data = await updateCourseMeeting({
          subjectId: params.subjectId,
          classId: body.classId,
          teacherId,
          meetingNumber: Number(params.meetingNumber),
          meetingDate: body.meetingDate,
          title: body.title,
          objective: body.objective,
        });
        return status(200, {
          success: true,
          message: "Pertemuan berhasil diperbarui",
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
        summary: "Perbarui pertemuan course",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        classId: t.String(),
        meetingDate: t.Optional(t.String()),
        title: t.Optional(t.String()),
        objective: t.Optional(t.String()),
        teacherId: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/:subjectId/meetings/:meetingNumber",
    async ({ params, query, user, status }: any) => {
      try {
        const teacherId = user?.role === "guru" ? user.id : query.teacherId || null;
        const data = await deleteCourseMeeting({
          subjectId: params.subjectId,
          classId: query.classId || query.class_id,
          teacherId,
          meetingNumber: Number(params.meetingNumber),
        });
        return status(200, {
          success: true,
          message: "Pertemuan berhasil dihapus",
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
        summary: "Hapus pertemuan course",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
        teacherId: t.Optional(t.String()),
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
