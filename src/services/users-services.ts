import { eq } from "drizzle-orm";
import { db } from "../db";
import { roles, userRoles, users } from "../db/schema";

// Role kanonis SIMANIS (admin/guru/siswa). "teacher"/"student" tetap
// diterima sebagai alias demi kompatibilitas klien lama dan disimpan
// apa adanya.
export const VALID_ROLES = [
  "admin",
  "guru",
  "siswa",
  "teacher",
  "student",
] as const;
export type UserRole = (typeof VALID_ROLES)[number];

export const DEFAULT_ROLE: UserRole = "siswa";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export async function findUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return rows[0];
}

async function findRoleByName(name: string) {
  const rows = await db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .limit(1);
  return rows[0];
}

async function ensureRole(name: string) {
  const existing = await findRoleByName(name);
  if (existing) return existing;
  const rows = await db.insert(roles).values({ name }).returning();
  const created = rows[0];
  if (!created) {
    throw new Error("Gagal membuat role");
  }
  return created;
}

// Query JOIN user_roles + roles untuk mendapatkan nama role user.
export async function getUserRoleName(
  userId: string
): Promise<string | null> {
  const rows = await db
    .select({ name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId))
    .limit(1);
  return rows[0]?.name ?? null;
}

export async function createUser(input: {
  full_name?: string;
  name?: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  avatar_url?: string;
}) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  const fullName = input.full_name ?? input.name;
  if (!fullName) {
    throw new Error("Nama wajib diisi");
  }

  const role = input.role ?? DEFAULT_ROLE;
  if (!(VALID_ROLES as readonly string[]).includes(role)) {
    throw new Error("Role tidak valid");
  }

  const passwordHash = await Bun.password.hash(input.password);

  const inserted = await db
    .insert(users)
    .values({
      fullName,
      email: input.email,
      passwordHash,
      phone: input.phone,
      avatarUrl: input.avatar_url,
    })
    .returning({ id: users.id });
  const first = inserted[0];
  if (!first) {
    throw new Error("Gagal membuat user");
  }
  const userId = first.id;

  const roleRow = await ensureRole(role);
  if (!roleRow) {
    throw new Error("Gagal membuat role");
  }
  await db.insert(userRoles).values({ userId, roleId: roleRow.id });
}

// Validasi kredensial lalu susun JWT payload { sub, email, role }.
// Penandatanganan token (jwt.sign) dilakukan di route via plugin @elysiajs/jwt.
export async function buildLoginPayload(input: {
  email: string;
  password: string;
}): Promise<JwtPayload> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new Error("Email atau password salah");
  }

  const valid = await Bun.password.verify(input.password, user.passwordHash);
  if (!valid) {
    throw new Error("Email atau password salah");
  }

  if (!user.isActive) {
    throw new Error("Akun tidak aktif");
  }

  const roleName = await getUserRoleName(user.id);
  return {
    sub: user.id,
    email: user.email,
    role: roleName ?? DEFAULT_ROLE,
  };
}

// Query data user berdasarkan sub (id) dari token + nama role-nya.
// password_hash selalu dikecualikan dari response.
export async function getCurrentUserById(sub: string) {
  const userRows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
      avatarUrl: users.avatarUrl,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, sub))
    .limit(1);
  const user = userRows[0];
  if (!user) {
    throw new Error("Unauthorized");
  }

  const role = await getUserRoleName(user.id);

  return {
    id: user.id,
    name: user.fullName,
    full_name: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar_url: user.avatarUrl,
    is_active: user.isActive,
    role: role ?? DEFAULT_ROLE,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

// JWT bersifat stateless: logout cukup dilakukan di sisi klien dengan
// membuang token. Fungsi ini dipertahankan agar route tidak berubah.
export async function logoutUser(_token: string) {
  return;
}
