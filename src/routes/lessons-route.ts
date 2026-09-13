import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { createLesson, listLessonsByModule } from "../services/lessons-services";

function toErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Module tidak ditemukan") {
      return { status: 404 as const, body: { error: error.message } };
    }
    if (error.message === "ID tidak valid") {
      return { status: 400 as const, body: { error: error.message } };
    }
  }
  throw error;
}

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
        const mapped = toErrorResponse(error);
        return status(mapped.status, {
          success: false,
          message: mapped.body.error,
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
      const mapped = toErrorResponse(error);
      return status(mapped.status, {
        success: false,
        message: mapped.body.error,
      });
    }
  });
