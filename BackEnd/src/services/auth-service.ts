// ── Alur autentikasi ──────────────────────────────────────────────────
// Login dengan email ATAU nomor induk (NIS/NIP), registrasi siswa dengan
// verifikasi roster, aktivasi akun, lupa password, dan ganti password.

import { and, eq, isNull, ne, sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import {
  consumeAuthToken,
  issueAuthToken,
  revokeAuthTokens,
} from "../lib/auth-token";
import {
  buildActivationEmail,
  buildPasswordResetEmail,
} from "../lib/email-templates";
import { buildAppLink, sendEmail } from "../lib/mailer";
import {
  assertPasswordStrength,
  hashPassword,
  normalizeNomorInduk,
  normalizeTanggalLahir,
  verifyPassword,
} from "../lib/password";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../utils/response";
import { DEFAULT_ROLE, getUserRoleName } from "./role-service";
import { getCurrentUserById } from "./users-services";

/** Masa berlaku JWT: 7 hari. */
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

const LOGIN_ERROR = "Email/NIS atau password salah";

export interface AuthTokenClaims {
  sub: string;
  email: string;
  role: string;
  /** Token version — dicocokkan dengan users.token_version oleh middleware. */
  tv: number;
  /** Unix timestamp (detik). */
  exp: number;
}

export function normalizeEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestError("Format email tidak valid");
  }
  return email;
}

/** Cari user berdasarkan email (mengandung "@") atau nomor induk. */
async function findUserByIdentifier(identifier: string) {
  const value = identifier.trim();
  if (!value) return undefined;

  const rows = value.includes("@")
    ? await db
        .select()
        .from(users)
        .where(eq(users.email, value.toLowerCase()))
        .limit(1)
    : await db
        .select()
        .from(users)
        .where(eq(users.nomorInduk, normalizeNomorInduk(value)))
        .limit(1);

  return rows[0];
}

async function buildClaims(userId: string): Promise<AuthTokenClaims> {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      tokenVersion: users.tokenVersion,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = rows[0];
  if (!user) {
    throw new UnauthorizedError();
  }

  const role = (await getUserRoleName(user.id)) ?? DEFAULT_ROLE;

  return {
    sub: user.id,
    email: user.email ?? "",
    role,
    tv: user.tokenVersion,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
}

// ── Login ─────────────────────────────────────────────────────────────

export async function loginWithIdentifier(input: {
  identifier: string;
  password: string;
}): Promise<{ claims: AuthTokenClaims; mustChangePassword: boolean }> {
  const user = await findUserByIdentifier(input.identifier);

  if (!user?.passwordHash) {
    if (user && !user.isActive) {
      throw new ForbiddenError(
        "Akun belum diaktivasi. Cek email aktivasi atau minta admin mengirim ulang."
      );
    }
    throw new UnauthorizedError(LOGIN_ERROR);
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError(LOGIN_ERROR);
  }

  if (!user.isActive) {
    throw new ForbiddenError("Akun tidak aktif. Hubungi admin sekolah.");
  }

  return {
    claims: await buildClaims(user.id),
    mustChangePassword: user.passwordChangedAt === null,
  };
}

// ── Registrasi guru (dibuat oleh admin) ────────────────────────────────

export async function registerStudent(input: {
  email: string;
  nomorInduk: string;
  tanggalLahir: string;
}): Promise<void> {
  const email = normalizeEmail(input.email);
  const nomorInduk = normalizeNomorInduk(input.nomorInduk);
  const tanggalLahir = normalizeTanggalLahir(input.tanggalLahir);

  if (!nomorInduk) {
    throw new BadRequestError("Nomor induk wajib diisi");
  }

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.nomorInduk, nomorInduk))
    .limit(1);
  const roster = rows[0];

  if (!roster) {
    throw new BadRequestError(
      "Nomor induk tidak terdaftar di sekolah. Hubungi admin."
    );
  }

  // Urutan validasi: tanggal lahir dulu, agar nomor induk milik
  // guru/admin tidak bisa ditebak perannya dari pesan error.
  if (roster.tanggalLahir !== tanggalLahir) {
    throw new BadRequestError(
      "Nomor induk dan tanggal lahir tidak cocok dengan data sekolah."
    );
  }

  // Registrasi publik hanya untuk siswa — nomor induk milik guru/admin
  // tidak boleh bisa diaktivasi lewat jalur ini.
  if ((await getUserRoleName(roster.id)) !== "siswa") {
    throw new BadRequestError(
      "Nomor induk tidak dapat digunakan untuk registrasi siswa."
    );
  }

  if (roster.isActive || roster.passwordHash) {
    throw new BadRequestError(
      "Nomor induk sudah diaktivasi. Silakan login atau gunakan lupa password."
    );
  }

  if (roster.email && roster.email.toLowerCase() !== email) {
    throw new BadRequestError(
      "Pendaftaran dengan nomor induk ini sudah diproses. Cek email atau hubungi admin."
    );
  }

  const emailTaken = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, roster.id)))
    .limit(1);

  if (emailTaken[0]) {
    throw new BadRequestError("Email sudah terdaftar");
  }

  await db.update(users).set({ email }).where(eq(users.id, roster.id));

  const { token } = await issueAuthToken(roster.id, "activation");
  await sendEmail(
    email,
    buildActivationEmail({
      name: roster.fullName,
      link: buildAppLink("/auth/activate", token),
    })
  );
}

// ── Registrasi guru (dibuat oleh admin) ────────────────────────────────

export async function registerTeacher(input: {
  fullName: string;
  nomorInduk: string;
  tanggalLahir: string;
  email?: string | null;
  major?: string | null;
  gradeLevel?: string | null;
  subject?: string | null;
  role: string;
}): Promise<void> {
  const nomorInduk = normalizeNomorInduk(input.nomorInduk);
  const tanggalLahir = normalizeTanggalLahir(input.tanggalLahir);

  if (!nomorInduk) {
    throw new BadRequestError("Nomor induk wajib diisi");
  }

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.nomorInduk, nomorInduk))
    .limit(1);

  if (rows[0]) {
    throw new BadRequestError(
      "Nomor induk sudah terdaftar di sekolah."
    );
  }

  const emailTaken = input.email
    ? await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, input.email!.toLowerCase()))
        .limit(1)
    : null;

  if (emailTaken?.[0]) {
    throw new BadRequestError("Email sudah terdaftar");
  }

  await db.insert(users).values({
    id: crypto.randomUUID(),
    fullName: input.fullName.trim(),
    nomorInduk,
    tanggalLahir,
    email: input.email?.trim().toLowerCase() || null,
    passwordHash: null,
    isActive: true,
    role: input.role,
    createdBy: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// ── Aktivasi akun baru ────────────────────────────────────────────────

export async function activateAccount(input: {
  token: string;
  password: string;
}) {
  assertPasswordStrength(input.password);
  const userId = await consumeAuthToken(input.token, "activation");
  const passwordHash = await hashPassword(input.password);

  const updated = await db
    .update(users)
    .set({
      passwordHash,
      passwordChangedAt: new Date(),
      isActive: true,
      tokenVersion: sql`${users.tokenVersion} + 1`,
    })
    // Hanya akun yang belum pernah punya password yang boleh diaktivasi;
    // akun yang dinonaktifkan admin tidak ikut hidup kembali.
    .where(and(eq(users.id, userId), isNull(users.passwordHash)))
    .returning({ id: users.id });

  if (!updated[0]) {
    throw new BadRequestError("Token tidak valid atau sudah kedaluwarsa");
  }

  await revokeAuthTokens(userId);
  return getCurrentUserById(userId);
}

// ── Lupa password ─────────────────────────────────────────────────────

/**
 * Selalu selesai tanpa memberi tahu apakah identitas terdaftar
 * (mencegah email enumeration). Link dikirim ke email pemilik akun.
 */
export async function requestPasswordReset(identifier: string): Promise<void> {
  const user = await findUserByIdentifier(identifier);
  if (!user?.email) return;

  // Akun yang dinonaktifkan admin tidak boleh diaktifkan kembali lewat
  // alur mandiri.
  if (!user.isActive && user.passwordHash) return;

  if (!user.passwordHash) {
    const { token } = await issueAuthToken(user.id, "activation");
    await sendEmail(
      user.email,
      buildActivationEmail({
        name: user.fullName,
        link: buildAppLink("/auth/activate", token),
      })
    );
    return;
  }

  const { token } = await issueAuthToken(user.id, "password_reset");
  await sendEmail(
    user.email,
    buildPasswordResetEmail({
      name: user.fullName,
      link: buildAppLink("/auth/reset-password", token),
    })
  );
}

export async function resetPassword(input: {
  token: string;
  password: string;
}) {
  assertPasswordStrength(input.password);
  const userId = await consumeAuthToken(input.token, "password_reset");
  const passwordHash = await hashPassword(input.password);

  const updated = await db
    .update(users)
    .set({
      passwordHash,
      passwordChangedAt: new Date(),
      tokenVersion: sql`${users.tokenVersion} + 1`,
    })
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  if (!updated[0]) {
    throw new BadRequestError("Token tidak valid atau sudah kedaluwarsa");
  }

  await revokeAuthTokens(userId);
}

// ── Ganti password (user yang sudah login) ────────────────────────────

export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string }
): Promise<AuthTokenClaims> {
  const rows = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = rows[0];
  if (!user?.passwordHash) {
    throw new BadRequestError("Akun belum memiliki password");
  }

  const valid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw new BadRequestError("Password saat ini salah");
  }

  assertPasswordStrength(input.newPassword);
  const passwordHash = await hashPassword(input.newPassword);

  await db
    .update(users)
    .set({
      passwordHash,
      passwordChangedAt: new Date(),
      tokenVersion: sql`${users.tokenVersion} + 1`,
    })
    .where(eq(users.id, userId));

  await revokeAuthTokens(userId);

  // Token baru diterbitkan agar sesi aktif tidak ikut mati.
  return buildClaims(userId);
}
