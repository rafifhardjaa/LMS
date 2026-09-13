import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createEnrollment,
  listEnrollmentsByStudent,
  updateEnrollmentStatus,
} from "../services/enrollments-services";

function toErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (
      error.message === "Subject tidak ditemukan" ||
      error.message === "Enrollment tidak ditemukan"
    ) {
      return { status: 404 as const, body: { error: error.message } };
    }
    if (error.message === "ID tidak valid" || error.message === "Sudah terdaftar di subject ini") {
      return { status: 400 as const, body: { error: error.message } };
    }
  }
  throw error;
}

export const enrollmentsRoute = new Elysia({ prefix: "/api/v1/enrollments" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createEnrollment({
          studentId: user.id,
          subjectId: body.subject_id,
        });
        return status(201, {
          success: true,
          message: "Enrollment created",
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
      beforeHandle: requireRole(["siswa"]),
      body: t.Object({
        subject_id: t.String(),
      }),
    }
  )
  .get("/my-courses", async ({ user, status }: any) => {
    try {
      const data = await listEnrollmentsByStudent(user.id);
      return status(200, {
        success: true,
        message: "Enrollments retrieved",
        data,
      });
    } catch (error) {
      const mapped = toErrorResponse(error);
      return status(mapped.status, {
        success: false,
        message: mapped.body.error,
      });
    }
  })
  .patch(
    "/:id/status",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateEnrollmentStatus(params.id, body.status);
        return status(200, {
          success: true,
          message: "Enrollment status updated",
          data: updated,
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
      params: t.Object({ id: t.String() }),
      body: t.Object({
        status: t.String(),
      }),
    }
  );
