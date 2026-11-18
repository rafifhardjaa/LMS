// Import detail course (materi & pertemuan) dari Detail_Course.xlsx.
//
// Sumber data:
//   - sheet "Course"          : 86 course (mapel × tingkat) -> mapping ke subjects
//   - sheet "Materi Pertemuan": 1376 baris (course × pertemuan 1-16)
//   - sheet "Detail Course"   : 19840 baris (course × kelas × pertemuan)
//
// Script ini:
//   1. Memetakan course ke subject existing (nama mapel + tingkat + jurusan).
//   2. Menimpa capaian_pembelajaran subjects dengan teks dari sheet Course.
//   3. Menulis course_materials & course_meetings (refresh penuh).
//
// Pemakaian:
//   bun run db:import-detail-course --dry-run
//   bun run db:import-detail-course

import ExcelJS from "exceljs";
import { eq } from "drizzle-orm";
import { join } from "node:path";
import { db } from "../src/db/index";
import {
  classes,
  courseMaterials,
  courseMeetings,
  gradeLevels,
  majors,
  subjects,
  users,
} from "../src/db/schema";

const XLSX_PATH = join(import.meta.dir, "..", "..", "Detail_Course.xlsx");
const DRY_RUN = process.argv.includes("--dry-run");

type CellValue = ExcelJS.CellValue;

type CourseRow = {
  courseCode: string;
  sourceSubjectCode: string;
  subjectName: string;
  gradeCode: string;
  fase: string;
  majorCode: string | null;
  subjectGroup: string;
  meetingCount: number;
  capaianPembelajaran: string;
};

type MaterialRow = {
  courseCode: string;
  meetingNumber: number;
  title: string;
  objective: string;
};

type DetailRow = {
  courseCode: string;
  classCode: string;
  meetingNumber: number;
  meetingDate: string;
  day: string;
  title: string;
  objective: string;
  teacherCode: string;
};

const MAJOR_ALIASES: Record<string, string> = {
  AKL: "AKL",
  "Bisnis Digital": "BDG",
  DKV: "DKV",
  Kuliner: "KUL",
  PPLG: "PPLG",
  Perhotelan: "HTL",
  TJKT: "TJKT",
  TKI: "TKI",
  TKR: "TKR",
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function cellText(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "result" in value) {
    return cellText(value.result as CellValue);
  }
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function cellNumber(value: CellValue, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "number") return value;
  if (typeof value === "object" && "result" in value) {
    return cellNumber(value.result as CellValue, fallback);
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cellDate(value: CellValue): string {
  if (value instanceof Date) {
    return `${value.getUTCFullYear()}-${pad2(value.getUTCMonth() + 1)}-${pad2(
      value.getUTCDate()
    )}`;
  }
  const text = cellText(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  throw new Error(`Format tanggal tidak dikenali: ${text}`);
}

function normalize(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function sheetHeader(sheet: ExcelJS.Worksheet): Map<string, number> {
  const header = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, column) => {
    header.set(cellText(cell.value), column);
  });
  return header;
}

function column(header: Map<string, number>, name: string): number {
  const value = header.get(name);
  if (!value) throw new Error(`Kolom "${name}" tidak ditemukan`);
  return value;
}

function requiredColumns(
  header: Map<string, number>,
  names: string[],
  sheetName: string
) {
  const missing = names.filter((name) => !header.has(name));
  if (missing.length) {
    throw new Error(
      `Sheet "${sheetName}" kehilangan kolom: ${missing.join(", ")}`
    );
  }
}

async function readWorkbook() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(XLSX_PATH);
  return workbook;
}

function readCourseRows(workbook: ExcelJS.Workbook): CourseRow[] {
  const sheet = workbook.getWorksheet("Course");
  if (!sheet) throw new Error('Sheet "Course" tidak ditemukan');

  const header = sheetHeader(sheet);
  requiredColumns(
    header,
    [
      "kode_course",
      "kode_mapel",
      "nama_mapel",
      "tingkat",
      "fase",
      "jurusan",
      "kelompok_mapel",
      "jumlah_pertemuan",
      "capaian_pembelajaran",
    ],
    "Course"
  );

  const rows: CourseRow[] = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const courseCode = cellText(row.getCell(column(header, "kode_course")).value);
    if (!courseCode) continue;

    const jurusan = cellText(row.getCell(column(header, "jurusan")).value);
    rows.push({
      courseCode,
      sourceSubjectCode: cellText(
        row.getCell(column(header, "kode_mapel")).value
      ),
      subjectName: cellText(row.getCell(column(header, "nama_mapel")).value),
      gradeCode: cellText(row.getCell(column(header, "tingkat")).value),
      fase: cellText(row.getCell(column(header, "fase")).value),
      majorCode: jurusan === "Semua jurusan" ? null : (MAJOR_ALIASES[jurusan] ?? jurusan),
      subjectGroup: cellText(
        row.getCell(column(header, "kelompok_mapel")).value
      ),
      meetingCount: cellNumber(
        row.getCell(column(header, "jumlah_pertemuan")).value,
        16
      ),
      capaianPembelajaran: cellText(
        row.getCell(column(header, "capaian_pembelajaran")).value
      ),
    });
  }
  return rows;
}

function readMaterialRows(workbook: ExcelJS.Workbook): MaterialRow[] {
  const sheet = workbook.getWorksheet("Materi Pertemuan");
  if (!sheet) throw new Error('Sheet "Materi Pertemuan" tidak ditemukan');

  const header = sheetHeader(sheet);
  requiredColumns(
    header,
    ["kode_course", "pertemuan", "judul_materi", "tujuan_singkat"],
    "Materi Pertemuan"
  );

  const rows: MaterialRow[] = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const courseCode = cellText(row.getCell(column(header, "kode_course")).value);
    if (!courseCode) continue;
    rows.push({
      courseCode,
      meetingNumber: cellNumber(row.getCell(column(header, "pertemuan")).value, 0),
      title: cellText(row.getCell(column(header, "judul_materi")).value),
      objective: cellText(row.getCell(column(header, "tujuan_singkat")).value),
    });
  }
  return rows;
}

function readDetailRows(workbook: ExcelJS.Workbook): DetailRow[] {
  const sheet = workbook.getWorksheet("Detail Course");
  if (!sheet) throw new Error('Sheet "Detail Course" tidak ditemukan');

  const header = sheetHeader(sheet);
  requiredColumns(
    header,
    [
      "kode_course",
      "kode_kelas",
      "pertemuan",
      "tanggal_pertemuan",
      "hari",
      "judul_materi",
      "tujuan_singkat",
      "kode_guru",
    ],
    "Detail Course"
  );

  const rows: DetailRow[] = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const courseCode = cellText(row.getCell(column(header, "kode_course")).value);
    if (!courseCode) continue;
    rows.push({
      courseCode,
      classCode: cellText(row.getCell(column(header, "kode_kelas")).value),
      meetingNumber: cellNumber(row.getCell(column(header, "pertemuan")).value, 0),
      meetingDate: cellDate(
        row.getCell(column(header, "tanggal_pertemuan")).value
      ),
      day: cellText(row.getCell(column(header, "hari")).value),
      title: cellText(row.getCell(column(header, "judul_materi")).value),
      objective: cellText(row.getCell(column(header, "tujuan_singkat")).value),
      teacherCode: cellText(row.getCell(column(header, "kode_guru")).value),
    });
  }
  return rows;
}

async function main() {
  console.log(`Membaca ${XLSX_PATH} ...`);
  const [workbook, allSubjects, allClasses, allTeachers, allGrades, allMajors] =
    await Promise.all([
      readWorkbook(),
      db.select().from(subjects),
      db.select().from(classes),
      db.select().from(users),
      db.select().from(gradeLevels),
      db.select().from(majors),
    ]);

  const courseRows = readCourseRows(workbook);
  const materialRows = readMaterialRows(workbook);
  const detailRows = readDetailRows(workbook);

  const gradeByCode = new Map(allGrades.map((row) => [row.code, row.id]));
  const majorByCode = new Map(allMajors.map((row) => [row.code, row.id]));

  const subjectByKey = new Map<string, (typeof allSubjects)[number]>();
  for (const subject of allSubjects) {
    const grade = allGrades.find((row) => row.id === subject.gradeLevelId);
    const major = subject.majorId
      ? allMajors.find((row) => row.id === subject.majorId)
      : undefined;
    const key = `${subject.name.trim().toLowerCase()}|${grade?.code ?? "-"}|${major?.code ?? "-"}`;
    if (subjectByKey.has(key)) {
      throw new Error(`Subject duplikat untuk key mapping: ${key}`);
    }
    subjectByKey.set(key, subject);
  }

  const teacherByCode = new Map(
    allTeachers
      .filter((row) => row.kodeGuru)
      .map((row) => [row.kodeGuru as string, row.id])
  );

  const classByNorm = new Map<string, (typeof allClasses)[number]>();
  for (const item of allClasses) {
    const key = normalize(item.name);
    if (classByNorm.has(key)) {
      throw new Error(`Kelas duplikat setelah normalisasi: ${item.name}`);
    }
    classByNorm.set(key, item);
  }

  const courseToSubject = new Map<string, (typeof allSubjects)[number]>();
  const missingCourses: string[] = [];
  for (const course of courseRows) {
    const gradeId = gradeByCode.get(course.gradeCode);
    if (!gradeId) {
      missingCourses.push(`${course.courseCode} (tingkat ${course.gradeCode})`);
      continue;
    }
    const majorId = course.majorCode
      ? (majorByCode.get(course.majorCode) ?? null)
      : null;
    const key = `${course.subjectName.trim().toLowerCase()}|${course.gradeCode}|${course.majorCode ?? "-"}`;
    const subject = subjectByKey.get(key);
    if (!subject || subject.gradeLevelId !== gradeId || (subject.majorId ?? null) !== majorId) {
      missingCourses.push(`${course.courseCode} (key ${key})`);
      continue;
    }
    courseToSubject.set(course.courseCode, subject);
  }

  const materialByCourse = new Map<string, Map<number, MaterialRow>>();
  for (const material of materialRows) {
    if (!materialByCourse.has(material.courseCode)) {
      materialByCourse.set(material.courseCode, new Map());
    }
    const meetings = materialByCourse.get(material.courseCode)!;
    if (meetings.has(material.meetingNumber)) {
      throw new Error(
        `Materi duplikat: ${material.courseCode} pertemuan ${material.meetingNumber}`
      );
    }
    meetings.set(material.meetingNumber, material);
  }

  const missingMaterials: string[] = [];
  for (const course of courseRows) {
    const meetings = materialByCourse.get(course.courseCode);
    if (!meetings || meetings.size !== course.meetingCount) {
      missingMaterials.push(
        `${course.courseCode} (${meetings?.size ?? 0}/${course.meetingCount})`
      );
    }
  }

  const missingClasses = new Set<string>();
  const missingTeachers = new Set<string>();
  const meetingKey = new Map<string, DetailRow>();
  const duplicateMeetings = new Set<string>();
  let materialMismatch = 0;

  for (const detail of detailRows) {
    const classRow = classByNorm.get(normalize(detail.classCode));
    if (!classRow) missingClasses.add(detail.classCode);
    if (!teacherByCode.has(detail.teacherCode)) missingTeachers.add(detail.teacherCode);

    const key = `${detail.courseCode}|${detail.classCode}|${detail.meetingNumber}`;
    if (meetingKey.has(key)) duplicateMeetings.add(key);
    meetingKey.set(key, detail);

    const material = materialByCourse
      .get(detail.courseCode)
      ?.get(detail.meetingNumber);
    if (
      material &&
      (material.title !== detail.title || material.objective !== detail.objective)
    ) {
      materialMismatch += 1;
    }
  }

  console.log("\nValidasi mapping:");
  console.log(`  Course            : ${courseRows.length}`);
  console.log(`  Course terpetakan : ${courseToSubject.size}`);
  console.log(`  Materi            : ${materialRows.length}`);
  console.log(`  Detail course     : ${detailRows.length}`);
  console.log(`  Kelas unik        : ${new Set(detailRows.map((row) => row.classCode)).size}`);
  console.log(`  Guru unik         : ${new Set(detailRows.map((row) => row.teacherCode)).size}`);

  if (missingCourses.length) {
    throw new Error(
      `Course tidak terpetakan (${missingCourses.length}): ${missingCourses.slice(0, 20).join("\n  ")}`
    );
  }
  if (missingMaterials.length) {
    throw new Error(
      `Course tanpa materi lengkap (${missingMaterials.length}): ${missingMaterials.slice(0, 20).join("\n  ")}`
    );
  }
  if (missingClasses.size) {
    throw new Error(
      `Kelas tidak terpetakan (${missingClasses.size}): ${[...missingClasses].slice(0, 20).join(", ")}`
    );
  }
  if (missingTeachers.size) {
    throw new Error(
      `Guru tidak terpetakan (${missingTeachers.size}): ${[...missingTeachers].slice(0, 20).join(", ")}`
    );
  }
  if (duplicateMeetings.size) {
    throw new Error(`Detail course duplikat: ${duplicateMeetings.size}`);
  }
  if (materialMismatch) {
    console.warn(
      `  Peringatan: ${materialMismatch} baris detail berbeda judul/tujuan dengan sheet Materi Pertemuan.`
    );
  }

  const summary = {
    subjects: courseRows.length,
    materials: materialRows.length,
    meetings: detailRows.length,
  };

  if (DRY_RUN) {
    console.log("\n[DRY-RUN] Tidak ada perubahan database.");
    console.log(summary);
    return;
  }

  console.log("\nMenulis ke database...");
  await db.transaction(async (tx) => {
    await tx.delete(courseMeetings);
    await tx.delete(courseMaterials);
    console.log("  course_meetings & course_materials dibersihkan.");

    for (const course of courseRows) {
      const subject = courseToSubject.get(course.courseCode)!;
      await tx
        .update(subjects)
        .set({
          courseCode: course.courseCode,
          sourceSubjectCode: course.sourceSubjectCode,
          fase: course.fase,
          subjectGroup: course.subjectGroup,
          meetingCount: course.meetingCount,
          capaianPembelajaran: course.capaianPembelajaran,
        })
        .where(eq(subjects.id, subject.id));
    }
    console.log(`  subjects diperbarui: ${courseRows.length}`);

    const CHUNK = 500;
    const materialValues = materialRows.map((material) => {
      const subject = courseToSubject.get(material.courseCode)!;
      return {
        subjectId: subject.id,
        meetingNumber: material.meetingNumber,
        title: material.title,
        objective: material.objective,
      };
    });
    for (let index = 0; index < materialValues.length; index += CHUNK) {
      await tx.insert(courseMaterials).values(materialValues.slice(index, index + CHUNK));
    }
    console.log(`  course_materials dimasukkan: ${materialValues.length}`);

    const meetingValues = detailRows.map((detail) => {
      const subject = courseToSubject.get(detail.courseCode)!;
      return {
        subjectId: subject.id,
        classId: classByNorm.get(normalize(detail.classCode))!.id,
        teacherId: teacherByCode.get(detail.teacherCode) ?? null,
        meetingNumber: detail.meetingNumber,
        meetingDate: detail.meetingDate,
        day: detail.day,
      };
    });
    for (let index = 0; index < meetingValues.length; index += CHUNK) {
      await tx.insert(courseMeetings).values(meetingValues.slice(index, index + CHUNK));
    }
    console.log(`  course_meetings dimasukkan: ${meetingValues.length}`);
  });

  console.log("\nImport selesai:");
  console.log(summary);
}

main()
  .catch((error) => {
    console.error("\nImport gagal:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
