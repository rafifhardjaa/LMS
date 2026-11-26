"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MessageCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { chatApi } from "@/lib/api/client";
import type { ChatMessageDto } from "@/lib/api/types";
import { useChatSocket, type ChatSocketEvent } from "@/hooks/use-chat-socket";
import { useAuthStore } from "@/lib/store/auth-store";
import { ConversationList } from "./conversation-list";
import { MessageComposer } from "./message-composer";
import { MessageThread } from "./message-thread";
import {
  buildStudentConversations,
  identifierLabel,
  initialsOf,
  roleLabel,
} from "./data";
import type { ChatMessage, Conversation } from "./types";

export function StudentChat() {
  const user = useAuthStore((state) => state.user);
  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        setLoading(true);
        setError(null);
        const [contactRes, conversationRes] = await Promise.all([
          chatApi.contacts.list(),
          chatApi.conversations.list(),
        ]);
        if (!active) return;
        if (contactRes.error) {
          throw new Error(
            contactRes.error.message ?? "Gagal memuat kontak chat.",
          );
        }
        if (conversationRes.error) {
          throw new Error(
            conversationRes.error.message ?? "Gagal memuat percakapan.",
          );
        }

        const data = contactRes.data?.data;
        const summaryByUser = new Map(
          (conversationRes.data?.data ?? []).map((summary) => [
            summary.otherUserId,
            summary,
          ]),
        );
        const nextConversations = buildStudentConversations(
          data?.contacts ?? [],
        ).map((conversation) => {
          const summary = summaryByUser.get(conversation.id);
          return {
            ...conversation,
            conversationId: summary?.id ?? null,
            lastMessage: summary?.lastMessage ?? "Belum ada pesan",
            lastMessageAt: summary?.lastMessageAt ?? null,
            unreadCount: summary?.unreadCount ?? 0,
          };
        });
        if (!active) return;

        setClassName(data?.class.name ?? "");
        setClassId(data?.class.id ?? "");
        setConversations(nextConversations);
        setSelectedId(
          window.matchMedia("(min-width: 1024px)").matches
            ? nextConversations[0]?.id ?? null
            : null,
        );
      } catch (loadError) {
        if (active) {
          setConversations([]);
          setSelectedId(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat data chat.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const toLocalMessage = useCallback(
    (message: ChatMessageDto): ChatMessage => ({
      id: message.id,
      direction: message.senderId === user?.id ? "outgoing" : "incoming",
      body: message.body,
      sentAt: message.createdAt,
      clientMessageId: message.clientMessageId,
    }),
    [user?.id],
  );

  const handleSocketEvent = useCallback(
    (event: ChatSocketEvent) => {
      if (event.type === "message:new") {
        const localMessage = toLocalMessage(event.message);
        const target = conversations.find(
          (conversation) =>
            conversation.conversationId === event.message.conversationId,
        );
        setConversations((current) =>
          current.map((conversation) =>
            conversation.conversationId === event.message.conversationId
              ? {
                  ...conversation,
                  messages: [...conversation.messages, localMessage],
                  lastMessage: localMessage.body,
                  lastMessageAt: localMessage.sentAt,
                  unreadCount:
                    selectedIdRef.current === conversation.id
                      ? 0
                      : conversation.unreadCount + 1,
                }
              : conversation,
          ),
        );
        if (target && selectedIdRef.current === target.id) {
          void chatApi.messages.read(
            event.message.conversationId,
            event.message.id,
          );
        }
        return;
      }

      if (event.type === "message:ack") {
        const localMessage = toLocalMessage(event.message);
        setConversations((current) =>
          current.map((conversation) => {
            if (
              conversation.conversationId !== event.message.conversationId
            ) {
              return conversation;
            }
            const hasTemp = conversation.messages.some(
              (message) =>
                message.clientMessageId === localMessage.clientMessageId,
            );
            const messages = hasTemp
              ? conversation.messages.map((message) =>
                  message.clientMessageId === localMessage.clientMessageId
                    ? localMessage
                    : message,
                )
              : [...conversation.messages, localMessage];
            return {
              ...conversation,
              messages,
              lastMessage: localMessage.body,
              lastMessageAt: localMessage.sentAt,
              unreadCount: 0,
            };
          }),
        );
        return;
      }

      if (
        event.type === "typing:start" ||
        event.type === "typing:stop"
      ) {
        const target = conversations.find(
          (conversation) =>
            conversation.conversationId === event.conversationId,
        );
        if (!target || selectedIdRef.current !== target.id) return;
        if (event.type === "typing:stop") {
          setTypingUserId(null);
          return;
        }
        setTypingUserId(event.userId);
        if (typingTimerRef.current !== null) {
          window.clearTimeout(typingTimerRef.current);
        }
        typingTimerRef.current = window.setTimeout(
          () => setTypingUserId(null),
          3000,
        );
      }
    },
    [conversations, toLocalMessage],
  );

  const { sendMessage, sendRead, sendTyping } =
    useChatSocket(handleSocketEvent);

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedId) ?? null,
    [conversations, selectedId],
  );

  async function ensureConversation(conversation: Conversation) {
    if (conversation.conversationId) return conversation.conversationId;
    const res = await chatApi.conversations.getOrCreate({
      classId,
      participantId: conversation.id,
    });
    if (res.error) {
      throw new Error(res.error.message ?? "Gagal membuka percakapan.");
    }
    const realId = res.data?.data.id;
    if (!realId) throw new Error("Percakapan tidak tersedia.");
    setConversations((current) =>
      current.map((item) =>
        item.id === conversation.id
          ? { ...item, conversationId: realId }
          : item,
      ),
    );
    return realId;
  }

  async function handleSelect(conversationId: string) {
    setSelectedId(conversationId);
    selectedIdRef.current = conversationId;
    setTypingUserId(null);
    const contact = conversations.find(
      (conversation) => conversation.id === conversationId,
    );
    if (!contact) return;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation,
      ),
    );

    try {
      const realId = await ensureConversation(contact);
      const res = await chatApi.messages.list(realId);
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal memuat pesan.");
      }
      const messages = (res.data?.data.messages ?? []).map(toLocalMessage);
      if (selectedIdRef.current !== conversationId) return;
      const lastMessage = messages.at(-1);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                conversationId: realId,
                messages,
                lastMessage: lastMessage?.body ?? "Belum ada pesan",
                lastMessageAt: lastMessage?.sentAt ?? null,
                unreadCount: 0,
              }
            : conversation,
        ),
      );
      await chatApi.messages.read(realId, lastMessage?.id);
      sendRead(realId, lastMessage?.id);
    } catch (selectError) {
      toast.error(
        selectError instanceof Error
          ? selectError.message
          : "Gagal memuat percakapan.",
      );
    }
  }

  async function handleSend(body: string) {
    if (!selectedConversation) return;
    const contact = selectedConversation;
    const clientMessageId = crypto.randomUUID();
    const tempId = `temp-${clientMessageId}`;
    const sentAt = new Date().toISOString();

    try {
      const realId = await ensureConversation(contact);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === contact.id
            ? {
                ...conversation,
                lastMessage: body,
                lastMessageAt: sentAt,
                unreadCount: 0,
                messages: [
                  ...conversation.messages,
                  {
                    id: tempId,
                    direction: "outgoing",
                    body,
                    sentAt,
                    clientMessageId,
                  },
                ],
              }
            : conversation,
        ),
      );

      if (sendMessage(realId, clientMessageId, body)) return;

      const res = await chatApi.messages.send(realId, {
        clientMessageId,
        body,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal mengirim pesan.");
      }
      const saved = res.data?.data;
      if (saved) {
        const localMessage = toLocalMessage(saved);
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === contact.id
              ? {
                  ...conversation,
                  messages: conversation.messages.map((message) =>
                    message.id === tempId ? localMessage : message,
                  ),
                  lastMessage: localMessage.body,
                  lastMessageAt: localMessage.sentAt,
                }
              : conversation,
          ),
        );
      }
    } catch (sendError) {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === contact.id
            ? {
                ...conversation,
                messages: conversation.messages.filter(
                  (message) => message.id !== tempId,
                ),
              }
            : conversation,
        ),
      );
      toast.error(
        sendError instanceof Error
          ? sendError.message
          : "Gagal mengirim pesan.",
      );
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-152px)] min-h-[560px] items-center justify-center rounded-[20px] border border-[#cee8e1] bg-white shadow-sm">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#64748B]">
          <Loader2 className="size-5 animate-spin text-[#0d5c52]" />
          Memuat kontak chat...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100dvh-152px)] min-h-[560px] items-center justify-center rounded-[20px] border border-[#FECACA] bg-white px-6 text-center shadow-sm">
        <div>
          <AlertCircle className="mx-auto size-8 text-[#b91c1c]" />
          <p className="mt-3 text-[13px] font-bold text-[#071f1c]">
            Chat belum dapat dimuat
          </p>
          <p className="mt-1 max-w-md text-[12px] leading-5 text-[#64748B]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-[calc(100dvh-152px)] min-h-[560px] items-center justify-center rounded-[20px] border border-[#cee8e1] bg-white px-6 text-center shadow-sm">
        <div>
          <Users className="mx-auto size-9 text-[#CBD5E1]" />
          <p className="mt-3 text-[13px] font-bold text-[#071f1c]">
            Belum ada kontak chat
          </p>
          <p className="mt-1 text-[12px] text-[#64748B]">
            Teman sekelas, wali kelas, dan guru mapel akan muncul di sini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-152px)] min-h-[560px] overflow-hidden rounded-[20px] border border-[#A7D8CA] bg-[#F7FCFA] shadow-[0_2px_8px_-2px_rgba(7,31,28,0.05)]">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div
          className={`min-h-0 min-w-0 w-full overflow-hidden border-r border-[#A7D8CA] bg-[#F0FDFA] lg:flex ${
            selectedId ? "hidden" : "flex"
          }`}
        >
          <ConversationList
            conversations={conversations}
            className={className}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        <div
          className={`min-h-0 min-w-0 w-full flex-col overflow-hidden bg-[#F7FCFA] ${
            selectedId ? "flex" : "hidden lg:flex"
          }`}
        >
          {selectedConversation ? (
            <>
              <header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-[#A7D8CA] bg-[#F0FDFA] px-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Kembali ke daftar kontak"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#E7F6F1] hover:text-[#0d5c52] lg:hidden"
                >
                  <ArrowLeft className="size-5" />
                </button>

                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${selectedConversation.avatarClassName}`}
                >
                  {initialsOf(selectedConversation.name)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-[13px] font-bold text-[#071f1c]">
                    {selectedConversation.name}
                  </h2>
                  <p
                    title={roleLabel(selectedConversation)}
                    className="truncate text-[10px] text-[#64748B]"
                  >
                    {typingUserId && typingUserId !== user?.id
                      ? "sedang mengetik..."
                      : roleLabel(selectedConversation)}
                  </p>
                  <p className="truncate text-[9px] text-[#94A3B8]">
                    {identifierLabel(selectedConversation)}
                  </p>
                </div>
                <span className="ml-auto hidden shrink-0 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-semibold text-[#0d5c52] sm:inline-flex">
                  {selectedConversation.kind === "student"
                    ? "Siswa"
                    : selectedConversation.roles.includes("advisor")
                      ? "Wali/Guru"
                      : "Guru"}
                </span>
              </header>

              <MessageThread conversation={selectedConversation} />
              <MessageComposer
                key={selectedConversation.id}
                onSend={handleSend}
                onTyping={(active) => {
                  if (selectedConversation.conversationId) {
                    sendTyping(
                      selectedConversation.conversationId,
                      active,
                    );
                  }
                }}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#0d5c52]">
                <MessageCircle className="size-7" />
              </span>
              <h2 className="mt-4 text-[16px] font-bold text-[#071f1c]">
                Pilih percakapan
              </h2>
              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#64748B]">
                Pilih teman sekelas, wali kelas, atau guru mapel untuk mulai mengirim pesan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
