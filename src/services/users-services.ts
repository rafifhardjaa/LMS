import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";

export async function findUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return rows[0];
}

export const VALID_ROLES = ["admin", "teacher", "student"] as const;
export type UserRole = (typeof VALID_ROLES)[number];

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  const role = input.role ?? "student";
  if (!(VALID_ROLES as readonly string[]).includes(role)) {
    throw new Error("Role tidak valid");
  }

  const hashedPassword = await Bun.password.hash(input.password);

  await db.insert(users).values({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role,
  });
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<string> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new Error("Email atau password salah");
  }

  const valid = await Bun.password.verify(input.password, user.password);
  if (!valid) {
    throw new Error("Email atau password salah");
  }

  const token = crypto.randomUUID();

  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return token;
}

export async function getCurrentUser(token: string) {
  const sessionRows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);
  const session = sessionRows[0];
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  const user = userRows[0];
  if (!user) {
    throw new Error("Unauthorized");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
  };
}

export async function logoutUser(token: string) {
  const sessionRows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);
  const session = sessionRows[0];
  if (!session) {
    throw new Error("Unauthorized");
  }

  await db.delete(sessions).where(eq(sessions.token, token));
}
