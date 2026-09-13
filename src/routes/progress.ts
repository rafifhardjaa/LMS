import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  markLessonProgress,
  getProgressPercentage,
} from "../services/progress-services";
import { handleError } from "../utils/response";

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
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
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
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      params: t.Object({
        subjectId: t.String(),
      }),
    }
  );
