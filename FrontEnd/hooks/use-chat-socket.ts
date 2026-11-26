"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatApi } from "@/lib/api/client";
import type { ChatMessageDto } from "@/lib/api/types";

export type ChatSocketStatus = "connecting" | "open" | "closed";

export type ChatSocketEvent =
  | { type: "connection:ready"; userId: string; role: string }
  | { type: "message:ack"; message: ChatMessageDto }
  | { type: "message:new"; message: ChatMessageDto }
  | {
      type: "message:read";
      conversationId: string;
      userId: string;
      lastReadAt: string;
    }
  | {
      type: "typing:start" | "typing:stop";
      conversationId: string;
      userId: string;
    }
  | { type: "error"; message: string }
  | { type: "pong" };

function websocketUrl(ticket: string) {
  const raw =
    process.env.NEXT_PUBLIC_WS_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3000";
  const base = raw
    .trim()
    .replace(/\/+$/, "")
    .replace(/^http/i, "ws");
  return `${base}/api/v1/chat/ws?ticket=${encodeURIComponent(ticket)}`;
}

export function useChatSocket(
  onEvent: (event: ChatSocketEvent) => void,
) {
  const [status, setStatus] = useState<ChatSocketStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);
  const heartbeatRef = useRef<number | null>(null);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    let disposed = false;
    let attempt = 0;
    let reconnectTimer: number | null = null;

    function clearHeartbeat() {
      if (heartbeatRef.current !== null) {
        window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    }

    function scheduleReconnect() {
      if (disposed) return;
      const delay = Math.min(1000 * 2 ** attempt, 15000);
      attempt += 1;
      reconnectTimer = window.setTimeout(() => {
        void connect();
      }, delay);
    }

    async function connect() {
      if (disposed) return;
      setStatus("connecting");
      try {
        const ticketRes = await chatApi.wsTicket.create();
        if (disposed) return;
        if (ticketRes.error || !ticketRes.data?.data.ticket) {
          throw new Error(
            ticketRes.error?.message ?? "Gagal membuat ticket WebSocket",
          );
        }

        const socket = new WebSocket(
          websocketUrl(ticketRes.data.data.ticket),
        );
        socketRef.current = socket;

        socket.onopen = () => {
          if (disposed) {
            socket.close();
            return;
          }
          attempt = 0;
          setStatus("open");
          clearHeartbeat();
          heartbeatRef.current = window.setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: "ping" }));
            }
          }, 25000);
        };

        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(String(event.data)) as ChatSocketEvent;
            onEventRef.current(payload);
          } catch {
            onEventRef.current({
              type: "error",
              message: "Payload WebSocket tidak valid",
            });
          }
        };

        socket.onclose = () => {
          clearHeartbeat();
          if (disposed) return;
          setStatus("closed");
          scheduleReconnect();
        };

        socket.onerror = () => {
          if (socket.readyState !== WebSocket.CLOSED) {
            socket.close();
          }
        };
      } catch {
        if (!disposed) {
          setStatus("closed");
          scheduleReconnect();
        }
      }
    }

    void connect();

    return () => {
      disposed = true;
      clearHeartbeat();
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  const send = useCallback((payload: unknown) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(payload));
    return true;
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, clientMessageId: string, body: string) =>
      send({
        type: "message:send",
        conversationId,
        clientMessageId,
        body,
      }),
    [send],
  );

  const sendRead = useCallback(
    (conversationId: string, lastMessageId?: string) =>
      send({
        type: "message:read",
        conversationId,
        lastMessageId,
      }),
    [send],
  );

  const sendTyping = useCallback(
    (conversationId: string, active: boolean) =>
      send({
        type: active ? "typing:start" : "typing:stop",
        conversationId,
      }),
    [send],
  );

  return {
    status,
    isOpen: status === "open",
    sendMessage,
    sendRead,
    sendTyping,
  };
}
