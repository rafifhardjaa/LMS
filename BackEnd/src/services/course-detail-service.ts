import { and, asc, eq } from "drizzle-orm";
import { db } from "../db/index";
import { storageDb } from "../db/storage";
import { assignments } from "../db/storage-schema";
import {
  courseMaterials,
  courseMeetings,
  jadwalPelajaran,
  teachingAssignments,
  users,
} from "../db/schema";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/response";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function deriveDay(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestError("Format tanggal tidak valid");
  }
  const day = DAY_NAMES[parsed.getUTCDay()];
  if (!day) {
    throw new BadRequestError("Format tanggal tidak valid");
  }
  return day;
}

function assertPositiveInteger(value: number) {
  if (!Number.isInteger(value) || value < 1) {
    throw new BadRequestError("Nomor pertemuan harus bilangan bulat positif");
  }
}

function assertDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestError("Tanggal harus berformat YYYY-MM-DD");
  }
}

export async function assertTeacherHasAssignment(
  teacherId: string | null,
  subjectId: string,
  classId: string
) {
  if (!teacherId) return;

  const rows = await db
    .select({ id: teachingAssignments.id })
    .from(teachingAssignments)
    .where(
      and(
        eq(teachingAssignments.teacherId, teacherId),
        eq(teachingAssignments.subjectId, subjectId),
        eq(teachingAssignments.classId, classId)
      )
    )
    .limit(1);

  if (!rows.length) {
    throw new ForbiddenError("Anda tidak mengampu course ini");
  }
}

export async function listCourseMaterials(subjectId: string) {
  const subjectRows = await db
    .select({ id: courseMaterials.subjectId })
    .from(courseMaterials)
    .where(eq(courseMaterials.subjectId, subjectId))
    .limit(1);

  if (!subjectRows.length) {
    throw new NotFoundError("Materi course tidak ditemukan");
  }

  return db
    .select({
      meetingNumber: courseMaterials.meetingNumber,
      title: courseMaterials.title,
      objective: courseMaterials.objective,
    })
    .from(courseMaterials)
    .where(eq(courseMaterials.subjectId, subjectId))
    .orderBy(asc(courseMaterials.meetingNumber));
}

export async function listCourseMeetings({
  subjectId,
  classId,
  teacherId,
}: {
  subjectId: string;
  classId: string;
  teacherId: string | null;
}) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);

  const meetingRows = await db
    .select({
      id: courseMeetings.id,
      meetingNumber: courseMeetings.meetingNumber,
      meetingDate: courseMeetings.meetingDate,
      day: courseMeetings.day,
      title: courseMaterials.title,
      objective: courseMaterials.objective,
      teacherName: users.fullName,
      teacherCode: users.kodeGuru,
    })
    .from(courseMeetings)
    .innerJoin(
      courseMaterials,
      and(
        eq(courseMaterials.subjectId, courseMeetings.subjectId),
        eq(courseMaterials.meetingNumber, courseMeetings.meetingNumber)
      )
    )
    .leftJoin(users, eq(courseMeetings.teacherId, users.id))
    .where(
      and(
        eq(courseMeetings.subjectId, subjectId),
        eq(courseMeetings.classId, classId)
      )
    )
    .orderBy(asc(courseMeetings.meetingNumber));

  const schedule = await db
    .select({
      startTime: jadwalPelajaran.mulai,
      endTime: jadwalPelajaran.selesai,
    })
    .from(jadwalPelajaran)
    .where(
      and(
        eq(jadwalPelajaran.classId, classId),
        eq(jadwalPelajaran.subjectId, subjectId)
      )
    )
    .limit(1);

  return meetingRows.map((row) => ({
    ...row,
    startTime: schedule[0]?.startTime ?? null,
    endTime: schedule[0]?.endTime ?? null,
  }));
}

export async function createCourseMeeting({
  subjectId,
  classId,
  teacherId,
  meetingNumber,
  meetingDate,
  title,
  objective,
}: {
  subjectId: string;
  classId: string;
  teacherId: string | null;
  meetingNumber: number;
  meetingDate: string;
  title: string;
  objective: string;
}) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);
  assertPositiveInteger(meetingNumber);
  assertDate(meetingDate);

  const material = await db
    .select({ id: courseMaterials.id })
    .from(courseMaterials)
    .where(
      and(
        eq(courseMaterials.subjectId, subjectId),
        eq(courseMaterials.meetingNumber, meetingNumber)
      )
    )
    .limit(1);

  if (material.length) {
    throw new BadRequestError(`Pertemuan ${meetingNumber} sudah ada`);
  }

  await db.insert(courseMaterials).values({
    subjectId,
    meetingNumber,
    title,
    objective,
  });

  await db.insert(courseMeetings).values({
    subjectId,
    classId,
    teacherId: teacherId ?? null,
    meetingNumber,
    meetingDate,
    day: deriveDay(meetingDate),
  });

  return {
    subjectId,
    classId,
    meetingNumber,
    meetingDate,
    day: deriveDay(meetingDate),
    title,
    objective,
  };
}

export async function updateCourseMeeting({
  subjectId,
  classId,
  teacherId,
  meetingNumber,
  meetingDate,
  title,
  objective,
}: {
  subjectId: string;
  classId: string;
  teacherId: string | null;
  meetingNumber: number;
  meetingDate?: string;
  title?: string;
  objective?: string;
}) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);
  assertPositiveInteger(meetingNumber);

  const existing = await db
    .select({
      meetingNumber: courseMeetings.meetingNumber,
      meetingDate: courseMeetings.meetingDate,
      day: courseMeetings.day,
    })
    .from(courseMeetings)
    .where(
      and(
        eq(courseMeetings.subjectId, subjectId),
        eq(courseMeetings.classId, classId),
        eq(courseMeetings.meetingNumber, meetingNumber)
      )
    )
    .limit(1);

  if (!existing.length) {
    throw new NotFoundError(`Pertemuan ${meetingNumber} tidak ditemukan`);
  }

  const nextDate = meetingDate ?? existing[0]!.meetingDate;
  assertDate(nextDate);

  await db
    .update(courseMeetings)
    .set({ meetingDate: nextDate, day: deriveDay(nextDate) })
    .where(
      and(
        eq(courseMeetings.subjectId, subjectId),
        eq(courseMeetings.classId, classId),
        eq(courseMeetings.meetingNumber, meetingNumber)
      )
    );

  if (title !== undefined || objective !== undefined) {
    await db
      .update(courseMaterials)
      .set({
        ...(title !== undefined ? { title } : {}),
        ...(objective !== undefined ? { objective } : {}),
      })
      .where(
        and(
          eq(courseMaterials.subjectId, subjectId),
          eq(courseMaterials.meetingNumber, meetingNumber)
        )
      );
  }

  return {
    subjectId,
    classId,
    meetingNumber,
    meetingDate: nextDate,
    day: deriveDay(nextDate),
  };
}

export async function deleteCourseMeeting({
  subjectId,
  classId,
  teacherId,
  meetingNumber,
}: {
  subjectId: string;
  classId: string;
  teacherId: string | null;
  meetingNumber: number;
}) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);
  assertPositiveInteger(meetingNumber);

  const [meeting] = await db
    .select({ id: courseMeetings.id })
    .from(courseMeetings)
    .where(
      and(
        eq(courseMeetings.subjectId, subjectId),
        eq(courseMeetings.meetingNumber, meetingNumber)
      )
    )
    .limit(1);

  if (meeting) {
    await storageDb
      .delete(assignments)
      .where(eq(assignments.meetingId, meeting.id));
  }

  await db
    .delete(courseMeetings)
    .where(
      and(
        eq(courseMeetings.subjectId, subjectId),
        eq(courseMeetings.meetingNumber, meetingNumber)
      )
    );

  await db
    .delete(courseMaterials)
    .where(
      and(
        eq(courseMaterials.subjectId, subjectId),
        eq(courseMaterials.meetingNumber, meetingNumber)
      )
    );

  return { subjectId, meetingNumber };
}
