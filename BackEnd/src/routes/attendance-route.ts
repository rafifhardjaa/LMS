import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  listAttendanceDates,
  listAttendanceRecords,
  listStudentAttendanceRecap,
  saveAttendanceRecords,
  saveStudentAttendance,
} from "../services/attendance-service";
import { handleError } from "../utils/response";

export const attendanceRoute = new Elysia({
  prefix: "/api/v1/attendance",
})
  .use(authMiddleware)
  .get(
    "/dates",
    async ({ query, user, status }: any) => {
      try {
        const classId = query.classId || query.class_id;
        if (!classId) {
          return status(400, {
            success: false,
            message: "classId wajib diisi",
          });
        }

        const data = await listAttendanceDates({ classId, actor: user });
        return status(200, {
          success: true,
          message: "Attendance dates retrieved",
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
        tags: ["Attendance"],
        summary: "Daftar tanggal presensi per kelas",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/me",
    async ({ user, status }: any) => {
      try {
        const data = await listStudentAttendanceRecap({ userId: user.id });
        return status(200, {
          success: true,
          message: "Attendance recap retrieved",
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
        tags: ["Attendance"],
        summary: "Rekap presensi harian siswa untuk semester aktif",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .put(
    "/me",
    async ({ body, user, status }: any) => {
      try {
        const data = await saveStudentAttendance({
          userId: user.id,
          date: body.date,
          status: body.status,
          note: body.note,
        });
        return status(200, {
          success: true,
          message: "Presensi berhasil dicatat",
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
        tags: ["Attendance"],
        summary: "Siswa mencatat presensi harian sendiri",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        date: t.String(),
        status: t.Union([
          t.Literal("hadir"),
          t.Literal("sakit"),
          t.Literal("izin"),
        ]),
        note: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/records",
    async ({ query, user, status }: any) => {
      try {
        const classId = query.classId || query.class_id;
        const date = query.date;
        if (!classId || !date) {
          return status(400, {
            success: false,
            message: "classId dan date wajib diisi",
          });
        }

        const data = await listAttendanceRecords({ classId, date, actor: user });
        return status(200, {
          success: true,
          message: "Attendance records retrieved",
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
        tags: ["Attendance"],
        summary: "Catatan kehadiran kelas per tanggal",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
        date: t.String(),
      }),
    }
  )
  .put(
    "/records",
    async ({ body, user, status }: any) => {
      try {
        const data = await saveAttendanceRecords({
          classId: body.classId,
          date: body.date,
          records: body.records,
          actor: user,
        });
        return status(200, {
          success: true,
          message: "Presensi berhasil disimpan",
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
        tags: ["Attendance"],
        summary: "Simpan catatan kehadiran kelas per tanggal",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        classId: t.String(),
        date: t.String(),
        records: t.Array(
          t.Object({
            studentId: t.String(),
            status: t.Union([
              t.Literal("hadir"),
              t.Literal("sakit"),
              t.Literal("izin"),
              t.Literal("alpa"),
            ]),
            note: t.Optional(t.String()),
          })
        ),
      }),
    }
  );
