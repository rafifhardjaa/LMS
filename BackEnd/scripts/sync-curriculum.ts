// Sync majors with Mapel_SMK_per_Jurusan.md
//
// - Renames legacy majors (TKJ -> TJKT, RPL -> PPLG) and refreshes their names.
// - Adds Teknik Kimia Industri (TKI).
// - Idempotent: existing majors are kept, only missing rows are added.
//
// Run: bun run scripts/sync-curriculum.ts

import { eq } from "drizzle-orm";
import { db } from "../src/db/index";
import { majors } from "../src/db/schema";

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
  console.log("Syncing majors from Mapel_SMK_per_Jurusan.md\n");

  for (const seed of MAJOR_SEEDS) {
    const result = await ensureMajor(seed);
    console.log(
      `  ${seed.code.padEnd(5)} ${result.status.padEnd(8)} ${seed.name}`
    );
  }

  const total = await db.$count(majors);
  console.log(`\nDone. Majors in database: ${total}`);
}

main()
  .catch((error) => {
    console.error("\nSync failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
