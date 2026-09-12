import { eq } from "drizzle-orm";
import { db } from "../db";
import { subjects, users } from "../db/schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new Error("ID tidak valid");
  }
}

function isUniqueViolation(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23505"
  );
}

export async function createSubject(input: {
  name: string;
  code: string;
  description?: string;
  createdBy: string;
}) {
  try {
    const rows = await db
      .insert(subjects)
      .values({
        name: input.name,
        code: input.code,
        description: input.description,
        createdBy: input.createdBy,
      })
      .returning({
        id: subjects.id,
        name: subjects.name,
        code: subjects.code,
        description: subjects.description,
        createdBy: subjects.createdBy,
        createdAt: subjects.createdAt,
      });
    return rows[0];
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new Error("Kode sudah digunakan");
    }
    throw err;
  }
}

export async function listSubjects() {
  return db
    .select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      description: subjects.description,
      created_by_name: users.fullName,
      createdAt: subjects.createdAt,
    })
    .from(subjects)
    .leftJoin(users, eq(subjects.createdBy, users.id));
}

export async function updateSubject(
  id: string,
  patch: { name?: string; code?: string; description?: string }
) {
  assertUuid(id);
  try {
    const rows = await db
      .update(subjects)
      .set(patch)
      .where(eq(subjects.id, id))
      .returning({
        id: subjects.id,
        name: subjects.name,
        code: subjects.code,
        description: subjects.description,
        createdBy: subjects.createdBy,
        createdAt: subjects.createdAt,
      });
    const updated = rows[0];
    if (!updated) {
      throw new Error("Subject tidak ditemukan");
    }
    return updated;
  } catch (err) {
    if (err instanceof Error && err.message === "Subject tidak ditemukan") {
      throw err;
    }
    if (isUniqueViolation(err)) {
      throw new Error("Kode sudah digunakan");
    }
    throw err;
  }
}

export async function deleteSubject(id: string) {
  assertUuid(id);
  const rows = await db
    .delete(subjects)
    .where(eq(subjects.id, id))
    .returning({ id: subjects.id });
  if (rows.length === 0) {
    throw new Error("Subject tidak ditemukan");
  }
}
