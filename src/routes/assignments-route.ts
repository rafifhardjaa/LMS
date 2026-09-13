import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createAssignment,
  listAssignmentsByModule,
  submitAssignment,
  gradeAttempt,
} from "../services/assignments-services";

function toError(error: unknown) {
  if (error instanceof Error) {
    if (
      error.message === "Module tidak ditemukan" ||
      error.message === "Assignment tidak ditemukan" ||
      error.message === "Attempt tidak ditemukan"
    ) {
      return { status: 404 as const, body: { error: error.message } };
    }
    if (
      error.message === "ID tidak valid" ||
      error.message === "Score melebihi maxScore"
    ) {
      return { status: 400 as const, body: { error: error.message } };
    }
  }
  throw error;
}

export const assignmentsRoute = new Elysia({ prefix: "/api/v1/assignments" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createAssignment({
          moduleId: body.module_id,
          title: body.title,
          description: body.description,
          dueDate: body.due_date,
          maxScore: body.max_score,
          createdBy: user.id,
        });
        return status(201, { success: true, message: "Assignment created", data: created });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      body: t.Object({
        module_id: t.String(),
        title: t.String(),
        description: t.String(),
        due_date: t.String(),
        max_score: t.Optional(t.Number()),
      }),
    }
  )
  .get("/module/:moduleId", async ({ params, status }: any) => {
    try {
      const data = await listAssignmentsByModule(params.moduleId);
      return status(200, { success: true, message: "Assignments retrieved", data });
    } catch (error) {
      const m = toError(error);
      return status(m.status, { success: false, message: m.body.error });
    }
  })
  .post(
    "/:assignmentId/submit",
    async ({ params, body, user, status }: any) => {
      try {
        const created = await submitAssignment({
          assignmentId: params.assignmentId,
          studentId: user.id,
          fileUrl: body.file_url,
        });
        return status(201, { success: true, message: "Assignment submitted", data: created });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      params: t.Object({ assignmentId: t.String() }),
      body: t.Object({ file_url: t.String() }),
    }
  )
  .post(
    "/attempts/:attemptId/grade",
    async ({ params, body, user, status }: any) => {
      try {
        const graded = await gradeAttempt({
          attemptId: params.attemptId,
          score: body.score,
          feedback: body.feedback,
          gradedBy: user.id,
        });
        return status(201, { success: true, message: "Grade created", data: graded });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      params: t.Object({ attemptId: t.String() }),
      body: t.Object({
        score: t.Number(),
        feedback: t.Optional(t.String()),
      }),
    }
  );
