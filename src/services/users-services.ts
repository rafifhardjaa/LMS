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

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await Bun.password.hash(input.password);

  await db.insert(users).values({
    name: input.name,
    email: input.email,
    password: hashedPassword,
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
    created_at: user.createdAt,
  };
}
