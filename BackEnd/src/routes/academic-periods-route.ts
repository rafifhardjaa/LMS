import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  activateAcademicPeriod,
  createAcademicPeriod,
  listAcademicPeriods,
  updateAcademicPeriod,
} from "../services/attendance-service";
import { handleError } from "../utils/response";

const withError = async (handler: () => Promise<unknown>, status: any) => {
  try {
    return status(200, { success: true, data: await handler() });
  } catch (error) {
    const err = handleError(error);
    return status(err.status, { success: false, message: err.message });
  }
};

export const academicPeriodsRoute = new Elysia({
  prefix: "/api/v1/academic-periods",
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ status }: any) =>
      withError(() => listAcademicPeriods(), status),
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Academic Periods"],
        summary: "Daftar periode akademik",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .post(
    "/",
    async ({ body, status }: any) =>
      withError(
        () =>
          createAcademicPeriod({
            name: body.name,
            startDate: body.startDate,
            endDate: body.endDate,
            isActive: body.isActive,
          }),
        status
      ),
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Academic Periods"],
        summary: "Buat periode akademik",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        name: t.String(),
        startDate: t.String(),
        endDate: t.String(),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) =>
      withError(() => updateAcademicPeriod(params.id, body), status),
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Academic Periods"],
        summary: "Perbarui periode akademik",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )
  .post(
    "/:id/activate",
    async ({ params, status }: any) =>
      withError(() => activateAcademicPeriod(params.id), status),
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Academic Periods"],
        summary: "Aktifkan periode akademik",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
