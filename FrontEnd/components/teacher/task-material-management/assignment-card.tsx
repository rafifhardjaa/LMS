"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StaggerItem } from "@/components/ui/animations";
import type { Assignment } from "./types";

const primaryToneClasses = {
  primary:
    "bg-[#b71422] text-white shadow-sm hover:bg-[#db3237] active:scale-[0.98]",
  blue: "bg-[#006398] text-white shadow-sm hover:bg-[#5bb8fe] active:scale-[0.98]",
  neutral:
    "bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] active:scale-[0.98]",
} as const;

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const PrimaryIcon = assignment.primaryIcon;

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

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex size-11 flex-shrink-0 items-center justify-center rounded-xl ${assignment.iconBgClassName} ${assignment.iconTextClassName}`}
            >
              <span className="text-[14px] font-semibold">
                {assignment.badge}
              </span>
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${assignment.iconBgClassName} ${assignment.iconTextClassName}`}
                >
                  {assignment.subject}
                </span>
                <span className="text-[11px] font-medium text-[#64748B]">
                  Kelas {assignment.classes.join(" & ")}
                </span>
              </div>
              <h3 className="mt-1 text-[15px] font-semibold leading-6 text-[#1E293B]">
                {assignment.title}
              </h3>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              assignment.dueTone === "urgent"
                ? "bg-[#FFEBEB] text-[#b71422]"
                : "bg-[#F1F5F9] text-[#475569]"
            }`}
          >
            <Clock3 className={`size-3.5 ${assignment.dueTone === "urgent" ? "animate-pulse" : ""}`} />
            {assignment.dueLabel}
          </span>
        </div>

        <p className="line-clamp-2 text-[12px] leading-5 text-[#64748B]">
          {assignment.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#475569]">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5 text-[#94A3B8]" />
            {assignment.startLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5 text-[#94A3B8]" />
            {assignment.dueLabel}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 rounded-xl bg-[#F8FAFC] p-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
              Progres
            </span>
            <span className="text-[12px] font-semibold text-[#1E293B]">
              {assignment.submitted} / {assignment.total} Siswa
            </span>
            <span
              className={`text-[12px] font-semibold ${assignment.percentageClassName}`}
            >
              ({assignment.percentage}%)
            </span>
          </div>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#F1F5F9]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${assignment.percentage}%` }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${assignment.progressClassName}`}
            />
          </div>
          <button
            type="button"
            onClick={() =>
              toast.info(
                "Alur pemeriksaan jawaban akan dihubungkan ke modul penilaian.",
              )
            }
            className={`ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${primaryToneClasses[assignment.primaryTone]}`}
          >
            <PrimaryIcon className="size-4" />
            Periksa Jawaban
          </button>
        </div>
      </motion.article>
    </StaggerItem>
  );
}
