"use client";

import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import { AverageScoreChart } from "./average-score-chart";
import { CompletionStatusChart } from "./completion-status-chart";
import { GradeLedger } from "./grade-ledger";
import { AnalyticsPageHeader } from "./page-header";
import { RemedialPanel } from "./remedial-panel";
import { students } from "./data";
import type { StudentGrade } from "./types";

export function AnalyticsGrades() {
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
        "Rincian capaian per butir asesmen dibuka pada Rincian Leger Nilai Siswa.",
    });
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AnalyticsPageHeader />

      <FadeIn delay={0.06} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AverageScoreChart />
        <CompletionStatusChart />
      </FadeIn>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <FadeIn delay={0.1} className="lg:col-span-8">
          <GradeLedger
            students={students}
            onScheduleRemedial={handleScheduleRemedial}
            onEditNote={handleEditNote}
            onViewDetail={handleViewDetail}
          />
        </FadeIn>

        <FadeIn delay={0.14} className="lg:col-span-4">
          <div id="remedial-section" className="scroll-mt-24">
            <RemedialPanel />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
