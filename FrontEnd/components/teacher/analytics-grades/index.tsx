"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import { exportStudentsToXlsx } from "@/lib/export-xlsx";
import { AverageScoreChart } from "./average-score-chart";
import { CompletionStatusChart } from "./completion-status-chart";
import {
  assessmentOptions,
  classOptions,
  getStudentStatus,
  students,
  subjectOptions,
} from "./data";
import { GradeLedger } from "./grade-ledger";
import { AnalyticsPageHeader } from "./page-header";
import { RemedialPanel } from "./remedial-panel";
import type { StudentGrade } from "./types";
import { ValueToolbar } from "./value-toolbar";

export function AnalyticsGrades() {
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [assessmentFilter, setAssessmentFilter] = useState("");
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isRemedialOpen, setIsRemedialOpen] = useState(false);

  const selectedClassLabel =
    classOptions.find((option) => option.value === classFilter)?.label ?? "-";
  const selectedSubjectLabel =
    subjectOptions.find((option) => option.value === subjectFilter)?.label ?? "-";
  const selectedAssessmentLabel =
    assessmentOptions.find((option) => option.value === assessmentFilter)?.label ??
    "-";

  const studentStats = useMemo(() => {
    const filteredStudents = students.filter(
      (student) =>
        student.className === classFilter && student.subject === subjectFilter,
    );
    const statuses = filteredStudents.map((student) =>
      getStudentStatus(student),
    );

    return {
      total: filteredStudents.length,
      tuntas: statuses.filter((status) => status.tone === "success").length,
      remidi: statuses.filter((status) => status.tone === "danger").length,
    };
  }, [classFilter, subjectFilter]);

  function handleClassChange(value: string) {
    setClassFilter(value);
    setIsLedgerOpen(false);
  }

  function handleSubjectChange(value: string) {
    setSubjectFilter(value);
    setIsLedgerOpen(false);
  }

  function handleAssessmentChange(value: string) {
    setAssessmentFilter(value);
    setIsLedgerOpen(false);
  }

  function handleBack() {
    setClassFilter("");
    setSubjectFilter("");
    setAssessmentFilter("");
    setIsLedgerOpen(false);
    setIsRemedialOpen(false);
  }

  function handleOpenRemedial() {
    setIsLedgerOpen(false);
    setIsRemedialOpen(true);
  }

  function handleCloseRemedial() {
    setIsRemedialOpen(false);
  }

  function handleDownload(rows: StudentGrade[]) {
    const filename = isRemedialOpen
      ? "siswa-perlu-remidi.xlsx"
      : `rekap-nilai-${classFilter || "semua"}-${subjectFilter || "semua"}.xlsx`;

    exportStudentsToXlsx(rows, filename);
    toast.success("Berkas XLSX diunduh", {
      description: `${rows.length} siswa berhasil diekspor.`,
    });
  }

  function handleScheduleRemedial(student: StudentGrade) {
    toast.success("Sesi bimbingan dibuka", {
      description: `Jadwal remedial ${student.name} telah disiapkan untuk tindak lanjut.`,
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

      {isRemedialOpen ? (
        <FadeIn delay={0.1}>
          <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <GradeLedger
              students={students}
              classFilter=""
              subjectFilter=""
              assessmentFilter=""
              classLabel="Semua Kelas"
              subjectLabel="Semua Mapel"
              assessmentLabel="Siswa Perlu Remidi"
              opened
              remedialOnly
              onScheduleRemedial={handleScheduleRemedial}
              onEditNote={handleEditNote}
              onViewDetail={handleViewDetail}
              onChangeFilter={handleCloseRemedial}
              onBack={handleCloseRemedial}
              onDownload={handleDownload}
            />
          </section>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            <section
              className={`overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${
                isLedgerOpen ? "lg:col-span-12" : "lg:col-span-8"
              }`}
            >
              <ValueToolbar
                classOptions={classOptions}
                subjectOptions={subjectOptions}
                assessmentOptions={assessmentOptions}
                classFilter={classFilter}
                subjectFilter={subjectFilter}
                assessmentFilter={assessmentFilter}
                opened={isLedgerOpen}
                studentStats={studentStats}
                selectedClassLabel={selectedClassLabel}
                selectedSubjectLabel={selectedSubjectLabel}
                selectedAssessmentLabel={selectedAssessmentLabel}
                onClassChange={handleClassChange}
                onSubjectChange={handleSubjectChange}
                onAssessmentChange={handleAssessmentChange}
                onOpen={() => setIsLedgerOpen(true)}
              />

              <GradeLedger
                students={students}
                classFilter={classFilter}
                subjectFilter={subjectFilter}
                assessmentFilter={assessmentFilter}
                classLabel={selectedClassLabel}
                subjectLabel={selectedSubjectLabel}
                assessmentLabel={selectedAssessmentLabel}
                opened={isLedgerOpen}
                onScheduleRemedial={handleScheduleRemedial}
                onEditNote={handleEditNote}
                onViewDetail={handleViewDetail}
                onChangeFilter={() => setIsLedgerOpen(false)}
                onBack={handleBack}
                onDownload={handleDownload}
              />
            </section>

            {!isLedgerOpen && (
              <FadeIn delay={0.14} className="lg:col-span-4">
                <RemedialPanel onOpenList={handleOpenRemedial} />
              </FadeIn>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
