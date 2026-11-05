// Backfill default passwords for active users (guru/siswa/admin-managed accounts)
// that have nomor_induk + tanggal_lahir but no password_hash.
//
// Default password formula (must match BackEnd/src/lib/password.ts):
//   DDMMYYYY + last 3 digits of normalized nomor_induk
// password_changed_at is kept NULL so users must change password on first login.
//
// Run (from BackEnd):
//   bun run scripts/fill-default-passwords.ts
// Dry run:
//   bun run scripts/fill-default-passwords.ts --dry-run

import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "../src/db/index";
import { users } from "../src/db/schema";
import {
  buildDefaultPassword,
  hashPassword,
  normalizeNomorInduk,
  normalizeTanggalLahir,
} from "../src/lib/password";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  const rows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      nomorInduk: users.nomorInduk,
      tanggalLahir: users.tanggalLahir,
      email: users.email,
      isActive: users.isActive,
    })
    .from(users)
    .where(
      and(
        isNull(users.passwordHash),
        isNotNull(users.nomorInduk),
        isNotNull(users.tanggalLahir)
      )
    );

  console.log(
    `${dryRun ? "[dry-run] " : ""}Found ${rows.length} user(s) with missing password_hash and valid identity fields.`
  );

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    try {
      const nomorInduk = normalizeNomorInduk(row.nomorInduk ?? "");
      const tanggalLahir = normalizeTanggalLahir(row.tanggalLahir ?? "");
      const defaultPassword = buildDefaultPassword(tanggalLahir, nomorInduk);
      const passwordHash = await hashPassword(defaultPassword);

      if (!dryRun) {
        await db
          .update(users)
          .set({
            passwordHash,
            // keep NULL: force password change on first login
            passwordChangedAt: null,
            updatedAt: new Date(),
          })
          .where(and(eq(users.id, row.id), isNull(users.passwordHash)));
      }

      updated += 1;
      console.log(
        `  ${dryRun ? "would update" : "updated"}: ${row.fullName} (${nomorInduk}) ${row.email ?? "-"}`
      );
    } catch (err) {
      skipped += 1;
      console.warn(
        `  skipped: ${row.fullName} (${row.nomorInduk ?? "-"}) — ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  console.log(
    `\nDone. ${dryRun ? "Would update" : "Updated"}: ${updated}, skipped: ${skipped}.`
  );
  if (!dryRun && updated > 0) {
    console.log(
      "Users can now log in with default password (DDMMYYYY + last 3 digits of nomor induk) and must change it on first login."
    );
  }
}

main()
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
