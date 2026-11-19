// Tetapkan wali kelas unik: satu guru hanya menjadi wali kelas satu kelas.
//
// Algoritma:
//   1. Minim perubahan: tiap wali kelas existing dipertahankan di satu kelas
//      (kelas terkecil/urut pertama), lalu ditandai terpakai.
//   2. Kelas sisanya diberi guru pengampu (teaching_assignments) dengan
//      kode_guru terkecil yang belum terpakai; fallback ke guru mana pun
//      yang belum terpakai.
//
// Pemakaian:
//   bun run db:fix-advisor --dry-run
//   bun run db:fix-advisor

import { asc, eq, isNotNull } from "drizzle-orm";
import { db } from "../src/db/index";
import {
  classes,
  gradeLevels,
  majors,
  teachingAssignments,
  users,
} from "../src/db/schema";

const DRY_RUN = process.argv.includes("--dry-run");

type ClassRow = {
  id: string;
  name: string;
  advisorId: string | null;
  gradeCode: string | null;
  majorCode: string | null;
};

type TeacherRow = {
  id: string;
  fullName: string;
  kodeGuru: string | null;
};

function orderValue(row: ClassRow): string {
  return `${row.gradeCode ?? ""}|${row.majorCode ?? ""}|${row.name}`;
}

async function main() {
  const classRows = await db
    .select({
      id: classes.id,
      name: classes.name,
      advisorId: classes.advisorId,
      gradeCode: gradeLevels.code,
      majorCode: majors.code,
    })
    .from(classes)
    .leftJoin(gradeLevels, eq(classes.gradeLevelId, gradeLevels.id))
    .leftJoin(majors, eq(classes.majorId, majors.id))
    .orderBy(asc(gradeLevels.code), asc(majors.code), asc(classes.name));

  const teacherRows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      kodeGuru: users.kodeGuru,
    })
    .from(users)
    .where(isNotNull(users.kodeGuru))
    .orderBy(asc(users.kodeGuru));

  const assignmentRows = await db
    .select({
      classId: teachingAssignments.classId,
      teacherId: teachingAssignments.teacherId,
      kodeGuru: users.kodeGuru,
    })
    .from(teachingAssignments)
    .innerJoin(users, eq(teachingAssignments.teacherId, users.id))
    .orderBy(asc(users.kodeGuru));

  const candidatesByClass = new Map<string, string[]>();
  for (const row of assignmentRows) {
    if (!candidatesByClass.has(row.classId)) {
      candidatesByClass.set(row.classId, []);
    }
    candidatesByClass.get(row.classId)!.push(row.teacherId);
  }

  const orderedClasses = [...classRows].sort((first, second) =>
    orderValue(first).localeCompare(orderValue(second))
  );

  const assigned = new Map<string, string>();
  const used = new Set<string>();

  // Fase 1: pertahankan wali kelas existing di satu kelas.
  const classesByAdvisor = new Map<string, ClassRow[]>();
  for (const row of orderedClasses) {
    if (!row.advisorId) continue;
    if (!classesByAdvisor.has(row.advisorId)) {
      classesByAdvisor.set(row.advisorId, []);
    }
    classesByAdvisor.get(row.advisorId)!.push(row);
  }
  for (const [teacherId, advisorClasses] of classesByAdvisor) {
    const keep = advisorClasses[0]!;
    assigned.set(keep.id, teacherId);
    used.add(teacherId);
  }

  // Fase 2: lengkapi kelas sisanya.
  const availableTeachers = teacherRows.map((row) => row.id);
  for (const row of orderedClasses) {
    if (assigned.has(row.id)) continue;

    const candidates = candidatesByClass.get(row.id) ?? [];
    const picked =
      candidates.find((teacherId) => !used.has(teacherId)) ??
      availableTeachers.find((teacherId) => !used.has(teacherId));

    if (!picked) {
      throw new Error(`Tidak ada guru tersisa untuk kelas ${row.name}`);
    }

    assigned.set(row.id, picked);
    used.add(picked);
  }

  const changes: { className: string; from: string; to: string }[] = [];
  for (const row of orderedClasses) {
    const next = assigned.get(row.id)!;
    if (row.advisorId === next) continue;
    const teacher = teacherRows.find((item) => item.id === next);
    changes.push({
      className: row.name,
      from: row.advisorId ?? "-",
      to: teacher?.fullName ?? next,
    });
  }

  const teacherName = (id: string) =>
    teacherRows.find((item) => item.id === id)?.fullName ?? id;

  console.log("\nRingkasan:");
  console.log(`  Kelas            : ${orderedClasses.length}`);
  console.log(`  Wali unik        : ${used.size}`);
  console.log(`  Dipertahankan    : ${orderedClasses.length - changes.length}`);
  console.log(`  Diubah           : ${changes.length}`);
  console.log("\nContoh perubahan:");
  for (const change of changes.slice(0, 10)) {
    console.log(`  ${change.className}: ${change.from} -> ${change.to}`);
  }

  const duplicate = new Map<string, number>();
  for (const teacherId of assigned.values()) {
    duplicate.set(teacherId, (duplicate.get(teacherId) ?? 0) + 1);
  }
  const duplicates = [...duplicate.entries()].filter(([, count]) => count > 1);
  if (duplicates.length) {
    throw new Error(
      `Masih ada guru dengan >1 kelas: ${duplicates
        .map(([id, count]) => `${teacherName(id)} (${count})`)
        .join(", ")}`
    );
  }

  if (DRY_RUN) {
    console.log("\n[DRY-RUN] Tidak ada perubahan database.");
    return;
  }

  console.log("\nMenulis advisor_id...");
  await db.transaction(async (tx) => {
    for (const row of orderedClasses) {
      const next = assigned.get(row.id)!;
      if (row.advisorId === next) continue;
      await tx
        .update(classes)
        .set({ advisorId: next })
        .where(eq(classes.id, row.id));
    }
  });

  console.log(`Selesai. ${changes.length} kelas diperbarui.`);
}

main()
  .catch((error) => {
    console.error("\nGagal:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
