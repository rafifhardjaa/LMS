import { Elysia } from "elysia";
import {
  assertConversationParticipant,
  consumeChatWsTicket,
  getConversationParticipantIds,
  markChatConversationRead,
  sendChatMessage,
} from "../services/chat-messaging-service";
import { canonicalRole } from "../services/role-service";
import { getSessionUserById } from "../services/users-services";

type SocketUser = {
  id: string;
  role: string;
};

const connections = new Map<string, SocketUser>();

function sendJson(ws: any, payload: unknown) {
  ws.send(JSON.stringify(payload));
}

function allowedOrigins() {
  const values = [
    process.env.APP_URL ?? "http://localhost:3001",
    ...(process.env.CORS_ORIGINS ?? "").split(","),
  ];
  return new Set(
    values
      .map((value) => value.trim().replace(/\/+$/, ""))
      .filter(Boolean),
  );
}

function isAllowedOrigin(origin: string | null) {
  if (!origin) return true;
  return allowedOrigins().has(origin.replace(/\/+$/, ""));
}

function requestUrl(ws: any) {
  const raw = ws.data?.request?.url;
  return raw ? new URL(raw) : null;
}

export const chatWsRoute = new Elysia({ prefix: "/api/v1/chat" })
  .ws("/ws", {
    async open(ws: any) {
      try {
        const url = requestUrl(ws);
        const ticket =
          url?.searchParams.get("ticket") ??
          ws.data?.query?.ticket ??
          "";
        const origin =
          ws.data?.headers?.origin ??
          ws.data?.request?.headers?.get("origin") ??
          null;

        if (!isAllowedOrigin(origin)) {
          ws.close(4403, "Origin tidak diizinkan");
          return;
        }

        const userId = await consumeChatWsTicket(String(ticket));
        const user = await getSessionUserById(userId);
        const role = canonicalRole(user.role);
        if (role !== "siswa" && role !== "guru") {
          ws.close(4403, "Role tidak diizinkan");
          return;
        }

        connections.set(ws.id, { id: userId, role });
        ws.subscribe(`user:${userId}`);
        sendJson(ws, {
          type: "connection:ready",
          userId,
          role,
        });
      } catch {
        ws.close(4401, "Unauthorized");
      }
    },
    async message(ws: any, raw: any) {
      const user = connections.get(ws.id);
      if (!user) {
        ws.close(4401, "Unauthorized");
        return;
      }

      let payload: any;
      try {
        if (typeof raw === "string") {
          payload = JSON.parse(raw);
        } else if (raw instanceof Uint8Array) {
          payload = JSON.parse(new TextDecoder().decode(raw));
        } else {
          payload = raw;
        }
      } catch {
        sendJson(ws, { type: "error", message: "Payload tidak valid" });
        return;
      }

      try {
        if (payload?.type === "ping") {
          sendJson(ws, { type: "pong" });
          return;
        }

        if (payload?.type === "message:send") {
          const conversationId = String(payload.conversationId ?? "");
          const clientMessageId = String(payload.clientMessageId ?? "");
          const body = String(payload.body ?? "");
          if (!conversationId) {
            sendJson(ws, { type: "error", message: "conversationId wajib" });
            return;
          }

          const message = await sendChatMessage({
            conversationId,
            senderId: user.id,
            clientMessageId,
            body,
          });
          sendJson(ws, { type: "message:ack", message });

          const participantIds =
            await getConversationParticipantIds(conversationId);
          for (const participantId of participantIds) {
            if (participantId === user.id) continue;
            ws.publish(
              `user:${participantId}`,
              JSON.stringify({ type: "message:new", message }),
            );
          }
          return;
        }

        if (payload?.type === "message:read") {
          const conversationId = String(payload.conversationId ?? "");
          if (!conversationId) {
            sendJson(ws, { type: "error", message: "conversationId wajib" });
            return;
          }

          const result = await markChatConversationRead({
            conversationId,
            userId: user.id,
            lastMessageId: payload.lastMessageId
              ? String(payload.lastMessageId)
              : undefined,
          });
          const participantIds =
            await getConversationParticipantIds(conversationId);
          for (const participantId of participantIds) {
            if (participantId === user.id) continue;
            ws.publish(
              `user:${participantId}`,
              JSON.stringify({
                type: "message:read",
                conversationId,
                userId: user.id,
                lastReadAt: result.lastReadAt,
              }),
            );
          }
          return;
        }

        if (
          payload?.type === "typing:start" ||
          payload?.type === "typing:stop"
        ) {
          const conversationId = String(payload.conversationId ?? "");
          if (!conversationId) {
            sendJson(ws, { type: "error", message: "conversationId wajib" });
            return;
          }
          await assertConversationParticipant(conversationId, user.id);
          const participantIds =
            await getConversationParticipantIds(conversationId);
          for (const participantId of participantIds) {
            if (participantId === user.id) continue;
            ws.publish(
              `user:${participantId}`,
              JSON.stringify({
                type: payload.type,
                conversationId,
                userId: user.id,
              }),
            );
          }
          return;
        }

        sendJson(ws, { type: "error", message: "Event tidak dikenal" });
      } catch (error) {
        sendJson(ws, {
          type: "error",
          message:
            error instanceof Error ? error.message : "Gagal memproses event",
        });
      }
    },
    close(ws: any) {
      connections.delete(ws.id);
    },
  });
