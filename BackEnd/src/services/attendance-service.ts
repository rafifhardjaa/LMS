import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { classes, courseMeetings, subjects } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../utils/response";

export type AttendanceActor = {
  id: string;
  role: string;
};

async function assertAdvisorAccess(
  classId: string,
  actor: AttendanceActor | null
) {
  const rows = await db
    .select({ advisorId: classes.advisorId })
    .from(classes)
    .where(eq(classes.id, classId))
    .limit(1);

  if (!rows.length) {
    throw new NotFoundError("Kelas tidak ditemukan");
  }

  if (actor && actor.role === "guru" && rows[0]!.advisorId !== actor.id) {
    throw new ForbiddenError(
      "Hanya wali kelas yang dapat membuka presensi kelas ini"
    );
  }
}

export async function listAttendanceDates({
  classId,
  actor,
}: {
  classId: string;
  actor: AttendanceActor | null;
}) {
  await assertAdvisorAccess(classId, actor);

  const dateRows = await db
    .select({
      date: courseMeetings.meetingDate,
      day: courseMeetings.day,
    })
    .from(courseMeetings)
    .where(eq(courseMeetings.classId, classId))
    .groupBy(courseMeetings.meetingDate, courseMeetings.day)
    .orderBy(asc(courseMeetings.meetingDate));

  const subjectRows = await db
    .select({
      date: courseMeetings.meetingDate,
      subjectId: courseMeetings.subjectId,
      subjectName: subjects.name,
      subjectCode: subjects.code,
    })
    .from(courseMeetings)
    .innerJoin(subjects, eq(courseMeetings.subjectId, subjects.id))
    .where(eq(courseMeetings.classId, classId));

  const subjectsByDate = new Map<
    string,
    Map<string, { id: string; name: string; code: string | null }>
  >();
  for (const row of subjectRows) {
    if (!subjectsByDate.has(row.date)) {
      subjectsByDate.set(row.date, new Map());
    }
    subjectsByDate.get(row.date)!.set(row.subjectId, {
      id: row.subjectId,
      name: row.subjectName,
      code: row.subjectCode,
    });
  }

  return dateRows.map((row) => {
    const subjectMap = subjectsByDate.get(row.date) ?? new Map();
    const subjectList = [...subjectMap.values()].sort((first, second) =>
      first.name.localeCompare(second.name)
    );

    return {
      date: row.date,
      day: row.day,
      subjectCount: subjectList.length,
      subjects: subjectList,
    };
  });
}
