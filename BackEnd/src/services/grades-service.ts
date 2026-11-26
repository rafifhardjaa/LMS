import {
  and,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  sql,
} from "drizzle-orm";
import { db } from "../db";
import {
  academicPeriods,
  classes,
  courseMeetings,
  jadwalPelajaran,
  studentSubjectGrades,
  subjects,
  subjectGradeWeights,
  teachingAssignments,
  users,
} from "../db/schema";
import { storageDb } from "../db/storage";
import {
  assignments,
  guruAssignmentKuis,
  guruAssignmentTugas,
} from "../db/storage-schema";
import { assertTeacherHasAssignment } from "./course-detail-service";
import { getActiveAcademicPeriod } from "./attendance-service";
import { listStudents } from "./students-service";
import { BadRequestError, NotFoundError } from "../utils/response";

const DEFAULT_WEIGHTS = {
  tugasWeight: 20,
  kuisWeight: 20,
  utsWeight: 30,
  uasWeight: 30,
};

type ResolvedPeriod = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

async function resolvePeriod(periodId?: string): Promise<ResolvedPeriod> {
  if (!periodId) {
    const active = await getActiveAcademicPeriod();
    return {
      id: active.id,
      name: active.name,
      startDate: active.startDate,
      endDate: active.endDate,
    };
  }

  const [period] = await db
    .select()
    .from(academicPeriods)
    .where(eq(academicPeriods.id, periodId))
    .limit(1);

  if (!period) throw new NotFoundError("Periode akademik tidak ditemukan");

  return {
    id: period.id,
    name: period.name,
    startDate: period.startDate,
    endDate: period.endDate,
  };
}

async function getWeights(subjectId: string, periodId: string) {
  const [row] = await db
    .select()
    .from(subjectGradeWeights)
    .where(
      and(
        eq(subjectGradeWeights.subjectId, subjectId),
        eq(subjectGradeWeights.academicPeriodId, periodId),
      ),
    )
    .limit(1);

  if (!row) return { ...DEFAULT_WEIGHTS };

  return {
    tugasWeight: Number(row.tugasWeight),
    kuisWeight: Number(row.kuisWeight),
    utsWeight: Number(row.utsWeight),
    uasWeight: Number(row.uasWeight),
  };
}

function calculateFinal(
  tugasScore: number | null,
  kuisScore: number | null,
  utsScore: number | null,
  uasScore: number | null,
  weights: typeof DEFAULT_WEIGHTS,
) {
  if (
    tugasScore === null ||
    kuisScore === null ||
    utsScore === null ||
    uasScore === null
  ) {
    return null;
  }

  return round2(
    (tugasScore * weights.tugasWeight +
      kuisScore * weights.kuisWeight +
      utsScore * weights.utsWeight +
      uasScore * weights.uasWeight) /
      100,
  );
}

type AverageResult = { average: number; count: number };

async function averageScores(
  table: any,
  assignmentIds: string[],
  studentIds: string[],
) {
  if (!assignmentIds.length || !studentIds.length) {
    return new Map<string, AverageResult>();
  }

  const rows = await storageDb
    .select({
      studentId: table.studentId,
      score: table.score,
    })
    .from(table)
    .where(
      and(
        inArray(table.assignmentId, assignmentIds),
        inArray(table.studentId, studentIds),
        eq(table.isDeleted, false),
        isNotNull(table.score),
      ),
    );

  const totals = new Map<string, { sum: number; count: number }>();
  for (const row of rows) {
    const score = Number(row.score);
    if (Number.isNaN(score)) continue;
    const current = totals.get(row.studentId) ?? { sum: 0, count: 0 };
    current.sum += score;
    current.count += 1;
    totals.set(row.studentId, current);
  }

  const averages = new Map<string, AverageResult>();
  for (const [studentId, value] of totals) {
    averages.set(studentId, {
      average: round2(value.sum / value.count),
      count: value.count,
    });
  }
  return averages;
}

async function getAssignmentIds(
  classId: string,
  subjectId: string,
  period: ResolvedPeriod,
) {
  const meetings = await db
    .select({ id: courseMeetings.id })
    .from(courseMeetings)
    .where(
      and(
        eq(courseMeetings.classId, classId),
        eq(courseMeetings.subjectId, subjectId),
        gte(courseMeetings.meetingDate, period.startDate),
        lte(courseMeetings.meetingDate, period.endDate),
      ),
    );

  const meetingIds = meetings.map((meeting) => meeting.id);
  if (!meetingIds.length) {
    return { tugasIds: [] as string[], kuisIds: [] as string[] };
  }

  const rows = await storageDb
    .select({ id: assignments.id, type: assignments.type })
    .from(assignments)
    .where(
      and(
        eq(assignments.classId, classId),
        eq(assignments.subjectId, subjectId),
        inArray(assignments.meetingId, meetingIds),
      ),
    );

  return {
    tugasIds: rows.filter((row) => row.type === "tugas").map((row) => row.id),
    kuisIds: rows.filter((row) => row.type === "kuis").map((row) => row.id),
  };
}

async function buildComponentScores(
  classId: string,
  subjectId: string,
  period: ResolvedPeriod,
  studentIds: string[],
) {
  const { tugasIds, kuisIds } = await getAssignmentIds(
    classId,
    subjectId,
    period,
  );
  const [tugas, kuis] = await Promise.all([
    averageScores(guruAssignmentTugas, tugasIds, studentIds),
    averageScores(guruAssignmentKuis, kuisIds, studentIds),
  ]);
  return { tugas, kuis };
}

export async function listStudentGrades({
  classId,
  subjectId,
  periodId,
  teacherId,
}: {
  classId: string;
  subjectId: string;
  periodId?: string;
  teacherId: string | null;
}) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);
  const period = await resolvePeriod(periodId);
  const weights = await getWeights(subjectId, period.id);
  const students = await listStudents({ classId });
  const studentIds = students.map((student) => student.id);
  const { tugas, kuis } = await buildComponentScores(
    classId,
    subjectId,
    period,
    studentIds,
  );

  const gradeRows = await db
    .select()
    .from(studentSubjectGrades)
    .where(
      and(
        eq(studentSubjectGrades.classId, classId),
        eq(studentSubjectGrades.subjectId, subjectId),
        eq(studentSubjectGrades.academicPeriodId, period.id),
      ),
    );
  const byStudent = new Map(
    gradeRows.map((row) => [row.studentId, row]),
  );

  return {
    period,
    weights,
    students: students.map((student) => {
      const existing = byStudent.get(student.id);
      const tugasScore = tugas.get(student.id)?.average ?? null;
      const kuisScore = kuis.get(student.id)?.average ?? null;
      const utsScore =
        existing?.utsScore !== null && existing?.utsScore !== undefined
          ? Number(existing.utsScore)
          : null;
      const uasScore =
        existing?.uasScore !== null && existing?.uasScore !== undefined
          ? Number(existing.uasScore)
          : null;

      return {
        studentId: student.id,
        name: student.fullName,
        nisn: student.nomorInduk ?? student.nisn ?? null,
        tugasScore,
        kuisScore,
        utsScore,
        uasScore,
        finalScore: calculateFinal(
          tugasScore,
          kuisScore,
          utsScore,
          uasScore,
          weights,
        ),
        tugasCount: tugas.get(student.id)?.count ?? 0,
        kuisCount: kuis.get(student.id)?.count ?? 0,
      };
    }),
  };
}

export type StudentGradeRow = {
  subjectId: string;
  subjectCode: string | null;
  subjectName: string;
  teacherName: string | null;
  jp: number;
  classId: string;
  className: string;
  academicPeriodId: string;
  academicPeriodName: string;
  weights: typeof DEFAULT_WEIGHTS;
  tugasScore: number | null;
  kuisScore: number | null;
  utsScore: number | null;
  uasScore: number | null;
  finalScore: number | null;
};

export async function listGradesForStudent(
  studentId: string,
): Promise<StudentGradeRow[]> {
  const gradeRows = await db
    .select()
    .from(studentSubjectGrades)
    .where(eq(studentSubjectGrades.studentId, studentId));

  if (!gradeRows.length) return [];

  const subjectIds = [...new Set(gradeRows.map((row) => row.subjectId))];
  const classIds = [...new Set(gradeRows.map((row) => row.classId))];
  const periodIds = [...new Set(gradeRows.map((row) => row.academicPeriodId))];

  const [subjectRows, classRows, periodRows, weightRows, scheduleRows, teacherRows] =
    await Promise.all([
      db
        .select({
          id: subjects.id,
          code: subjects.code,
          name: subjects.name,
        })
        .from(subjects)
        .where(inArray(subjects.id, subjectIds)),
      db
        .select({ id: classes.id, name: classes.name })
        .from(classes)
        .where(inArray(classes.id, classIds)),
      db
        .select({
          id: academicPeriods.id,
          name: academicPeriods.name,
        })
        .from(academicPeriods)
        .where(inArray(academicPeriods.id, periodIds)),
      db
        .select()
        .from(subjectGradeWeights)
        .where(
          and(
            inArray(subjectGradeWeights.subjectId, subjectIds),
            inArray(subjectGradeWeights.academicPeriodId, periodIds),
          ),
        ),
      db
        .select({
          subjectId: jadwalPelajaran.subjectId,
          classId: jadwalPelajaran.classId,
        })
        .from(jadwalPelajaran)
        .where(
          and(
            inArray(jadwalPelajaran.subjectId, subjectIds),
            inArray(jadwalPelajaran.classId, classIds),
          ),
        ),
      db
        .select({
          subjectId: teachingAssignments.subjectId,
          classId: teachingAssignments.classId,
          teacherName: users.fullName,
        })
        .from(teachingAssignments)
        .innerJoin(users, eq(teachingAssignments.teacherId, users.id))
        .where(
          and(
            inArray(teachingAssignments.subjectId, subjectIds),
            inArray(teachingAssignments.classId, classIds),
          ),
        ),
    ]);

  const subjectMap = new Map(subjectRows.map((row) => [row.id, row]));
  const classMap = new Map(classRows.map((row) => [row.id, row]));
  const periodMap = new Map(periodRows.map((row) => [row.id, row]));
  const weightMap = new Map(
    weightRows.map((row) => [
      `${row.subjectId}:${row.academicPeriodId}`,
      {
        tugasWeight: Number(row.tugasWeight),
        kuisWeight: Number(row.kuisWeight),
        utsWeight: Number(row.utsWeight),
        uasWeight: Number(row.uasWeight),
      },
    ]),
  );
  const scheduleCount = new Map<string, number>();
  for (const row of scheduleRows) {
    const key = `${row.subjectId}:${row.classId}`;
    scheduleCount.set(key, (scheduleCount.get(key) ?? 0) + 1);
  }
  const teacherMap = new Map<string, string>();
  for (const row of teacherRows) {
    const key = `${row.subjectId}:${row.classId}`;
    if (!teacherMap.has(key)) teacherMap.set(key, row.teacherName);
  }

  const mappedRows: Array<StudentGradeRow | null> = gradeRows.map((row) => {
    const subject = subjectMap.get(row.subjectId);
    const itemClass = classMap.get(row.classId);
    const period = periodMap.get(row.academicPeriodId);
    if (!subject || !itemClass || !period) return null;

    const weightKey = `${row.subjectId}:${row.academicPeriodId}`;
    return {
        subjectId: row.subjectId,
        subjectCode: subject.code,
        subjectName: subject.name,
        teacherName: teacherMap.get(`${row.subjectId}:${row.classId}`) ?? null,
        jp:
          scheduleCount.get(`${row.subjectId}:${row.classId}`) ??
          0,
        classId: row.classId,
        className: itemClass.name,
        academicPeriodId: row.academicPeriodId,
        academicPeriodName: period.name,
        weights: weightMap.get(weightKey) ?? { ...DEFAULT_WEIGHTS },
        tugasScore:
          row.tugasScore === null ? null : Number(row.tugasScore),
        kuisScore:
          row.kuisScore === null ? null : Number(row.kuisScore),
        utsScore:
          row.utsScore === null ? null : Number(row.utsScore),
        uasScore:
          row.uasScore === null ? null : Number(row.uasScore),
        finalScore:
          row.finalScore === null ? null : Number(row.finalScore),
      };
  });

  return mappedRows
    .filter((row): row is StudentGradeRow => row !== null)
    .sort((first, second) => first.subjectName.localeCompare(second.subjectName));
}

export async function upsertStudentGrades({
  classId,
  subjectId,
  periodId,
  teacherId,
  records,
}: {
  classId: string;
  subjectId: string;
  periodId?: string;
  teacherId: string | null;
  records: Array<{
    studentId: string;
    utsScore?: number | null;
    uasScore?: number | null;
  }>;
}) {
  await assertTeacherHasAssignment(teacherId, subjectId, classId);
  const period = await resolvePeriod(periodId);
  const weights = await getWeights(subjectId, period.id);
  const students = await listStudents({ classId });
  const allowed = new Set(students.map((student) => student.id));
  const studentIds = [...allowed];
  const { tugas, kuis } = await buildComponentScores(
    classId,
    subjectId,
    period,
    studentIds,
  );

  const values = records.map((record) => {
    if (!allowed.has(record.studentId)) {
      throw new BadRequestError("Siswa tidak terdaftar pada kelas ini");
    }
    const utsScore =
      record.utsScore === null || record.utsScore === undefined
        ? null
        : record.utsScore;
    const uasScore =
      record.uasScore === null || record.uasScore === undefined
        ? null
        : record.uasScore;
    if (
      (utsScore !== null && (utsScore < 0 || utsScore > 100)) ||
      (uasScore !== null && (uasScore < 0 || uasScore > 100))
    ) {
      throw new BadRequestError("Nilai UTS/UAS harus 0–100");
    }

    const tugasScore = tugas.get(record.studentId)?.average ?? null;
    const kuisScore = kuis.get(record.studentId)?.average ?? null;

    return {
      studentId: record.studentId,
      classId,
      subjectId,
      academicPeriodId: period.id,
      tugasScore: tugasScore === null ? null : String(tugasScore),
      kuisScore: kuisScore === null ? null : String(kuisScore),
      utsScore: utsScore === null ? null : String(utsScore),
      uasScore: uasScore === null ? null : String(uasScore),
      finalScore: (() => {
        const final = calculateFinal(
          tugasScore,
          kuisScore,
          utsScore,
          uasScore,
          weights,
        );
        return final === null ? null : String(final);
      })(),
      tugasCount: tugas.get(record.studentId)?.count ?? 0,
      kuisCount: kuis.get(record.studentId)?.count ?? 0,
      updatedAt: new Date(),
    };
  });

  if (!values.length) return { saved: 0 };

  await db
    .insert(studentSubjectGrades)
    .values(values)
    .onConflictDoUpdate({
      target: [
        studentSubjectGrades.studentId,
        studentSubjectGrades.subjectId,
        studentSubjectGrades.academicPeriodId,
      ],
      set: {
        classId: sql`excluded.class_id`,
        tugasScore: sql`excluded.tugas_score`,
        kuisScore: sql`excluded.kuis_score`,
        utsScore: sql`excluded.uts_score`,
        uasScore: sql`excluded.uas_score`,
        finalScore: sql`excluded.final_score`,
        tugasCount: sql`excluded.tugas_count`,
        kuisCount: sql`excluded.kuis_count`,
        updatedAt: sql`excluded.updated_at`,
      },
    });

  return { saved: values.length };
}

export async function getGradeWeights({
  subjectId,
  periodId,
}: {
  subjectId: string;
  periodId?: string;
}) {
  const period = await resolvePeriod(periodId);
  const weights = await getWeights(subjectId, period.id);
  return { period, weights };
}

export async function upsertGradeWeights({
  subjectId,
  periodId,
  tugasWeight,
  kuisWeight,
  utsWeight,
  uasWeight,
}: {
  subjectId: string;
  periodId?: string;
  tugasWeight: number;
  kuisWeight: number;
  utsWeight: number;
  uasWeight: number;
}) {
  const period = await resolvePeriod(periodId);
  const weights = { tugasWeight, kuisWeight, utsWeight, uasWeight };
  const total =
    weights.tugasWeight +
    weights.kuisWeight +
    weights.utsWeight +
    weights.uasWeight;

  if (
    [weights.tugasWeight, weights.kuisWeight, weights.utsWeight, weights.uasWeight].some(
      (weight) => weight < 0 || weight > 100,
    ) ||
    Math.abs(total - 100) > 0.01
  ) {
    throw new BadRequestError("Total bobot nilai harus 100");
  }

  await db
    .insert(subjectGradeWeights)
    .values({
      subjectId,
      academicPeriodId: period.id,
      tugasWeight: String(weights.tugasWeight),
      kuisWeight: String(weights.kuisWeight),
      utsWeight: String(weights.utsWeight),
      uasWeight: String(weights.uasWeight),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        subjectGradeWeights.subjectId,
        subjectGradeWeights.academicPeriodId,
      ],
      set: {
        tugasWeight: sql`excluded.tugas_weight`,
        kuisWeight: sql`excluded.kuis_weight`,
        utsWeight: sql`excluded.uts_weight`,
        uasWeight: sql`excluded.uas_weight`,
        updatedAt: sql`excluded.updated_at`,
      },
    });

  return { period, weights };
}
