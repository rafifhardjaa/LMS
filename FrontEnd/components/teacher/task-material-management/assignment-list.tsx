"use client";

import { ArrowRight, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { StaggerChildren } from "@/components/ui/animations";
import { AssignmentCard } from "./assignment-card";
import { EmptyState } from "./empty-state";
import type { Assignment } from "./types";

type AssignmentListProps = {
  assignments: Assignment[];
  onReset: () => void;
};

export function AssignmentList({
  assignments,
  onReset,
}: AssignmentListProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-[22px] text-[#b71422]" />
          <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
            Tugas Praktikum &amp; LKPD Aktif
          </h2>
          <span className="rounded-full bg-[#FFEBEB] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#b71422]">
            {assignments.length} Prioritas
          </span>
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
          icon={ClipboardList}
          title="Tidak ada tugas yang cocok"
          description="Ubah filter kelas, mata pelajaran, atau kata kunci untuk menampilkan tugas lain."
          actionLabel="Reset filter"
          onAction={onReset}
        />
      )}
    </section>
  );
}
