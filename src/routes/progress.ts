import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  markLessonProgress,
  getProgressPercentage,
} from "../services/progress-services";

function toError(error: unknown) {
  if (error instanceof Error) {
    if (
      error.message === "Lesson tidak ditemukan" ||
      error.message === "Enrollment tidak ditemukan"
    ) {
      return { status: 404 as const, body: { error: error.message } };
    }
    if (error.message === "ID tidak valid") {
      return { status: 400 as const, body: { error: error.message } };
    }
  }
  throw error;
}

export const progressRoute = new Elysia({ prefix: "/api/v1/progress" })
  .use(authMiddleware)
  .post(
    "/lesson/:lessonId",
    async ({ params, user, status }: any) => {
      try {
        const progress = await markLessonProgress(params.lessonId, user.id);
        return status(200, {
          success: true,
          message: "Progress berhasil diperbarui",
          data: progress,
        });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      params: t.Object({
        lessonId: t.String(),
      }),
    }
  )
  .get(
    "/subject/:subjectId",
    async ({ params, user, status }: any) => {
      try {
        const percentage = await getProgressPercentage(
          params.subjectId,
          user.id
        );
        return status(200, {
          success: true,
          message: "Progress berhasil diambil",
          data: { percentage },
        });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      params: t.Object({
        subjectId: t.String(),
      }),
    }
  );
