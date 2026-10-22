"use client";

import { ArrowUpRight, Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { diagnosticTopics } from "./data";

export function DiagnosticPanel() {
  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#EFF4FF] text-[#006398]">
            <Brain className="size-4" />
          </span>
          <div>
            <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
              Diagnostik Butir Materi (TP)
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Daya serap per tujuan pembelajaran
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#F1F5F9] px-2 py-1 text-[9px] font-semibold text-[#64748B]">
          Fisika Rombel A
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {diagnosticTopics.map((topic) => (
          <div key={topic.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold leading-4 text-[#475569]">
                {topic.title}
              </p>
              <span
                className={cn(
                  "shrink-0 text-[10px] font-bold",
                  topic.textClassName,
                )}
              >
                {topic.percentLabel}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topic.percent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn("h-full rounded-full", topic.barClassName)}
              />
            </div>
            <p
              className={cn(
                "mt-1.5 text-[9px] leading-4 text-[#94A3B8]",
                topic.noteClassName,
              )}
            >
              {topic.note}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[#E4E9FF] bg-[#F7F9FF] p-3">
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#006398]">
          <Sparkles className="size-3" />
          Rekomendasi AI
        </div>
        <p className="mt-1.5 text-[10px] leading-4 text-[#475569]">
          Alokasikan 1 sesi remedial 45 menit untuk{" "}
          <span className="font-semibold text-[#1E293B]">TP 04 Kalor</span>{" "}
          dan gunakan simulasi virtual sebelum asesmen ulang.
        </p>
        <button
          type="button"
          onClick={() =>
            toast.success("Modul remedial dibagikan", {
              description:
                "Tautan modul mandiri TP 04 dikirim ke 3 siswa remedial.",
            })
          }
          className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#006398] transition hover:text-[#b71422]"
        >
          Bagikan Modul Remedial Mandiri
          <ArrowUpRight className="size-3" />
        </button>
      </div>
    </section>
  );
}
