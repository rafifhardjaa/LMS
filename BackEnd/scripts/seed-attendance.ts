import { eq, sql } from "drizzle-orm";
import { db } from "../src/db/index";
import {
  academicPeriods,
  attendanceRecords,
  attendanceSessions,
  classes,
} from "../src/db/schema";
import { getActiveAcademicPeriod } from "../src/services/attendance-service";
import { listStudents } from "../src/services/students-service";

const CLASS_NAME = "XII TJKT D";
const EXPECTED_START_DATE = "2026-07-20";
const EXPECTED_END_DATE = "2026-11-10";

type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa";

function weekdaysBetween(startDate: string, endDate: string) {
  const days: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00Z`);
  const last = new Date(`${endDate}T00:00:00Z`);

  while (cursor <= last) {
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      days.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function statusFor(studentIndex: number, dayIndex: number): AttendanceStatus {
  const value = (studentIndex * 13 + dayIndex * 7) % 100;
  if (value < 85) return "hadir";
  if (value < 90) return "sakit";
  if (value < 96) return "izin";
  return "alpa";
}

async function main() {
  const classRows = await db
    .select()
    .from(classes)
    .where(eq(classes.name, CLASS_NAME))
    .limit(1);
  const itemClass = classRows[0];
  if (!itemClass) throw new Error(`Kelas ${CLASS_NAME} tidak ditemukan`);

  const period = await getActiveAcademicPeriod();
  if (
    period.startDate !== EXPECTED_START_DATE ||
    period.endDate !== EXPECTED_END_DATE
  ) {
    throw new Error(
      `Periode aktif tidak sesuai: ${period.startDate}..${period.endDate}`,
    );
  }

  const students = await listStudents({ classId: itemClass.id });
  if (!students.length) throw new Error("Tidak ada siswa pada kelas ini");

  const dates = weekdaysBetween(period.startDate, period.endDate);
  const statusCounts: Record<AttendanceStatus, number> = {
    hadir: 0,
    sakit: 0,
    izin: 0,
    alpa: 0,
  };

  for (const [dayIndex, date] of dates.entries()) {
    await db
      .insert(attendanceSessions)
      .values({
        classId: itemClass.id,
        academicPeriodId: period.id,
        date,
        openedBy: itemClass.advisorId,
        openedAt: new Date(`${date}T07:00:00.000Z`),
      })
      .onConflictDoUpdate({
        target: [attendanceSessions.classId, attendanceSessions.date],
        set: {
          academicPeriodId: period.id,
          openedBy: itemClass.advisorId,
          openedAt: new Date(`${date}T07:00:00.000Z`),
          updatedAt: new Date(),
        },
      });

    const recordValues = students.map((student, studentIndex) => {
      const status = statusFor(studentIndex, dayIndex);
      statusCounts[status] += 1;
      return {
        studentId: student.id,
        classId: itemClass.id,
        academicPeriodId: period.id,
        date,
        status,
        note: null,
        recordedBy: itemClass.advisorId,
        updatedAt: new Date(),
      };
    });

    await db
      .insert(attendanceRecords)
      .values(recordValues)
      .onConflictDoUpdate({
        target: [attendanceRecords.studentId, attendanceRecords.date],
        set: {
          classId: sql`excluded.class_id`,
          academicPeriodId: sql`excluded.academic_period_id`,
          status: sql`excluded.status`,
          note: sql`excluded.note`,
          recordedBy: sql`excluded.recorded_by`,
          updatedAt: sql`excluded.updated_at`,
        },
      });
  }

  console.log(
    JSON.stringify(
      {
        class: CLASS_NAME,
        className: itemClass.name,
        period: period.name,
        startDate: period.startDate,
        endDate: period.endDate,
        dates: dates.length,
        students: students.length,
        records: dates.length * students.length,
        statusCounts,
        firstDate: dates[0],
        lastDate: dates.at(-1),
      },
      null,
      2,
    ),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
