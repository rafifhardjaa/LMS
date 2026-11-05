import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { createTeacher, listTeachers } from "../services/master-data-service";
import { handleError } from "../utils/response";

export const teachersRoute = new Elysia({ prefix: "/api/v1/teachers" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createTeacher({
          fullName: body.fullName,
          nomorInduk: body.nomorInduk,
          tanggalLahir: body.tanggalLahir,
          email: body.email ?? null,
          major: body.major ?? body.majorId ?? null,
          gradeLevelId: body.gradeLevelId ?? body.grade_level_id ?? null,
          semester: body.semester,
        });
        return status(201, { success: true, message: "Guru berhasil dibuat", data: created });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Teachers"],
        summary: "Buat guru baru (admin)",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        fullName: t.String(),
        nomorInduk: t.String(),
        tanggalLahir: t.String(),
        email: t.Optional(t.Union([t.String(), t.Null()])),
        major: t.Optional(t.Union([t.String(), t.Null()])),
        gradeLevelId: t.Optional(t.String()),
        grade_level_id: t.Optional(t.String()),
        semester: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listTeachers(query.q);
        return status(200, { success: true, message: "Teachers retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Teachers"],
        summary: "List guru beserta jumlah mapel dan kelas yang diampu",
        security: [{ BearerAuth: [] }],
      },
    }
  );
