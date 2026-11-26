"use client";

import { useMemo, useState } from "react";
import {
  GraduationCap,
  MessageCircle,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { identifierLabel, roleLabel } from "./data";
import type { ContactFilter, Conversation } from "./types";

type ConversationListProps = {
  conversations: Conversation[];
  className: string;
  selectedId: string | null;
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

const filters: Array<{
  value: ContactFilter;
  label: string;
  icon: typeof Users;
}> = [
  { value: "all", label: "Semua", icon: MessageCircle },
  { value: "classmates", label: "Teman", icon: Users },
  { value: "teachers", label: "Guru", icon: GraduationCap },
  { value: "advisor", label: "Wali", icon: ShieldCheck },
];

export function ConversationList({
  conversations,
  className,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ContactFilter>("all");

  const counts = useMemo(
    () => ({
      all: conversations.length,
      classmates: conversations.filter((item) => item.kind === "student").length,
      teachers: conversations.filter((item) =>
        item.roles.includes("teacher"),
      ).length,
      advisor: conversations.filter((item) =>
        item.roles.includes("advisor"),
      ).length,
    }),
    [conversations],
  );

  const filteredConversations = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return conversations
      .filter((conversation) => {
        if (filter === "classmates" && conversation.kind !== "student") {
          return false;
        }
        if (
          filter === "teachers" &&
          !conversation.roles.includes("teacher")
        ) {
          return false;
        }
        if (
          filter === "advisor" &&
          !conversation.roles.includes("advisor")
        ) {
          return false;
        }
        if (!keyword) return true;
        return (
          conversation.name.toLowerCase().includes(keyword) ||
          (conversation.identifier ?? "").toLowerCase().includes(keyword) ||
          conversation.lastMessage.toLowerCase().includes(keyword) ||
          conversation.subjects.some((subject) =>
            subject.name.toLowerCase().includes(keyword),
          )
        );
      })
      .sort((first, second) =>
        (second.lastMessageAt ?? "").localeCompare(
          first.lastMessageAt ?? "",
        ),
      );
  }, [conversations, filter, query]);

  return (
    <section className="flex min-h-0 min-w-0 w-full flex-1 flex-col bg-[#F0FDFA]">
      <div className="border-b border-[#A7D8CA] bg-[#ECFDF5]/80 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#0d5c52]">
            <MessageCircle className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-[16px] font-bold tracking-tight text-[#071f1c]">
              Chat
            </h1>
            <p className="truncate text-[11px] font-medium text-[#64748B]">
              {className} · {conversations.length} kontak
            </p>
          </div>
        </div>

        <label className="relative mt-4 block w-full min-w-0">
          <span className="sr-only">Cari kontak atau pesan</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama, NISN, NIP, atau mapel..."
            className="h-10 w-full min-w-0 max-w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-3 text-[12px] text-[#071f1c] outline-none transition focus:border-[#0d5c52]/40 focus:ring-2 focus:ring-[#0d5c52]/10"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {filters.map((item) => {
            const Icon = item.icon;
            const active = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition ${
                  active
                    ? "bg-[#0d5c52] text-white"
                    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                }`}
              >
                <Icon className="size-3" />
                {item.label}
                <span
                  className={`rounded-full px-1 text-[9px] ${
                    active ? "bg-white/20" : "bg-white"
                  }`}
                >
                  {counts[item.value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-2 py-2">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full min-h-52 flex-col items-center justify-center px-5 text-center">
            <Users className="size-8 text-[#CBD5E1]" />
            <p className="mt-3 text-[12px] font-semibold text-[#475569]">
              {query
                ? "Kontak tidak ditemukan"
                : "Belum ada kontak pada filter ini"}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#94A3B8]">
              {query
                ? "Coba cari nama, NISN/NIP, atau nama mapel."
                : "Pilih filter lain untuk melihat kontak."}
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
            const detail = roleLabel(conversation);

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                aria-pressed={selected}
                className={`flex min-w-0 w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left transition ${
                  selected
                    ? "bg-[#E7F6F1] ring-1 ring-[#A7D8CA]"
                    : "hover:bg-white"
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
                  {conversation.roles.includes("advisor") ? (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-[#0d5c52]" />
                  ) : null}
                </span>

                <span className="min-w-0 max-w-full flex-1">
                  <span className="flex min-w-0 items-center justify-between gap-2">
                    <span
                      title={conversation.name}
                      className="min-w-0 max-w-full truncate text-[13px] font-semibold text-[#071f1c]"
                    >
                      {conversation.name}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] ${
                        conversation.unreadCount > 0
                          ? "font-semibold text-[#0d5c52]"
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
                      <span className="inline-flex min-w-4 shrink-0 items-center justify-center rounded-full bg-[#0d5c52] px-1 py-0.5 text-[9px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </span>
                  <span
                    title={detail}
                    className="mt-0.5 block min-w-0 max-w-full truncate text-[10px] text-[#94A3B8]"
                  >
                    {detail}
                  </span>
                  <span
                    title={identifierLabel(conversation)}
                    className="mt-0.5 block min-w-0 max-w-full truncate text-[9px] text-[#A0AEC0]"
                  >
                    {identifierLabel(conversation)}
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
