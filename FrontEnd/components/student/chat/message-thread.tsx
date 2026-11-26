"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCheck, MessageCircle } from "lucide-react";
import type { Conversation } from "./types";

type MessageThreadProps = {
  conversation: Conversation;
};

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageThread({ conversation }: MessageThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversation.id, conversation.messages.length]);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
      style={{
        backgroundColor: "#EFF9F5",
        backgroundImage: "radial-gradient(#BFDCD2 0.7px, transparent 0.7px)",
        backgroundSize: "18px 18px",
      }}
    >
      {conversation.messages.length === 0 ? (
        <div className="flex h-full min-h-64 flex-col items-center justify-center px-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#0d5c52] shadow-sm">
            <MessageCircle className="size-6" />
          </span>
          <p className="mt-4 text-[13px] font-semibold text-[#475569]">
            Belum ada pesan
          </p>
          <p className="mt-1 max-w-xs text-[11px] leading-5 text-[#94A3B8]">
            Mulai percakapan dengan {conversation.name} melalui kolom pesan di bawah.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex justify-center">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-[#64748B] shadow-sm">
              Hari ini
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {conversation.messages.map((message) => {
              const outgoing = message.direction === "outgoing";
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${outgoing ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:max-w-[68%] ${
                      outgoing
                        ? "rounded-br-md bg-[#0d5c52] text-white"
                        : "rounded-bl-md bg-white text-[#334155]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-[12px] leading-5">
                      {message.body}
                    </p>
                    <div
                      className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] ${
                        outgoing ? "text-white/70" : "text-[#94A3B8]"
                      }`}
                    >
                      <span>{formatMessageTime(message.sentAt)}</span>
                      {outgoing ? <CheckCheck className="size-3.5" /> : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={endRef} />
          </div>
        </>
      )}
    </div>
  );
}
