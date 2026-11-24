import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { canonicalRole } from "../services/role-service";
import {
  getGradeWeights,
  listStudentGrades,
  upsertGradeWeights,
  upsertStudentGrades,
} from "../services/grades-service";
import { handleError } from "../utils/response";

export const gradesRoute = new Elysia({ prefix: "/api/v1/grades" })
  .use(authMiddleware)
  .get(
    "/weights",
    async ({ query, status }: any) => {
      try {
        const subjectId = query.subjectId || query.subject_id;
        if (!subjectId) {
          return status(400, {
            success: false,
            message: "subjectId wajib diisi",
          });
        }
        const data = await getGradeWeights({
          subjectId,
          periodId: query.periodId || query.period_id,
        });
        return status(200, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Grades"],
        summary: "Bobot komponen nilai per mapel dan periode",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        subjectId: t.Optional(t.String()),
        subject_id: t.Optional(t.String()),
        periodId: t.Optional(t.String()),
        period_id: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/weights",
    async ({ body, status }: any) => {
      try {
        const data = await upsertGradeWeights({
          subjectId: body.subjectId,
          periodId: body.periodId,
          tugasWeight: body.tugasWeight,
          kuisWeight: body.kuisWeight,
          utsWeight: body.utsWeight,
          uasWeight: body.uasWeight,
        });
        return status(200, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Grades"],
        summary: "Simpan bobot komponen nilai mapel",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        subjectId: t.String(),
        periodId: t.Optional(t.String()),
        tugasWeight: t.Number({ minimum: 0, maximum: 100 }),
        kuisWeight: t.Number({ minimum: 0, maximum: 100 }),
        utsWeight: t.Number({ minimum: 0, maximum: 100 }),
        uasWeight: t.Number({ minimum: 0, maximum: 100 }),
      }),
    }
  )
  .get(
    "/",
    async ({ query, user, status }: any) => {
      try {
        const classId = query.classId || query.class_id;
        const subjectId = query.subjectId || query.subject_id;
        if (!classId || !subjectId) {
          return status(400, {
            success: false,
            message: "classId dan subjectId wajib diisi",
          });
        }
        const teacherId =
          canonicalRole(user.role) === "guru" ? user.id : null;
        const data = await listStudentGrades({
          classId,
          subjectId,
          periodId: query.periodId || query.period_id,
          teacherId,
        });
        return status(200, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Grades"],
        summary: "Daftar nilai per kelas dan mapel",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
        subjectId: t.Optional(t.String()),
        subject_id: t.Optional(t.String()),
        periodId: t.Optional(t.String()),
        period_id: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const teacherId =
          canonicalRole(user.role) === "guru" ? user.id : null;
        const data = await upsertStudentGrades({
          classId: body.classId,
          subjectId: body.subjectId,
          periodId: body.periodId,
          teacherId,
          records: body.records,
        });
        return status(200, {
          success: true,
          message: "Nilai berhasil disimpan",
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
        tags: ["Grades"],
        summary: "Simpan nilai UTS/UAS dan hitung nilai akhir",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        classId: t.String(),
        subjectId: t.String(),
        periodId: t.Optional(t.String()),
        records: t.Array(
          t.Object({
            studentId: t.String(),
            utsScore: t.Optional(t.Union([t.Number(), t.Null()])),
            uasScore: t.Optional(t.Union([t.Number(), t.Null()])),
          })
        ),
      }),
    }
  );
