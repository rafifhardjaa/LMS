"use client";

import { ClipboardList } from "lucide-react";
import { StaggerChildren } from "@/components/ui/animations";
import { AssignmentCard } from "./assignment-card";
import { EmptyState } from "./empty-state";
import type { Assignment } from "./types";

type AssignmentListProps = {
  assignments: Assignment[];
  onOpenQueue: (assignment: Assignment) => void;
};

export function AssignmentList({
  assignments,
  onOpenQueue,
}: AssignmentListProps) {
  const visibleAssignments = assignments.slice(0, 3);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <ClipboardList className="size-4" />
          </span>
          <div>
            <h2 className="text-[16px] font-bold tracking-tight text-[#1E293B]">
              Tugas Praktikum &amp; LKPD Aktif
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Pantau pengumpulan dan nilai jawaban siswa.
            </p>
          </div>
        </div>
      </div>

      {visibleAssignments.length > 0 ? (
        <StaggerChildren
          staggerDelay={0.08}
          className="flex max-h-[420px] flex-col gap-4 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visibleAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onOpenQueue={onOpenQueue}
            />
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
