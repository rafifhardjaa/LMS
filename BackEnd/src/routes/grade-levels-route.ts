import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createGradeLevel,
  deleteGradeLevel,
  listGradeLevels,
  updateGradeLevel,
} from "../services/master-data-service";
import { handleError } from "../utils/response";

export const gradeLevelsRoute = new Elysia({
  prefix: "/api/v1/grade-levels",
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listGradeLevels(query.includeInactive === "true");
        return status(200, {
          success: true,
          message: "Grade levels retrieved",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Grade Levels"],
        summary: "List tingkatan kelas",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .post(
    "/",
    async ({ body, status }: any) => {
      try {
        const created = await createGradeLevel(body);
        return status(201, {
          success: true,
          message: "Grade level created",
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
        tags: ["Grade Levels"],
        summary: "Buat tingkatan kelas (admin)",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        code: t.String(),
        name: t.String(),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateGradeLevel(params.id, body);
        return status(200, {
          success: true,
          message: "Grade level updated",
          data: updated,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Grade Levels"],
        summary: "Update tingkatan kelas (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        code: t.Optional(t.String()),
        name: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        await deleteGradeLevel(params.id);
        return status(200, { success: true, message: "Grade level deleted" });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Grade Levels"],
        summary: "Hapus tingkatan kelas (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
