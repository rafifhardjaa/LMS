// Seed jadwal_pelajaran from xlsx data
//
// Reads BackEnd/scripts/jadwal-pelajaran-data.json
// Maps xlsx rows to jadwal_pelajaran table
// Run: bun run scripts/seed-jadwal-pelajaran.ts

import { eq } from "drizzle-orm";
import { db } from "../src/db/index";
import { classes, subjects, majors, gradeLevels, jadwalPelajaran } from "../src/db/schema";
import * as fs from "fs";
import * as path from "path";

const DATA_FILE = path.join(__dirname, "jadwal-pelajaran-data.json");

// Map xlsx subject name -> DB subject name (for abbreviated/short forms)
const SUBJECT_ALIASES: Record<string, string> = {
  // TJKT / PPLG / DKV / AKL / BDG / HTL / KUL / TKR / TKI - abbreviated dasar subjects
  "Dasar-dasar TJKT": "Dasar-dasar Teknik Jaringan Komputer dan Telekomunikasi",
  "Dasar-dasar PPLG": "Dasar-dasar Pengembangan Perangkat Lunak dan Gim",
  "Dasar-dasar DKV": "Dasar-dasar Desain Komunikasi Visual",
  "Dasar-dasar AKL": "Dasar-dasar Akuntansi dan Keuangan Lembaga",
  "Dasar-dasar Bisnis Digital": "Dasar Bisnis Digital",
  "Dasar-dasar Perhotelan": "Dasar Perhotelan",
  "Dasar-dasar Kuliner": "Dasar-dasar Kuliner",
  "Dasar-dasar Teknik Otomotif": "Dasar-dasar Teknik Otomotif",
  "Dasar-dasar Teknik Kimia Industri": "Dasar-dasar Teknik Kimia Industri",

  // General subjects
  "Pendidikan Agama dan Budi Pekerti": "Pendidikan Agama",
  "Muatan Lokal (Bahasa Jawa)": "Muatan Lokal (misalnya Bahasa Jawa)",
  "Projek Kreatif dan Kewirausahaan (PKK)": "Prakarya dan Kewirausahaan",
  "PKL (Bimbingan)": "PKL / Praktik Kerja Lapangan",
  "Persiapan UKK": "Persiapan UKK (Uji Kompetensi Keahlian)",

  // TJKT XII lanjutan subjects (all map to generic lanjutan)
  "Lanjutan Teknologi Layanan Jaringan": "Lanjutan Mapel Konsentrasi Kelas XI",
  "Lanjutan Teknologi Jaringan Berbasis Luas": "Lanjutan Mapel Konsentrasi Kelas XI",
  "Lanjutan Administrasi Sistem Jaringan": "Lanjutan Mapel Konsentrasi Kelas XI",
  "Lanjutan Administrasi Infrastruktur Jaringan": "Lanjutan Mapel Konsentrasi Kelas XI",

  // Other
  "PKL (Praktik Kerja Lapangan)": "PKL / Praktik Kerja Lapangan",
  "Persiapan UKK (Uji Kompetensi Keahlian)": "Persiapan UKK (Uji Kompetensi Keahlian)",
};

// Map xlsx jurusan name -> DB major code
const MAJOR_NAME_TO_CODE: Record<string, string> = {
  "AKL": "AKL",
  "Bisnis Digital": "BDG",
  "DKV": "DKV",
  "Perhotelan": "HTL",
  "Kuliner": "KUL",
  "PPLG": "PPLG",
  "TJKT": "TJKT",
  "TKI": "TKI",
  "TKR": "TKR",
};

function timeToString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

function timeToMinutes(timeStr: string | null | undefined): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function normalizeSubjectName(name: string): string {
  return name.trim().toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("Seeding jadwal_pelajaran from xlsx data...\n");

  const DATA_FILE = path.join(__dirname, "jadwal-pelajaran-data.json");
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Data file not found: ${DATA_FILE}`);
  }
  const { rows } = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  console.log(`Loaded ${rows.length} rows from ${DATA_FILE}`);

  // Fetch classes with major + gradeLevel
  const classRows = await db
    .select({
      classId: classes.id,
      className: classes.name,
      classSection: classes.section,
      majorId: classes.majorId,
      gradeLevelId: classes.gradeLevelId,
      majorCode: majors.code,
      gradeLevelCode: gradeLevels.code,
    })
    .from(classes)
    .innerJoin(majors, eq(classes.majorId, majors.id))
    .innerJoin(gradeLevels, eq(classes.gradeLevelId, gradeLevels.id));

  const classMap = new Map<string, { id: string }>();
  for (const row of classRows) {
    const key = `${row.gradeLevelCode} ${row.majorCode}`;
    classMap.set(key, { id: row.classId });
  }

  const subjectRows = await db.select().from(subjects);
  const subjectMap = new Map<string, string>();
  for (const s of subjectRows) {
    subjectMap.set(s.name, s.id);
    const normalized = normalizeSubjectName(s.name);
    subjectMap.set(normalized, s.id);
  }

  const majorRows = await db.select().from(majors);
  const majorMap = new Map<string, string>();
  for (const m of majorRows) majorMap.set(m.code, m.id);

  const gradeRows = await db.select().from(gradeLevels);
  const gradeMap = new Map<string, string>();
  for (const g of gradeRows) gradeMap.set(g.code, g.id);

  function resolveSubject(mapelName: string): string | null {
    const alias = SUBJECT_ALIASES[mapelName];
    if (alias) {
      const id = subjectMap.get(alias);
      if (id) return id;
    }
    const direct = subjectMap.get(mapelName);
    if (direct) return direct;
    const normalized = normalizeSubjectName(mapelName);
    const normId = subjectMap.get(normalized);
    if (normId) return normId;
    const lower = mapelName.toLowerCase();
    for (const [name, id] of subjectMap.entries()) {
      if (name.toLowerCase() === lower) return id;
    }
    return null;
  }

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      const kelas = String(row["Kelas"]);
      const tingkat = String(row["Tingkat"]);
      const jurusan = String(row["Jurusan"]);
      const hari = String(row["Hari"]);
      const sesi = Number(row["Sesi"]);
      const mulai = row["Mulai"];
      const selesai = row["Selesai"];
      const durasi = Number(row["Durasi (menit)"]);
      const mapel = String(row["Mapel"]);
      const bentrokKelas = Number(row["Bentrok Kelas"] || 0);
      const durasiLebihDari90 = Number(row["Durasi >90"] || 0);
      const diLuarJamKerja = Number(row["Di Luar 07:00-15:00"] || 0);
      const jatuhDiIstirahat = Number(row["Jatuh di Istirahat"] || 0);

      // kelas format: "X TKJ" (grade + majorName/code)
      const parts = kelas.split(" ");
      const grade = parts[0];
      const jurusanOrCode = parts.slice(1).join(" ");
      if (!grade || !jurusanOrCode) {
        errors.push(`Invalid kelas: ${kelas}`);
        skipped++;
        continue;
      }

      // Map jurusan name to code (e.g., "Bisnis Digital" -> "BDG")
      const majorCode = MAJOR_NAME_TO_CODE[jurusanOrCode] ?? jurusanOrCode;
      const classKey = `${grade} ${majorCode}`;
      const classEntry = classMap.get(classKey);
      if (!classEntry) {
        errors.push(`Class not found: ${classKey}`);
        skipped++;
        continue;
      }

      const subjectId = resolveSubject(mapel);
      if (!subjectId) {
        errors.push(`Subject not found: "${mapel}" (major: ${majorCode}, grade: ${grade})`);
        skipped++;
        continue;
      }

      const majorId = majorMap.get(majorCode);
      if (!majorId) {
        errors.push(`Major not found: ${majorCode}`);
        skipped++;
        continue;
      }

      const gradeLevelId = gradeMap.get(tingkat);
      if (!gradeLevelId) {
        errors.push(`Grade level not found: ${tingkat}`);
        skipped++;
        continue;
      }

      await db.insert(jadwalPelajaran).values({
        classId: classEntry.id,
        subjectId,
        gradeLevelId,
        majorId,
        hari,
        sesi,
        mulai: timeToString(timeToMinutes(mulai)),
        selesai: timeToString(timeToMinutes(selesai)),
        durasi,
        bentrokKelas,
        durasiLebihDari90,
        diLuarJamKerja,
        jatuhDiIstirahat,
      });
      inserted++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Row error: ${msg}`);
      skipped++;
    }
  }

  console.log(`\n✅ Inserted: ${inserted}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  if (errors.length) {
    console.log(`\n❌ Errors (${errors.length}):`);
    for (const e of errors.slice(0, 30)) console.log(`   - ${e}`);
    if (errors.length > 30) console.log(`   ... and ${errors.length - 30} more`);
  }
}

main()
  .catch((err) => {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));