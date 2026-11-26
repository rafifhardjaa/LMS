"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Search, Users } from "lucide-react";
import { ClassSelector } from "./class-selector";
import type { ChatClass, Conversation } from "./types";

type ConversationListProps = {
  conversations: Conversation[];
  classes: ChatClass[];
  selectedClassId: string;
  unreadByClass: Record<string, number>;
  selectedId: string | null;
  onClassChange: (classId: string) => void;
  onSelect: (conversationId: string) => void;
};

function formatConversationTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const minutes = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 60_000),
  );
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} mnt`;
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

export function ConversationList({
  conversations,
  classes,
  selectedClassId,
  unreadByClass,
  selectedId,
  onClassChange,
  onSelect,
}: ConversationListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const selectedClass =
    classes.find((item) => item.id === selectedClassId) ?? null;
  const selectedClassName = selectedClass?.name ?? "Kelas";
  const unreadTotal = conversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );

  const filteredConversations = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return conversations
      .filter((conversation) => {
        if (filter === "unread" && conversation.unreadCount === 0) return false;
        if (!keyword) return true;
        return (
          conversation.name.toLowerCase().includes(keyword) ||
          conversation.nisn.toLowerCase().includes(keyword) ||
          conversation.lastMessage.toLowerCase().includes(keyword)
        );
      })
      .sort((first, second) =>
        (second.lastMessageAt ?? "").localeCompare(
          first.lastMessageAt ?? "",
        ),
      );
  }, [conversations, filter, query]);

  return (
    <section className="flex min-h-0 min-w-0 w-full flex-1 flex-col bg-[#FFF7F7]">
      <div className="border-b border-[#FECACA] bg-[#FFF3F3]/80 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <MessageCircle className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-[16px] font-bold tracking-tight text-[#1E293B]">
              Pesan
            </h1>
            <p className="truncate text-[11px] font-medium text-[#64748B]">
              {selectedClassName} · {conversations.length} siswa
            </p>
          </div>
        </div>

        <ClassSelector
          classes={classes}
          selectedClassId={selectedClassId}
          unreadByClass={unreadByClass}
          onChange={onClassChange}
        />

        <label className="relative mt-3 block w-full min-w-0">
          <span className="sr-only">Cari percakapan</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama, NISN, atau pesan..."
            className="h-10 w-full min-w-0 max-w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-3 text-[12px] text-[#1E293B] outline-none transition focus:border-[#b71422]/40 focus:bg-white focus:ring-2 focus:ring-[#b71422]/10"
          />
        </label>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
              filter === "all"
                ? "bg-[#b71422] text-white"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            aria-pressed={filter === "unread"}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
              filter === "unread"
                ? "bg-[#b71422] text-white"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            Belum dibaca
            {unreadTotal > 0 ? (
              <span
                className={`inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                  filter === "unread"
                    ? "bg-white text-[#b71422]"
                    : "bg-[#b71422] text-white"
                }`}
              >
                {unreadTotal}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-2 py-2">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full min-h-52 flex-col items-center justify-center px-5 text-center">
            <Users className="size-8 text-[#CBD5E1]" />
            <p className="mt-3 text-[12px] font-semibold text-[#475569]">
              {conversations.length === 0
                ? "Belum ada siswa di kelas ini"
                : query
                  ? "Percakapan tidak ditemukan"
                  : "Belum ada pesan belum dibaca"}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#94A3B8]">
              {conversations.length === 0
                ? "Siswa kelas ini akan muncul setelah terdaftar."
                : query
                  ? "Coba gunakan nama, NISN, atau kata kunci lain."
                  : "Percakapan yang belum dibaca akan muncul di sini."}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const selected = conversation.id === selectedId;
            const lastMessage = conversation.messages.at(-1);
            const preview =
              lastMessage?.direction === "outgoing"
                ? `Anda: ${conversation.lastMessage}`
                : conversation.lastMessage;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                aria-pressed={selected}
                className={`flex min-w-0 w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left transition ${
                  selected
                    ? "bg-[#FFF3F3] ring-1 ring-[#FECACA]"
                    : "hover:bg-white/70"
                }`}
              >
                <span
                  className={`relative flex size-11 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${conversation.avatarClassName}`}
                >
                  {conversation.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("")}
                </span>

                <span className="min-w-0 max-w-full flex-1">
                  <span className="flex min-w-0 items-center justify-between gap-2">
                    <span
                      title={conversation.name}
                      className="min-w-0 max-w-full truncate text-[13px] font-semibold text-[#1E293B]"
                    >
                      {conversation.name}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] ${
                        conversation.unreadCount > 0
                          ? "font-semibold text-[#b71422]"
                          : "text-[#94A3B8]"
                      }`}
                    >
                      {formatConversationTime(conversation.lastMessageAt)}
                    </span>
                  </span>
                  <span className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
                    <span
                      title={preview}
                      className="min-w-0 max-w-full truncate text-[11px] text-[#64748B]"
                    >
                      {preview}
                    </span>
                    {conversation.unreadCount > 0 ? (
                      <span className="inline-flex min-w-4 shrink-0 items-center justify-center rounded-full bg-[#b71422] px-1 py-0.5 text-[9px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </span>
                  <span
                    title={`NISN ${conversation.nisn}`}
                    className="mt-0.5 block min-w-0 max-w-full truncate text-[10px] text-[#94A3B8]"
                  >
                    NISN {conversation.nisn}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
