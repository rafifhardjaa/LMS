"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";
import { toast } from "sonner";

type MessageComposerProps = {
  onSend: (body: string) => void;
  onTyping?: (active: boolean) => void;
  disabled?: boolean;
};

export function MessageComposer({
  onSend,
  onTyping,
  disabled = false,
}: MessageComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const height = Math.min(Math.max(textarea.scrollHeight, 36), 96);
    textarea.style.height = `${height}px`;
  }, [value]);

  function updateTyping(active: boolean) {
    if (typingRef.current === active) return;
    typingRef.current = active;
    onTyping?.(active);
  }

  function submit() {
    const body = value.trim();
    if (!body || disabled) return;
    updateTyping(false);
    onSend(body);
    setValue("");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="shrink-0 border-t border-[#FECACA] bg-[#FFF9F9] px-3 py-1 sm:px-4"
    >
      <div className="flex items-end gap-1.5">
        <button
          type="button"
          title="Lampiran segera tersedia"
          aria-label="Tambahkan lampiran"
          onClick={() =>
            toast.info("Lampiran akan tersedia setelah integrasi chat.")
          }
          className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#b71422]"
        >
          <Paperclip className="size-4" />
        </button>

        <div className="flex min-w-0 flex-1 items-end rounded-2xl border border-[#FECACA] bg-white px-3 py-1 transition focus-within:border-[#b71422]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#b71422]/10">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              updateTyping(event.target.value.length > 0);
            }}
            onBlur={() => updateTyping(false)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Tulis pesan..."
            aria-label="Tulis pesan"
            disabled={disabled}
            className="max-h-24 min-h-6 w-full resize-none bg-transparent text-[12px] leading-5 text-[#1E293B] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          title="Kirim pesan"
          aria-label="Kirim pesan"
          disabled={disabled || !value.trim()}
          className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#b71422] text-white shadow-sm transition hover:bg-[#99101C] disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] disabled:shadow-none"
        >
          <SendHorizontal className="size-4" />
        </button>
      </div>
    </form>
  );
}
