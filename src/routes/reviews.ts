import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createReview,
  listReviewsBySubject,
  deleteReview,
} from "../services/reviews-notifications-services";
import { handleError } from "../utils/response";

export const reviewsRoute = new Elysia({ prefix: "/api/v1/reviews" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const review = await createReview({
          subjectId: body.subjectId,
          rating: body.rating,
          comment: body.comment,
          studentId: user.id,
        });
        return status(201, {
          success: true,
          message: "Ulasan berhasil ditambahkan",
          data: review,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      body: t.Object({
        subjectId: t.String(),
        rating: t.Number({ minimum: 1, maximum: 5 }),
        comment: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/subject/:subjectId",
    async ({ params, status }: any) => {
      try {
        const reviewsList = await listReviewsBySubject(params.subjectId);
        return status(200, {
          success: true,
          message: "Daftar ulasan berhasil diambil",
          data: reviewsList,
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
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        const deleted = await deleteReview(params.id);
        return status(200, {
          success: true,
          message: "Ulasan berhasil dihapus",
          data: deleted,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      params: t.Object({
        id: t.String(),
      }),
    }
  );
