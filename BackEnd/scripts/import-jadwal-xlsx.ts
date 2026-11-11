// Import jadwal pelajaran, mapel, dan penugasan guru-mapel-kelas dari
// Jadwal_Pelajaran_SMK.xlsx (sheet "Data Jadwal").
//
// Guru TIDAK dibuat ulang: kode_guru pada Excel dicocokkan dengan user guru
// yang sudah ada di database (hasil import Data_User_Guru.xlsx). Script ini
// bersifat destructive untuk subject lama dan jadwal lama: keduanya diganti
// total dengan data dari Excel. Jalankan dengan --dry-run terlebih dahulu
// untuk memvalidasi mapping tanpa menulis ke database.
//
// Pemakaian:
//   bun run db:import-jadwal --dry-run
//   bun run db:import-jadwal

import ExcelJS from "exceljs";
import { eq, isNotNull } from "drizzle-orm";
import { join } from "node:path";
import { db } from "../src/db/index";
import {
  classes,
  gradeLevels,
  jadwalPelajaran,
  majors,
  roles,
  subjects,
  teacherClassrooms,
  teacherSubjects,
  teachingAssignments,
  userRoles,
  users,
} from "../src/db/schema";

const XLSX_PATH = join(import.meta.dir, "..", "..", "Jadwal_Pelajaran_SMK.xlsx");
const SHEET_NAME = "Data Jadwal";
const DRY_RUN = process.argv.includes("--dry-run");

// Jurusan pada Excel -> kode jurusan di database.
const MAJOR_ALIASES: Record<string, string> = {
  TJKT: "TJKT",
  PPLG: "PPLG",
  DKV: "DKV",
  AKL: "AKL",
  "Bisnis Digital": "BDG",
  TKR: "TKR",
  Perhotelan: "HTL",
  Kuliner: "KUL",
  TKI: "TKI",
};

type ScheduleRow = {
  kelas: string;
  tingkat: string;
  jurusan: string;
  rombel: string;
  majorCode: string;
  hari: string;
  sesi: number;
  mulai: string;
  selesai: string;
  durasi: number;
  mapel: string;
  kodeGuru: string;
  namaGuru: string;
};

type CellValue = ExcelJS.CellValue;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function cellText(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "result" in value) {
    return cellText(value.result as CellValue);
  }
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

/** Konversi sel waktu ExcelJS (Date atau serial) menjadi HH:MM:SS. */
function cellTime(value: CellValue): string {
  if (value instanceof Date) {
    return `${pad2(value.getUTCHours())}:${pad2(value.getUTCMinutes())}:00`;
  }
  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60);
    return `${pad2(Math.floor(totalMinutes / 60) % 24)}:${pad2(totalMinutes % 60)}:00`;
  }
  const text = cellText(value);
  const match = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    return `${pad2(Number(match[1]))}:${pad2(Number(match[2]))}:${pad2(Number(match[3] ?? 0))}`;
  }
  throw new Error(`Format waktu tidak dikenali: ${text}`);
}

function timeToMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function abbreviation(value: string): string {
  const cleaned = value.replace(/\([^)]*\)/g, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  const initials = words.map((word) => word[0]).join("").toUpperCase();
  if (initials.length >= 3) return initials.slice(0, 8);
  return cleaned.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 8) || "MAPEL";
}

async function readScheduleRows(): Promise<ScheduleRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(XLSX_PATH);
  const sheet = workbook.getWorksheet(SHEET_NAME);
  if (!sheet) {
    throw new Error(`Sheet "${SHEET_NAME}" tidak ditemukan di ${XLSX_PATH}`);
  }

  const header = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, column) => {
    header.set(cellText(cell.value), column);
  });

  const required = [
    "Kelas",
    "Tingkat",
    "Jurusan",
    "Rombel",
    "Hari",
    "Sesi",
    "Mulai",
    "Selesai",
    "Durasi (menit)",
    "Mapel",
    "Kode Guru",
    "Nama Guru",
  ];
  for (const name of required) {
    if (!header.has(name)) {
      throw new Error(`Kolom "${name}" tidak ditemukan pada sheet ${SHEET_NAME}`);
    }
  }

  const column = (name: string): number => header.get(name)!;
  const rows: ScheduleRow[] = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const kelas = cellText(row.getCell(column("Kelas")).value);
    if (!kelas) continue;

    const tingkat = cellText(row.getCell(column("Tingkat")).value);
    const jurusan = cellText(row.getCell(column("Jurusan")).value);
    const majorCode = MAJOR_ALIASES[jurusan] ?? jurusan;
    const mulai = cellTime(row.getCell(column("Mulai")).value);
    const selesai = cellTime(row.getCell(column("Selesai")).value);
    const durasiCell = row.getCell(column("Durasi (menit)")).value;
    const durasi = cellNumber(durasiCell, timeToMinutes(selesai) - timeToMinutes(mulai));

    rows.push({
      kelas,
      tingkat,
      jurusan,
      rombel: cellText(row.getCell(column("Rombel")).value),
      majorCode,
      hari: cellText(row.getCell(column("Hari")).value),
      sesi: cellNumber(row.getCell(column("Sesi")).value),
      mulai,
      selesai,
      durasi,
      mapel: cellText(row.getCell(column("Mapel")).value),
      kodeGuru: cellText(row.getCell(column("Kode Guru")).value),
      namaGuru: cellText(row.getCell(column("Nama Guru")).value),
    });
  }

  return rows;
}

function classKey(gradeCode: string, majorCode: string, section: string): string {
  return `${gradeCode}|${majorCode}|${section}`;
}

function subjectKey(mapel: string, gradeCode: string, scope: string): string {
  return `${mapel}|${gradeCode}|${scope}`;
}

async function main() {
  console.log(`Membaca ${XLSX_PATH}`);
  const rows = await readScheduleRows();
  console.log(`  ${rows.length} baris jadwal`);

  const majorRows = await db.select({ id: majors.id, code: majors.code }).from(majors);
  const majorIdByCode = new Map(majorRows.map((row) => [row.code, row.id]));

  const gradeRows = await db
    .select({ id: gradeLevels.id, code: gradeLevels.code })
    .from(gradeLevels);
  const gradeIdByCode = new Map(gradeRows.map((row) => [row.code, row.id]));

  const classRows = await db
    .select({
      id: classes.id,
      name: classes.name,
      section: classes.section,
      majorId: classes.majorId,
      gradeLevelId: classes.gradeLevelId,
    })
    .from(classes);
  const classByKey = new Map(
    classRows.map((row) => [
      classKey(
        gradeRows.find((grade) => grade.id === row.gradeLevelId)?.code ?? "",
        majorRows.find((major) => major.id === row.majorId)?.code ?? "",
        row.section
      ),
      row,
    ])
  );

  // Nama kelas mengikuti penulisan Excel (mis. "X Bisnis Digital A").
  const excelClassNameByKey = new Map<string, string>();
  for (const row of rows) {
    excelClassNameByKey.set(
      classKey(row.tingkat, row.majorCode, row.rombel),
      row.kelas
    );
  }

  // Kelompokkan mapel per tingkat untuk menentukan mapel umum vs kejuruan.
  const majorsBySubject = new Map<string, Set<string>>();
  for (const row of rows) {
    const key = `${row.mapel}|${row.tingkat}`;
    const set = majorsBySubject.get(key) ?? new Set<string>();
    set.add(row.majorCode);
    majorsBySubject.set(key, set);
  }

  const subjectEntities = new Map<
    string,
    {
      name: string;
      gradeCode: string;
      majorCode: string | null;
      gradeLevelId: string;
      majorId: string | null;
    }
  >();
  for (const row of rows) {
    const gradeLevelId = gradeIdByCode.get(row.tingkat);
    if (!gradeLevelId) throw new Error(`Tingkat tidak ditemukan: ${row.tingkat}`);
    const isGeneral = (majorsBySubject.get(`${row.mapel}|${row.tingkat}`)?.size ?? 0) > 1;
    const majorCode = isGeneral ? null : row.majorCode;
    const majorId = majorCode ? majorIdByCode.get(majorCode) ?? null : null;
    if (majorCode && !majorId) throw new Error(`Jurusan tidak ditemukan: ${majorCode}`);
    const scope = majorCode ?? "GEN";
    subjectEntities.set(subjectKey(row.mapel, row.tingkat, scope), {
      name: row.mapel,
      gradeCode: row.tingkat,
      majorCode,
      gradeLevelId,
      majorId,
    });
  }

  const teacherByCode = new Map<string, string>();
  for (const row of rows) {
    if (!row.kodeGuru) throw new Error(`Kode guru kosong untuk ${row.namaGuru}`);
    const existing = teacherByCode.get(row.kodeGuru);
    if (existing && existing !== row.namaGuru) {
      throw new Error(`Kode guru ${row.kodeGuru} dipakai lebih dari satu nama`);
    }
    teacherByCode.set(row.kodeGuru, row.namaGuru);
  }

  const teachingTriples = new Map<
    string,
    { kodeGuru: string; subjectKey: string; classId: string; classKey: string }
  >();
  const teacherSlotCounts = new Map<string, number>();
  const classSlotCounts = new Map<string, number>();

  for (const row of rows) {
    const key = classKey(row.tingkat, row.majorCode, row.rombel);
    const classRow = classByKey.get(key);
    if (!classRow) throw new Error(`Kelas tidak ditemukan: ${row.kelas} (${key})`);
    const majorsForSubject = majorsBySubject.get(`${row.mapel}|${row.tingkat}`);
    const isGeneral = (majorsForSubject?.size ?? 0) > 1;
    const sKey = subjectKey(row.mapel, row.tingkat, isGeneral ? "GEN" : row.majorCode);
    if (!subjectEntities.has(sKey)) throw new Error(`Subject tidak ditemukan: ${sKey}`);

    teachingTriples.set(`${row.kodeGuru}|${sKey}|${classRow.id}`, {
      kodeGuru: row.kodeGuru,
      subjectKey: sKey,
      classId: classRow.id,
      classKey: key,
    });

    const teacherSlot = `${row.kodeGuru}|${row.hari}|${row.sesi}`;
    teacherSlotCounts.set(teacherSlot, (teacherSlotCounts.get(teacherSlot) ?? 0) + 1);
    const classSlot = `${classRow.id}|${row.hari}|${row.sesi}`;
    classSlotCounts.set(classSlot, (classSlotCounts.get(classSlot) ?? 0) + 1);
  }

  const teacherConflicts = [...teacherSlotCounts.values()].reduce(
    (total, count) => total + Math.max(0, count - 1),
    0
  );
  const classConflicts = [...classSlotCounts.values()].reduce(
    (total, count) => total + Math.max(0, count - 1),
    0
  );

  console.log(`  Guru unik: ${teacherByCode.size}`);
  console.log(`  Subject unik: ${subjectEntities.size}`);
  console.log(`  Penugasan unik: ${teachingTriples.size}`);
  console.log(`  Bentrok kelas: ${classConflicts}`);
  console.log(`  Bentrok guru: ${teacherConflicts}`);

  if (teacherConflicts > 0) {
    throw new Error(`Data Excel memiliki ${teacherConflicts} bentrok guru`);
  }
  if (classConflicts > 0) {
    throw new Error(`Data Excel memiliki ${classConflicts} bentrok kelas`);
  }

  if (DRY_RUN) {
    console.log("\nDry run selesai. Tidak ada data yang diubah.");
    return;
  }

  const adminRows = await db
    .select({ id: users.id })
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(eq(roles.name, "admin"))
    .limit(1);
  const adminId = adminRows[0]?.id;
  if (!adminId) throw new Error("User admin tidak ditemukan");

  // Guru TIDAK dibuat ulang: cocokkan kode_guru Excel dengan user guru yang
  // sudah ada di database (hasil import Data_User_Guru.xlsx).
  const guruRows = await db
    .select({
      id: users.id,
      kodeGuru: users.kodeGuru,
      fullName: users.fullName,
    })
    .from(users)
    .where(isNotNull(users.kodeGuru));
  const teacherIdByCode = new Map(
    guruRows.map((row) => [row.kodeGuru ?? "", row.id])
  );

  const missingTeachers = [...teacherByCode.keys()].filter(
    (kodeGuru) => !teacherIdByCode.has(kodeGuru)
  );
  if (missingTeachers.length > 0) {
    throw new Error(
      `Kode guru di Excel tidak ada di database: ${missingTeachers.join(", ")}`
    );
  }

  const nameMismatches = [...teacherByCode.entries()].filter(
    ([kodeGuru, namaGuru]) =>
      (guruRows.find((row) => row.kodeGuru === kodeGuru)?.fullName ?? "") !==
      namaGuru
  );
  if (nameMismatches.length > 0) {
    console.warn(
      `\nPeringatan: ${nameMismatches.length} nama guru beda dengan database:`
    );
    for (const [kodeGuru, namaGuru] of nameMismatches) {
      const dbName =
        guruRows.find((row) => row.kodeGuru === kodeGuru)?.fullName ?? "-";
      console.warn(`  ${kodeGuru}: Excel="${namaGuru}" vs DB="${dbName}"`);
    }
  }

  const usedSubjectCodes = new Set<string>();
  const subjectEntries = [...subjectEntities.entries()];
  const subjectValues = subjectEntries.map(([key, entity]) => {
    const scope = entity.majorCode ?? "GEN";
    const base = `${abbreviation(entity.name)}-${entity.gradeCode}-${scope}`;
    let code = base.slice(0, 90);
    let suffix = 2;
    while (usedSubjectCodes.has(`${code}|${entity.gradeLevelId}`)) {
      code = `${base.slice(0, 85)}-${suffix}`;
      suffix += 1;
    }
    usedSubjectCodes.add(`${code}|${entity.gradeLevelId}`);
    return {
      entityKey: key,
      name: entity.name,
      code,
      majorId: entity.majorId,
      gradeLevelId: entity.gradeLevelId,
      semester: "Ganjil",
      createdBy: adminId,
    };
  });

  let insertedSubjects = 0;
  let insertedAssignments = 0;
  let insertedSchedules = 0;

  await db.transaction(async (tx) => {
    console.log("\nMenghapus data lama...");
    await tx.delete(jadwalPelajaran);
    await tx.delete(teachingAssignments);
    await tx.delete(teacherSubjects);
    await tx.delete(teacherClassrooms);
    await tx.delete(subjects);

    console.log("Menyesuaikan nama kelas dengan Excel...");
    for (const [key, excelName] of excelClassNameByKey) {
      const classRow = classByKey.get(key);
      if (!classRow) throw new Error(`Kelas tidak ditemukan: ${key}`);
      if (classRow.name !== excelName) {
        await tx.update(classes).set({ name: excelName }).where(eq(classes.id, classRow.id));
      }
    }

    console.log(`Menyisipkan ${subjectValues.length} subject...`);
    const insertedSubjectRows = await tx
      .insert(subjects)
      .values(
        subjectValues.map(({ entityKey: _entityKey, ...value }) => value)
      )
      .returning({
        id: subjects.id,
        name: subjects.name,
        gradeLevelId: subjects.gradeLevelId,
        majorId: subjects.majorId,
      });
    insertedSubjects = insertedSubjectRows.length;
    const subjectIdByEntityKey = new Map<string, string>();
    for (const [key, entity] of subjectEntries) {
      const found = insertedSubjectRows.find(
        (row) =>
          row.name === entity.name &&
          row.gradeLevelId === entity.gradeLevelId &&
          (row.majorId ?? null) === entity.majorId
      );
      if (!found) throw new Error(`Subject hasil insert tidak ditemukan: ${key}`);
      subjectIdByEntityKey.set(key, found.id);
    }

    const assignmentValues = [...teachingTriples.values()].map((triple) => {
      const teacherId = teacherIdByCode.get(triple.kodeGuru);
      if (!teacherId) throw new Error(`Guru tidak ditemukan: ${triple.kodeGuru}`);
      const subjectId = subjectIdByEntityKey.get(triple.subjectKey);
      if (!subjectId) throw new Error(`Subject tidak ditemukan: ${triple.subjectKey}`);
      return { teacherId, subjectId, classId: triple.classId };
    });
    console.log(`Menyisipkan ${assignmentValues.length} penugasan...`);
    await tx.insert(teachingAssignments).values(assignmentValues).onConflictDoNothing();
    insertedAssignments = assignmentValues.length;

    const scheduleValues = rows.map((row) => {
      const key = classKey(row.tingkat, row.majorCode, row.rombel);
      const classRow = classByKey.get(key);
      if (!classRow) throw new Error(`Kelas tidak ditemukan: ${row.kelas}`);
      const teacherId = teacherIdByCode.get(row.kodeGuru);
      if (!teacherId) throw new Error(`Guru tidak ditemukan: ${row.kodeGuru}`);
      const majorsForSubject = majorsBySubject.get(`${row.mapel}|${row.tingkat}`);
      const isGeneral = (majorsForSubject?.size ?? 0) > 1;
      const sKey = subjectKey(row.mapel, row.tingkat, isGeneral ? "GEN" : row.majorCode);
      const subjectId = subjectIdByEntityKey.get(sKey);
      if (!subjectId) throw new Error(`Subject tidak ditemukan: ${sKey}`);

      const start = timeToMinutes(row.mulai);
      const end = timeToMinutes(row.selesai);
      const classSlot = `${classRow.id}|${row.hari}|${row.sesi}`;
      const bentrokKelas = Math.max(0, (classSlotCounts.get(classSlot) ?? 1) - 1);
      const jatuhDiIstirahat =
        (start < 9 * 60 + 15 && end > 9 * 60 ? 1 : 0) +
        (start < 12 * 60 + 15 && end > 12 * 60 ? 1 : 0);

      return {
        classId: classRow.id,
        subjectId,
        teacherId,
        gradeLevelId: classRow.gradeLevelId,
        majorId: classRow.majorId,
        hari: row.hari,
        sesi: row.sesi,
        mulai: row.mulai,
        selesai: row.selesai,
        durasi: row.durasi,
        bentrokKelas,
        durasiLebihDari90: row.durasi > 90 ? 1 : 0,
        diLuarJamKerja: start < 7 * 60 || end > 15 * 60 ? 1 : 0,
        jatuhDiIstirahat,
      };
    });

    console.log(`Menyisipkan ${scheduleValues.length} jadwal...`);
    const CHUNK_SIZE = 500;
    for (let index = 0; index < scheduleValues.length; index += CHUNK_SIZE) {
      await tx
        .insert(jadwalPelajaran)
        .values(scheduleValues.slice(index, index + CHUNK_SIZE));
    }
    insertedSchedules = scheduleValues.length;

    const derivedSubjects = new Map<string, { teacherId: string; subjectId: string }>();
    for (const value of assignmentValues) {
      derivedSubjects.set(`${value.teacherId}|${value.subjectId}`, {
        teacherId: value.teacherId,
        subjectId: value.subjectId,
      });
    }
    const derivedClasses = new Map<string, { teacherId: string; classId: string }>();
    for (const value of assignmentValues) {
      derivedClasses.set(`${value.teacherId}|${value.classId}`, {
        teacherId: value.teacherId,
        classId: value.classId,
      });
    }

    console.log("Membangun ulang teacher_subjects & teacher_classrooms...");
    await tx
      .insert(teacherSubjects)
      .values([...derivedSubjects.values()])
      .onConflictDoNothing();
    await tx
      .insert(teacherClassrooms)
      .values([...derivedClasses.values()])
      .onConflictDoNothing();

    console.log(`  teacher_subjects: ${derivedSubjects.size}`);
    console.log(`  teacher_classrooms: ${derivedClasses.size}`);
  });

  console.log("\nImport selesai:");
  console.log(`  Subject    : ${insertedSubjects}`);
  console.log(`  Penugasan  : ${insertedAssignments}`);
  console.log(`  Jadwal     : ${insertedSchedules}`);
  console.log("\nJalankan verifikasi SQL untuk memastikan jumlah dan bentrok sesuai.");
}

main()
  .catch((error) => {
    console.error("\nImport gagal:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
