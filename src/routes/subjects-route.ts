import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createSubject,
  deleteSubject,
  listSubjects,
  updateSubject,
} from "../services/subjects-services";
import { handleError } from "../utils/response";

export const subjectsRoute = new Elysia({ prefix: "/api/v1/subjects" })
  .use(authMiddleware)
  .get("/", async ({ status }) => {
    try {
      const data = await listSubjects();
      return status(200, { success: true, message: "Subjects retrieved", data });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  }, {
    beforeHandle: requireRole(["admin", "guru", "siswa"]),
  })
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createSubject({
          ...(body as { name: string; code: string; description?: string }),
          createdBy: user.id,
        });
        return status(201, { success: true, message: "Subject created", data: created });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
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
        return status(200, { success: true, message: "Subject updated", data: updated });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
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
        return status(200, { success: true, message: "Subject deleted" });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      params: t.Object({ id: t.String() }),
    }
  );
