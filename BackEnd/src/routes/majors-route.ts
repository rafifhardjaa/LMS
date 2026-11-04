import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createMajor,
  deleteMajor,
  listMajors,
  updateMajor,
} from "../services/master-data-service";
import { handleError } from "../utils/response";

export const majorsRoute = new Elysia({ prefix: "/api/v1/majors" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listMajors(query.includeInactive === "true");
        return status(200, { success: true, message: "Majors retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Majors"],
        summary: "List jurusan",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .post(
    "/",
    async ({ body, status }: any) => {
      try {
        const created = await createMajor(body);
        return status(201, { success: true, message: "Major created", data: created });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Majors"],
        summary: "Buat jurusan (admin)",
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
        const updated = await updateMajor(params.id, body);
        return status(200, { success: true, message: "Major updated", data: updated });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Majors"],
        summary: "Update jurusan (admin)",
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
        await deleteMajor(params.id);
        return status(200, { success: true, message: "Major deleted" });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Majors"],
        summary: "Hapus jurusan (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
