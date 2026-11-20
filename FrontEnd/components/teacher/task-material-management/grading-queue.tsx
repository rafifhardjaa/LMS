"use client";

import { Clock3, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import type { GradingItem } from "./types";

type GradingQueueProps = {
  items: GradingItem[];
  onOpenAll: () => void;
};

export function GradingQueue({ items, onOpenAll }: GradingQueueProps) {
  return (
    <FadeIn>
      <section className="flex flex-col gap-4 rounded-[20px] border border-[#FEE2E2] bg-[#FFF9F9] p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
              <Clock3 className="size-4" />
            </span>
            <div>
              <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
                Antrean Pengumpulan
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
                Siswa yang perlu dinilai segera • 38 tugas
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-[#b71422]">
            Prioritas
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const FileIcon = item.fileIcon;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-white bg-white/80 p-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-[#b71422]/20 hover:bg-white"
              >
                <div
                  className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${item.avatarClassName}`}
                >
                  {item.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[13px] font-semibold text-[#1E293B]">
                      {item.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                        item.submittedAtTone === "urgent"
                          ? "text-[#b71422]"
                          : "text-[#475569]"
                      }`}
                    >
                      <Clock3 className="size-3 shrink-0" />
                      {item.submittedAt}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-[#94A3B8]">
                    {item.nisn} • {item.className}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#1E293B]">
                    <FileIcon className={`size-4 ${item.fileIconClassName}`} />
                    {item.fileName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#94A3B8]">
            Menampilkan {items.length} antrean prioritas dari 38 pengumpulan
          </span>
          <button
            type="button"
            onClick={onOpenAll}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#006398] transition-colors hover:underline"
          >
            Buka Seluruh Antrean
            <ExternalLink className="size-4" />
          </button>
        </div>
      </section>
    </FadeIn>
  );
}
