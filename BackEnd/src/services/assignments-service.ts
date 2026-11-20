import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../db/index";
import { courseMeetings, users } from "../db/schema";
import { storageDb } from "../db/storage";
import {
  assignments,
  guruAssignmentKuis,
  guruAssignmentTugas,
  siswaUpAssignmentKuis,
  siswaUpAssignmentTugas,
} from "../db/storage-schema";
import { assertTeacherHasAssignment } from "./course-detail-service";
import { BadRequestError, NotFoundError } from "../utils/response";

export type AssignmentType = "tugas" | "kuis";

function assertAssignmentType(type: unknown): asserts type is AssignmentType {
  if (type !== "tugas" && type !== "kuis") {
    throw new BadRequestError("type harus 'tugas' atau 'kuis'");
  }
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

  await storageDb.delete(assignments).where(eq(assignments.id, id));
  return { id };
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
