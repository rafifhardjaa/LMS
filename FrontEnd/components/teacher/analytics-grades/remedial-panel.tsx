"use client";

import { CalendarDays, Clock3, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { remedialGroups } from "./data";

export function RemedialPanel() {
  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <CalendarDays className="size-4" />
          </span>
          <div>
            <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
              Rekomendasi Remedial
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Tindak lanjut siswa di bawah KKTP
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#FEE2E2] px-2 py-1 text-[9px] font-bold text-[#b71422]">
          3 siswa
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {remedialGroups.map((group) => (
          <div
            key={group.id}
            className={cn(
              "rounded-xl border p-3",
              group.waiting
                ? "border-dashed border-[#E8D5B0] bg-[#FFFCF5]"
                : "border-[#F3C6C3] bg-[#FFFBFB]",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-bold leading-4 text-[#1E293B]">
                {group.students}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold",
                  group.statusClassName,
                )}
              >
                {group.status}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-start gap-1.5 text-[9px] font-medium text-[#64748B]">
                <Clock3 className="mt-0.5 size-3 shrink-0 text-[#94A3B8]" />
                <span>{group.schedule}</span>
              </div>
              {group.room && (
                <div className="flex items-start gap-1.5 text-[9px] font-medium text-[#64748B]">
                  <MapPin className="mt-0.5 size-3 shrink-0 text-[#94A3B8]" />
                  <span>{group.room}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          toast.success("Notifikasi remedial dikirim", {
            description:
              "Pesan WhatsApp diteruskan ke orang tua 3 siswa remedial.",
          })
        }
        className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[#b71422] text-[10px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(183,20,34,0.8)] transition hover:bg-[#a1121f]"
      >
        <Send className="size-3.5" />
        Kirim Notifikasi WA ke Orang Tua
      </button>
    </section>
  );
}
