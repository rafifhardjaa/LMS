import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  FORBIDDEN_MESSAGE,
  createModule,
  deleteModule,
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
      query: t.Object({ subject_id: t.Optional(t.String()) }),
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
      body: t.Object({
        subject_id: t.String(),
        title: t.String(),
        description: t.Optional(t.String()),
        order_index: t.Optional(t.Integer()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, user, status }: any) => {
      try {
        const updated = await updateModule(params.id, user, {
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
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        order_index: t.Optional(t.Integer()),
        subject_id: t.Optional(t.String()),
      }),
    }
  )
  .delete("/:id", async ({ params, user, status }: any) => {
    try {
      await deleteModule(params.id, user);
      return status(200, { success: true, message: "Module deleted" });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  }, {
    beforeHandle: requireRole(["admin", "guru"]),
    params: t.Object({ id: t.String() }),
  });
