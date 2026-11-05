import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createSubject,
  deleteSubject,
  getSubject,
  listSubjects,
  updateSubject,
} from "../services/subjects-services";
import { handleError } from "../utils/response";

export const subjectsRoute = new Elysia({ prefix: "/api/v1/subjects" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, user, status }: any) => {
      try {
        const data = await listSubjects(
          {
    majorId: query.majorId || query.major_id,
      gradeLevelId: query.gradeLevelId || query.grade_level_id,
      semester: query.semester,
      q: query.q,
      includeInactive: query.includeInactive === "true",
          },
          user
        );
        return status(200, { success: true, message: "Subjects retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Subjects"],
        summary: "List mata pelajaran (terfilter sesuai peran)",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .get(
    "/:id",
    async ({ params, status }: any) => {
      try {
        const data = await getSubject(params.id);
        return status(200, { success: true, message: "Subject retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Subjects"],
        summary: "Detail mata pelajaran",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  )
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createSubject({
          name: body.name,
          code: body.code,
          description: body.description,
          majorId: body.majorId ?? body.major_id ?? null,
          gradeLevelId: body.gradeLevelId ?? body.grade_level_id,
          semester: body.semester,
          isActive: body.isActive ?? body.is_active,
          createdBy: user.id,
        });
        return status(201, { success: true, message: "Subject created", data: created });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Subjects"],
        summary: "Buat mata pelajaran baru (admin)",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.Union([t.String(), t.Null()])),
        majorId: t.Optional(t.Union([t.String(), t.Null()])),
        major_id: t.Optional(t.Union([t.String(), t.Null()])),
        gradeLevelId: t.Optional(t.String()),
        grade_level_id: t.Optional(t.String()),
        semester: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
        is_active: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateSubject(params.id, {
          name: body.name,
          code: body.code,
          description: body.description,
          majorId: body.majorId ?? body.major_id,
          gradeLevelId: body.gradeLevelId ?? body.grade_level_id,
          semester: body.semester,
          isActive: body.isActive ?? body.is_active,
        });
        return status(200, { success: true, message: "Subject updated", data: updated });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Subjects"],
        summary: "Update mata pelajaran (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        code: t.Optional(t.String()),
        description: t.Optional(t.Union([t.String(), t.Null()])),
        majorId: t.Optional(t.Union([t.String(), t.Null()])),
        major_id: t.Optional(t.Union([t.String(), t.Null()])),
        gradeLevelId: t.Optional(t.String()),
        grade_level_id: t.Optional(t.String()),
        semester: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
        is_active: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        await deleteSubject(params.id);
        return status(200, { success: true, message: "Subject deleted" });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Subjects"],
        summary: "Hapus mata pelajaran (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
