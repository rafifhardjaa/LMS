import { and, eq, or } from "drizzle-orm";
import { db } from "../src/db/index";
import {
  enrollments,
  gradeLevels,
  majors,
  modules,
  reviews,
  subjects,
  teacherSubjects,
  users,
} from "../src/db/schema";

const TKJ_SUBJECTS = [
  { name: "Informatika", code: "INF", grade: "X" },
  { name: "Simulasi dan Komunikasi Digital", code: "SKD", grade: "X" },
  { name: "Sistem Komputer", code: "SKOM", grade: "X" },
  { name: "Komputer dan Jaringan Dasar", code: "KJD", grade: "X" },
  { name: "Pemrograman Dasar", code: "PD", grade: "X" },
  { name: "Dasar Desain Grafis", code: "DDG", grade: "X" },
  { name: "Administrasi Infrastruktur Jaringan (AIJ)", code: "AIJ", grade: "XI" },
  { name: "Administrasi Sistem Jaringan (ASJ)", code: "ASJ", grade: "XI" },
  { name: "Teknologi Layanan Jaringan (TLJ)", code: "TLJ", grade: "XI" },
  { name: "Teknologi Jaringan Berbasis Luas (WAN)", code: "WAN", grade: "XI" },
  { name: "Produk Kreatif dan Kewirausahaan (PKK)", code: "PKK", grade: "XI" },
  { name: "Administrasi Infrastruktur Jaringan (lanjutan)", code: "AIJ-L", grade: "XII" },
  { name: "Administrasi Sistem Jaringan (lanjutan)", code: "ASJ-L", grade: "XII" },
  { name: "Teknologi Layanan Jaringan (lanjutan)", code: "TLJ-L", grade: "XII" },
  { name: "Teknologi Jaringan Berbasis Luas (lanjutan)", code: "WAN-L", grade: "XII" },
  { name: "Produk Kreatif dan Kewirausahaan (lanjutan)", code: "PKK-L", grade: "XII" },
  { name: "PKL / Praktik Kerja Lapangan", code: "PKL", grade: "XII" },
  { name: "Persiapan UKK (Uji Kompetensi Keahlian)", code: "UKK", grade: "XII" },
];

async function main() {
  console.log("🌱 Resetting subjects to TKJ major only...\n");

  const tkj = await db
    .select({ id: majors.id, code: majors.code })
    .from(majors)
    .where(eq(majors.code, "TKJ"))
    .limit(1);
  if (!tkj[0]) throw new Error("TKJ major not found");
  const majorId = tkj[0].id;
  console.log(`  ✓ TKJ major id = ${majorId}`);

  const grades = await db
    .select({ id: gradeLevels.id, code: gradeLevels.code })
    .from(gradeLevels)
    .where(or(
      eq(gradeLevels.code, "X"),
      eq(gradeLevels.code, "XI"),
      eq(gradeLevels.code, "XII")
    ));
  const gradeByCode = new Map(grades.map((g) => [g.code, g.id]));
  for (const code of ["X", "XI", "XII"]) {
    if (!gradeByCode.has(code)) throw new Error(`Grade level "${code}" not found`);
  }
  console.log(`  ✓ Grade levels: X=${gradeByCode.get("X")} XI=${gradeByCode.get("XI")} XII=${gradeByCode.get("XII")}`);

  const admin = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, "admin@simanis.com"))
    .limit(1);
  if (!admin[0]) throw new Error("Admin user not found");
  const createdBy = admin[0].id;
  console.log(`  ✓ Admin user id = ${createdBy}`);

  const existingCount = await db.$count(subjects);
  console.log(`  ℹ Existing subjects: ${existingCount}`);

  console.log("  🗑 Deleting dependent rows + subjects...");
  await db.transaction(async (tx) => {
    await tx.delete(teacherSubjects);
    await tx.delete(modules);
    await tx.delete(enrollments);
    await tx.delete(reviews);
    await tx.delete(subjects);
  });

  console.log(`  📝 Inserting ${TKJ_SUBJECTS.length} TKJ subjects...`);
  await db.insert(subjects).values(
    TKJ_SUBJECTS.map((s) => ({
      name: s.name,
      code: s.code,
      majorId,
      gradeLevelId: gradeByCode.get(s.grade)!,
      semester: "Ganjil",
      academicYear: "2026/2027",
      isActive: true,
      createdBy,
    }))
  );

  const inserted = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      gradeCode: gradeLevels.code,
    })
    .from(subjects)
    .innerJoin(gradeLevels, eq(subjects.gradeLevelId, gradeLevels.id))
    .where(eq(subjects.majorId, majorId))
    .orderBy(gradeLevels.code, subjects.code);

  console.log(`\n✅ Done. ${inserted.length} TKJ subjects inserted.\n`);
  for (const s of inserted) {
    console.log(`   ${s.gradeCode} | ${s.code.padEnd(8)} | ${s.name}`);
  }
}

main()
  .catch((err) => {
    console.error("\n❌ Reset failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
