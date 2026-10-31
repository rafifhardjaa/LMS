import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { enrollments, lessonProgress, lessons, modules } from "../db/schema";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/response";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new BadRequestError("ID tidak valid");
  }
}

async function findActiveEnrollmentId(studentId: string, subjectId: string) {
  const rows = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.subjectId, subjectId),
        eq(enrollments.status, "active")
      )
    )
    .limit(1);

  const enrollment = rows[0];
  if (!enrollment) {
    throw new ForbiddenError("Anda belum terdaftar di mata pelajaran ini");
  }
  return enrollment.id;
}

async function findModuleSubjectId(moduleId: string) {
  const rows = await db
    .select({ subjectId: modules.subjectId })
    .from(modules)
    .where(eq(modules.id, moduleId))
    .limit(1);

  const module = rows[0];
  if (!module) {
    throw new NotFoundError("Module tidak ditemukan");
  }
  return module.subjectId;
}

async function calculateCompletion(
  enrollmentId: string,
  lessonIds: string[]
): Promise<number> {
  if (lessonIds.length === 0) return 0;

  const rows = await db
    .select({ count: count() })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.enrollmentId, enrollmentId),
        eq(lessonProgress.isCompleted, true),
        inArray(lessonProgress.lessonId, lessonIds)
      )
    );

  const completed = rows[0]?.count ?? 0;
  // Floor keeps 199/200 at 99%, never a false 100.
  return Math.min(100, Math.floor((completed / lessonIds.length) * 100));
}

export async function markLessonProgress(
  lessonId: string,
  studentId: string
) {
  assertUuid(lessonId);

  const lessonRows = await db
    .select({ subjectId: modules.subjectId })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(lessons.id, lessonId))
    .limit(1);

  const lesson = lessonRows[0];
  if (!lesson) {
    throw new NotFoundError("Lesson tidak ditemukan");
  }

  const enrollmentId = await findActiveEnrollmentId(
    studentId,
    lesson.subjectId
  );

  const existing = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.lessonId, lessonId),
        eq(lessonProgress.enrollmentId, enrollmentId)
      )
    );

  if (existing.length === 0) {
    const rows = await db
      .insert(lessonProgress)
      .values({
        enrollmentId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      })
      .returning();
    return rows[0];
  }

  const current = existing[0];
  if (!current) {
    throw new Error("Progress tidak ditemukan");
  }
  const newStatus = !current.isCompleted;
  const rows = await db
    .update(lessonProgress)
    .set({
      isCompleted: newStatus,
      completedAt: newStatus ? new Date() : null,
    })
    .where(eq(lessonProgress.id, current.id))
    .returning();

  return rows[0];
}

export async function getProgressPercentage(
  subjectId: string,
  studentId: string
) {
  assertUuid(subjectId);

  const enrollmentId = await findActiveEnrollmentId(studentId, subjectId);

  const subjectLessons = await db
    .select({ id: lessons.id })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(modules.subjectId, subjectId));

  return calculateCompletion(
    enrollmentId,
    subjectLessons.map((lesson) => lesson.id)
  );
}

export async function getModuleProgressPercentage(
  moduleId: string,
  studentId: string
) {
  assertUuid(moduleId);

  const subjectId = await findModuleSubjectId(moduleId);
  const enrollmentId = await findActiveEnrollmentId(studentId, subjectId);

  const moduleLessons = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId));

  return calculateCompletion(
    enrollmentId,
    moduleLessons.map((lesson) => lesson.id)
  );
}
