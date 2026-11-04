import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createClass,
  deleteClass,
  getClass,
  listClasses,
  updateClass,
} from "../services/master-data-service";
import { handleError } from "../utils/response";

export const classesRoute = new Elysia({ prefix: "/api/v1/classes" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listClasses({
          majorId: query.majorId || query.major_id,
          gradeLevelId: query.gradeLevelId || query.grade_level_id,
          q: query.q,
          includeInactive: query.includeInactive === "true",
        });
        return status(200, { success: true, message: "Classes retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Classes"],
        summary: "List kelas",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .get(
    "/:id",
    async ({ params, status }: any) => {
      try {
        const data = await getClass(params.id);
        return status(200, { success: true, message: "Class retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Classes"],
        summary: "Detail kelas",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  )
  .post(
    "/",
    async ({ body, status }: any) => {
      try {
        const created = await createClass({
          name: body.name,
          section: body.section,
          majorId: body.majorId ?? body.major_id,
          gradeLevelId: body.gradeLevelId ?? body.grade_level_id,
          capacity: body.capacity,
          isActive: body.isActive ?? body.is_active,
        });
        return status(201, { success: true, message: "Class created", data: created });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Classes"],
        summary: "Buat kelas (admin)",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        name: t.String(),
        section: t.String(),
        majorId: t.Optional(t.String()),
        major_id: t.Optional(t.String()),
        gradeLevelId: t.Optional(t.String()),
        grade_level_id: t.Optional(t.String()),
        capacity: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
        is_active: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateClass(params.id, {
          name: body.name,
          section: body.section,
          majorId: body.majorId ?? body.major_id,
          gradeLevelId: body.gradeLevelId ?? body.grade_level_id,
          capacity: body.capacity,
          isActive: body.isActive ?? body.is_active,
        });
        return status(200, { success: true, message: "Class updated", data: updated });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Classes"],
        summary: "Update kelas (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        section: t.Optional(t.String()),
        majorId: t.Optional(t.String()),
        major_id: t.Optional(t.String()),
        gradeLevelId: t.Optional(t.String()),
        grade_level_id: t.Optional(t.String()),
        capacity: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
        is_active: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        await deleteClass(params.id);
        return status(200, { success: true, message: "Class deleted" });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Classes"],
        summary: "Hapus kelas (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
