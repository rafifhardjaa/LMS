import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index";
import { classes, courseMeetings, subjects, users } from "../db/schema";
import { storageDb } from "../db/storage";
import {
  assignments,
  guruAssignmentKuis,
  guruAssignmentTugas,
  guruUploadsKuis,
  guruUploadsTugas,
  siswaUpAssignmentKuis,
  siswaUpAssignmentTugas,
} from "../db/storage-schema";
import { assertTeacherHasAssignment } from "./course-detail-service";
import { BadRequestError, NotFoundError } from "../utils/response";

export type AssignmentType = "tugas" | "kuis";
export type GradingStatus = "pending" | "graded" | "revision";

export type AssignmentGradingRow = {
  id: string;
  studentId: string;
  name: string;
  nisn: string;
  className: string;
  assignmentId: string;
  taskTitle: string;
  subject: string;
  fileName: string;
  mimeType: string;
  fileUrl: string;
  submittedAt: string;
  submittedAtTone: "urgent" | "neutral";
  status: GradingStatus;
  score: number | null;
};

function assertAssignmentType(type: unknown): asserts type is AssignmentType {
  if (type !== "tugas" && type !== "kuis") {
    throw new BadRequestError("type harus 'tugas' atau 'kuis'");
  }
}

function assignmentFileTable(type: AssignmentType) {
  return type === "tugas" ? guruUploadsTugas : guruUploadsKuis;
}

async function syncAssignmentFiles({
  assignment,
  fileIds,
}: {
  assignment: { id: string; meetingId: string; type: AssignmentType };
  fileIds?: string[];
}) {
  if (!fileIds) return;

  const table = assignmentFileTable(assignment.type);
  const uniqueFileIds = [...new Set(fileIds)];

  if (uniqueFileIds.length > 0) {
    const rows = await storageDb
      .select({
        id: table.id,
        meetingId: table.meetingId,
        assignmentId: table.assignmentId,
        isDeleted: table.isDeleted,
      })
      .from(table)
      .where(inArray(table.id, uniqueFileIds));

    if (rows.length !== uniqueFileIds.length) {
      throw new BadRequestError("File tugas tidak ditemukan");
    }

    for (const row of rows) {
      if (row.isDeleted) throw new BadRequestError("File tugas tidak ditemukan");
      if (row.meetingId !== assignment.meetingId) {
        throw new BadRequestError(
          "File tugas hanya boleh berasal dari pertemuan ini",
        );
      }
      if (row.assignmentId && row.assignmentId !== assignment.id) {
        throw new BadRequestError(
          "File tugas sudah dipakai assignment lain",
        );
      }
    }
  }

  await storageDb.transaction(async (tx) => {
    await tx
      .update(table)
      .set({ assignmentId: null })
      .where(eq(table.assignmentId, assignment.id));

    if (uniqueFileIds.length > 0) {
      await tx
        .update(table)
        .set({ assignmentId: assignment.id })
        .where(inArray(table.id, uniqueFileIds));
    }
  });
}

async function clearAssignmentFiles({
  id,
  type,
}: {
  id: string;
  type: AssignmentType;
}) {
  const table = assignmentFileTable(type);
  await storageDb
    .update(table)
    .set({ assignmentId: null })
    .where(eq(table.assignmentId, id));
}

function assertPositiveString(value: string | undefined, label: string) {
  if (!value || typeof value !== "string") {
    throw new BadRequestError(`${label} wajib diisi`);
  }
}

function parseIso(value: string | undefined, label: string) {
  const parsed = new Date(value ?? "");
  if (!value || Number.isNaN(parsed.getTime())) {
    throw new BadRequestError(`${label} tidak valid`);
  }
  return parsed;
}

function assertLessThanOrEqual(a: Date, b: Date, message: string) {
  if (a.getTime() > b.getTime()) throw new BadRequestError(message);
}

async function getMeeting({
  subjectId,
  classId,
  meetingId,
}: {
  subjectId: string;
  classId: string;
  meetingId: string;
}) {
  const [meeting] = await db
    .select({
      id: courseMeetings.id,
      subjectId: courseMeetings.subjectId,
      classId: courseMeetings.classId,
    })
    .from(courseMeetings)
    .where(eq(courseMeetings.id, meetingId))
    .limit(1);

  if (!meeting || meeting.subjectId !== subjectId || meeting.classId !== classId) {
    throw new BadRequestError("meetingId tidak valid untuk subject/class");
  }

  return meeting;
}

async function hasStorageRows(assignmentId: string) {
  const checks = await Promise.all([
    storageDb
      .select({ id: siswaUpAssignmentTugas.id })
      .from(siswaUpAssignmentTugas)
      .where(
        and(
          eq(siswaUpAssignmentTugas.assignmentId, assignmentId),
          eq(siswaUpAssignmentTugas.isDeleted, false),
        ),
      )
      .limit(1),
    storageDb
      .select({ id: siswaUpAssignmentKuis.id })
      .from(siswaUpAssignmentKuis)
      .where(
        and(
          eq(siswaUpAssignmentKuis.assignmentId, assignmentId),
          eq(siswaUpAssignmentKuis.isDeleted, false),
        ),
      )
      .limit(1),
    storageDb
      .select({ id: guruAssignmentTugas.id })
      .from(guruAssignmentTugas)
      .where(
        and(
          eq(guruAssignmentTugas.assignmentId, assignmentId),
          eq(guruAssignmentTugas.isDeleted, false),
        ),
      )
      .limit(1),
    storageDb
      .select({ id: guruAssignmentKuis.id })
      .from(guruAssignmentKuis)
      .where(
        and(
          eq(guruAssignmentKuis.assignmentId, assignmentId),
          eq(guruAssignmentKuis.isDeleted, false),
        ),
      )
      .limit(1),
  ]);
  return checks.some((rows) => rows.length > 0);
}

export async function deleteAssignmentsByMeetingId(meetingId: string) {
  await storageDb.delete(assignments).where(eq(assignments.meetingId, meetingId));
}

export async function deleteAssignmentsByClassId(classId: string) {
  await storageDb.delete(assignments).where(eq(assignments.classId, classId));
}

export async function deleteAssignmentsBySubjectId(subjectId: string) {
  await storageDb.delete(assignments).where(eq(assignments.subjectId, subjectId));
}

export async function getAssignments({
  subjectId,
  classId,
  meetingId,
  type,
}: {
  subjectId: string;
  classId: string;
  meetingId: string;
  type?: AssignmentType;
}) {
  const rows = await storageDb
    .select()
    .from(assignments)
    .where(
      and(
        eq(assignments.subjectId, subjectId),
        eq(assignments.classId, classId),
        eq(assignments.meetingId, meetingId),
        ...(type ? [eq(assignments.type, type)] : []),
      ),
    )
    .orderBy(asc(assignments.orderIndex), asc(assignments.id));

  const summaries = await Promise.all(
    rows.map((row) => {
      assertAssignmentType(row.type);
      return getAssignmentSummary({ assignmentId: row.id, type: row.type });
    }),
  );

  return rows.map((row, index) => ({
    ...row,
    startAt: row.startAt.toISOString(),
    deadlineAt: row.deadlineAt.toISOString(),
    summary: summaries[index],
  }));
}

export async function getAssignment(id: string) {
  const [row] = await storageDb
    .select()
    .from(assignments)
    .where(eq(assignments.id, id))
    .limit(1);
  if (!row) throw new NotFoundError("Assignment tidak ditemukan");
  return toApiAssignment(row);
}

export async function createAssignment({
  subjectId,
  classId,
  teacherId,
  data,
}: {
  subjectId: string;
  classId: string;
  teacherId: string | null;
    data: {
      type: AssignmentType;
      title: string;
      description?: string;
      startAt?: string;
      deadlineAt: string;
      meetingId: string;
      fileIds?: string[];
    };
  }) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);

  assertAssignmentType(data.type);
  await getMeeting({ subjectId, classId, meetingId: data.meetingId });
  assertPositiveString(data.title, "title");

  const startAt = parseIso(data.startAt ?? data.deadlineAt, "Tanggal mulai");
  const deadlineAt = parseIso(data.deadlineAt, "Deadline");
  assertLessThanOrEqual(
    startAt,
    deadlineAt,
    "Tanggal mulai harus lebih dulu atau sama dengan deadline",
  );

  const [inserted] = await storageDb
    .insert(assignments)
    .values({
      subjectId,
      classId,
      meetingId: data.meetingId,
      type: data.type,
      title: data.title,
      description: data.description,
      startAt,
      deadlineAt,
      createdBy: teacherId ?? undefined,
    })
    .returning();

  if (!inserted) throw new NotFoundError("Gagal membuat assignment");

  await syncAssignmentFiles({
    assignment: {
      id: inserted.id,
      meetingId: inserted.meetingId,
      type: inserted.type as AssignmentType,
    },
    fileIds: data.fileIds,
  });

  return toApiAssignment(inserted);
}

export async function updateAssignment({
  subjectId,
  classId,
  teacherId,
  id,
  data,
}: {
  subjectId: string;
  classId: string;
  teacherId: string | null;
  id: string;
    data: {
      classId?: string;
      type?: AssignmentType;
      title?: string;
      description?: string;
      startAt?: string;
      deadlineAt?: string;
      meetingId?: string;
      fileIds?: string[];
    };
  }) {
  const [existing] = await storageDb
    .select()
    .from(assignments)
    .where(eq(assignments.id, id))
    .limit(1);

  if (!existing) throw new NotFoundError("Assignment tidak ditemukan");

  const nextClassId = classId || existing.classId;
  if (existing.subjectId !== subjectId || existing.classId !== nextClassId) {
    throw new BadRequestError("Assignment tidak ditemukan untuk course ini");
  }
  await assertTeacherHasAssignment(teacherId, subjectId, nextClassId);

  assertAssignmentType(data.type ?? existing.type);
  const meetingId = data.meetingId ?? existing.meetingId;
  await getMeeting({ subjectId, classId: nextClassId, meetingId });
  assertPositiveString(data.title ?? existing.title, "title");

  const startAt = parseIso(data.startAt ?? existing.startAt.toISOString(), "Tanggal mulai");
  const deadlineAt = parseIso(data.deadlineAt ?? existing.deadlineAt.toISOString(), "Deadline");
  assertLessThanOrEqual(
    startAt,
    deadlineAt,
    "Tanggal mulai harus lebih dulu atau sama dengan deadline",
  );

  const [updated] = await storageDb
    .update(assignments)
    .set({
      ...(data.type ? { type: data.type } : {}),
      ...(data.title ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.classId ? { classId: nextClassId } : {}),
      ...(data.meetingId ? { meetingId: data.meetingId } : {}),
      startAt,
      deadlineAt,
    })
    .where(eq(assignments.id, id))
    .returning();

  if (!updated) throw new NotFoundError("Assignment tidak ditemukan");

  await syncAssignmentFiles({
    assignment: {
      id: updated.id,
      meetingId: updated.meetingId,
      type: updated.type as AssignmentType,
    },
    fileIds: data.fileIds,
  });

  return toApiAssignment(updated);
}

export async function removeAssignment({
  subjectId,
  classId,
  teacherId,
  id,
}: {
  subjectId: string;
  classId: string;
  teacherId: string | null;
  id: string;
}) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);

  const [existing] = await storageDb
    .select()
    .from(assignments)
    .where(eq(assignments.id, id))
    .limit(1);

  if (!existing) throw new NotFoundError("Assignment tidak ditemukan");
  if (existing.subjectId !== subjectId || existing.classId !== classId) {
    throw new BadRequestError("Assignment tidak ditemukan untuk course ini");
  }
  if (await hasStorageRows(id)) {
    throw new BadRequestError(
      "Assignment tidak bisa dihapus: sudah ada jawaban dari siswa",
    );
  }

  await clearAssignmentFiles({ id, type: existing.type as AssignmentType });
  await storageDb.delete(assignments).where(eq(assignments.id, id));
  return { id };
}

function gradingTable(type: AssignmentType) {
  return type === "tugas" ? guruAssignmentTugas : guruAssignmentKuis;
}

function submissionSlot(type: AssignmentType) {
  return type === "tugas" ? "tugasSubmission" : "kuisSubmission";
}

async function listGradingRows(
  assignment: Awaited<ReturnType<typeof getAssignment>>,
): Promise<AssignmentGradingRow[]> {
  assertAssignmentType(assignment.type);
  const table = gradingTable(assignment.type);

  const rows = await storageDb
    .select({
      id: table.id,
      studentId: table.studentId,
      submissionId: table.submissionId,
      assignmentId: table.assignmentId,
      fileName: table.filename,
      mimeType: table.mimeType,
      studentFileId: table.studentFileId,
      submittedAt: table.submittedAt,
      score: table.score,
      gradingStatus: table.gradingStatus,
    })
    .from(table)
    .where(
      and(
        eq(table.assignmentId, assignment.id),
        eq(table.isDeleted, false),
      ),
    )
    .orderBy(desc(table.submittedAt));

  if (!rows.length) return [];

  const studentIds = [...new Set(rows.map((row) => row.studentId))];
  const [studentRows, classRows, subjectRows] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.fullName,
        nisn: users.nisn,
        nomorInduk: users.nomorInduk,
      })
      .from(users)
      .where(inArray(users.id, studentIds)),
    db
      .select({ id: classes.id, name: classes.name })
      .from(classes)
      .where(eq(classes.id, assignment.classId))
      .limit(1),
    db
      .select({ id: subjects.id, name: subjects.name })
      .from(subjects)
      .where(eq(subjects.id, assignment.subjectId))
      .limit(1),
  ]);

  const studentMap = new Map(studentRows.map((row) => [row.id, row]));
  const className = classRows[0]?.name ?? "-";
  const subjectName = subjectRows[0]?.name ?? "-";

  return rows.map((row) => {
    const student = studentMap.get(row.studentId);
    const status = (["pending", "graded", "revision"].includes(
      row.gradingStatus,
    )
      ? row.gradingStatus
      : "pending") as GradingStatus;
    const hoursSinceSubmit =
      (Date.now() - new Date(row.submittedAt).getTime()) / 3_600_000;

    return {
      id: row.submissionId,
      studentId: row.studentId,
      name: student?.name ?? "Siswa",
      nisn: student?.nisn || student?.nomorInduk || "-",
      className,
      assignmentId: assignment.id,
      taskTitle: assignment.title,
      subject: subjectName,
      fileName: row.fileName,
      mimeType: row.mimeType,
      fileUrl: `/api/v1/uploads/storage/${submissionSlot(assignment.type)}/${row.studentFileId}`,
      submittedAt: row.submittedAt.toISOString(),
      submittedAtTone: hoursSinceSubmit <= 24 ? "urgent" : "neutral",
      status,
      score: row.score === null ? null : Number(row.score),
    } satisfies AssignmentGradingRow;
  });
}

export async function getAssignmentGrading({
  subjectId,
  assignmentId,
  teacherId,
}: {
  subjectId: string;
  assignmentId: string;
  teacherId: string | null;
}) {
  const assignment = await getAssignment(assignmentId);
  if (assignment.subjectId !== subjectId) {
    throw new BadRequestError("Assignment tidak ditemukan untuk course ini");
  }
  await assertTeacherHasAssignment(teacherId, subjectId, assignment.classId);
  return listGradingRows(assignment);
}

export async function updateAssignmentGrading({
  subjectId,
  assignmentId,
  submissionId,
  teacherId,
  data,
}: {
  subjectId: string;
  assignmentId: string;
  submissionId: string;
  teacherId: string | null;
  data: { score: number; status: GradingStatus };
}) {
  const assignment = await getAssignment(assignmentId);
  if (assignment.subjectId !== subjectId) {
    throw new BadRequestError("Assignment tidak ditemukan untuk course ini");
  }
  await assertTeacherHasAssignment(teacherId, subjectId, assignment.classId);
  assertAssignmentType(assignment.type);

  const table = gradingTable(assignment.type);
  const [updated] = await storageDb
    .update(table)
    .set({
      score: data.score.toFixed(2),
      gradingStatus: data.status,
      gradedAt: data.status === "pending" ? null : new Date(),
    })
    .where(
      and(
        eq(table.assignmentId, assignmentId),
        eq(table.submissionId, submissionId),
      ),
    )
    .returning();

  if (!updated) throw new NotFoundError("Submission tidak ditemukan");

  return {
    assignmentId,
    submissionId,
    score: updated.score === null ? null : Number(updated.score),
    status: updated.gradingStatus as GradingStatus,
  };
}

export async function getAssignmentSummary({
  assignmentId,
  type,
}: {
  assignmentId: string;
  type: AssignmentType;
}) {
  const studentTable = type === "tugas" ? siswaUpAssignmentTugas : siswaUpAssignmentKuis;

  const rows = await storageDb
    .select({ studentId: studentTable.studentId })
    .from(studentTable)
    .where(and(eq(studentTable.assignmentId, assignmentId), eq(studentTable.isDeleted, false)))
    .orderBy(asc(studentTable.submittedAt), asc(studentTable.id));

  const submitted = new Set(rows.map((row) => row.studentId)).size;

  const [assignmentRow] = await storageDb
    .select({ classId: assignments.classId })
    .from(assignments)
    .where(eq(assignments.id, assignmentId))
    .limit(1);

  if (!assignmentRow) {
    throw new NotFoundError("Assignment tidak ditemukan");
  }

  const [totalRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.classId, assignmentRow.classId))
    .limit(1);

  const total = Number(totalRow?.count ?? 0);
  return {
    assignmentId,
    totalStudents: total,
    submitted,
    notSubmitted: Math.max(total - submitted, 0),
    percent: total ? Math.round((submitted / total) * 100) : 0,
    students: rows.map((row) => ({ studentId: row.studentId })),
  };
}

function toApiAssignment(row: typeof assignments.$inferSelect) {
  assertAssignmentType(row.type);
  return {
    ...row,
    type: row.type,
    startAt: row.startAt.toISOString(),
    deadlineAt: row.deadlineAt.toISOString(),
    summary: null,
  };
}
