import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createDiscussion,
  createReply,
  listDiscussions,
} from "../services/discussions-services";
import { handleError } from "../utils/response";

const params = t.Object({ moduleId: t.String() });
const replyParams = t.Object({
  moduleId: t.String(),
  discussionId: t.String(),
});
const body = t.Object({ body: t.String() });

export const discussionsRoute = new Elysia({
  prefix: "/api/v1/modules",
})
  .use(authMiddleware)
  .get(
    "/:moduleId/discussions",
    async ({ params, user, status }: any) => {
      try {
        const data = await listDiscussions(params.moduleId, user);
        return status(200, {
          success: true,
          message: "Discussions retrieved",
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
        tags: ["Discussions"],
        summary: "List diskusi modul",
        description:
          "Siswa harus terdaftar di subject modul. Guru hanya dapat melihat modul miliknya, admin dapat melihat semua.",
        security: [{ BearerAuth: [] }],
      },
      params,
    }
  )
  .post(
    "/:moduleId/discussions",
    async ({ params, body, user, status }: any) => {
      try {
        const data = await createDiscussion(params.moduleId, user, body.body);
        return status(201, {
          success: true,
          message: "Discussion created",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      detail: {
        tags: ["Discussions"],
        summary: "Buat pertanyaan diskusi",
        description: "Hanya siswa yang terdaftar di subject modul.",
        security: [{ BearerAuth: [] }],
      },
      params,
      body,
    }
  )
  .post(
    "/:moduleId/discussions/:discussionId/replies",
    async ({ params, body, user, status }: any) => {
      try {
        const data = await createReply(
          params.moduleId,
          params.discussionId,
          user,
          body.body
        );
        return status(201, {
          success: true,
          message: "Reply created",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Discussions"],
        summary: "Balas diskusi modul",
        description:
          "Guru hanya dapat membalas modul miliknya, admin dapat membalas semua.",
        security: [{ BearerAuth: [] }],
      },
      params: replyParams,
      body,
    }
  );
