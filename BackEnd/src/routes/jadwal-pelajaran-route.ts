import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { createJadwalPelajaran, listJadwalPelajaran, removeJadwalPelajaran, updateJadwalPelajaran } from "../services/master-data-service";
import { handleError } from "../utils/response";

export const jadwalPelajaranRoute = new Elysia({ prefix: "/api/v1/jadwal-pelajaran" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ query, status }: any) => {
      try {
        const data = await listJadwalPelajaran({
          classId: query.classId,
          gradeLevelId: query.gradeLevelId,
          majorId: query.majorId,
          hari: query.hari,
        });
        return status(200, { success: true, message: "Jadwal pelajaran retrieved", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Jadwal Pelajaran"],
        summary: "List jadwal pelajaran",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        gradeLevelId: t.Optional(t.String()),
        majorId: t.Optional(t.String()),
        hari: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/",
    async ({ body, status }: any) => {
      try {
        const data = await createJadwalPelajaran(body);
        return status(201, { success: true, message: "Sesi jadwal pelajaran dibuat", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Jadwal Pelajaran"],
        summary: "Create jadwal pelajaran",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        classId: t.String(),
        subjectId: t.String(),
        teacherId: t.Optional(t.String()),
        hari: t.String(),
        sesi: t.Number(),
        durasi: t.Optional(t.Number()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, status }: any) => {
      try {
        const data = await updateJadwalPelajaran(params.id, body);
        return status(200, { success: true, message: "Sesi jadwal pelajaran diperbarui", data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Jadwal Pelajaran"],
        summary: "Update jadwal pelajaran",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        classId: t.Optional(t.String()),
        subjectId: t.Optional(t.String()),
        teacherId: t.Optional(t.String()),
        hari: t.Optional(t.String()),
        sesi: t.Optional(t.Number()),
        durasi: t.Optional(t.Number()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, status }: any) => {
      try {
        await removeJadwalPelajaran(params.id);
        return status(200, { success: true, message: "Sesi jadwal pelajaran dihapus" });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Jadwal Pelajaran"],
        summary: "Delete jadwal pelajaran",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );