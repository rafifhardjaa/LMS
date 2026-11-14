// Import 2160 siswa dari Data_Siswa.xlsx.
//
// Script ini bersifat destructive sebagian: 4 siswa demo seed (siswa@simanis.com
// dst, role "siswa") dihapus, lalu diganti dengan data dari Excel. Guru/admin
// dan siswa lain tidak disentuh. Kelas yang dirujuk Excel diupdate capacity-nya
// menjadi 20 (sesuai parameter file).
//
// Pemakaian:
//   bun run db:import-siswa --dry-run
//   bun run db:import-siswa

import ExcelJS from "exceljs";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { join } from "node:path";
import { db } from "../src/db/index";
import { classes, roles, userRoles, users } from "../src/db/schema";

const XLSX_PATH = join(import.meta.dir, "..", "..", "Data_Siswa.xlsx");
const SHEET_NAME = "Siswa";
const DEFAULT_PASSWORD = "Siswa@12345";
const KAPASITAS_KELAS = 20;
const DEMO_EMAILS = [
  "siswa@simanis.com",
  "siswa2@simanis.com",
  "siswa3@simanis.com",
  "siswa4@simanis.com",
];
const CHUNK_SIZE = 500;
const DRY_RUN = process.argv.includes("--dry-run");

type CellValue = ExcelJS.CellValue;

function cellText(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "result" in value) {
    return cellText(value.result as CellValue);
  }
  return String(value).trim();
}

function cellDate(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object" && "result" in value) {
    return cellDate(value.result as CellValue);
  }
  return String(value).trim();
}

async function readStudentRows(): Promise<
  Array<{
    id: string;
    nis: string;
    nisn: string;
    namaSiswa: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    kodeKelas: string;
    namaKelas: string;
    tingkat: string;
    jurusan: string;
    rombel: string;
    angkatan: number;
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
    "nis",
    "nisn",
    "nama_siswa",
    "jenis_kelamin",
    "tempat_lahir",
    "tanggal_lahir",
    "kode_kelas",
    "nama_kelas",
    "tingkat",
    "jurusan",
    "rombel",
    "angkatan",
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
    nis: string;
    nisn: string;
    namaSiswa: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    kodeKelas: string;
    namaKelas: string;
    tingkat: string;
    jurusan: string;
    rombel: string;
    angkatan: number;
    email: string;
    passwordDefault: string;
    role: string;
    status: string;
  }> = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const nis = cellText(row.getCell(column("nis")).value);
    if (!nis) continue;

    const angkatanRaw = cellText(row.getCell(column("angkatan")).value);
    rows.push({
      id: cellText(row.getCell(column("id")).value),
      nis,
      nisn: cellText(row.getCell(column("nisn")).value),
      namaSiswa: cellText(row.getCell(column("nama_siswa")).value),
      jenisKelamin: cellText(row.getCell(column("jenis_kelamin")).value),
      tempatLahir: cellText(row.getCell(column("tempat_lahir")).value),
      tanggalLahir: cellDate(row.getCell(column("tanggal_lahir")).value),
      kodeKelas: cellText(row.getCell(column("kode_kelas")).value),
      namaKelas: cellText(row.getCell(column("nama_kelas")).value),
      tingkat: cellText(row.getCell(column("tingkat")).value),
      jurusan: cellText(row.getCell(column("jurusan")).value),
      rombel: cellText(row.getCell(column("rombel")).value),
      angkatan: Number(angkatanRaw),
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
    nis: string;
    nisn: string;
    namaSiswa: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    kodeKelas: string;
    namaKelas: string;
    tingkat: string;
    jurusan: string;
    rombel: string;
    angkatan: number;
    email: string;
    passwordDefault: string;
    role: string;
    status: string;
  }>
): void {
  if (rows.length === 0) throw new Error("Tidak ada baris data siswa di Excel");

  const nisSet = new Set<string>();
  const nisnSet = new Set<string>();
  const emailSet = new Set<string>();

  for (const row of rows) {
    if (!row.nis) throw new Error(`NIS kosong pada baris id ${row.id}`);
    if (nisSet.has(row.nis)) {
      throw new Error(`NIS duplikat: ${row.nis} (baris id ${row.id})`);
    }
    nisSet.add(row.nis);

    if (!row.nisn) throw new Error(`NISN kosong pada baris id ${row.id}`);
    if (nisnSet.has(row.nisn)) {
      throw new Error(`NISN duplikat: ${row.nisn} (baris id ${row.id})`);
    }
    nisnSet.add(row.nisn);

    if (!row.email) throw new Error(`Email kosong pada baris id ${row.id}`);
    const emailKey = row.email.toLowerCase();
    if (emailSet.has(emailKey)) {
      throw new Error(`Email duplikat: ${row.email} (baris id ${row.id})`);
    }
    emailSet.add(emailKey);

    if (!row.namaSiswa) {
      throw new Error(`Nama siswa kosong pada baris id ${row.id}`);
    }
    if (!row.tanggalLahir) {
      throw new Error(`Tanggal lahir kosong pada baris id ${row.id}`);
    }
    if (!row.namaKelas) {
      throw new Error(`Nama kelas kosong pada baris id ${row.id}`);
    }
    if (!row.passwordDefault) {
      throw new Error(`Password default kosong pada baris id ${row.id}`);
    }
    if (row.role.toLowerCase() !== "siswa") {
      throw new Error(`Role bukan siswa pada baris id ${row.id}: ${row.role}`);
    }
    if (!Number.isFinite(row.angkatan)) {
      throw new Error(`Angkatan tidak valid pada baris id ${row.id}`);
    }
    const jk = row.jenisKelamin.toUpperCase();
    if (jk !== "L" && jk !== "P") {
      throw new Error(
        `Jenis kelamin tidak valid pada baris id ${row.id}: ${row.jenisKelamin}`
      );
    }
  }
}

async function main() {
  console.log(`Membaca ${XLSX_PATH}`);
  const rows = await readStudentRows();
  console.log(`  ${rows.length} baris siswa`);
  validateRows(rows);

  const siswaRoleRows = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "siswa"))
    .limit(1);
  const siswaRoleId = siswaRoleRows[0]?.id;
  if (!siswaRoleId) throw new Error("Role siswa tidak ditemukan");

  const classRows = await db
    .select({ id: classes.id, name: classes.name })
    .from(classes);
  const classByName = new Map(classRows.map((row) => [row.name, row.id]));

  const missingClasses = [
    ...new Set(rows.map((row) => row.namaKelas).filter((name) => !classByName.has(name))),
  ];
  console.log(`  Kelas DB existing: ${classRows.length}`);
  console.log(`  Nama kelas Excel yang tidak ada di DB: ${missingClasses.length}`);
  if (missingClasses.length > 0) {
    for (const name of missingClasses) {
      console.log(`    - ${name}`);
    }
    throw new Error(
      "Ada nama_kelas yang tidak cocok dengan tabel classes. Selesaikan terlebih dahulu."
    );
  }

  const demoUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .where(
      and(
        eq(userRoles.roleId, siswaRoleId),
        inArray(users.email, DEMO_EMAILS)
      )
    );
  const demoIds = demoUsers.map((row) => row.id);

  const existingUserRows =
    demoIds.length > 0
      ? await db
          .select({ email: users.email })
          .from(users)
          .where(notInArray(users.id, demoIds))
      : await db.select({ email: users.email }).from(users);
  const existingEmailSet = new Set(
    existingUserRows
      .map((row) => row.email)
      .filter((value): value is string => Boolean(value))
      .map((email) => email.toLowerCase())
  );

  const emailConflicts = rows.filter((row) =>
    existingEmailSet.has(row.email.toLowerCase())
  );

  console.log(`  Siswa demo akan dihapus: ${demoIds.length}`);
  console.log(`  Email bentrok dgn user existing: ${emailConflicts.length}`);
  if (emailConflicts.length > 0) {
    for (const row of emailConflicts) {
      console.log(`    - ${row.nis} ${row.email}`);
    }
    throw new Error(
      "Ada email siswa yang bentrok dengan user existing. Selesaikan terlebih dahulu."
    );
  }

  const passwordHash = await Bun.password.hash(DEFAULT_PASSWORD, {
    algorithm: "argon2id",
  });

  const studentValues = rows.map((row) => ({
    fullName: row.namaSiswa,
    email: row.email,
    nomorInduk: row.nis,
    nisn: row.nisn,
    jenisKelamin: row.jenisKelamin.toUpperCase(),
    tempatLahir: row.tempatLahir,
    tanggalLahir: row.tanggalLahir,
    angkatan: row.angkatan,
    kelas: row.namaKelas,
    classId: classByName.get(row.namaKelas)!,
    passwordHash,
    passwordChangedAt: null,
    isActive: row.status.toLowerCase() === "aktif",
  }));

  if (DRY_RUN) {
    console.log("\nDry run selesai. Tidak ada data yang diubah.");
    console.log(`  Akan menghapus ${demoIds.length} siswa demo`);
    console.log(`  Akan update capacity ${classRows.length} kelas menjadi ${KAPASITAS_KELAS}`);
    console.log(`  Akan menyisipkan ${studentValues.length} siswa baru`);
    return;
  }

  await db.transaction(async (tx) => {
    console.log("\nMenghapus siswa demo...");
    if (demoIds.length > 0) {
      await tx.delete(users).where(inArray(users.id, demoIds));
    }
    console.log(`  Siswa demo dihapus: ${demoIds.length}`);

    console.log(`Mengupdate capacity ${classRows.length} kelas...`);
    await tx.update(classes).set({ capacity: KAPASITAS_KELAS });

    console.log(`Menyisipkan ${studentValues.length} siswa...`);
    const insertedStudentIds: string[] = [];
    for (let i = 0; i < studentValues.length; i += CHUNK_SIZE) {
      const chunk = studentValues.slice(i, i + CHUNK_SIZE);
      const inserted = await tx
        .insert(users)
        .values(chunk)
        .returning({ id: users.id });
      insertedStudentIds.push(...inserted.map((row) => row.id));
    }
    console.log(`  Siswa disisipkan: ${insertedStudentIds.length}`);

    console.log("Menyisipkan role siswa...");
    for (let i = 0; i < insertedStudentIds.length; i += CHUNK_SIZE) {
      const chunk = insertedStudentIds
        .slice(i, i + CHUNK_SIZE)
        .map((userId) => ({ userId, roleId: siswaRoleId }));
      await tx.insert(userRoles).values(chunk);
    }
    console.log(`  Role disisipkan: ${insertedStudentIds.length}`);
  });

  console.log("\nImport selesai:");
  console.log(`  Siswa demo dihapus: ${demoIds.length}`);
  console.log(`  Siswa disisipkan: ${studentValues.length}`);
  console.log(`  Capacity kelas: ${KAPASITAS_KELAS}`);
  console.log(`  Password default: ${DEFAULT_PASSWORD}`);
  console.log(`  password_changed_at: NULL (wajib ganti password login pertama)`);
}

main()
  .catch((error) => {
    console.error("\nImport gagal:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
