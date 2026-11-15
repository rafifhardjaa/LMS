import { db } from "../db";
import { teacherSubjects } from "../db/schema";
import {
  listClasses,
  listJadwalPelajaran,
  listTeachers,
} from "./master-data-service";
import { listStudents } from "./students-service";
import { listSubjects } from "./subjects-services";

export type ReadinessDatum = {
  entity: string;
  pct: number;
  gap: string;
};

export type TeachingLoadDatum = {
  name: string;
  value: number;
};

export type ScheduleCoverageDatum = {
  day: string;
  fullName: string;
  terisi: number;
  kosong: number;
  bentrok: number;
};

export type StudentDistributionDatum = {
  majorCode: string;
  majorName: string;
  x: number;
  xi: number;
  xii: number;
  tanpa: number;
  total: number;
};

export type DashboardStats = {
  readiness: ReadinessDatum[];
  teachingLoad: TeachingLoadDatum[];
  scheduleCoverage: ScheduleCoverageDatum[];
  studentDistribution: StudentDistributionDatum[];
};

const HARI_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI_SHORT: Record<string, string> = {
  Senin: "Sen",
  Selasa: "Sel",
  Rabu: "Rab",
  Kamis: "Kam",
  Jumat: "Jum",
  Sabtu: "Sab",
};

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function gapText(ready: number, total: number, unit: string): string {
  if (total <= 0) return "Belum ada data";
  const missing = total - ready;
  return missing > 0 ? `${missing} ${unit}` : "Semua lengkap";
}

function buildReadiness(
  students: Awaited<ReturnType<typeof listStudents>>,
  teachers: Awaited<ReturnType<typeof listTeachers>>,
  subjects: Awaited<ReturnType<typeof listSubjects>>,
  classes: Awaited<ReturnType<typeof listClasses>>,
  jadwal: Awaited<ReturnType<typeof listJadwalPelajaran>>,
  assignedSubjectIds: Set<string>
): ReadinessDatum[] {
  const totalStudents = students.length;
  const withClass = students.filter((s) => s.classId).length;

  const totalTeachers = teachers.length;
  const withSubject = teachers.filter((t) => (t.subjectCount ?? 0) > 0).length;

  const activeSubjects = subjects.filter((s) => s.isActive);
  const withTeacher = activeSubjects.filter((s) =>
    assignedSubjectIds.has(s.id)
  ).length;

  const totalClasses = classes.length;
  const withStudents = classes.filter((c) => (c.studentCount ?? 0) > 0).length;

  const totalSesi = jadwal.length;
  const problematic = jadwal.filter(
    (j) =>
      (j.bentrokKelas ?? 0) > 0 || j.durasiLebihDari90 || j.diLuarJamKerja
  ).length;
  const validSesi = totalSesi - problematic;

  return [
    {
      entity: "Siswa",
      pct: pct(withClass, totalStudents),
      gap: gapText(withClass, totalStudents, "siswa belum punya rombel"),
    },
    {
      entity: "Guru",
      pct: pct(withSubject, totalTeachers),
      gap: gapText(withSubject, totalTeachers, "guru belum dapat mapel"),
    },
    {
      entity: "Mapel",
      pct: pct(withTeacher, activeSubjects.length),
      gap: gapText(withTeacher, activeSubjects.length, "mapel tanpa guru pengampu"),
    },
    {
      entity: "Rombel",
      pct: pct(withStudents, totalClasses),
      gap: gapText(withStudents, totalClasses, "kelas belum ada siswa"),
    },
    {
      entity: "Jadwal",
      pct: pct(validSesi, totalSesi),
      gap:
        totalSesi === 0
          ? "Belum ada sesi jadwal"
          : problematic > 0
            ? `${problematic} sesi bermasalah`
            : "Semua sesi valid",
    },
  ];
}

function buildTeachingLoad(
  teachers: Awaited<ReturnType<typeof listTeachers>>
): TeachingLoadDatum[] {
  const inRange = (min: number, max: number) =>
    teachers.filter((t) => {
      const jp = t.scheduleCount ?? 0;
      return jp >= min && jp <= max;
    }).length;

  return [
    {
      name: "0 JP",
      value: teachers.filter((t) => (t.scheduleCount ?? 0) === 0).length,
    },
    { name: "1–12 JP", value: inRange(1, 12) },
    { name: "13–24 JP", value: inRange(13, 24) },
    {
      name: "> 24 JP",
      value: teachers.filter((t) => (t.scheduleCount ?? 0) > 24).length,
    },
  ];
}

function buildScheduleCoverage(
  jadwal: Awaited<ReturnType<typeof listJadwalPelajaran>>
): ScheduleCoverageDatum[] {
  const byDay = new Map<
    string,
    { terisi: number; kosong: number; bentrok: number }
  >();

  for (const row of jadwal) {
    const bucket = byDay.get(row.hari) ?? { terisi: 0, kosong: 0, bentrok: 0 };
    bucket.terisi += 1;
    if (!row.teacherId) bucket.kosong += 1;
    if ((row.bentrokKelas ?? 0) > 0) bucket.bentrok += 1;
    byDay.set(row.hari, bucket);
  }

  const knownDays = HARI_ORDER.filter((h) => byDay.has(h) || h !== "Sabtu");
  const extraDays = [...byDay.keys()]
    .filter((h) => !HARI_ORDER.includes(h))
    .sort();
  const days = [...knownDays, ...extraDays];

  return days.map((hari) => ({
    day: HARI_SHORT[hari] ?? hari.slice(0, 3),
    fullName: hari,
    ...(byDay.get(hari) ?? { terisi: 0, kosong: 0, bentrok: 0 }),
  }));
}

function buildStudentDistribution(
  students: Awaited<ReturnType<typeof listStudents>>
): StudentDistributionDatum[] {
  const groups = new Map<
    string,
    StudentDistributionDatum & { order: number }
  >();

  for (const student of students) {
    const key = student.majorCode ?? "TANPA";
    const existing = groups.get(key);
    const bucket =
      existing ?? {
        majorCode: student.majorCode ?? "TANPA",
        majorName: student.majorName ?? "Tanpa Rombel",
        x: 0,
        xi: 0,
        xii: 0,
        tanpa: 0,
        total: 0,
        order: key === "TANPA" ? 999 : 0,
      };

    if (!student.gradeCode) {
      bucket.tanpa += 1;
    } else if (student.gradeCode === "X") {
      bucket.x += 1;
    } else if (student.gradeCode === "XI") {
      bucket.xi += 1;
    } else if (student.gradeCode === "XII") {
      bucket.xii += 1;
    } else {
      bucket.tanpa += 1;
    }
    bucket.total += 1;
    groups.set(key, bucket);
  }

  return [...groups.values()]
    .sort((a, b) => b.total - a.total || a.order - b.order)
    .map(({ order: _order, ...item }) => item);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [students, teachers, subjects, classes, jadwal, assignedSubjects] =
    await Promise.all([
      listStudents({ status: "all" }),
      listTeachers(),
      listSubjects({ includeInactive: true }),
      listClasses(),
      listJadwalPelajaran({}),
      db.select({ subjectId: teacherSubjects.subjectId }).from(teacherSubjects),
    ]);

  return {
    readiness: buildReadiness(
      students,
      teachers,
      subjects,
      classes,
      jadwal,
      new Set(assignedSubjects.map((row) => row.subjectId))
    ),
    teachingLoad: buildTeachingLoad(teachers),
    scheduleCoverage: buildScheduleCoverage(jadwal),
    studentDistribution: buildStudentDistribution(students),
  };
}
