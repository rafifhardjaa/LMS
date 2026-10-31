import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import {
  enrollments,
  moduleDiscussionReplies,
  moduleDiscussions,
  roles,
  userRoles,
  users,
} from "../db/schema";
import { canonicalRole } from "./role-service";
import {
  assertCanManageModule,
  assertUuid,
  findModuleById,
} from "./modules-services";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/response";

type Actor = {
  id: string;
  role: string;
  full_name?: string;
  name?: string;
  avatar_url?: string | null;
};

type ModuleRow = Awaited<ReturnType<typeof findModuleById>>;

const MAX_BODY_LENGTH = 2000;
const MAX_DISCUSSIONS = 100;

function normalizeBody(body: string, label = "Pertanyaan") {
  const trimmed = String(body ?? "").trim();
  if (!trimmed) {
    throw new BadRequestError(`${label} tidak boleh kosong`);
  }
  if (trimmed.length > MAX_BODY_LENGTH) {
    throw new BadRequestError(
      `${label} maksimal ${MAX_BODY_LENGTH} karakter`
    );
  }
  return trimmed;
}

async function getModuleOrThrow(moduleId: string) {
  const module = await findModuleById(moduleId);
  if (!module) {
    throw new NotFoundError("Module tidak ditemukan");
  }
  return module;
}

async function isEnrolled(studentId: string, subjectId: string) {
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
  return rows.length > 0;
}

async function assertCanViewDiscussions(
  module: NonNullable<ModuleRow>,
  actor: Actor
) {
  const role = canonicalRole(actor.role);
  if (role === "admin") return;
  if (role === "guru" && module.teacherId === actor.id) return;
  if (role === "siswa") {
    if (await isEnrolled(actor.id, module.subjectId)) return;
    throw new ForbiddenError("Anda belum terdaftar di mata pelajaran ini");
  }
  throw new ForbiddenError("Akses ditolak: Peran tidak valid");
}

async function assertCanAsk(module: NonNullable<ModuleRow>, actor: Actor) {
  if (canonicalRole(actor.role) !== "siswa") {
    throw new ForbiddenError("Hanya siswa yang dapat bertanya");
  }
  if (!(await isEnrolled(actor.id, module.subjectId))) {
    throw new ForbiddenError("Anda belum terdaftar di mata pelajaran ini");
  }
}

async function getRoleMap(userIds: string[]) {
  const uniqueIds = [...new Set(userIds)];
  const map = new Map<string, string>();
  if (uniqueIds.length === 0) return map;

  const rows = await db
    .select({ userId: userRoles.userId, role: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(inArray(userRoles.userId, uniqueIds));

  for (const row of rows) {
    if (!map.has(row.userId)) {
      map.set(row.userId, canonicalRole(row.role));
    }
  }
  return map;
}

function actorAuthor(actor: Actor) {
  return {
    id: actor.id,
    full_name: actor.full_name ?? actor.name ?? "",
    role: canonicalRole(actor.role),
    avatar_url: actor.avatar_url ?? null,
  };
}

export async function listDiscussions(moduleId: string, actor: Actor) {
  const module = await getModuleOrThrow(moduleId);
  await assertCanViewDiscussions(module, actor);

  const threads = await db
    .select({
      id: moduleDiscussions.id,
      module_id: moduleDiscussions.moduleId,
      body: moduleDiscussions.body,
      created_at: moduleDiscussions.createdAt,
      author_id: moduleDiscussions.authorId,
      author_name: users.fullName,
      author_avatar_url: users.avatarUrl,
    })
    .from(moduleDiscussions)
    .innerJoin(users, eq(moduleDiscussions.authorId, users.id))
    .where(eq(moduleDiscussions.moduleId, moduleId))
    .orderBy(desc(moduleDiscussions.createdAt))
    .limit(MAX_DISCUSSIONS);

  const discussionIds = threads.map((thread) => thread.id);
  const replies =
    discussionIds.length > 0
      ? await db
          .select({
            id: moduleDiscussionReplies.id,
            discussion_id: moduleDiscussionReplies.discussionId,
            body: moduleDiscussionReplies.body,
            created_at: moduleDiscussionReplies.createdAt,
            author_id: moduleDiscussionReplies.authorId,
            author_name: users.fullName,
            author_avatar_url: users.avatarUrl,
          })
          .from(moduleDiscussionReplies)
          .innerJoin(users, eq(moduleDiscussionReplies.authorId, users.id))
          .where(
            inArray(moduleDiscussionReplies.discussionId, discussionIds)
          )
          .orderBy(asc(moduleDiscussionReplies.createdAt))
      : [];

  const roleMap = await getRoleMap([
    ...threads.map((thread) => thread.author_id),
    ...replies.map((reply) => reply.author_id),
  ]);

  return threads.map((thread) => ({
    id: thread.id,
    module_id: thread.module_id,
    body: thread.body,
    created_at: thread.created_at,
    author: {
      id: thread.author_id,
      full_name: thread.author_name,
      role: roleMap.get(thread.author_id) ?? "siswa",
      avatar_url: thread.author_avatar_url,
    },
    replies: replies
      .filter((reply) => reply.discussion_id === thread.id)
      .map((reply) => ({
        id: reply.id,
        discussion_id: reply.discussion_id,
        body: reply.body,
        created_at: reply.created_at,
        author: {
          id: reply.author_id,
          full_name: reply.author_name,
          role: roleMap.get(reply.author_id) ?? "siswa",
          avatar_url: reply.author_avatar_url,
        },
      })),
  }));
}

export async function createDiscussion(
  moduleId: string,
  actor: Actor,
  body: string
) {
  const module = await getModuleOrThrow(moduleId);
  await assertCanAsk(module, actor);
  const normalized = normalizeBody(body);

  const rows = await db
    .insert(moduleDiscussions)
    .values({
      moduleId: module.id,
      authorId: actor.id,
      body: normalized,
    })
    .returning({
      id: moduleDiscussions.id,
      module_id: moduleDiscussions.moduleId,
      body: moduleDiscussions.body,
      created_at: moduleDiscussions.createdAt,
    });

  const thread = rows[0];
  if (!thread) {
    throw new Error("Gagal menyimpan pertanyaan");
  }

  return {
    ...thread,
    author: actorAuthor(actor),
    replies: [],
  };
}

export async function createReply(
  moduleId: string,
  discussionId: string,
  actor: Actor,
  body: string
) {
  assertUuid(discussionId);
  await assertCanManageModule(moduleId, actor);

  const discussionRows = await db
    .select({ id: moduleDiscussions.id })
    .from(moduleDiscussions)
    .where(
      and(
        eq(moduleDiscussions.id, discussionId),
        eq(moduleDiscussions.moduleId, moduleId)
      )
    )
    .limit(1);

  if (!discussionRows[0]) {
    throw new NotFoundError("Diskusi tidak ditemukan");
  }

  const normalized = normalizeBody(body, "Balasan");
  const rows = await db
    .insert(moduleDiscussionReplies)
    .values({
      discussionId,
      authorId: actor.id,
      body: normalized,
    })
    .returning({
      id: moduleDiscussionReplies.id,
      discussion_id: moduleDiscussionReplies.discussionId,
      body: moduleDiscussionReplies.body,
      created_at: moduleDiscussionReplies.createdAt,
    });

  const reply = rows[0];
  if (!reply) {
    throw new Error("Gagal menyimpan balasan");
  }

  return {
    ...reply,
    author: actorAuthor(actor),
  };
}

