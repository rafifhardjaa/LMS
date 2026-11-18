import { and, asc, eq } from "drizzle-orm";
import { db } from "../db/index";
import {
  courseMaterials,
  courseMeetings,
  jadwalPelajaran,
  teachingAssignments,
  users,
} from "../db/schema";
import { ForbiddenError, NotFoundError } from "../utils/response";

async function assertTeacherHasAssignment(
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
