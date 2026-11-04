import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudentStats,
  listStudents,
  updateStudent,
} from "../services/students-service";
import { handleError } from "../utils/response";

export const studentsRoute = new Elysia({ prefix: "/api/v1/students" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, user, status }: any) => {
      try {
        const data = await listStudents(
          {
            q: query.q,
            classId: query.classId || query.class_id,
            majorId: query.majorId || query.major_id,
            gradeLevelId: query.gradeLevelId || query.grade_level_id,
            status: query.status,
          },
          user
        );
        return status(200, { success: true, message: "Students retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Students"],
        summary: "List siswa (terfilter sesuai peran dan kelas)",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .get(
    "/stats",
    async ({ user, status }: any) => {
      try {
        const data = await getStudentStats(user);
        return status(200, { success: true, message: "Student stats", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Students"],
        summary: "Statistik siswa",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .get(
    "/:id",
    async ({ params, status }: any) => {
      try {
        const data = await getStudent(params.id);
        return status(200, { success: true, message: "Student retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Students"],
        summary: "Detail siswa",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  )
  .post(
    "/",
    async ({ body, status }: any) => {
      try {
        const created = await createStudent({
          fullName: body.fullName ?? body.full_name,
          nomorInduk: body.nomorInduk ?? body.nomor_induk,
          tanggalLahir: body.tanggalLahir ?? body.tanggal_lahir,
          email: body.email,
          classId: body.classId ?? body.class_id,
          isActive: body.isActive ?? body.is_active,
          password: body.password,
        });
        return status(201, { success: true, message: "Student created", data: created });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Students"],
        summary: "Buat siswa (admin)",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        fullName: t.Optional(t.String()),
        full_name: t.Optional(t.String()),
        nomorInduk: t.Optional(t.String()),
        nomor_induk: t.Optional(t.String()),
        tanggalLahir: t.Optional(t.String()),
        tanggal_lahir: t.Optional(t.String()),
        email: t.Optional(t.Union([t.String(), t.Null()])),
        classId: t.Optional(t.Union([t.String(), t.Null()])),
        class_id: t.Optional(t.Union([t.String(), t.Null()])),
        isActive: t.Optional(t.Boolean()),
        is_active: t.Optional(t.Boolean()),
        password: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateStudent(params.id, {
          fullName: body.fullName ?? body.full_name,
          tanggalLahir: body.tanggalLahir ?? body.tanggal_lahir,
          email: body.email,
          classId: body.classId ?? body.class_id,
          isActive: body.isActive ?? body.is_active,
        });
        return status(200, { success: true, message: "Student updated", data: updated });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Students"],
        summary: "Update siswa (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        fullName: t.Optional(t.String()),
        full_name: t.Optional(t.String()),
        tanggalLahir: t.Optional(t.String()),
        tanggal_lahir: t.Optional(t.String()),
        email: t.Optional(t.Union([t.String(), t.Null()])),
        classId: t.Optional(t.Union([t.String(), t.Null()])),
        class_id: t.Optional(t.Union([t.String(), t.Null()])),
        isActive: t.Optional(t.Boolean()),
        is_active: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        await deleteStudent(params.id);
        return status(200, { success: true, message: "Student deleted" });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Students"],
        summary: "Hapus siswa (admin)",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
