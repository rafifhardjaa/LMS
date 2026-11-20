"use client";

import {
  Check,
  Clock3,
  ExternalLink,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import type { GradingItem } from "./types";

export function GradingQueue({ items }: { items: GradingItem[] }) {
  return (
    <FadeIn>
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="size-3 animate-pulse rounded-full bg-[#EF4444]" />
            <h2 className="text-[18px] font-semibold tracking-tight text-[#1E293B]">
              Antrean Pengumpulan Siswa yang Perlu Dinilai Segera
            </h2>
          </div>
          <span className="text-[12px] font-semibold text-[#94A3B8]">
            38 tugas menunggu penilaian
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const FileIcon = item.fileIcon;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3 transition-colors hover:border-[#b71422]/20"
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
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        item.submittedAtTone === "urgent"
                          ? "bg-[#FFEBEB] text-[#b71422]"
                          : "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      <Clock3 className="size-3" />
                      {item.submittedAt}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-[#94A3B8]">
                    {item.nisn} • {item.className} • {item.subject}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold">
                    <span className="inline-flex items-center gap-1 text-[#1E293B]">
                      <FileIcon className={`size-4 ${item.fileIconClassName}`} />
                      {item.fileName}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 ${
                        item.conformityTone === "success"
                          ? "text-[#16A34A]"
                          : "text-[#D97706]"
                      }`}
                    >
                      {item.conformityTone === "success" ? (
                        <Check className="size-4" />
                      ) : (
                        <TriangleAlert className="size-4" />
                      )}
                      {item.conformity}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Form nilai dan feedback akan dihubungkan ke modul penilaian.",
                    )
                  }
                  className="shrink-0 rounded-lg bg-[#FFEBEB] px-3 py-1.5 text-[12px] font-semibold text-[#b71422] transition-all hover:bg-[#b71422] hover:text-white active:scale-[0.98]"
                >
                  Beri Nilai &amp; Feedback
                </button>
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
            onClick={() =>
              toast.info("Batch grading akan tersedia setelah integrasi API.")
            }
            className="flex items-center gap-1 text-[12px] font-semibold text-[#006398] transition-colors hover:underline"
          >
            Buka Seluruh Antrean (Batch Grading)
            <ExternalLink className="size-4" />
          </button>
        </div>
      </section>
    </FadeIn>
  );
}
