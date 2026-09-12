import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  FORBIDDEN_MESSAGE,
  createModule,
  deleteModule,
  listModules,
  updateModule,
} from "../services/modules-services";

function toErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (
      error.message === "Module tidak ditemukan" ||
      error.message === "Subject tidak ditemukan"
    ) {
      return { status: 404 as const, body: { error: error.message } };
    }
    if (
      error.message === FORBIDDEN_MESSAGE ||
      error.message === "ID tidak valid"
    ) {
      const code = error.message === FORBIDDEN_MESSAGE ? 403 : 400;
      return { status: code as 403 | 400, body: { error: error.message } };
    }
  }
  throw error;
}

export const modulesRoute = new Elysia({ prefix: "/api/modules" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listModules({ subjectId: query?.subject_id });
        return status(200, { data });
      } catch (error) {
        const mapped = toErrorResponse(error);
        return status(mapped.status, mapped.body);
      }
    },
    {
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
        return status(201, { data: created });
      } catch (error) {
        const mapped = toErrorResponse(error);
        return status(mapped.status, mapped.body);
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
        return status(200, { data: updated });
      } catch (error) {
        const mapped = toErrorResponse(error);
        return status(mapped.status, mapped.body);
      }
    },
    {
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
      return status(200, { data: "OK" });
    } catch (error) {
      const mapped = toErrorResponse(error);
      return status(mapped.status, mapped.body);
    }
  });
