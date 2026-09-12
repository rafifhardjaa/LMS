import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createSubject,
  deleteSubject,
  listSubjects,
  updateSubject,
} from "../services/subjects-services";

function toErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Subject tidak ditemukan") {
      return { status: 404 as const, body: { error: error.message } };
    }
    if (
      error.message === "Kode sudah digunakan" ||
      error.message === "ID tidak valid"
    ) {
      return { status: 400 as const, body: { error: error.message } };
    }
  }
  throw error;
}

export const subjectsRoute = new Elysia({ prefix: "/api/subjects" })
  .use(authMiddleware)
  .get("/", async ({ status }) => {
    const data = await listSubjects();
    return status(200, { data });
  })
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createSubject({
          ...(body as { name: string; code: string; description?: string }),
          createdBy: user.id,
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
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateSubject(params.id, body);
        return status(200, { data: updated });
      } catch (error) {
        const mapped = toErrorResponse(error);
        return status(mapped.status, mapped.body);
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        code: t.Optional(t.String()),
        description: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        await deleteSubject(params.id);
        return status(200, { data: "OK" });
      } catch (error) {
        const mapped = toErrorResponse(error);
        return status(mapped.status, mapped.body);
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      params: t.Object({ id: t.String() }),
    }
  );
