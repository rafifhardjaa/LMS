"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  masterDataApi,
  type Assignment as ApiAssignment,
  type AssignmentGradingRow,
  type StudentSummary,
  type TeachingAssignment,
} from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn } from "@/components/ui/animations";
import { AverageScoreChart } from "./average-score-chart";
import { CompletionStatusChart } from "./completion-status-chart";
import { getStudentStatus } from "./data";
import { GradeLedger } from "./grade-ledger";
import { mapStudentsWithGrades } from "./mappers";
import { AnalyticsPageHeader } from "./page-header";
import { RemedialPanel } from "./remedial-panel";
import type { StudentGrade } from "./types";
import { ValueToolbar } from "./value-toolbar";

function errorMessage(error: { message?: string | null } | null | undefined) {
  return error?.message ?? "Terjadi kesalahan saat memuat data.";
}

export function AnalyticsGrades() {
  const user = useAuthStore((state) => state.user);

  const [teachingAssignments, setTeachingAssignments] = useState<TeachingAssignment[]>([]);
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [gradingRows, setGradingRows] = useState<AssignmentGradingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isRemedialOpen, setIsRemedialOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await masterDataApi.teacherAssignments.list({
          teacherId: user.id,
        });
        if (!active) return;
        if (res.error) throw new Error(errorMessage(res.error));
        setTeachingAssignments(res.data?.data ?? []);
      } catch (err) {
        if (active) {
          setTeachingAssignments([]);
          setError(
            err instanceof Error ? err.message : "Gagal memuat data course.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!classFilter || !subjectFilter) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const meetingRes = await masterDataApi.courseDetails.meetings.list(
          subjectFilter,
          classFilter,
        );
        if (!active) return;
        if (meetingRes.error) throw new Error(errorMessage(meetingRes.error));

        const meetings = meetingRes.data?.data ?? [];
        const responses = await Promise.all(
          meetings.map((meeting) =>
            masterDataApi.courseDetails.assignments.list(
              subjectFilter,
              classFilter,
              meeting.id,
            ),
          ),
        );
        if (!active) return;
        setAssignments(responses.flatMap((res) => res.data?.data ?? []));
      } catch (err) {
        if (active) {
          setAssignments([]);
          setError(
            err instanceof Error ? err.message : "Gagal memuat tugas/kuis.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [classFilter, subjectFilter]);

  useEffect(() => {
    if (!classFilter) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await masterDataApi.students.list({ classId: classFilter });
        if (!active) return;
        if (res.error) throw new Error(errorMessage(res.error));
        setStudents(res.data?.data ?? []);
      } catch (err) {
        if (active) {
          setStudents([]);
          setError(
            err instanceof Error ? err.message : "Gagal memuat siswa kelas.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [classFilter]);

  useEffect(() => {
    if (!subjectFilter || !assignmentFilter) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await masterDataApi.courseDetails.assignments.grading(
          subjectFilter,
          assignmentFilter,
        );
        if (!active) return;
        if (res.error) throw new Error(errorMessage(res.error));
        setGradingRows(res.data?.data ?? []);
      } catch (err) {
        if (active) {
          setGradingRows([]);
          setError(
            err instanceof Error ? err.message : "Gagal memuat nilai siswa.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [assignmentFilter, subjectFilter]);

  const classOptions = useMemo(() => {
    const map = new Map<string, string>();
    teachingAssignments.forEach((item) => {
      if (item.classId && item.className) map.set(item.classId, item.className);
    });
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }, [teachingAssignments]);

  const subjectOptions = useMemo(() => {
    const map = new Map<string, string>();
    teachingAssignments
      .filter((item) => item.classId === classFilter)
      .forEach((item) => {
        if (item.subjectId) {
          map.set(
            item.subjectId,
            item.subjectName || item.subjectCode || "Mata pelajaran",
          );
        }
      });
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }, [classFilter, teachingAssignments]);

  const assignmentOptions = useMemo(
    () =>
      assignments.map((assignment) => ({
        value: assignment.id,
        label: `${assignment.type === "kuis" ? "Kuis" : "Tugas"}: ${assignment.title}`,
      })),
    [assignments],
  );

  const selectedClassLabel =
    classOptions.find((option) => option.value === classFilter)?.label ?? "-";
  const selectedSubjectLabel =
    subjectOptions.find((option) => option.value === subjectFilter)?.label ?? "-";
  const selectedAssignmentLabel =
    assignmentOptions.find((option) => option.value === assignmentFilter)?.label ??
    "-";

  const studentRows = useMemo(
    () =>
      mapStudentsWithGrades({
        students,
        gradingRows,
        className: selectedClassLabel,
        subjectLabel: selectedSubjectLabel,
      }),
    [gradingRows, selectedClassLabel, selectedSubjectLabel, students],
  );

  const studentStats = useMemo(() => {
    const statuses = studentRows.map((student) => getStudentStatus(student));
    return {
      total: studentRows.length,
      tuntas: statuses.filter((status) => status.tone === "success").length,
      remidi: statuses.filter((status) => status.tone === "danger").length,
    };
  }, [studentRows]);

  const remedialStudents = useMemo(
    () =>
      studentRows.filter(
        (student) => getStudentStatus(student).tone === "danger",
      ),
    [studentRows],
  );

  function handleClassChange(value: string) {
    setClassFilter(value);
    setSubjectFilter("");
    setAssignmentFilter("");
    setAssignments([]);
    setGradingRows([]);
    setStudents([]);
    setIsLedgerOpen(false);
    setIsRemedialOpen(false);
  }

  function handleSubjectChange(value: string) {
    setSubjectFilter(value);
    setAssignmentFilter("");
    setAssignments([]);
    setGradingRows([]);
    setIsLedgerOpen(false);
    setIsRemedialOpen(false);
  }

  function handleAssignmentChange(value: string) {
    setAssignmentFilter(value);
    setGradingRows([]);
    setIsLedgerOpen(false);
    setIsRemedialOpen(false);
  }

  function handleBack() {
    setClassFilter("");
    setSubjectFilter("");
    setAssignmentFilter("");
    setAssignments([]);
    setGradingRows([]);
    setStudents([]);
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
      : `rekap-nilai-${selectedClassLabel || "kelas"}-${selectedAssignmentLabel || "tugas"}.xlsx`.replace(
          /[^\w\d-]+/g,
          "-",
        );

    import("@/lib/export-xlsx").then(({ exportStudentsToXlsx }) => {
      exportStudentsToXlsx(rows, filename);
      toast.success("Berkas XLSX diunduh", {
        description: `${rows.length} siswa berhasil diekspor.`,
      });
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
      description: `Rincian nilai ${student.name} pada ${selectedAssignmentLabel}.`,
    });
  }

  if (loading && !teachingAssignments.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#EBF0F5]">
        <Loader2 className="size-7 animate-spin text-[#b71422]" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AnalyticsPageHeader />

      {error ? (
        <div className="rounded-2xl bg-[#FEE2E2] px-5 py-4 text-[13px] font-semibold text-[#b91c1c]">
          {error}
        </div>
      ) : null}

      <FadeIn delay={0.06} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AverageScoreChart students={studentRows} classLabel={selectedClassLabel} />
        <CompletionStatusChart students={studentRows} classLabel={selectedClassLabel} />
      </FadeIn>

      {isRemedialOpen ? (
        <FadeIn delay={0.1}>
          <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <GradeLedger
              students={remedialStudents}
              classLabel={selectedClassLabel}
              subjectLabel={selectedSubjectLabel}
              assignmentLabel={selectedAssignmentLabel}
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
                assignmentOptions={assignmentOptions}
                classFilter={classFilter}
                subjectFilter={subjectFilter}
                assignmentFilter={assignmentFilter}
                opened={isLedgerOpen}
                studentStats={studentStats}
                selectedClassLabel={selectedClassLabel}
                selectedSubjectLabel={selectedSubjectLabel}
                selectedAssignmentLabel={selectedAssignmentLabel}
                onClassChange={handleClassChange}
                onSubjectChange={handleSubjectChange}
                onAssignmentChange={handleAssignmentChange}
                onOpen={() => setIsLedgerOpen(true)}
              />

              <GradeLedger
                students={studentRows}
                classLabel={selectedClassLabel}
                subjectLabel={selectedSubjectLabel}
                assignmentLabel={selectedAssignmentLabel}
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
                <RemedialPanel
                  students={studentRows}
                  onOpenList={handleOpenRemedial}
                />
              </FadeIn>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
