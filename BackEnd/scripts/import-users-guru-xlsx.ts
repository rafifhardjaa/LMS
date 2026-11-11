// Import 235 guru dari Data_User_Guru.xlsx.
//
// Script ini bersifat destructive: seluruh user dengan role "guru" lama
// dihapus, lalu diganti dengan data dari Excel. User dengan role admin/siswa
// tidak disentuh. User yang memiliki role guru + admin di-skip (tidak dihapus).
//
// Pemakaian:
//   bun run db:import-guru --dry-run
//   bun run db:import-guru

import ExcelJS from "exceljs";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { join } from "node:path";
import { db } from "../src/db/index";
import { roles, userRoles, users } from "../src/db/schema";

const XLSX_PATH = join(import.meta.dir, "..", "..", "Data_User_Guru.xlsx");
const SHEET_NAME = "User Guru";
const DEFAULT_PASSWORD = "Guru@12345";
const DEFAULT_TANGGAL_LAHIR = "2000-01-01";
const DRY_RUN = process.argv.includes("--dry-run");

type CellValue = ExcelJS.CellValue;

function cellText(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "result" in value) {
    return cellText(value.result as CellValue);
  }
  return String(value).trim();
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

async function readTeacherRows(): Promise<
  Array<{
    id: string;
    kodeGuru: string;
    namaGuru: string;
    email: string;
    passwordDefault: string;
    role: string;
    status: string;
  }>
> {
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
    "id",
    "kode_guru",
    "nama_guru",
    "email",
    "password_default",
    "role",
    "status",
  ];
  for (const name of required) {
    if (!header.has(name)) {
      throw new Error(`Kolom "${name}" tidak ditemukan pada sheet ${SHEET_NAME}`);
    }
  }

  const column = (name: string): number => header.get(name)!;
  const rows: Array<{
    id: string;
    kodeGuru: string;
    namaGuru: string;
    email: string;
    passwordDefault: string;
    role: string;
    status: string;
  }> = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const kodeGuru = cellText(row.getCell(column("kode_guru")).value);
    if (!kodeGuru) continue;

    rows.push({
      id: cellText(row.getCell(column("id")).value),
      kodeGuru,
      namaGuru: cellText(row.getCell(column("nama_guru")).value),
      email: cellText(row.getCell(column("email")).value),
      passwordDefault: cellText(row.getCell(column("password_default")).value),
      role: cellText(row.getCell(column("role")).value),
      status: cellText(row.getCell(column("status")).value),
    });
  }

  return rows;
}

function validateRows(
  rows: Array<{
    id: string;
    kodeGuru: string;
    namaGuru: string;
    email: string;
    passwordDefault: string;
    role: string;
    status: string;
  }>
): void {
  if (rows.length === 0) throw new Error("Tidak ada baris data guru di Excel");

  const kodeSet = new Set<string>();
  const emailSet = new Set<string>();
  const nomorIndukSet = new Set<string>();

  for (const row of rows) {
    if (!row.kodeGuru) throw new Error(`Kode guru kosong pada baris id ${row.id}`);
    if (kodeSet.has(row.kodeGuru)) {
      throw new Error(`Kode guru duplikat: ${row.kodeGuru}`);
    }
    kodeSet.add(row.kodeGuru);

    if (!row.email) throw new Error(`Email kosong pada baris id ${row.id}`);
    const emailKey = row.email.toLowerCase();
    if (emailSet.has(emailKey)) {
      throw new Error(`Email duplikat: ${row.email}`);
    }
    emailSet.add(emailKey);

    if (!row.namaGuru) throw new Error(`Nama guru kosong pada baris id ${row.id}`);
    if (!row.passwordDefault) {
      throw new Error(`Password default kosong pada baris id ${row.id}`);
    }
    if (row.role.toLowerCase() !== "guru") {
      throw new Error(`Role bukan guru pada baris id ${row.id}: ${row.role}`);
    }

    const nomorInduk = digitsOnly(row.kodeGuru) + row.id;
    if (nomorIndukSet.has(nomorInduk)) {
      throw new Error(
        `Nomor induk duplikat hasil generasi: ${nomorInduk} (baris id ${row.id})`
      );
    }
    nomorIndukSet.add(nomorInduk);
  }
}

async function main() {
  console.log(`Membaca ${XLSX_PATH}`);
  const rows = await readTeacherRows();
  console.log(`  ${rows.length} baris guru`);
  validateRows(rows);

  const guruRoleRows = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "guru"))
    .limit(1);
  const guruRoleId = guruRoleRows[0]?.id;
  if (!guruRoleId) throw new Error("Role guru tidak ditemukan");

  const adminRoleRows = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "admin"))
    .limit(1);
  const adminRoleId = adminRoleRows[0]?.id;
  if (!adminRoleId) throw new Error("Role admin tidak ditemukan");

  const guruUserRows = await db
    .select({ id: userRoles.userId })
    .from(userRoles)
    .where(eq(userRoles.roleId, guruRoleId));
  const guruUserIds = guruUserRows.map((row) => row.id);

  let adminUserIds: string[] = [];
  if (adminRoleId) {
    const adminUserRows = await db
      .select({ id: userRoles.userId })
      .from(userRoles)
      .where(eq(userRoles.roleId, adminRoleId));
    adminUserIds = adminUserRows.map((row) => row.id);
  }

  const adminIdSet = new Set(adminUserIds);
  const guruToDelete = guruUserIds.filter((id) => !adminIdSet.has(id));
  const guruSkipped = guruUserIds.filter((id) => adminIdSet.has(id));

  const existingNonGuruEmails = await db
    .select({ email: users.email })
    .from(users)
    .where(
      guruUserIds.length > 0 ? notInArray(users.id, guruUserIds) : undefined
    );
  const nonGuruEmailSet = new Set(
    existingNonGuruEmails
      .map((row) => row.email)
      .filter((value): value is string => Boolean(value))
      .map((email) => email.toLowerCase())
  );

  const emailConflicts = rows.filter((row) =>
    nonGuruEmailSet.has(row.email.toLowerCase())
  );

  console.log(`  Guru DB existing: ${guruUserIds.length}`);
  console.log(`  Guru akan dihapus: ${guruToDelete.length}`);
  console.log(`  Guru di-skip (juga admin): ${guruSkipped.length}`);
  console.log(`  Email bentrok dgn user non-guru: ${emailConflicts.length}`);
  if (emailConflicts.length > 0) {
    for (const row of emailConflicts) {
      console.log(`    - ${row.kodeGuru} ${row.email}`);
    }
    throw new Error(
      "Ada email guru yang bentrok dengan user non-guru. Selesaikan terlebih dahulu."
    );
  }

  const passwordHash = await Bun.password.hash(DEFAULT_PASSWORD, {
    algorithm: "argon2id",
  });

  const teacherValues = rows.map((row) => ({
    fullName: row.namaGuru,
    email: row.email,
    kodeGuru: row.kodeGuru,
    nomorInduk: digitsOnly(row.kodeGuru) + row.id,
    tanggalLahir: DEFAULT_TANGGAL_LAHIR,
    passwordHash,
    passwordChangedAt: null,
    isActive: row.status.toLowerCase() === "aktif",
  }));

  if (DRY_RUN) {
    console.log("\nDry run selesai. Tidak ada data yang diubah.");
    console.log(`  Akan menghapus ${guruToDelete.length} guru lama`);
    console.log(`  Akan menyisipkan ${teacherValues.length} guru baru`);
    return;
  }

  await db.transaction(async (tx) => {
    console.log("\nMenghapus guru lama...");
    if (guruToDelete.length > 0) {
      await tx.delete(users).where(inArray(users.id, guruToDelete));
    }
    console.log(`  Guru dihapus: ${guruToDelete.length}`);

    console.log(`Menyisipkan ${teacherValues.length} guru...`);
    const insertedTeacherRows = await tx
      .insert(users)
      .values(teacherValues)
      .returning({ id: users.id, kodeGuru: users.kodeGuru });

    await tx.insert(userRoles).values(
      insertedTeacherRows.map((row) => ({ userId: row.id, roleId: guruRoleId }))
    );
    console.log(`  Guru disisipkan: ${insertedTeacherRows.length}`);
  });

  console.log("\nImport selesai:");
  console.log(`  Guru dihapus: ${guruToDelete.length}`);
  console.log(`  Guru disisipkan: ${teacherValues.length}`);
  console.log(`  Password default: ${DEFAULT_PASSWORD}`);
  console.log(`  password_changed_at: NULL (wajib ganti password login pertama)`);
}

main()
  .catch((error) => {
    console.error("\nImport gagal:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
