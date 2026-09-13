import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { enrollments, subjects, users } from "../db/schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new Error("ID tidak valid");
  }
}

export async function createEnrollment(input: {
  studentId: string;
  subjectId: string;
}) {
  assertUuid(input.studentId);
  assertUuid(input.subjectId);

  const subjectRows = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.id, input.subjectId))
    .limit(1);
  if (subjectRows.length === 0) {
    throw new Error("Subject tidak ditemukan");
  }

  const existing = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, input.studentId),
        eq(enrollments.subjectId, input.subjectId)
      )
    )
    .limit(1);
  if (existing.length > 0) {
    throw new Error("Sudah terdaftar di subject ini");
  }

  const rows = await db
    .insert(enrollments)
    .values({
      studentId: input.studentId,
      subjectId: input.subjectId,
      status: "active",
    })
    .returning();
  return rows[0];
}

export async function listEnrollmentsByStudent(studentId: string) {
  assertUuid(studentId);
  return db
    .select({
      id: enrollments.id,
      subjectId: enrollments.subjectId,
      status: enrollments.status,
      enrolledAt: enrollments.enrolledAt,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      subjectDescription: subjects.description,
    })
    .from(enrollments)
    .innerJoin(subjects, eq(enrollments.subjectId, subjects.id))
    .where(eq(enrollments.studentId, studentId));
}

export async function updateEnrollmentStatus(
  id: string,
  status: string
) {
  assertUuid(id);
  const existing = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, id))
    .limit(1);
  if (existing.length === 0) {
    throw new Error("Enrollment tidak ditemukan");
  }

  const rows = await db
    .update(enrollments)
    .set({ status })
    .where(eq(enrollments.id, id))
    .returning();
  return rows[0];
}
