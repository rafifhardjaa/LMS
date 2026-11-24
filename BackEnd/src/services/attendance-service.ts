import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  academicPeriods,
  attendanceRecords,
  classes,
  jadwalPelajaran,
  subjects,
  users,
} from "../db/schema";
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

async function getActiveAcademicPeriod() {
  const [period] = await db
    .select()
    .from(academicPeriods)
    .where(eq(academicPeriods.isActive, true))
    .orderBy(desc(academicPeriods.startDate))
    .limit(1);

  if (!period) {
    throw new NotFoundError("Periode akademik aktif tidak ditemukan");
  }

  return period;
}

export async function listAttendanceDates({
  classId,
  actor,
}: {
  classId: string;
  actor: AttendanceActor | null;
}) {
  await assertAdvisorAccess(classId, actor);
  const period = await getActiveAcademicPeriod();

  const subjectRows = await db
    .select({
      hari: jadwalPelajaran.hari,
      subjectId: jadwalPelajaran.subjectId,
      subjectName: subjects.name,
      subjectCode: subjects.code,
    })
    .from(jadwalPelajaran)
    .innerJoin(subjects, eq(jadwalPelajaran.subjectId, subjects.id))
    .where(eq(jadwalPelajaran.classId, classId));

  const subjectsByDay = new Map<
    string,
    Map<string, { id: string; name: string; code: string | null }>
  >();
  for (const row of subjectRows) {
    const day = row.hari.trim();
    if (!subjectsByDay.has(day)) {
      subjectsByDay.set(day, new Map());
    }
    subjectsByDay.get(day)!.set(row.subjectId, {
      id: row.subjectId,
      name: row.subjectName,
      code: row.subjectCode,
    });
  }

  return weekdaysBetween(period.startDate, period.endDate).map((item) => {
    const subjectMap = subjectsByDay.get(item.day) ?? new Map();
    const subjectList = [...subjectMap.values()].sort((first, second) =>
      first.name.localeCompare(second.name)
    );

    return {
      date: item.date,
      day: item.day,
      subjectCount: subjectList.length,
      subjects: subjectList,
    };
  });
}

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function weekdaysBetween(startDate: string, endDate: string) {
  const days: { date: string; day: string }[] = [];
  const cursor = new Date(`${startDate}T00:00:00Z`);
  const last = new Date(`${endDate}T00:00:00Z`);

  while (cursor <= last) {
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      days.push({
        date: cursor.toISOString().slice(0, 10),
        day: DAY_NAMES[weekday]!,
      });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

async function getStudentClassId(userId: string) {
  const [student] = await db
    .select({ classId: users.classId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!student?.classId) {
    throw new ForbiddenError("Kelas siswa belum diatur");
  }

  return student.classId;
}

export async function listStudentAttendanceRecap({ userId }: { userId: string }) {
  await getStudentClassId(userId);
  const period = await getActiveAcademicPeriod();

  const rows = await db
    .select({
      date: attendanceRecords.date,
      status: attendanceRecords.status,
      note: attendanceRecords.note,
    })
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.studentId, userId),
        eq(attendanceRecords.academicPeriodId, period.id)
      )
    );

  const byDate = new Map(rows.map((row) => [row.date, row]));

  return {
    period: {
      id: period.id,
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
    },
    days: weekdaysBetween(period.startDate, period.endDate).map((item) => ({
      ...item,
      status: byDate.get(item.date)?.status ?? null,
      note: byDate.get(item.date)?.note ?? null,
    })),
  };
}
