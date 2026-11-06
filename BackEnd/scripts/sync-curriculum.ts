// Sync majors + subjects with Mapel_SMK_per_Jurusan.md
//
// - Renames legacy majors (TKJ -> TJKT, RPL -> PPLG) and refreshes their names.
// - Adds Teknik Kimia Industri (TKI).
// - Adds every subject from the curriculum reference that is not yet present.
// - Idempotent: existing majors/subjects are kept, only missing rows are added.
//
// Run: bun run scripts/sync-curriculum.ts

import { eq } from "drizzle-orm";
import { db } from "../src/db/index";
import { gradeLevels, majors, subjects, users } from "../src/db/schema";

type GradeCode = "X" | "XI" | "XII";
type SubjectSeed = { name: string; grade: GradeCode };

const MAJOR_SEEDS: {
  code: string;
  name: string;
  legacyCode?: string;
}[] = [
  {
    code: "TJKT",
    name: "Teknik Jaringan Komputer dan Telekomunikasi",
    legacyCode: "TKJ",
  },
  {
    code: "PPLG",
    name: "Pengembangan Perangkat Lunak dan Gim",
    legacyCode: "RPL",
  },
  { code: "DKV", name: "Desain Komunikasi Visual" },
  { code: "AKL", name: "Akuntansi dan Keuangan Lembaga" },
  { code: "BDG", name: "Bisnis Digital" },
  { code: "TKR", name: "Teknik Kendaraan Ringan Otomotif" },
  { code: "HTL", name: "Perhotelan dan Jasa Pariwisata" },
  { code: "KUL", name: "Kuliner dan Tata Boga" },
  { code: "TKI", name: "Teknik Kimia Industri" },
];

const GENERAL_SUBJECTS: SubjectSeed[] = [
  // Mapel umum - Kelas X
  { name: "Pendidikan Agama dan Budi Pekerti", grade: "X" },
  { name: "Pendidikan Pancasila", grade: "X" },
  { name: "Bahasa Indonesia", grade: "X" },
  { name: "PJOK", grade: "X" },
  { name: "Sejarah", grade: "X" },
  { name: "Seni Budaya", grade: "X" },
  { name: "Muatan Lokal (misalnya Bahasa Jawa)", grade: "X" },
  // Mapel umum - Kelas XI
  { name: "Pendidikan Agama dan Budi Pekerti", grade: "XI" },
  { name: "Pendidikan Pancasila", grade: "XI" },
  { name: "Bahasa Indonesia", grade: "XI" },
  { name: "PJOK", grade: "XI" },
  { name: "Sejarah", grade: "XI" },
  // Mapel umum - Kelas XII
  { name: "Pendidikan Agama dan Budi Pekerti", grade: "XII" },
  { name: "Pendidikan Pancasila", grade: "XII" },
  { name: "Bahasa Indonesia", grade: "XII" },
  { name: "PJOK", grade: "XII" },
  // Mapel kejuruan yang sama untuk semua jurusan
  { name: "Matematika", grade: "X" },
  { name: "Bahasa Inggris", grade: "X" },
  { name: "Informatika", grade: "X" },
  { name: "Projek IPAS", grade: "X" },
  { name: "Dasar-dasar Program Keahlian", grade: "X" },
  { name: "Projek Kreatif dan Kewirausahaan (PKK)", grade: "X" },
  { name: "Matematika", grade: "XI" },
  { name: "Bahasa Inggris", grade: "XI" },
  { name: "Projek Kreatif dan Kewirausahaan (PKK)", grade: "XI" },
  { name: "Bahasa Inggris", grade: "XII" },
  { name: "Projek Kreatif dan Kewirausahaan (PKK)", grade: "XII" },
  { name: "PKL / Praktik Kerja Lapangan", grade: "XII" },
  { name: "Persiapan UKK (Uji Kompetensi Keahlian)", grade: "XII" },
];

const MAJOR_SUBJECTS: Record<string, SubjectSeed[]> = {
  TJKT: [
    { name: "Dasar-dasar Teknik Jaringan Komputer dan Telekomunikasi", grade: "X" },
    { name: "Administrasi Infrastruktur Jaringan", grade: "XI" },
    { name: "Administrasi Sistem Jaringan", grade: "XI" },
    { name: "Teknologi Layanan Jaringan", grade: "XI" },
    { name: "Teknologi Jaringan Berbasis Luas", grade: "XI" },
    { name: "Lanjutan Mapel Konsentrasi Kelas XI", grade: "XII" },
    { name: "Keamanan Jaringan", grade: "XII" },
  ],
  PPLG: [
    { name: "Dasar-dasar Pengembangan Perangkat Lunak dan Gim", grade: "X" },
    { name: "Pemrograman Berorientasi Objek", grade: "XI" },
    { name: "Basis Data", grade: "XI" },
    { name: "Pemrograman Web dan Perangkat Bergerak", grade: "XI" },
    { name: "Lanjutan Pemrograman Web dan Perangkat Bergerak", grade: "XII" },
    { name: "Pemrograman Gim", grade: "XII" },
  ],
  DKV: [
    { name: "Dasar-dasar Desain Komunikasi Visual", grade: "X" },
    { name: "Desain Grafis Percetakan", grade: "XI" },
    { name: "Fotografi", grade: "XI" },
    { name: "Desain Media Interaktif", grade: "XI" },
    { name: "Animasi 2D dan 3D", grade: "XII" },
    { name: "Videografi", grade: "XII" },
  ],
  AKL: [
    { name: "Dasar-dasar Akuntansi dan Keuangan Lembaga", grade: "X" },
    { name: "Akuntansi Keuangan", grade: "XI" },
    { name: "Komputer Akuntansi", grade: "XI" },
    { name: "Administrasi Pajak", grade: "XI" },
    { name: "Lanjutan Akuntansi Keuangan", grade: "XII" },
    { name: "Akuntansi Lembaga/Instansi Pemerintah", grade: "XII" },
    { name: "Lanjutan Komputer Akuntansi", grade: "XII" },
  ],
  BDG: [
    { name: "Dasar-dasar Bisnis Digital", grade: "X" },
    { name: "Bisnis Online", grade: "XI" },
    { name: "Digital Marketing", grade: "XI" },
    { name: "Pemasaran", grade: "XI" },
    { name: "Pengelolaan Bisnis Ritel", grade: "XII" },
    { name: "Lanjutan Digital Marketing", grade: "XII" },
    { name: "Komunikasi Bisnis", grade: "XII" },
  ],
  TKR: [
    { name: "Dasar-dasar Teknik Otomotif", grade: "X" },
    { name: "Pemeliharaan Mesin Kendaraan Ringan", grade: "XI" },
    { name: "Pemeliharaan Sasis dan Pemindah Tenaga", grade: "XI" },
    { name: "Pemeliharaan Kelistrikan Kendaraan Ringan", grade: "XII" },
    { name: "Lanjutan Mesin dan Sasis", grade: "XII" },
  ],
  HTL: [
    { name: "Dasar-dasar Perhotelan", grade: "X" },
    { name: "Front Office", grade: "XI" },
    { name: "Housekeeping", grade: "XI" },
    { name: "Food and Beverage Service", grade: "XI" },
    { name: "Lanjutan Layanan Akomodasi", grade: "XII" },
    { name: "Lanjutan Food and Beverage Service", grade: "XII" },
  ],
  KUL: [
    { name: "Dasar-dasar Kuliner", grade: "X" },
    { name: "Pengolahan Makanan Indonesia", grade: "XI" },
    { name: "Pengolahan Makanan Kontinental", grade: "XI" },
    { name: "Pengolahan Kue dan Roti", grade: "XI" },
    { name: "Penyajian Makanan dan Minuman", grade: "XII" },
    { name: "Lanjutan Pengolahan Kue dan Roti", grade: "XII" },
  ],
  TKI: [
    { name: "Dasar-dasar Teknik Kimia Industri", grade: "X" },
    { name: "Kimia Analisis", grade: "XI" },
    { name: "Proses Kimia Industri", grade: "XI" },
    { name: "Pengendalian Proses Industri", grade: "XII" },
    { name: "Pengujian dan Analisis Mutu", grade: "XII" },
  ],
};

function normalizeName(raw: string) {
  let value = raw.toLowerCase();
  value = value.replace(/\([^)]*\)/g, " ");
  value = value.replace(/[^a-z0-9]+/g, " ");
  value = value.replace(/\bdasar dasar\b/g, "dasar");
  value = value.replace(/\s+/g, " ").trim();

  if (value === "pendidikan agama dan budi pekerti") return "pendidikan agama";
  if (
    value === "prakarya dan kewirausahaan" ||
    value === "projek kreatif dan kewirausahaan" ||
    value === "proyek kreatif dan kewirausahaan"
  ) {
    return "pkk";
  }
  if (value === "muatan lokal misalnya bahasa jawa") return "muatan lokal";

  return value;
}

function buildCodeBase(name: string) {
  const words = name
    .replace(/\([^)]*\)/g, " ")
    .split(/[^A-Za-z0-9]+/)
    .filter((word) => word && !/^(dan|atau|di|ke|dari|untuk|pada|yang)$/i.test(word));

  let base = words.map((word) => word[0]).join("").toUpperCase();
  if (base.length < 3) {
    base = words.map((word) => word.slice(0, 2)).join("").toUpperCase();
  }
  return base.slice(0, 10) || "MAPEL";
}

async function ensureMajor(seed: (typeof MAJOR_SEEDS)[number]) {
  const byCode = await db
    .select({ id: majors.id, name: majors.name })
    .from(majors)
    .where(eq(majors.code, seed.code))
    .limit(1);

  if (byCode[0]) {
    if (byCode[0].name !== seed.name) {
      await db
        .update(majors)
        .set({ name: seed.name, updatedAt: new Date() })
        .where(eq(majors.id, byCode[0].id));
    }
    return { id: byCode[0].id, status: "exists" as const };
  }

  if (seed.legacyCode) {
    const legacy = await db
      .select({ id: majors.id })
      .from(majors)
      .where(eq(majors.code, seed.legacyCode))
      .limit(1);
    if (legacy[0]) {
      await db
        .update(majors)
        .set({
          code: seed.code,
          name: seed.name,
          updatedAt: new Date(),
        })
        .where(eq(majors.id, legacy[0].id));
      return { id: legacy[0].id, status: "renamed" as const };
    }
  }

  const inserted = await db
    .insert(majors)
    .values({ code: seed.code, name: seed.name })
    .returning({ id: majors.id });

  return { id: inserted[0]!.id, status: "created" as const };
}

async function main() {
  console.log("Syncing majors + subjects from Mapel_SMK_per_Jurusan.md\n");

  const majorIds = new Map<string, string>();
  for (const seed of MAJOR_SEEDS) {
    const result = await ensureMajor(seed);
    majorIds.set(seed.code, result.id);
    console.log(
      `  Major ${seed.code.padEnd(5)} ${result.status.padEnd(8)} ${seed.name}`
    );
  }

  const admin = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, "admin@simanis.com"))
    .limit(1);
  if (!admin[0]) throw new Error("Admin user not found");
  const createdBy = admin[0].id;

  const grades = await db
    .select({ id: gradeLevels.id, code: gradeLevels.code })
    .from(gradeLevels);
  const gradeById = new Map(grades.map((grade) => [grade.code, grade.id]));
  for (const code of ["X", "XI", "XII"] as GradeCode[]) {
    if (!gradeById.has(code)) throw new Error(`Grade level "${code}" not found`);
  }

  const existing = await db
    .select({
      name: subjects.name,
      code: subjects.code,
      majorId: subjects.majorId,
      gradeLevelId: subjects.gradeLevelId,
    })
    .from(subjects);

  const existingKeys = new Set<string>();
  const usedCodes = new Set<string>();
  for (const row of existing) {
    if (!row.gradeLevelId) continue;
    existingKeys.add(
      `${row.majorId ?? "general"}|${row.gradeLevelId}|${normalizeName(row.name)}`
    );
    usedCodes.add(`${row.code}|${row.gradeLevelId}`);
  }

  const rowsToInsert: {
    name: string;
    code: string;
    majorId: string | null;
    gradeLevelId: string;
    semester: string;
    isActive: boolean;
    createdBy: string;
  }[] = [];

  const plan = [
    ...GENERAL_SUBJECTS.map((seed) => ({ ...seed, majorCode: null as string | null })),
    ...Object.entries(MAJOR_SUBJECTS).flatMap(([majorCode, seeds]) =>
      seeds.map((seed) => ({ ...seed, majorCode }))
    ),
  ];

  for (const item of plan) {
    const gradeLevelId = gradeById.get(item.grade)!;
    const majorId = item.majorCode ? majorIds.get(item.majorCode) ?? null : null;
    const key = `${majorId ?? "general"}|${gradeLevelId}|${normalizeName(item.name)}`;
    if (existingKeys.has(key)) continue;

    const codeBase = buildCodeBase(item.name);
    let code = `${codeBase}-${item.grade}`;
    let suffix = 2;
    while (usedCodes.has(`${code}|${gradeLevelId}`)) {
      code = `${codeBase}-${item.grade}-${suffix++}`;
    }

    existingKeys.add(key);
    usedCodes.add(`${code}|${gradeLevelId}`);
    rowsToInsert.push({
      name: item.name,
      code,
      majorId,
      gradeLevelId,
      semester: "Ganjil",
      isActive: true,
      createdBy,
    });
  }

  if (rowsToInsert.length) {
    await db.insert(subjects).values(rowsToInsert);
  }

  console.log(`\nInserted ${rowsToInsert.length} new subject(s):`);
  for (const row of rowsToInsert) {
    const majorCode =
      [...majorIds.entries()].find(([, id]) => id === row.majorId)?.[0] ?? "UMUM";
    const gradeCode =
      [...gradeById.entries()].find(([, id]) => id === row.gradeLevelId)?.[0] ?? "?";
    console.log(
      `  ${majorCode.padEnd(5)} ${gradeCode.padEnd(3)} ${row.code.padEnd(14)} ${row.name}`
    );
  }

  const majorTotal = await db.$count(majors);
  const subjectTotal = await db.$count(subjects);
  console.log(
    `\nDone. Majors in database: ${majorTotal}. Subjects in database: ${subjectTotal}`
  );
}

main()
  .catch((error) => {
    console.error("\nSync failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
