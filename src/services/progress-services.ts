import { and, eq, count } from "drizzle-orm";
import { db } from "../db";
import { lessonProgress, enrollments, lessons } from "../db/schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new Error("ID tidak valid");
  }
}

export async function markLessonProgress(
  lessonId: string,
  studentId: string
) {
  assertUuid(lessonId);

  const enrollment = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.subjectId, lessonId)
      )
    )
    .limit(1);

  const lesson = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  if (lesson.length === 0) {
    throw new Error("Lesson tidak ditemukan");
  }

  const enrollmentId = enrollment[0]?.id;
  if (!enrollmentId) {
    throw new Error("Enrollment tidak ditemukan");
  }

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

  const enrollment = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.subjectId, subjectId)
      )
    );

  if (enrollment.length === 0) {
    throw new Error("Enrollment tidak ditemukan");
  }

  const enroll = enrollment[0];
  if (!enroll) {
    throw new Error("Enrollment tidak ditemukan");
  }

  const enrollmentId = enroll.id;

  const allLessons = await db
    .select({ id: lessons.id })
    .from(lessons)
    .innerJoin(enrollments, eq(lessons.moduleId, enrollments.subjectId))
    .where(eq(enrollments.id, enrollmentId));

  const totalLessons = allLessons.length;
  if (totalLessons === 0) {
    return 0;
  }

  const completedCount = await db
    .select({ count: count() })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.enrollmentId, enrollmentId),
        eq(lessonProgress.isCompleted, true)
      )
    );

  const completed = completedCount[0]?.count ?? 0;
  return Math.round((completed / totalLessons) * 100);
}
