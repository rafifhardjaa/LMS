// ── Manajemen akun oleh admin ─────────────────────────────────────────
// Guru & siswa hanya dibuat lewat jalur ini (siswa juga bisa lewat
// registrasi mandiri dengan verifikasi roster). Password awal selalu
// diturunkan dari data user, sehingga admin tidak perlu mengetiknya
// satu per satu.

import { and, eq, ne } from "drizzle-orm";
import { db } from "../db";
import { classes, roles, userRoles, users } from "../db/schema";
import { revokeAuthTokens } from "../lib/auth-token";
import {
  buildDefaultPassword,
  hashPassword,
  normalizeNomorInduk,
  normalizeTanggalLahir,
} from "../lib/password";
import { BadRequestError } from "../utils/response";
import { normalizeEmail } from "./auth-service";
import { ensureRole } from "./role-service";

export type ManagedRole = "guru" | "siswa";

export interface ImportStudentRow {
  full_name: string;
  nomor_induk: string;
  tanggal_lahir: string;
  kelas?: string;
  email?: string;
}

interface ManagedUserInput {
  fullName: string;
  nomorInduk: string;
  tanggalLahir: string;
  role: ManagedRole;
  kelas?: string;
  email?: string;
}

function cleanName(value: string, label: string): string {
  const name = value.trim();
  if (!name) {
    throw new BadRequestError(`${label} wajib diisi`);
  }
  return name;
}

async function assertIdentityAvailable(input: {
  nomorInduk: string;
  email?: string;
  exceptUserId?: string;
}): Promise<void> {
  const cond = input.exceptUserId
    ? and(eq(users.nomorInduk, input.nomorInduk), ne(users.id, input.exceptUserId))
    : eq(users.nomorInduk, input.nomorInduk);

  const byNomorInduk = await db
    .select({ id: users.id })
    .from(users)
    .where(cond)
    .limit(1);
  if (byNomorInduk[0]) {
    throw new BadRequestError("Nomor induk sudah terdaftar");
  }

  if (input.email) {
    const emailCond = input.exceptUserId
      ? and(eq(users.email, input.email), ne(users.id, input.exceptUserId))
      : eq(users.email, input.email);

    const byEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(emailCond)
      .limit(1);
    if (byEmail[0]) {
      throw new BadRequestError("Email sudah terdaftar");
    }
  }
}

/**
 * Buat akun guru/siswa yang langsung aktif dengan password default.
 * Admin memberi tahu password tersebut; user wajib menggantinya saat
 * login pertama.
 */
async function resolveClassByName(name?: string | null) {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  const rows = await db
    .select({ id: classes.id })
    .from(classes)
    .where(eq(classes.name, trimmed))
    .limit(1);
  return rows[0] ?? null;
}

export async function createManagedUser(input: ManagedUserInput) {
  const fullName = cleanName(input.fullName, "Nama");
  const nomorInduk = normalizeNomorInduk(input.nomorInduk);
  const tanggalLahir = normalizeTanggalLahir(input.tanggalLahir);
  const email = input.email ? normalizeEmail(input.email) : undefined;

  if (!nomorInduk) {
    throw new BadRequestError("Nomor induk wajib diisi");
  }
  if (input.role !== "guru" && input.role !== "siswa") {
    throw new BadRequestError("Role tidak valid");
  }

  await assertIdentityAvailable({ nomorInduk, email });

  const defaultPassword = buildDefaultPassword(tanggalLahir, nomorInduk);
  const passwordHash = await hashPassword(defaultPassword);
  const roleRow = await ensureRole(input.role);

  const classRow =
    input.role === "siswa" ? await resolveClassByName(input.kelas) : null;

  const created = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(users)
      .values({
        fullName,
        email,
        nomorInduk,
        tanggalLahir,
        kelas: input.role === "siswa" ? input.kelas?.trim() || null : null,
        classId:
          input.role === "siswa" && classRow ? classRow.id : null,
        passwordHash,
        isActive: true,
        passwordChangedAt: null,
      })
      .returning({ id: users.id });

    const user = inserted[0];
    if (!user) {
      throw new BadRequestError("Gagal membuat user");
    }

    await tx
      .insert(userRoles)
      .values({ userId: user.id, roleId: roleRow.id });

    return user;
  });

  return {
    id: created.id,
    full_name: fullName,
    email: email ?? null,
    nomor_induk: nomorInduk,
    role: input.role,
    default_password: defaultPassword,
    must_change_password: true,
  };
}

/** Aktifkan entri roster dengan password default (jalur admin). */
export async function activateRosterUser(userId: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const user = rows[0];

  if (!user) {
    throw new BadRequestError("User tidak ditemukan");
  }
  if (user.isActive && user.passwordHash) {
    throw new BadRequestError("Akun sudah aktif");
  }
  if (!user.nomorInduk || !user.tanggalLahir) {
    throw new BadRequestError(
      "Nomor induk dan tanggal lahir wajib diisi sebelum aktivasi"
    );
  }

  const defaultPassword = buildDefaultPassword(
    user.tanggalLahir,
    user.nomorInduk
  );

  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(defaultPassword),
      isActive: true,
      passwordChangedAt: null,
    })
    .where(eq(users.id, userId));

  await revokeAuthTokens(userId);

  return {
    id: user.id,
    nomor_induk: user.nomorInduk,
    default_password: defaultPassword,
    must_change_password: true,
  };
}

/** Reset password user ke formula default; token lama langsung dicabut. */
export async function resetPasswordToDefault(userId: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const user = rows[0];

  if (!user) {
    throw new BadRequestError("User tidak ditemukan");
  }
  if (!user.nomorInduk || !user.tanggalLahir) {
    throw new BadRequestError(
      "User belum memiliki nomor induk dan tanggal lahir"
    );
  }

  const defaultPassword = buildDefaultPassword(
    user.tanggalLahir,
    user.nomorInduk
  );

  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(defaultPassword),
      isActive: true,
      passwordChangedAt: null,
      tokenVersion: (user.tokenVersion ?? 0) + 1,
    })
    .where(eq(users.id, userId));

  await revokeAuthTokens(userId);

  return {
    id: user.id,
    nomor_induk: user.nomorInduk,
    default_password: defaultPassword,
    must_change_password: true,
  };
}

/** Daftar siswa yang sudah diimpor tetapi belum menyelesaikan aktivasi. */
export async function listRoster() {
  return db
    .select({
      id: users.id,
      full_name: users.fullName,
      nomor_induk: users.nomorInduk,
      tanggal_lahir: users.tanggalLahir,
      kelas: users.kelas,
      email: users.email,
      created_at: users.createdAt,
    })
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(and(eq(roles.name, "siswa"), eq(users.isActive, false)))
    .orderBy(users.fullName);
}

export interface ImportResult {
  created: number;
  updated: number;
  activated: number;
  skipped: { nomor_induk: string; reason: string }[];
  accounts: { nomor_induk: string; default_password: string }[];
}

/**
 * Impor daftar siswa.
 * - activate=false (default): entri roster belum aktif, siswa menyelesaikan
 *   registrasi mandiri dengan NIS + tanggal lahir.
 * - activate=true: akun langsung aktif dengan password default.
 * Baris yang gagal dilewati dan dilaporkan, baris lain tetap diproses.
 */
export async function importStudents(input: {
  rows: ImportStudentRow[];
  activate: boolean;
}): Promise<ImportResult> {
  const result: ImportResult = {
    created: 0,
    updated: 0,
    activated: 0,
    skipped: [],
    accounts: [],
  };

  const siswaRole = await ensureRole("siswa");
  const seen = new Set<string>();

  for (const row of input.rows) {
    const nomorInduk = normalizeNomorInduk(row.nomor_induk ?? "");

    try {
      if (!nomorInduk) {
        throw new BadRequestError("Nomor induk kosong");
      }
      if (seen.has(nomorInduk)) {
        throw new BadRequestError("Nomor induk duplikat di file impor");
      }
      seen.add(nomorInduk);

const fullName = cleanName(row.full_name ?? "", "Nama");
      const tanggalLahir = normalizeTanggalLahir(row.tanggalahir ?? "");
      const kelas = row.kelas?.trim() || null;
      const email = row.email ? normalizeEmail(row.email) : undefined;
      const classRow = kelas ? await resolveClassByName(kelas) : null;
      const defaultPassword = buildDefaultPassword(tanggalLahir, nomorInduk);

      const existingRows = await db
        .select()
        .from(users)
        .where(eq(users.nomorInduk, nomorInduk))
        .limit(1);
      const existing = existingRows[0];

      if (existing && (existing.isActive || existing.passwordHash)) {
        throw new BadRequestError("Nomor induk sudah aktif");
      }

      if (existing) {
        if (email) {
          await assertIdentityAvailable({
            nomorInduk,
            email,
            exceptUserId: existing.id,
          });
        }

        await db
          .update(users)
          .set({
            fullName,
            tanggalLahir,
            kelas,
            classId: classRow?.id ?? null,
            email: email ?? existing.email,
            ...(input.activate
              ? {
                  passwordHash: await hashPassword(defaultPassword),
                  isActive: true,
                  passwordChangedAt: null,
                }
              : {}),
          })
          .where(eq(users.id, existing.id));

        result.updated += 1;
      } else {
        await assertIdentityAvailable({ nomorInduk, email });

        await db.transaction(async (tx) => {
          const inserted = await tx
            .insert(users)
            .values({
              fullName,
              nomorInduk,
              tanggalLahir,
              kelas,
              classId: classRow?.id ?? null,
              email,
              passwordHash: input.activate
                ? await hashPassword(defaultPassword)
                : null,
              isActive: input.activate,
              passwordChangedAt: null,
            })
            .returning({ id: users.id });

          const user = inserted[0];
          if (!user) {
            throw new BadRequestError("Gagal membuat user");
          }

          await tx
            .insert(userRoles)
            .values({ userId: user.id, roleId: siswaRole.id });

          return user;
        });

        result.created += 1;
      }

      if (input.activate) {
        result.activated += 1;
        result.accounts.push({
          nomor_induk: nomorInduk,
          default_password: defaultPassword,
        });
      }
    } catch (error) {
      result.skipped.push({
        nomor_induk: nomorInduk || "-",
        reason:
          error instanceof Error ? error.message : "Gagal memproses baris",
      });
    }
  }

  return result;
}
