import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { createTeacher, listTeachers, removeTeacher, updateTeacher } from "../services/master-data-service";
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
          majorId: body.majorId ?? body.major_id ?? null,
          gradeLevelId: body.gradeLevelId ?? body.grade_level_id ?? null,
          subjectId: body.subjectId ?? body.subject_id ?? null,
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
        majorId: t.Optional(t.Union([t.String(), t.Null()])),
        major_id: t.Optional(t.Union([t.String(), t.Null()])),
        gradeLevelId: t.Optional(t.String()),
        grade_level_id: t.Optional(t.String()),
        subjectId: t.Optional(t.String()),
        subject_id: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateTeacher(params.id, {
          fullName: body.fullName,
          nomorInduk: body.nomorInduk,
          tanggalLahir: body.tanggalLahir,
          email: body.email ?? null,
          isActive: body.isActive,
          majorId: body.majorId ?? body.major_id ?? null,
        });
        return status(200, { success: true, message: "Guru berhasil diperbarui", data: updated });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Teachers"],
        summary: "Perbarui data guru (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        fullName: t.String(),
        nomorInduk: t.String(),
        tanggalLahir: t.String(),
        email: t.Optional(t.Union([t.String(), t.Null()])),
        isActive: t.Optional(t.Boolean()),
        majorId: t.Optional(t.Union([t.String(), t.Null()])),
        major_id: t.Optional(t.Union([t.String(), t.Null()])),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        const deleted = await removeTeacher(params.id);
        return status(200, { success: true, message: "Guru berhasil dihapus", data: deleted });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Teachers"],
        summary:
          "Hapus guru (admin) — penugasan & data turunan ikut terhapus, slot jadwal menjadi tanpa guru",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  )
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listTeachers(query.q, query.statusFilter);
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
