import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import {
  academicPeriods,
  attendanceRecords,
  attendanceSessions,
  classes,
  jadwalPelajaran,
  subjects,
  users,
} from "../db/schema";
import { canonicalRole } from "./role-service";
import { listStudents } from "./students-service";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/response";

export type AttendanceActor = {
  id: string;
  role: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SESSION_WINDOW_MS = 60 * 60 * 1000;

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

  if (
    actor &&
    canonicalRole(actor.role) === "guru" &&
    rows[0]!.advisorId !== actor.id
  ) {
    throw new ForbiddenError(
      "Hanya wali kelas yang dapat membuka presensi kelas ini"
    );
  }
}

export async function getActiveAcademicPeriod() {
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

function assertAttendanceDate(
  date: string,
  period: { startDate: string; endDate: string }
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new BadRequestError("Tanggal presensi tidak valid");
  }
  if (date < period.startDate || date > period.endDate) {
    throw new BadRequestError("Tanggal di luar periode akademik aktif");
  }

  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  if (weekday === 0 || weekday === 6) {
    throw new BadRequestError("Presensi hanya untuk hari Senin–Jumat");
  }
}

function periodSummary(period: {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}) {
  return {
    id: period.id,
    name: period.name,
    startDate: period.startDate,
    endDate: period.endDate,
  };
}

function validatePeriodInput(name: string, startDate: string, endDate: string) {
  if (!name.trim()) throw new BadRequestError("Nama periode wajib diisi");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    throw new BadRequestError("Tanggal periode tidak valid");
  }
  if (startDate > endDate) {
    throw new BadRequestError("Tanggal mulai harus sebelum tanggal selesai");
  }
}

function describeSession(openedAt: Date | string | null) {
  if (!openedAt) {
    return { isOpen: false, openedAt: null, closesAt: null };
  }

  const opened = openedAt instanceof Date ? openedAt : new Date(openedAt);
  const closes = new Date(opened.getTime() + SESSION_WINDOW_MS);

  return {
    isOpen: Date.now() <= closes.getTime(),
    openedAt: opened.toISOString(),
    closesAt: closes.toISOString(),
  };
}

export async function openAttendanceSession({
  classId,
  date,
  actor,
}: {
  classId: string;
  date: string;
  actor: AttendanceActor | null;
}) {
  await assertAdvisorAccess(classId, actor);
  const period = await getActiveAcademicPeriod();
  assertAttendanceDate(date, period);

  const openedAt = new Date();
  const [row] = await db
    .insert(attendanceSessions)
    .values({
      classId,
      academicPeriodId: period.id,
      date,
      openedBy: actor && UUID_RE.test(actor.id) ? actor.id : null,
      openedAt,
    })
    .onConflictDoUpdate({
      target: [attendanceSessions.classId, attendanceSessions.date],
      set: {
        academicPeriodId: sql`excluded.academic_period_id`,
        openedBy: sql`excluded.opened_by`,
        openedAt: sql`excluded.opened_at`,
        updatedAt: new Date(),
      },
    })
    .returning();

  return describeSession(row?.openedAt ?? openedAt);
}

export async function getAttendanceSession({
  classId,
  date,
}: {
  classId: string;
  date: string;
}) {
  const [row] = await db
    .select({ openedAt: attendanceSessions.openedAt })
    .from(attendanceSessions)
    .where(
      and(
        eq(attendanceSessions.classId, classId),
        eq(attendanceSessions.date, date)
      )
    )
    .limit(1);

  return describeSession(row?.openedAt ?? null);
}

export async function closeAttendanceSession({
  classId,
  date,
  actor,
}: {
  classId: string;
  date: string;
  actor: AttendanceActor | null;
}) {
  await assertAdvisorAccess(classId, actor);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new BadRequestError("Tanggal presensi tidak valid");
  }

  await db
    .delete(attendanceSessions)
    .where(
      and(
        eq(attendanceSessions.classId, classId),
        eq(attendanceSessions.date, date)
      )
    );

  return { closed: true };
}

async function assertSessionOpen(classId: string, date: string) {
  const session = await getAttendanceSession({ classId, date });
  if (!session.isOpen) {
    throw new BadRequestError(
      session.openedAt
        ? "Waktu presensi sudah berakhir"
        : "Presensi belum dibuka guru",
    );
  }
  return session;
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

export async function listAttendanceRecords({
  classId,
  date,
  actor,
}: {
  classId: string;
  date: string;
  actor: AttendanceActor | null;
}) {
  await assertAdvisorAccess(classId, actor);
  const period = await getActiveAcademicPeriod();
  assertAttendanceDate(date, period);

  const students = await listStudents({ classId });
  const rows = await db
    .select({
      studentId: attendanceRecords.studentId,
      status: attendanceRecords.status,
      note: attendanceRecords.note,
    })
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.classId, classId),
        eq(attendanceRecords.date, date)
      )
    )
    .orderBy(asc(attendanceRecords.studentId));

  const byStudent = new Map(rows.map((row) => [row.studentId, row]));

  return {
    period: periodSummary(period),
    date,
    students: students.map((student) => ({
      studentId: student.id,
      name: student.fullName,
      nomorInduk: student.nomorInduk ?? student.nisn ?? null,
      status: byStudent.get(student.id)?.status ?? null,
      note: byStudent.get(student.id)?.note ?? null,
    })),
  };
}

export async function saveAttendanceRecords({
  classId,
  date,
  records,
  actor,
}: {
  classId: string;
  date: string;
  records: Array<{
    studentId: string;
    status: "hadir" | "sakit" | "izin" | "alpa";
    note?: string | null;
  }>;
  actor: AttendanceActor | null;
}) {
  await assertAdvisorAccess(classId, actor);
  const period = await getActiveAcademicPeriod();
  assertAttendanceDate(date, period);
  await assertSessionOpen(classId, date);

  const allowed = new Set((await listStudents({ classId })).map((s) => s.id));
  const seen = new Set<string>();
  const values: Array<{
    studentId: string;
    classId: string;
    academicPeriodId: string;
    date: string;
    status: "hadir" | "sakit" | "izin" | "alpa";
    note: string | null;
    recordedBy: string | null;
    updatedAt: Date;
  }> = [];

  for (const record of records) {
    if (!allowed.has(record.studentId)) {
      throw new BadRequestError("Siswa tidak terdaftar pada kelas ini");
    }
    if (!["hadir", "sakit", "izin", "alpa"].includes(record.status)) {
      throw new BadRequestError("Status kehadiran tidak valid");
    }
    if (seen.has(record.studentId)) continue;
    seen.add(record.studentId);

    values.push({
      studentId: record.studentId,
      classId,
      academicPeriodId: period.id,
      date,
      status: record.status,
      note: record.note?.trim() || null,
      recordedBy: actor && UUID_RE.test(actor.id) ? actor.id : null,
      updatedAt: new Date(),
    });
  }

  if (values.length > 0) {
    await db
      .insert(attendanceRecords)
      .values(values)
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

  return { saved: values.length };
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
  const classId = await getStudentClassId(userId);
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

  const sessionRows = await db
    .select({
      date: attendanceSessions.date,
      openedAt: attendanceSessions.openedAt,
    })
    .from(attendanceSessions)
    .where(
      and(
        eq(attendanceSessions.classId, classId),
        eq(attendanceSessions.academicPeriodId, period.id)
      )
    );

  const byDate = new Map(rows.map((row) => [row.date, row]));
  const sessionsByDate = new Map(
    sessionRows.map((row) => [row.date, describeSession(row.openedAt)]),
  );

  return {
    period: periodSummary(period),
    days: weekdaysBetween(period.startDate, period.endDate).map((item) => ({
      ...item,
      status: byDate.get(item.date)?.status ?? null,
      note: byDate.get(item.date)?.note ?? null,
      sessionOpen: sessionsByDate.get(item.date)?.isOpen ?? false,
      sessionOpenedAt: sessionsByDate.get(item.date)?.openedAt ?? null,
      sessionClosesAt: sessionsByDate.get(item.date)?.closesAt ?? null,
    })),
  };
}

export async function listAcademicPeriods() {
  return db
    .select()
    .from(academicPeriods)
    .orderBy(desc(academicPeriods.startDate));
}

export async function createAcademicPeriod({
  name,
  startDate,
  endDate,
  isActive = false,
}: {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}) {
  validatePeriodInput(name, startDate, endDate);

  return db.transaction(async (tx) => {
    if (isActive) {
      await tx
        .update(academicPeriods)
        .set({ isActive: false })
        .where(eq(academicPeriods.isActive, true));
    }

    const [created] = await tx
      .insert(academicPeriods)
      .values({
        name: name.trim(),
        startDate,
        endDate,
        isActive,
      })
      .returning();

    return created;
  });
}

export async function updateAcademicPeriod(
  id: string,
  patch: {
    name?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  }
) {
  const [existing] = await db
    .select()
    .from(academicPeriods)
    .where(eq(academicPeriods.id, id))
    .limit(1);
  if (!existing) throw new NotFoundError("Periode akademik tidak ditemukan");

  const name = patch.name ?? existing.name;
  const startDate = patch.startDate ?? existing.startDate;
  const endDate = patch.endDate ?? existing.endDate;
  validatePeriodInput(name, startDate, endDate);

  return db.transaction(async (tx) => {
    if (patch.isActive === true) {
      await tx
        .update(academicPeriods)
        .set({ isActive: false })
        .where(eq(academicPeriods.isActive, true));
    }

    const [updated] = await tx
      .update(academicPeriods)
      .set({
        name: name.trim(),
        startDate,
        endDate,
        ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
        updatedAt: new Date(),
      })
      .where(eq(academicPeriods.id, id))
      .returning();

    return updated;
  });
}

export async function activateAcademicPeriod(id: string) {
  const [existing] = await db
    .select()
    .from(academicPeriods)
    .where(eq(academicPeriods.id, id))
    .limit(1);
  if (!existing) throw new NotFoundError("Periode akademik tidak ditemukan");

  await db.transaction(async (tx) => {
    await tx
      .update(academicPeriods)
      .set({ isActive: false })
      .where(eq(academicPeriods.isActive, true));
    await tx
      .update(academicPeriods)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(academicPeriods.id, id));
  });

  return { id };
}

export async function saveStudentAttendance({
  userId,
  date,
  status,
  note,
}: {
  userId: string;
  date: string;
  status: "hadir" | "sakit" | "izin";
  note?: string | null;
}) {
  const classId = await getStudentClassId(userId);
  const period = await getActiveAcademicPeriod();
  assertAttendanceDate(date, period);
  await assertSessionOpen(classId, date);

  if (!["hadir", "sakit", "izin"].includes(status)) {
    throw new BadRequestError("Status presensi siswa tidak valid");
  }

  const [existing] = await db
    .select({ id: attendanceRecords.id })
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.studentId, userId),
        eq(attendanceRecords.date, date)
      )
    )
    .limit(1);

  if (existing) {
    throw new BadRequestError("Presensi untuk tanggal ini sudah tercatat");
  }

  await db.insert(attendanceRecords).values({
    studentId: userId,
    classId,
    academicPeriodId: period.id,
    date,
    status,
    note: note?.trim() || null,
    recordedBy: userId,
  });

  return { date, status };
}