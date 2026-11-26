"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, GraduationCap } from "lucide-react";
import type { ChatClass } from "./types";

type ClassSelectorProps = {
  classes: ChatClass[];
  selectedClassId: string;
  unreadByClass: Record<string, number>;
  onChange: (classId: string) => void;
};

export function ClassSelector({
  classes,
  selectedClassId,
  unreadByClass,
  onChange,
}: ClassSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedClass =
    classes.find((item) => item.id === selectedClassId) ?? null;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full min-w-0 items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-[#b71422]/30 focus:border-[#b71422]/40 focus:outline-none focus:ring-2 focus:ring-[#b71422]/10"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFEBEB] text-[#b71422]">
          <GraduationCap className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-bold text-[#1E293B]">
            {selectedClass?.name ?? "Pilih kelas"}
          </span>
          <span className="block truncate text-[10px] text-[#64748B]">
            {selectedClass
              ? `${selectedClass.studentCount} siswa${selectedClass.isAdvisor ? " · Wali kelas" : ""}`
              : "Kelas yang diampu"}
          </span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#64748B] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Pilih kelas"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)]"
        >
          {classes.map((item) => {
            const selected = item.id === selectedClassId;
            const unread = unreadByClass[item.id] ?? 0;
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
                className={`flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                  selected ? "bg-[#FFF3F3]" : "hover:bg-[#F8FAFC]"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[12px] font-semibold text-[#1E293B]">
                      {item.name}
                    </span>
                    {item.isAdvisor ? (
                      <span className="shrink-0 rounded-full bg-[#FFEBEB] px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#b71422]">
                        Wali
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[#64748B]">
                    {item.studentCount} siswa
                  </span>
                </span>
                {unread > 0 ? (
                  <span className="inline-flex min-w-4 shrink-0 items-center justify-center rounded-full bg-[#b71422] px-1 py-0.5 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                ) : null}
                {selected ? (
                  <Check className="size-4 shrink-0 text-[#b71422]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
