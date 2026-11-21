"use client";

import { useMemo } from "react";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { cn } from "@/lib/utils";
import { getFinalScore, getStudentStatus, students } from "./data";

type RemedialPanelProps = {
  onOpenList: () => void;
};

export function RemedialPanel({ onOpenList }: RemedialPanelProps) {
  const dangerStudents = useMemo(
    () =>
      students
        .filter((student) => getStudentStatus(student).tone === "danger")
        .sort((first, second) => getFinalScore(first) - getFinalScore(second)),
    [],
  );

  return (
    <FadeIn>
      <section className="flex flex-col gap-4 rounded-[20px] border border-[#FEE2E2] bg-[#FFF9F9] p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
              <TriangleAlert className="size-4" />
            </span>
            <div>
              <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
                Siswa Perlu Remidi
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
                Siswa di bawah KKTP • {dangerStudents.length} siswa
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-[#b71422]">
            Prioritas
          </span>
        </div>

        <div className="flex max-h-[380px] flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {dangerStudents.map((student) => {
            const finalScore = getFinalScore(student);
            const status = getStudentStatus(student);

            return (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-xl border border-[#FECACA] bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-[#b71422]/40 hover:bg-white"
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    student.avatarClassName,
                  )}
                >
                  {student.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[13px] font-semibold text-[#1E293B]">
                      {student.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#b71422]">
                      {finalScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-[#94A3B8]">
                    {student.nisn} • {student.rollNo}
                  </div>
                  <div className="mt-1.5 truncate text-[12px] font-semibold text-[#b71422]">
                    {status.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#94A3B8]">
            Menampilkan {dangerStudents.length} siswa perlu remidi
          </span>
          <button
            type="button"
            onClick={onOpenList}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#006398] transition-colors hover:underline"
          >
            Buka daftar remidi
            <ExternalLink className="size-4" />
          </button>
        </div>
      </section>
    </FadeIn>
  );
}
