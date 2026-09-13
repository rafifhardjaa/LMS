import { eq, count } from "drizzle-orm";
import { db } from "../db";
import { assignments, assignmentAttempts, grades, modules } from "../db/schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) throw new Error("ID tidak valid");
}

export async function createAssignment(input: {
  moduleId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore?: number;
  createdBy: string;
}) {
  assertUuid(input.moduleId);
  const mod = await db.select({ id: modules.id }).from(modules).where(eq(modules.id, input.moduleId)).limit(1);
  if (!mod.length) throw new Error("Module tidak ditemukan");

  const rows = await db
    .insert(assignments)
    .values({
      moduleId: input.moduleId,
      title: input.title,
      description: input.description,
      dueDate: new Date(input.dueDate),
      maxScore: input.maxScore ?? 100,
      createdBy: input.createdBy,
    })
    .returning();
  return rows[0];
}

export async function listAssignmentsByModule(moduleId: string) {
  assertUuid(moduleId);
  return db.select().from(assignments).where(eq(assignments.moduleId, moduleId));
}

export async function submitAssignment(input: {
  assignmentId: string;
  studentId: string;
  fileUrl: string;
}) {
  assertUuid(input.assignmentId);
  const a = await db.select({ id: assignments.id }).from(assignments).where(eq(assignments.id, input.assignmentId)).limit(1);
  if (!a.length) throw new Error("Assignment tidak ditemukan");

  const cnt = await db
    .select({ value: count() })
    .from(assignmentAttempts)
    .where(eq(assignmentAttempts.assignmentId, input.assignmentId));

  const attemptNumber = (cnt[0]?.value ?? 0) + 1;

  // also count per-student? issue spec says "hitung jumlah attempt di assignmentAttempts"
  // using total attempts count for incremental numbering
  const rows = await db
    .insert(assignmentAttempts)
    .values({
      assignmentId: input.assignmentId,
      studentId: input.studentId,
      fileUrl: input.fileUrl,
      attemptNumber,
    })
    .returning();
  return rows[0];
}

export async function gradeAttempt(input: {
  attemptId: string;
  score: number;
  feedback?: string;
  gradedBy: string;
}) {
  assertUuid(input.attemptId);
  const attempt = await db
    .select()
    .from(assignmentAttempts)
    .where(eq(assignmentAttempts.id, input.attemptId))
    .limit(1);
  if (!attempt.length) throw new Error("Attempt tidak ditemukan");

  const assignmentId = attempt[0]!.assignmentId;
  const assignment = await db
    .select({ maxScore: assignments.maxScore })
    .from(assignments)
    .where(eq(assignments.id, assignmentId))
    .limit(1);

  if (assignment[0]?.maxScore != null && input.score > assignment[0].maxScore) {
    throw new Error("Score melebihi maxScore");
  }

  const rows = await db
    .insert(grades)
    .values({
      attemptId: input.attemptId,
      score: input.score,
      feedback: input.feedback,
      gradedBy: input.gradedBy,
    })
    .returning();
  return rows[0];
}
