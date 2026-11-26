import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createAssignment,
  getAssignment,
  getAssignmentGrading,
  getAssignmentSummary,
  getAssignments,
  removeAssignment,
  updateAssignment,
  updateAssignmentGrading,
} from "../services/assignments-service";
import { handleError } from "../utils/response";

const prefix = "/api/v1/course-details/:subjectId/assignments";

const assignmentParams = t.Object({
  subjectId: t.String(),
  id: t.String(),
});

export const assignmentsRoute = new Elysia({ prefix });

assignmentsRoute.use(authMiddleware).get(
  "/",
  async ({ params, query, user, status }: any) => {
    try {
      const classId = query.classId || query.class_id;
      if (!classId) return status(400, { success: false, message: "classId wajib diisi" });

      const data = await getAssignments({
        subjectId: params.subjectId,
        classId,
        meetingId: query.meetingId ?? query.meeting_id ?? "",
        type: query.type as "tugas" | "kuis" | undefined,
      });

      return status(200, { success: true, message: "Assignments retrieved", data });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru", "siswa"]),
    detail: {
      tags: ["Assignments"],
      summary: "Daftar assignment/tugas & kuis pada pertemuan",
      security: [{ BearerAuth: [] }],
    },
    query: t.Object({
      classId: t.Optional(t.String()),
      class_id: t.Optional(t.String()),
      meetingId: t.Optional(t.String()),
      meeting_id: t.Optional(t.String()),
      type: t.Optional(t.Union([t.Literal("tugas"), t.Literal("kuis")])),
    }),
  }
);

assignmentsRoute.post(
  "/",
  async ({ params, body, user, status }: any) => {
    try {
      const teacherId = user?.role === "guru" ? user.id : body.createdBy ?? null;
      const data = await createAssignment({
        subjectId: params.subjectId,
        classId: body.classId,
        teacherId,
        data: body,
      });
      return status(201, { success: true, message: "Tugas berhasil ditambahkan", data });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru"]),
    detail: {
      tags: ["Assignments"],
      summary: "Buat tugas/kuis baru pada pertemuan",
      security: [{ BearerAuth: [] }],
    },
    body: t.Object({
      classId: t.String(),
      meetingId: t.String(),
      type: t.Union([t.Literal("tugas"), t.Literal("kuis")]),
      title: t.String(),
      description: t.Optional(t.String()),
      startAt: t.Optional(t.String()),
      deadlineAt: t.String(),
      fileIds: t.Optional(t.Array(t.String())),
      createdBy: t.Optional(t.String()),
    }),
  }
);

assignmentsRoute.get(
  "/:id",
  async ({ params, status }) => {
    try {
      return status(200, { success: true, message: "Assignment retrieved", data: await getAssignment(params.id) });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru", "siswa"]),
    detail: { tags: ["Assignments"], summary: "Detail satu assignment", security: [{ BearerAuth: [] }] },
    params: assignmentParams,
  }
);

assignmentsRoute.get(
  "/:id/summary",
  async ({ params, status }) => {
    try {
      const assignment = await getAssignment(params.id);
      const summary = await getAssignmentSummary({
        assignmentId: params.id,
        type: assignment.type,
      });
      return status(200, { success: true, data: summary });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru", "siswa"]),
    detail: { tags: ["Assignments"], summary: "Ringkasan pengumpulan per assignment", security: [{ BearerAuth: [] }] },
    params: assignmentParams,
  }
);

assignmentsRoute.get(
  "/:id/grading",
  async ({ params, user, status }: any) => {
    try {
      const teacherId = user?.role === "guru" ? user.id : null;
      const data = await getAssignmentGrading({
        subjectId: params.subjectId,
        assignmentId: params.id,
        teacherId,
      });
      return status(200, { success: true, message: "Grading retrieved", data });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru"]),
    detail: {
      tags: ["Assignments"],
      summary: "Daftar penilaian submission tugas/kuis",
      security: [{ BearerAuth: [] }],
    },
    params: assignmentParams,
  }
);

assignmentsRoute.put(
  "/:id/grading/:submissionId",
  async ({ params, body, user, status }: any) => {
    try {
      const teacherId = user?.role === "guru" ? user.id : null;
      const data = await updateAssignmentGrading({
        subjectId: params.subjectId,
        assignmentId: params.id,
        submissionId: params.submissionId,
        teacherId,
        data: body,
      });
      return status(200, { success: true, message: "Nilai berhasil disimpan", data });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru"]),
    detail: {
      tags: ["Assignments"],
      summary: "Simpan nilai submission tugas/kuis",
      security: [{ BearerAuth: [] }],
    },
    params: t.Object({
      subjectId: t.String(),
      id: t.String(),
      submissionId: t.String(),
    }),
    body: t.Object({
      score: t.Number({ minimum: 0, maximum: 100 }),
      status: t.Union([
        t.Literal("pending"),
        t.Literal("graded"),
        t.Literal("revision"),
      ]),
    }),
  }
);

assignmentsRoute.put(
  "/:id",
  async ({ params, body, user, status }: any) => {
    try {
      const teacherId = user?.role === "guru" ? user.id : body.createdBy ?? null;
      const data = await updateAssignment({
        subjectId: params.subjectId,
        classId: body.classId,
        teacherId,
        id: params.id,
        data: body,
      });
      return status(200, { success: true, message: "Tugas berhasil diperbarui", data });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru"]),
    detail: {
      tags: ["Assignments"],
      summary: "Perbarui tugas/kuis pada pertemuan",
      security: [{ BearerAuth: [] }],
    },
    body: t.Object({
      classId: t.Optional(t.String()),
      type: t.Optional(t.Union([t.Literal("tugas"), t.Literal("kuis")])),
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      startAt: t.Optional(t.String()),
      deadlineAt: t.Optional(t.String()),
      meetingId: t.Optional(t.String()),
      fileIds: t.Optional(t.Array(t.String())),
    }),
    params: assignmentParams,
  }
);

assignmentsRoute.delete(
  "/:id",
  async ({ params, user, status }: any) => {
    try {
      const existing = await getAssignment(params.id);
      const data = await removeAssignment({
        subjectId: existing.subjectId,
        classId: existing.classId,
        teacherId: user?.role === "guru" ? user.id : null,
        id: params.id,
      });
      return status(200, { success: true, message: "Tugas berhasil dihapus", data });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, { success: false, message: err.message });
    }
  },
  {
    beforeHandle: requireRole(["admin", "guru"]),
    detail: {
      tags: ["Assignments"],
      summary: "Hapus tugas/kuis dari pertemuan",
      security: [{ BearerAuth: [] }],
    },
    params: assignmentParams,
  }
);
