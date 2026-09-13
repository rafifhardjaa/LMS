import { and, eq, desc } from "drizzle-orm";
import { db } from "../db";
import { reviews, notifications, subjects } from "../db/schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(id: string) {
  if (!UUID_RE.test(id)) {
    throw new Error("ID tidak valid");
  }
}

// ── REVIEWS ────────────────────────────────────────────────────────────

export async function createReview(input: {
  subjectId: string;
  rating: number;
  comment?: string;
  studentId: string;
}) {
  assertUuid(input.subjectId);

  const subjectExists = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.id, input.subjectId));

  if (subjectExists.length === 0) {
    throw new Error("Subject tidak ditemukan");
  }

  const existing = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(
      and(
        eq(reviews.subjectId, input.subjectId),
        eq(reviews.studentId, input.studentId)
      )
    );

  if (existing.length > 0) {
    throw new Error("Anda sudah memberikan ulasan untuk mata pelajaran ini");
  }

  const rows = await db
    .insert(reviews)
    .values({
      subjectId: input.subjectId,
      studentId: input.studentId,
      rating: input.rating,
      comment: input.comment,
    })
    .returning();

  return rows[0];
}

export async function listReviewsBySubject(subjectId: string) {
  assertUuid(subjectId);

  const subjectExists = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.id, subjectId));

  if (subjectExists.length === 0) {
    throw new Error("Subject tidak ditemukan");
  }

  return db
    .select()
    .from(reviews)
    .where(eq(reviews.subjectId, subjectId))
    .orderBy(desc(reviews.createdAt));
}

export async function deleteReview(id: string) {
  assertUuid(id);

  const rows = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning();

  if (rows.length === 0) {
    throw new Error("Ulasan tidak ditemukan");
  }

  return rows[0];
}

// ── NOTIFICATIONS ──────────────────────────────────────────────────────

export async function listUserNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: string, userId: string) {
  assertUuid(id);

  const existing = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id));

  const notif = existing[0];
  if (!notif) {
    throw new Error("Notifikasi tidak ditemukan");
  }

  if (notif.userId !== userId) {
    throw new Error("Akses ditolak");
  }

  const rows = await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, id))
    .returning();

  return rows[0];
}

export async function markAllNotificationsAsRead(userId: string) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId));

  return { success: true };
}
