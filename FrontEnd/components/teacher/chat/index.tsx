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
import { masterDataApi } from "@/lib/api/master-data";
import type { ChatMessageDto } from "@/lib/api/types";
import { useChatSocket, type ChatSocketEvent } from "@/hooks/use-chat-socket";
import { useAuthStore } from "@/lib/store/auth-store";
import { ConversationList } from "./conversation-list";
import { MessageComposer } from "./message-composer";
import { MessageThread } from "./message-thread";
import { buildConversations, initialsOf } from "./data";
import type { ChatClass, ChatMessage, Conversation } from "./types";

export function TeacherChat() {
  const user = useAuthStore((state) => state.user);
  const [classes, setClasses] = useState<ChatClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    void (async () => {
      try {
        setLoading(true);
        setError(null);

        const [taughtRes, classRes] = await Promise.all([
          masterDataApi.teacherAssignments.listClasses({
            teacherId: user.id,
          }),
          masterDataApi.classes.list(),
        ]);
        if (!active) return;
        if (taughtRes.error) {
          throw new Error(taughtRes.error.message ?? "Gagal memuat kelas.");
        }
        if (classRes.error) {
          throw new Error(classRes.error.message ?? "Gagal memuat detail kelas.");
        }

        const classDetails = classRes.data?.data ?? [];
        const classMap = new Map<string, ChatClass>();
        for (const item of taughtRes.data?.data ?? []) {
          if (classMap.has(item.classId)) continue;
          const detail = classDetails.find((row) => row.id === item.classId);
          classMap.set(item.classId, {
            id: item.classId,
            name: item.className ?? detail?.name ?? "-",
            gradeCode: item.gradeCode ?? detail?.gradeCode ?? null,
            section: item.section ?? detail?.section ?? null,
            studentCount: detail?.studentCount ?? 0,
            isAdvisor: detail?.advisorId === user.id,
          });
        }

        const nextClasses = [...classMap.values()].sort(
          (first, second) =>
            Number(second.isAdvisor) - Number(first.isAdvisor) ||
            first.name.localeCompare(second.name, undefined, {
              numeric: true,
            }),
        );

        if (!nextClasses.length) {
          setClasses([]);
          setSelectedClassId("");
          setAllConversations([]);
          setSelectedId(null);
          return;
        }

        const studentResults = await Promise.all(
          nextClasses.map(async (item) => {
            const studentRes = await masterDataApi.students.list({
              classId: item.id,
            });
            if (studentRes.error) {
              throw new Error(
                studentRes.error.message ??
                  `Gagal memuat siswa ${item.name}.`,
              );
            }
            return {
              classId: item.id,
              students: studentRes.data?.data ?? [],
            };
          }),
        );
        if (!active) return;

        const baseConversations = nextClasses.flatMap((item, classIndex) => {
          const result = studentResults.find(
            (studentResult) => studentResult.classId === item.id,
          );
          return buildConversations(
            result?.students ?? [],
            item.name,
            item.id,
            classIndex * 5,
          );
        });

        const conversationRes = await chatApi.conversations.list();
        if (!active) return;
        if (conversationRes.error) {
          throw new Error(
            conversationRes.error.message ?? "Gagal memuat percakapan.",
          );
        }

        const summaries = conversationRes.data?.data ?? [];
        const summaryByUser = new Map(
          summaries.map((summary) => [summary.otherUserId, summary]),
        );
        const nextConversations = baseConversations.map((conversation) => {
          const summary = summaryByUser.get(conversation.id);
          return {
            ...conversation,
            conversationId: summary?.id ?? null,
            lastMessage: summary?.lastMessage ?? "Belum ada pesan",
            lastMessageAt: summary?.lastMessageAt ?? null,
            unreadCount: summary?.unreadCount ?? 0,
          };
        });

        const defaultClass = nextClasses[0]!;
        const defaultConversation = nextConversations.find(
          (conversation) => conversation.classId === defaultClass.id,
        );

        setClasses(nextClasses);
        setSelectedClassId(defaultClass.id);
        setAllConversations(nextConversations);
        setSelectedId(
          window.matchMedia("(min-width: 1024px)").matches
            ? defaultConversation?.id ?? null
            : null,
        );
      } catch (loadError) {
        if (active) {
          setClasses([]);
          setSelectedClassId("");
          setAllConversations([]);
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
  }, [user?.id]);

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
        const target = allConversations.find(
          (conversation) =>
            conversation.conversationId === event.message.conversationId,
        );
        setAllConversations((current) =>
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
        setAllConversations((current) =>
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
        const target = allConversations.find(
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
    [allConversations, toLocalMessage],
  );

  const { sendMessage, sendRead, sendTyping } =
    useChatSocket(handleSocketEvent);

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId) ?? null,
    [classes, selectedClassId],
  );

  const visibleConversations = useMemo(
    () =>
      allConversations.filter(
        (conversation) => conversation.classId === selectedClassId,
      ),
    [allConversations, selectedClassId],
  );

  const unreadByClass = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const conversation of allConversations) {
      counts[conversation.classId] =
        (counts[conversation.classId] ?? 0) + conversation.unreadCount;
    }
    return counts;
  }, [allConversations]);

  const selectedConversation = useMemo(
    () => allConversations.find((item) => item.id === selectedId) ?? null,
    [allConversations, selectedId],
  );

  async function ensureConversation(conversation: Conversation) {
    if (conversation.conversationId) return conversation.conversationId;
    const res = await chatApi.conversations.getOrCreate({
      classId: conversation.classId,
      participantId: conversation.id,
    });
    if (res.error) {
      throw new Error(res.error.message ?? "Gagal membuka percakapan.");
    }
    const realId = res.data?.data.id;
    if (!realId) throw new Error("Percakapan tidak tersedia.");
    setAllConversations((current) =>
      current.map((item) =>
        item.id === conversation.id
          ? { ...item, conversationId: realId }
          : item,
      ),
    );
    return realId;
  }

  function handleClassChange(classId: string) {
    setSelectedClassId(classId);
    setSelectedId(null);
    selectedIdRef.current = null;
    setTypingUserId(null);
    const firstConversation = allConversations.find(
      (conversation) => conversation.classId === classId,
    );
    if (window.matchMedia("(min-width: 1024px)").matches) {
      void handleSelect(firstConversation?.id ?? "");
    }
  }

  async function handleSelect(conversationId: string) {
    if (!conversationId) return;
    setSelectedId(conversationId);
    selectedIdRef.current = conversationId;
    setTypingUserId(null);
    const contact = allConversations.find(
      (conversation) => conversation.id === conversationId,
    );
    if (!contact) return;

    setAllConversations((current) =>
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
      setAllConversations((current) =>
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
      setAllConversations((current) =>
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
        setAllConversations((current) =>
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
      setAllConversations((current) =>
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
      <div className="flex h-[calc(100dvh-88px)] min-h-[560px] items-center justify-center rounded-[20px] border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#64748B]">
          <Loader2 className="size-5 animate-spin text-[#b71422]" />
          Memuat percakapan...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100dvh-88px)] min-h-[560px] items-center justify-center rounded-[20px] border border-[#FECACA] bg-white px-6 text-center shadow-sm">
        <div>
          <AlertCircle className="mx-auto size-8 text-[#b71422]" />
          <p className="mt-3 text-[13px] font-bold text-[#1E293B]">
            Chat belum dapat dimuat
          </p>
          <p className="mt-1 max-w-md text-[12px] leading-5 text-[#64748B]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex h-[calc(100dvh-88px)] min-h-[560px] items-center justify-center rounded-[20px] border border-[#E2E8F0] bg-white px-6 text-center shadow-sm">
        <div>
          <Users className="mx-auto size-9 text-[#CBD5E1]" />
          <p className="mt-3 text-[13px] font-bold text-[#1E293B]">
            Guru belum memiliki kelas
          </p>
          <p className="mt-1 text-[12px] text-[#64748B]">
            Kelas yang diampu akan muncul di sini setelah ditetapkan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-88px)] min-h-[560px] overflow-hidden rounded-[20px] border border-[#FECACA] bg-[#FFFBFB] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div
          className={`min-h-0 min-w-0 w-full overflow-hidden border-r border-[#FECACA] bg-[#FFF7F7] lg:flex ${
            selectedId ? "hidden" : "flex"
          }`}
        >
          <ConversationList
            key={selectedClassId}
            classes={classes}
            selectedClassId={selectedClassId}
            unreadByClass={unreadByClass}
            conversations={visibleConversations}
            selectedId={selectedId}
            onClassChange={handleClassChange}
            onSelect={handleSelect}
          />
        </div>

        <div
          className={`min-h-0 min-w-0 w-full flex-col overflow-hidden bg-[#FFFBFB] ${
            selectedId ? "flex" : "hidden lg:flex"
          }`}
        >
          {selectedConversation ? (
            <>
              <header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-[#FECACA] bg-[#FFF9F9] px-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Kembali ke daftar percakapan"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#b71422] lg:hidden"
                >
                  <ArrowLeft className="size-5" />
                </button>

                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${selectedConversation.avatarClassName}`}
                >
                  {initialsOf(selectedConversation.name)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-[13px] font-bold text-[#1E293B]">
                    {selectedConversation.name}
                  </h2>
                  <p className="truncate text-[10px] text-[#64748B]">
                    {typingUserId && typingUserId !== user?.id
                      ? "sedang mengetik..."
                      : `NISN ${selectedConversation.nisn} · ${selectedConversation.className}`}
                  </p>
                </div>
                <span className="ml-auto hidden rounded-full bg-[#FFEBEB] px-2.5 py-1 text-[10px] font-semibold text-[#b71422] sm:inline-flex">
                  Siswa
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
              <span className="flex size-16 items-center justify-center rounded-2xl bg-[#FFEBEB] text-[#b71422]">
                <MessageCircle className="size-7" />
              </span>
              <h2 className="mt-4 text-[16px] font-bold text-[#1E293B]">
                Pilih percakapan
              </h2>
              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#64748B]">
                Pilih siswa {selectedClass?.name ?? "kelas terpilih"} dari daftar di sebelah kiri untuk mulai mengirim pesan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
