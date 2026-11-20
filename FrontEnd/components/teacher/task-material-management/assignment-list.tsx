"use client";

import { ArrowRight, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { StaggerChildren } from "@/components/ui/animations";
import { AssignmentCard } from "./assignment-card";
import { EmptyState } from "./empty-state";
import type { Assignment } from "./types";

type AssignmentListProps = {
  assignments: Assignment[];
};

export function AssignmentList({ assignments }: AssignmentListProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <ClipboardList className="size-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-bold tracking-tight text-[#1E293B]">
                Tugas Praktikum &amp; LKPD Aktif
              </h2>
              <span className="rounded-full bg-[#FFEBEB] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#b71422]">
                {assignments.length} Prioritas
              </span>
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Pantau pengumpulan dan nilai jawaban siswa.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            toast.info("Arsip tugas lengkap akan tersedia di tahap berikutnya.")
          }
          className="flex items-center gap-1 text-[12px] font-semibold text-[#b71422] transition-colors hover:underline"
        >
          Lihat Arsip Tugas
          <ArrowRight className="size-4" />
        </button>
      </div>

      {assignments.length > 0 ? (
        <StaggerChildren
          staggerDelay={0.08}
          className="flex flex-col gap-4"
        >
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </StaggerChildren>
      ) : (
        <EmptyState
          bare
          icon={ClipboardList}
          title="Belum ada tugas praktikum"
          description="Tugas praktikum dan LKPD yang Anda buat akan tampil di sini."
        />
      )}
    </section>
  );
}
