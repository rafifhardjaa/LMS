import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  assignTeacherClassroom,
  assignTeacherSubject,
  listTeacherClassrooms,
  listTeacherSubjects,
  removeTeacherClassroom,
  removeTeacherSubject,
} from "../services/master-data-service";
import { handleError } from "../utils/response";

export const teacherAssignmentsRoute = new Elysia({
  prefix: "/api/v1/teacher-assignments",
})
  .use(authMiddleware)
  .get(
    "/subjects",
    async ({ query, user, status }: any) => {
      try {
        const data = await listTeacherSubjects({
          teacherId:
            user?.role === "guru"
              ? user.id
              : query.teacherId || query.teacher_id,
          subjectId: query.subjectId || query.subject_id,
        });
        return status(200, {
          success: true,
          message: "Teacher subject assignments retrieved",
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
        tags: ["Teacher Assignments"],
        summary: "List penugasan guru ke mata pelajaran",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .post(
    "/subjects",
    async ({ body, status }: any) => {
      try {
        const created = await assignTeacherSubject({
          teacherId: body.teacherId ?? body.teacher_id,
          subjectId: body.subjectId ?? body.subject_id,
        });
        return status(201, {
          success: true,
          message: "Teacher assigned to subject",
          data: created,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Teacher Assignments"],
        summary: "Tugaskan guru ke mata pelajaran (admin)",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        teacherId: t.Optional(t.String()),
        teacher_id: t.Optional(t.String()),
        subjectId: t.Optional(t.String()),
        subject_id: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/subjects/:id",
    async ({ params, status }: any) => {
      try {
        await removeTeacherSubject(params.id);
        return status(200, {
          success: true,
          message: "Teacher subject assignment removed",
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Teacher Assignments"],
        summary: "Hapus penugasan mapel guru (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  )
  .get(
    "/classes",
    async ({ query, user, status }: any) => {
      try {
        const data = await listTeacherClassrooms({
          teacherId:
            user?.role === "guru"
              ? user.id
              : query.teacherId || query.teacher_id,
          classId: query.classId || query.class_id,
        });
        return status(200, {
          success: true,
          message: "Teacher classroom assignments retrieved",
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
        tags: ["Teacher Assignments"],
        summary: "List penugasan guru ke kelas",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .post(
    "/classes",
    async ({ body, status }: any) => {
      try {
        const created = await assignTeacherClassroom({
          teacherId: body.teacherId ?? body.teacher_id,
          classId: body.classId ?? body.class_id,
        });
        return status(201, {
          success: true,
          message: "Teacher assigned to classroom",
          data: created,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Teacher Assignments"],
        summary: "Tugaskan guru ke kelas (admin)",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        teacherId: t.Optional(t.String()),
        teacher_id: t.Optional(t.String()),
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/classes/:id",
    async ({ params, status }: any) => {
      try {
        await removeTeacherClassroom(params.id);
        return status(200, {
          success: true,
          message: "Teacher classroom assignment removed",
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Teacher Assignments"],
        summary: "Hapus penugasan kelas guru (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
