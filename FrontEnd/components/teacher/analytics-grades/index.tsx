"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import { AnalyticsFilterBar } from "./filter-bar";
import { AnalyticsPageHeader } from "./page-header";
import { DiagnosticPanel } from "./diagnostic-panel";
import { DistributionPanel } from "./distribution-panel";
import { GradeInputDialog } from "./grade-input-dialog";
import { GradeLedger } from "./grade-ledger";
import { QuickActionsPanel } from "./quick-actions-panel";
import { RemedialPanel } from "./remedial-panel";
import { SummaryGrid } from "./summary-grid";
import { students } from "./data";
import type {
  AssessmentFilter,
  ClassFilter,
  StudentGrade,
} from "./types";

export function AnalyticsGrades() {
  const [classFilter, setClassFilter] = useState<ClassFilter>("VII-A");
  const [assessmentFilter, setAssessmentFilter] =
    useState<AssessmentFilter>("all");
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  function handleScheduleFromSummary() {
    document.getElementById("remedial-section")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function handleScheduleRemedial(student: StudentGrade) {
    toast.success("Sesi bimbingan dibuka", {
      description: `Jadwal remedial ${student.name} diarahkan ke panel Rekomendasi Remedial.`,
    });
    document.getElementById("remedial-section")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function handleEditNote(student: StudentGrade) {
    toast.info(`Catatan nilai ${student.name}`, {
      description:
        "Catatan perbaikan nilai akan tersimpan pada jurnal asesmen guru.",
    });
  }

  function handleViewDetail(student: StudentGrade) {
    toast.info(`Detail nilai ${student.name}`, {
      description:
        "Rincian capaian per butir asesmen dibuka pada panel diagnostik.",
    });
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AnalyticsPageHeader onInputGrade={() => setIsDialogOpen(true)} />

      <FadeIn delay={0.02}>
        <AnalyticsFilterBar
          classFilter={classFilter}
          assessmentFilter={assessmentFilter}
          search={search}
          onClassChange={setClassFilter}
          onAssessmentChange={setAssessmentFilter}
          onSearchChange={setSearch}
        />
      </FadeIn>

      <SummaryGrid onScheduleRemedial={handleScheduleFromSummary} />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <FadeIn delay={0.08} className="flex flex-col gap-5 lg:col-span-8">
          <DistributionPanel />
          <GradeLedger
            students={students}
            classFilter={classFilter}
            assessmentFilter={assessmentFilter}
            search={search}
            onScheduleRemedial={handleScheduleRemedial}
            onEditNote={handleEditNote}
            onViewDetail={handleViewDetail}
          />
        </FadeIn>

        <FadeIn delay={0.14} className="flex flex-col gap-4 lg:col-span-4">
          <DiagnosticPanel />
          <div id="remedial-section" className="scroll-mt-24">
            <RemedialPanel />
          </div>
          <QuickActionsPanel />
        </FadeIn>
      </div>

      <GradeInputDialog open={isDialogOpen} onClose={closeDialog} />
    </div>
  );
}
