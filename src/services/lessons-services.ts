import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { lessons, modules } from "../db/schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new Error("ID tidak valid");
  }
}

export async function createLesson(input: {
  moduleId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  attachmentUrl?: string;
  orderIndex?: number;
}) {
  assertUuid(input.moduleId);
  const moduleRows = await db
    .select({ id: modules.id })
    .from(modules)
    .where(eq(modules.id, input.moduleId))
    .limit(1);
  if (moduleRows.length === 0) {
    throw new Error("Module tidak ditemukan");
  }

  const rows = await db
    .insert(lessons)
    .values({
      moduleId: input.moduleId,
      title: input.title,
      content: input.content,
      videoUrl: input.videoUrl,
      attachmentUrl: input.attachmentUrl,
      orderIndex: input.orderIndex ?? 0,
    })
    .returning();
  return rows[0];
}

export async function listLessonsByModule(moduleId: string) {
  assertUuid(moduleId);
  return db
    .select()
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId))
    .orderBy(asc(lessons.orderIndex));
}
