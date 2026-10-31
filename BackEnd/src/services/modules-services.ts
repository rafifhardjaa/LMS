import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { modules, subjects, users } from "../db/schema";
import { canonicalRole } from "../middleware/auth-middleware";
import { NotFoundError } from "../utils/response";

export const FORBIDDEN_MESSAGE = "Akses ditolak: Peran tidak valid";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new Error("ID tidak valid");
  }
}

export async function findModuleById(id: string) {
  assertUuid(id);
  const rows = await db
    .select()
    .from(modules)
    .where(eq(modules.id, id))
    .limit(1);
  return rows[0];
}

export async function getModuleDetail(id: string) {
  assertUuid(id);
  const rows = await db
    .select({
      id: modules.id,
      subject_id: modules.subjectId,
      subject_name: subjects.name,
      teacher_id: modules.teacherId,
      teacher_name: users.fullName,
      title: modules.title,
      description: modules.description,
      order_index: modules.orderIndex,
      created_at: modules.createdAt,
    })
    .from(modules)
    .leftJoin(subjects, eq(modules.subjectId, subjects.id))
    .leftJoin(users, eq(modules.teacherId, users.id))
    .where(eq(modules.id, id))
    .limit(1);

  const module = rows[0];
  if (!module) {
    throw new NotFoundError("Module tidak ditemukan");
  }
  return module;
}

export async function assertCanManageModule(
  id: string,
  actor: { id: string; role: string }
) {
  const module = await findModuleById(id);
  if (!module) {
    throw new NotFoundError("Module tidak ditemukan");
  }
  const role = canonicalRole(actor.role);
  if (role === "admin") return module;
  if (role === "guru" && module.teacherId === actor.id) return module;
  throw new Error(FORBIDDEN_MESSAGE);
}

export async function createModule(input: {
  subjectId: string;
  title: string;
  description?: string;
  orderIndex?: number;
  teacherId: string;
}) {
  assertUuid(input.subjectId);
  const subjectRows = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.id, input.subjectId))
    .limit(1);
  if (!subjectRows[0]) {
    throw new Error("Subject tidak ditemukan");
  }
  const rows = await db
    .insert(modules)
    .values({
      subjectId: input.subjectId,
      title: input.title,
      description: input.description,
      orderIndex: input.orderIndex ?? 0,
      teacherId: input.teacherId,
    })
    .returning({
      id: modules.id,
      subjectId: modules.subjectId,
      teacherId: modules.teacherId,
      title: modules.title,
      description: modules.description,
      orderIndex: modules.orderIndex,
      createdAt: modules.createdAt,
    });
  return rows[0];
}

export async function listModules(filter?: { subjectId?: string }) {
  const base = db
    .select({
      id: modules.id,
      subject_id: modules.subjectId,
      subject_name: subjects.name,
      teacher_id: modules.teacherId,
      teacher_name: users.fullName,
      title: modules.title,
      description: modules.description,
      order_index: modules.orderIndex,
      created_at: modules.createdAt,
    })
    .from(modules)
    .leftJoin(subjects, eq(modules.subjectId, subjects.id))
    .leftJoin(users, eq(modules.teacherId, users.id));
  if (filter?.subjectId) {
    assertUuid(filter.subjectId);
    return base
      .where(eq(modules.subjectId, filter.subjectId))
      .orderBy(asc(modules.orderIndex), asc(modules.createdAt));
  }
  return base.orderBy(asc(modules.orderIndex), asc(modules.createdAt));
}

export async function updateModule(
  id: string,
  actor: { id: string; role: string },
  patch: {
    title?: string;
    description?: string;
    orderIndex?: number;
    subjectId?: string;
  }
) {
  assertUuid(id);
  await assertCanManageModule(id, actor);
  if (patch.subjectId) {
    assertUuid(patch.subjectId);
    const target = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(eq(subjects.id, patch.subjectId))
      .limit(1);
    if (!target[0]) {
      throw new Error("Subject tidak ditemukan");
    }
  }
  const rows = await db
    .update(modules)
    .set(patch)
    .where(eq(modules.id, id))
    .returning({
      id: modules.id,
      subjectId: modules.subjectId,
      teacherId: modules.teacherId,
      title: modules.title,
      description: modules.description,
      orderIndex: modules.orderIndex,
      createdAt: modules.createdAt,
    });
  return rows[0];
}

export async function deleteModule(
  id: string,
  actor: { id: string; role: string }
) {
  assertUuid(id);
  await assertCanManageModule(id, actor);
  const rows = await db
    .delete(modules)
    .where(eq(modules.id, id))
    .returning({ id: modules.id });
  if (rows.length === 0) {
    throw new Error("Module tidak ditemukan");
  }
}
