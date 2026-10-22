"use client";

import { CalendarDays, Clock3, Download } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StaggerItem } from "@/components/ui/animations";
import type { Assignment } from "./types";

const primaryToneClasses = {
  primary:
    "bg-[#b71422] text-white shadow-sm hover:bg-[#db3237] active:scale-[0.98]",
  blue:
    "bg-[#006398] text-white shadow-sm hover:bg-[#5bb8fe] active:scale-[0.98]",
  neutral:
    "bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] active:scale-[0.98]",
} as const;

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const PrimaryIcon = assignment.primaryIcon;
  const SecondaryIcon = assignment.secondaryIcon;

  return (
    <StaggerItem className="h-full">
      <motion.article
        whileHover={{
          y: -2,
          boxShadow: "0 10px 24px -10px rgba(0,0,0,0.14)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl bg-white p-5 shadow-sm"
      >
        <div
          className={`absolute inset-y-0 left-0 w-1.5 ${assignment.accentClassName}`}
        />

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`flex size-12 flex-shrink-0 items-center justify-center rounded-xl ${assignment.iconBgClassName} ${assignment.iconTextClassName}`}
            >
              <span className="text-[16px] font-semibold">
                {assignment.badge}
              </span>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${assignment.iconBgClassName} ${assignment.iconTextClassName}`}
                >
                  {assignment.subject}
                </span>
                <span className="text-[12px] text-[#94A3B8]">•</span>
                <span className="text-[12px] font-semibold text-[#1E293B]">
                  Kelas {assignment.classes.join(" & ")}
                </span>
              </div>
              <h3 className="mt-1 text-[16px] font-semibold leading-6 text-[#1E293B]">
                {assignment.title}
              </h3>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
              assignment.dueTone === "urgent"
                ? "bg-[#FFEBEB] text-[#b71422]"
                : "bg-[#F1F5F9] text-[#475569]"
            }`}
          >
            {assignment.dueTone === "urgent" ? (
              <Clock3 className="size-4 animate-pulse" />
            ) : (
              <CalendarDays className="size-4" />
            )}
            <span>{assignment.dueLabel}</span>
          </div>
        </div>

        <p className="text-[13px] leading-5 text-[#475569] sm:pl-16">
          {assignment.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-3 sm:ml-16">
          <div className="flex min-w-[200px] flex-1 items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Progres Pengumpulan
              </span>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#1E293B]">
                  {assignment.submitted} / {assignment.total} Siswa
                </span>
                <span
                  className={`text-[12px] font-semibold ${assignment.percentageClassName}`}
                >
                  ({assignment.percentage}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full max-w-[160px] overflow-hidden rounded-full bg-[#F1F5F9]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${assignment.percentage}%` }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${assignment.progressClassName}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {assignment.showArchive && (
              <button
                type="button"
                title="Unduh Arsip Jawaban (.ZIP)"
                onClick={() =>
                  toast.info(
                    "Arsip jawaban akan diunduh setelah integrasi penyimpanan.",
                  )
                }
                className="flex size-9 items-center justify-center rounded-lg bg-white text-[#475569] transition-colors hover:bg-[#F1F5F9]"
              >
                <Download className="size-[18px]" />
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                toast.info("Detail tugas akan dihubungkan ke halaman asesmen.")
              }
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1E293B] transition-colors hover:bg-[#F1F5F9]"
            >
              <SecondaryIcon className="size-4 text-[#475569]" />
              {assignment.secondaryLabel}
            </button>
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Alur pemeriksaan jawaban akan dihubungkan ke modul penilaian.",
                )
              }
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${primaryToneClasses[assignment.primaryTone]}`}
            >
              <PrimaryIcon className="size-4" />
              {assignment.primaryLabel}
            </button>
          </div>
        </div>
      </motion.article>
    </StaggerItem>
  );
}
