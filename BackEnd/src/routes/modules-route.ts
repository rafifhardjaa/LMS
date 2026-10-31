import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  FORBIDDEN_MESSAGE,
  createModule,
  deleteModule,
  getModuleDetail,
  listModules,
  updateModule,
} from "../services/modules-services";
import { handleError } from "../utils/response";

export const modulesRoute = new Elysia({ prefix: "/api/v1/modules" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listModules({ subjectId: query?.subject_id });
        return status(200, { success: true, message: "Modules retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Modules"],
        summary: "List modul",
        description: "Gunakan query `?subject_id=<id>` untuk filter per mata pelajaran.",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({ subject_id: t.Optional(t.String()) }),
    }
  )
  .get(
    "/:moduleId",
    async ({ params, status }: any) => {
      try {
        const data = await getModuleDetail(params.moduleId);
        return status(200, {
          success: true,
          message: "Module retrieved",
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
        tags: ["Modules"],
        summary: "Detail modul",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ moduleId: t.String() }),
    }
  )
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createModule({
          subjectId: body.subject_id,
          title: body.title,
          description: body.description,
          orderIndex: body.order_index,
          teacherId: user.id,
        });
        return status(201, { success: true, message: "Module created", data: created });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Modules"],
        summary: "Buat modul baru",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        subject_id: t.String(),
        title: t.String(),
        description: t.Optional(t.String()),
        order_index: t.Optional(t.Integer()),
      }),
    }
  )
  .put(
    "/:moduleId",
    async ({ params, body, user, status }: any) => {
      try {
        const updated = await updateModule(params.moduleId, user, {
          title: body.title,
          description: body.description,
          orderIndex: body.order_index,
          subjectId: body.subject_id,
        });
        return status(200, { success: true, message: "Module updated", data: updated });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Modules"],
        summary: "Update modul",
        description: "Guru hanya bisa update modul miliknya sendiri. Admin bisa update semua.",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ moduleId: t.String() }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        order_index: t.Optional(t.Integer()),
        subject_id: t.Optional(t.String()),
      }),
    }
  )
  .delete("/:moduleId", async ({ params, user, status }: any) => {
    try {
      await deleteModule(params.moduleId, user);
      return status(200, { success: true, message: "Module deleted" });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  }, {
    beforeHandle: requireRole(["admin", "guru"]),
    detail: {
      tags: ["Modules"],
      summary: "Hapus modul",
      security: [{ BearerAuth: [] }],
    },
    params: t.Object({ moduleId: t.String() }),
  });
