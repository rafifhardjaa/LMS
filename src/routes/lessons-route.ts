import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { createLesson, listLessonsByModule } from "../services/lessons-services";
import { handleError } from "../utils/response";

export const lessonsRoute = new Elysia({ prefix: "/api/v1/lessons" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, status }: any) => {
      try {
        const created = await createLesson({
          moduleId: body.module_id,
          title: body.title,
          content: body.content,
          videoUrl: body.video_url,
          attachmentUrl: body.attachment_url,
          orderIndex: body.order_index,
        });
        return status(201, {
          success: true,
          message: "Lesson created",
          data: created,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, {
          success: false,
          message: err.message,
        });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      body: t.Object({
        module_id: t.String(),
        title: t.String(),
        content: t.Optional(t.String()),
        video_url: t.Optional(t.String()),
        attachment_url: t.Optional(t.String()),
        order_index: t.Optional(t.Integer()),
      }),
    }
  )
  .get("/module/:moduleId", async ({ params, status }: any) => {
    try {
      const data = await listLessonsByModule(params.moduleId);
      return status(200, {
        success: true,
        message: "Lessons retrieved",
        data,
      });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, {
        success: false,
        message: err.message,
      });
    }
  }, {
    beforeHandle: requireRole(["admin", "guru", "siswa"]),
    params: t.Object({ moduleId: t.String() }),
  });
