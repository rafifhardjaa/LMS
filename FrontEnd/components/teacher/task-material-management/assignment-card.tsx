"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { StaggerItem } from "@/components/ui/animations";
import type { Assignment } from "./types";

const statusStyles: Record<
  Assignment["status"],
  { label: string; className: string }
> = {
  dueSoon: { label: "Tenggat dekat", className: "text-[#b71422]" },
  active: { label: "Aktif", className: "text-[#006398]" },
  done: { label: "Selesai", className: "text-[#16A34A]" },
};

const primaryLinkToneClasses = {
  primary: "text-[#b71422]",
  blue: "text-[#006398]",
  neutral: "text-[#475569]",
} as const;

type AssignmentCardProps = {
  assignment: Assignment;
  onOpenQueue: (assignment: Assignment) => void;
};

export function AssignmentCard({
  assignment,
  onOpenQueue,
}: AssignmentCardProps) {
  const PrimaryIcon = assignment.primaryIcon;

  return (
    <StaggerItem className="h-full">
      <article className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-[#475569]">
                {assignment.subject}
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">
                Kelas {assignment.classes.join(" & ")}
              </span>
              <span
                className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wide ${statusStyles[assignment.status].className}`}
              >
                {statusStyles[assignment.status].label}
              </span>
            </div>
            <h3 className="mt-1 text-[15px] font-semibold leading-6 text-[#1E293B]">
              {assignment.title}
            </h3>
          </div>

          <span className="inline-flex max-w-[190px] shrink-0 items-center gap-1 text-[11px] font-semibold text-[#475569]">
            <Clock3 className="size-3.5 shrink-0" />
            <span className="truncate">{assignment.dueLabel}</span>
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

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E2E8F0] pt-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div
              className={`relative flex size-10 shrink-0 items-center justify-center ${assignment.percentageClassName}`}
            >
              <svg viewBox="0 0 36 36" className="size-10 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.16"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(assignment.percentage / 100) * 94.2} 94.2`}
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-[#1E293B]">
                {assignment.percentage}%
              </span>
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Progres
              </span>
              <span className="block text-[12px] font-semibold text-[#1E293B]">
                {assignment.submitted} / {assignment.total} Siswa
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenQueue(assignment)}
            className={`ml-auto inline-flex items-center gap-1 text-[12px] font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none ${primaryLinkToneClasses[assignment.primaryTone]}`}
          >
            <PrimaryIcon className="size-4" />
            Periksa Jawaban
          </button>
        </div>
      </article>
    </StaggerItem>
  );
}
