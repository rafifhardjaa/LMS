import { createHash, randomBytes } from "node:crypto";
import {
  and,
  desc,
  eq,
  gt,
  isNull,
  lt,
  ne,
  sql,
} from "drizzle-orm";
import { db } from "../db";
import {
  chatConversationParticipants,
  chatConversations,
  chatMessages,
  chatWsTickets,
  classes,
  teacherClassrooms,
  teachingAssignments,
  users,
} from "../db/schema";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/response";
import { canonicalRole, getUserRoleName } from "./role-service";

const TICKET_TTL_MS = 30_000;
const MAX_MESSAGE_LENGTH = 4_000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export type ChatMessageDto = {
  id: string;
  conversationId: string;
  senderId: string;
  clientMessageId: string;
  body: string;
  createdAt: string;
};

export type ChatConversationSummary = {
  id: string;
  classId: string;
  otherUserId: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

type ChatActor = {
  id: string;
  role: string;
  classId: string | null;
  name: string;
  identifier: string | null;
};

function pairKey(firstUserId: string, secondUserId: string) {
  return [firstUserId, secondUserId].sort().join(":");
}

function toMessageDto(row: typeof chatMessages.$inferSelect): ChatMessageDto {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    clientMessageId: row.clientMessageId,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

async function getChatActor(userId: string): Promise<ChatActor> {
  const [row] = await db
    .select({
      id: users.id,
      name: users.fullName,
      identifier: users.nomorInduk,
      classId: users.classId,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) throw new NotFoundError("Pengguna tidak ditemukan");
  if (!row.isActive) throw new ForbiddenError("Akun pengguna tidak aktif");

  const role = canonicalRole((await getUserRoleName(userId)) ?? "siswa");
  return {
    id: row.id,
    role,
    classId: row.classId,
    name: row.name,
    identifier: row.identifier,
  };
}

async function teacherHasClass(teacherId: string, classId: string) {
  const [classroom] = await db
    .select({ id: teacherClassrooms.id })
    .from(teacherClassrooms)
    .where(
      and(
        eq(teacherClassrooms.teacherId, teacherId),
        eq(teacherClassrooms.classId, classId),
      ),
    )
    .limit(1);
  if (classroom) return true;

  const [assignment] = await db
    .select({ id: teachingAssignments.id })
    .from(teachingAssignments)
    .where(
      and(
        eq(teachingAssignments.teacherId, teacherId),
        eq(teachingAssignments.classId, classId),
      ),
    )
    .limit(1);
  if (assignment) return true;

  const [advisor] = await db
    .select({ id: classes.id })
    .from(classes)
    .where(and(eq(classes.id, classId), eq(classes.advisorId, teacherId)))
    .limit(1);
  return Boolean(advisor);
}

async function assertCanChat(
  actor: ChatActor,
  other: ChatActor,
  classId: string,
) {
  if (actor.role === "siswa" && other.role === "siswa") {
    if (actor.classId !== classId || other.classId !== classId) {
      throw new ForbiddenError("Chat hanya untuk siswa satu kelas");
    }
    return;
  }

  if (actor.role === "guru" && other.role === "siswa") {
    if (other.classId !== classId) {
      throw new ForbiddenError("Siswa tidak terdaftar pada kelas ini");
    }
    if (!(await teacherHasClass(actor.id, classId))) {
      throw new ForbiddenError("Guru tidak mengampu kelas ini");
    }
    return;
  }

  if (actor.role === "siswa" && other.role === "guru") {
    if (actor.classId !== classId) {
      throw new ForbiddenError("Anda tidak terdaftar pada kelas ini");
    }
    if (!(await teacherHasClass(other.id, classId))) {
      throw new ForbiddenError("Guru tidak mengampu kelas ini");
    }
    return;
  }

  throw new ForbiddenError("Tipe percakapan tidak didukung");
}

export async function getOrCreateDirectConversation({
  userId,
  classId,
  participantId,
}: {
  userId: string;
  classId: string;
  participantId: string;
}) {
  if (userId === participantId) {
    throw new BadRequestError("Tidak dapat membuat chat dengan diri sendiri");
  }

  const [actor, other] = await Promise.all([
    getChatActor(userId),
    getChatActor(participantId),
  ]);
  await assertCanChat(actor, other, classId);

  const key = pairKey(userId, participantId);

  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(chatConversations)
      .values({
        classId,
        participantKey: key,
        createdBy: userId,
      })
      .onConflictDoNothing({
        target: chatConversations.participantKey,
      })
      .returning();

    let conversation = created;
    if (!conversation) {
      const [existing] = await tx
        .select()
        .from(chatConversations)
        .where(eq(chatConversations.participantKey, key))
        .limit(1);
      conversation = existing;
    }

    if (!conversation) {
      throw new NotFoundError("Percakapan tidak dapat dibuat");
    }

    await tx
      .insert(chatConversationParticipants)
      .values([
        { conversationId: conversation.id, userId },
        { conversationId: conversation.id, userId: participantId },
      ])
      .onConflictDoNothing();

    return {
      id: conversation.id,
      classId: conversation.classId,
      participantId,
    };
  });
}

export async function assertConversationParticipant(
  conversationId: string,
  userId: string,
) {
  const [participant] = await db
    .select({ userId: chatConversationParticipants.userId })
    .from(chatConversationParticipants)
    .where(
      and(
        eq(chatConversationParticipants.conversationId, conversationId),
        eq(chatConversationParticipants.userId, userId),
      ),
    )
    .limit(1);

  if (!participant) {
    throw new ForbiddenError("Anda bukan peserta percakapan ini");
  }
}

export async function listChatConversations(
  userId: string,
  classId?: string,
): Promise<ChatConversationSummary[]> {
  const conditions = [
    eq(chatConversationParticipants.userId, userId),
  ];
  if (classId) conditions.push(eq(chatConversations.classId, classId));

  const rows = await db
    .select({
      id: chatConversations.id,
      classId: chatConversations.classId,
      lastMessageAt: chatConversations.lastMessageAt,
      lastReadAt: chatConversationParticipants.lastReadAt,
    })
    .from(chatConversationParticipants)
    .innerJoin(
      chatConversations,
      eq(chatConversationParticipants.conversationId, chatConversations.id),
    )
    .where(and(...conditions))
    .orderBy(desc(chatConversations.lastMessageAt));

  return Promise.all(
    rows.map(async (row) => {
      const [otherParticipant] = await db
        .select({ userId: chatConversationParticipants.userId })
        .from(chatConversationParticipants)
        .where(
          and(
            eq(
              chatConversationParticipants.conversationId,
              row.id,
            ),
            ne(chatConversationParticipants.userId, userId),
          ),
        )
        .limit(1);

      const [lastMessage] = await db
        .select({
          body: chatMessages.body,
          createdAt: chatMessages.createdAt,
        })
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, row.id))
        .orderBy(desc(chatMessages.createdAt))
        .limit(1);

      const unreadConditions = [
        eq(chatMessages.conversationId, row.id),
        ne(chatMessages.senderId, userId),
      ];
      if (row.lastReadAt) {
        unreadConditions.push(gt(chatMessages.createdAt, row.lastReadAt));
      }
      const [unread] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(chatMessages)
        .where(and(...unreadConditions));

      return {
        id: row.id,
        classId: row.classId,
        otherUserId: otherParticipant?.userId ?? "",
        lastMessage: lastMessage?.body ?? null,
        lastMessageAt:
          lastMessage?.createdAt.toISOString() ??
          row.lastMessageAt?.toISOString() ??
          null,
        unreadCount: Number(unread?.count ?? 0),
      };
    }),
  );
}

export async function listChatMessages({
  conversationId,
  userId,
  before,
  limit,
}: {
  conversationId: string;
  userId: string;
  before?: string;
  limit?: number;
}) {
  await assertConversationParticipant(conversationId, userId);

  const pageSize = Math.min(
    Math.max(Number(limit) || DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE,
  );
  const conditions = [eq(chatMessages.conversationId, conversationId)];
  if (before) {
    const beforeDate = new Date(before);
    if (Number.isNaN(beforeDate.getTime())) {
      throw new BadRequestError("Cursor pesan tidak valid");
    }
    conditions.push(lt(chatMessages.createdAt, beforeDate));
  }

  const rows = await db
    .select()
    .from(chatMessages)
    .where(and(...conditions))
    .orderBy(desc(chatMessages.createdAt))
    .limit(pageSize + 1);

  const hasMore = rows.length > pageSize;
  const page = hasMore ? rows.slice(0, pageSize) : rows;

  return {
    messages: page.map(toMessageDto).reverse(),
    hasMore,
    nextBefore:
      hasMore && page.length
        ? page[page.length - 1]!.createdAt.toISOString()
        : null,
  };
}

export async function getConversationParticipantIds(
  conversationId: string,
) {
  const rows = await db
    .select({ userId: chatConversationParticipants.userId })
    .from(chatConversationParticipants)
    .where(
      eq(chatConversationParticipants.conversationId, conversationId),
    );
  return rows.map((row) => row.userId);
}

export async function sendChatMessage({
  conversationId,
  senderId,
  clientMessageId,
  body,
}: {
  conversationId: string;
  senderId: string;
  clientMessageId: string;
  body: string;
}) {
  await assertConversationParticipant(conversationId, senderId);

  const cleanBody = body.trim();
  if (!cleanBody) throw new BadRequestError("Pesan wajib diisi");
  if (cleanBody.length > MAX_MESSAGE_LENGTH) {
    throw new BadRequestError(
      `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter`,
    );
  }

  const message = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(chatMessages)
      .values({
        conversationId,
        senderId,
        clientMessageId,
        body: cleanBody,
      })
      .onConflictDoNothing()
      .returning();

    let row = created;
    if (!row) {
      const [existing] = await tx
        .select()
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.conversationId, conversationId),
            eq(chatMessages.clientMessageId, clientMessageId),
          ),
        )
        .limit(1);
      row = existing;
    }
    if (!row) throw new NotFoundError("Pesan tidak dapat disimpan");

    await tx
      .update(chatConversations)
      .set({ lastMessageAt: row.createdAt, updatedAt: new Date() })
      .where(eq(chatConversations.id, conversationId));

    return row;
  });

  return toMessageDto(message);
}

export async function markChatConversationRead({
  conversationId,
  userId,
  lastMessageId,
}: {
  conversationId: string;
  userId: string;
  lastMessageId?: string;
}) {
  await assertConversationParticipant(conversationId, userId);

  let readAt = new Date();
  if (lastMessageId) {
    const [message] = await db
      .select({ createdAt: chatMessages.createdAt })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.id, lastMessageId),
          eq(chatMessages.conversationId, conversationId),
        ),
      )
      .limit(1);
    if (!message) throw new NotFoundError("Pesan tidak ditemukan");
    readAt = message.createdAt;
  }

  await db
    .update(chatConversationParticipants)
    .set({ lastReadAt: readAt })
    .where(
      and(
        eq(chatConversationParticipants.conversationId, conversationId),
        eq(chatConversationParticipants.userId, userId),
      ),
    );

  return { lastReadAt: readAt.toISOString() };
}

function ticketHash(ticket: string) {
  return createHash("sha256").update(ticket).digest("hex");
}

export async function createChatWsTicket(userId: string) {
  const ticket = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TICKET_TTL_MS);
  await db
    .delete(chatWsTickets)
    .where(lt(chatWsTickets.expiresAt, new Date()));
  await db.insert(chatWsTickets).values({
    tokenHash: ticketHash(ticket),
    userId,
    expiresAt,
  });
  return { ticket, expiresAt: expiresAt.toISOString() };
}

export async function consumeChatWsTicket(ticket: string) {
  if (!ticket) throw new BadRequestError("Ticket wajib diisi");
  const [row] = await db
    .update(chatWsTickets)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(chatWsTickets.tokenHash, ticketHash(ticket)),
        isNull(chatWsTickets.usedAt),
        gt(chatWsTickets.expiresAt, new Date()),
      ),
    )
    .returning({ userId: chatWsTickets.userId });

  if (!row) throw new ForbiddenError("Ticket WebSocket tidak valid");
  return row.userId;
}
