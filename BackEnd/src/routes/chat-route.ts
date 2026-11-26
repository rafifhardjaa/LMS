import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { listStudentChatContacts } from "../services/chat-service";
import {
  createChatWsTicket,
  getOrCreateDirectConversation,
  listChatConversations,
  listChatMessages,
  markChatConversationRead,
  sendChatMessage,
} from "../services/chat-messaging-service";
import { handleError } from "../utils/response";

export const chatRoute = new Elysia({ prefix: "/api/v1/chat" })
  .use(authMiddleware)
  .get(
    "/contacts",
    async ({ user, status }: any) => {
      try {
        const data = await listStudentChatContacts(user.id);
        return status(200, {
          success: true,
          message: "Kontak chat siswa berhasil dimuat",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      detail: {
        tags: ["Chat"],
        summary: "Kontak chat siswa berdasarkan kelas",
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/ws-ticket",
    async ({ user, status }: any) => {
      try {
        const data = await createChatWsTicket(user.id);
        return status(200, {
          success: true,
          message: "Ticket WebSocket dibuat",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa", "guru"]),
      detail: {
        tags: ["Chat"],
        summary: "Buat ticket WebSocket sekali pakai",
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .get(
    "/conversations",
    async ({ query, user, status }: any) => {
      try {
        const data = await listChatConversations(
          user.id,
          query.classId || query.class_id,
        );
        return status(200, {
          success: true,
          message: "Percakapan berhasil dimuat",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa", "guru"]),
      detail: {
        tags: ["Chat"],
        summary: "Daftar percakapan pengguna",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        classId: t.Optional(t.String()),
        class_id: t.Optional(t.String()),
      }),
    },
  )
  .post(
    "/conversations",
    async ({ body, user, status }: any) => {
      try {
        const data = await getOrCreateDirectConversation({
          userId: user.id,
          classId: body.classId,
          participantId: body.participantId,
        });
        return status(200, {
          success: true,
          message: "Percakapan siap",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa", "guru"]),
      detail: {
        tags: ["Chat"],
        summary: "Ambil atau buat percakapan direct",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        classId: t.String(),
        participantId: t.String(),
      }),
    },
  )
  .get(
    "/conversations/:id/messages",
    async ({ params, query, user, status }: any) => {
      try {
        const data = await listChatMessages({
          conversationId: params.id,
          userId: user.id,
          before: query.before,
          limit: query.limit ? Number(query.limit) : undefined,
        });
        return status(200, {
          success: true,
          message: "Pesan berhasil dimuat",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa", "guru"]),
      detail: {
        tags: ["Chat"],
        summary: "Riwayat pesan percakapan",
        security: [{ BearerAuth: [] }],
      },
      query: t.Object({
        before: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    },
  )
  .post(
    "/conversations/:id/messages",
    async ({ params, body, user, status }: any) => {
      try {
        const data = await sendChatMessage({
          conversationId: params.id,
          senderId: user.id,
          clientMessageId: body.clientMessageId,
          body: body.body,
        });
        return status(201, {
          success: true,
          message: "Pesan terkirim",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa", "guru"]),
      detail: {
        tags: ["Chat"],
        summary: "Kirim pesan melalui REST",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        clientMessageId: t.String(),
        body: t.String(),
      }),
    },
  )
  .post(
    "/conversations/:id/read",
    async ({ params, body, user, status }: any) => {
      try {
        const data = await markChatConversationRead({
          conversationId: params.id,
          userId: user.id,
          lastMessageId: body?.lastMessageId,
        });
        return status(200, {
          success: true,
          message: "Percakapan ditandai dibaca",
          data,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["siswa", "guru"]),
      detail: {
        tags: ["Chat"],
        summary: "Tandai pesan percakapan sudah dibaca",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        lastMessageId: t.Optional(t.String()),
      }),
    },
  );
