"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import { AtRiskPanel } from "./at-risk-panel";
import { AttendanceJournal } from "./attendance-journal";
import { AttendancePageHeader } from "./page-header";
import { AttendanceSummaryGrid } from "./summary-grid";
import { AttendanceTable } from "./attendance-table";
import { AttendanceToolbar } from "./attendance-toolbar";
import { DocumentationPanel } from "./documentation-panel";
import { NewSessionDialog } from "./new-session-dialog";
import { QrPanel } from "./qr-panel";
import { WeeklyTrend } from "./weekly-trend";
import { pageSize, students as initialStudents } from "./data";
import type {
  AttendanceCounts,
  AttendanceStatus,
  ClassFilter,
  SessionFilter,
  StatusFilter,
  StudentAttendance,
} from "./types";

const statusDefaults: Record<
  AttendanceStatus,
  Pick<StudentAttendance, "method" | "methodLabel" | "checkInTime">
> = {
  HADIR: {
    method: "manual",
    methodLabel: "Manual Guru",
    checkInTime: "07:30 WITA",
  },
  SAKIT: {
    method: "document",
    methodLabel: "Surat Dokter Valid",
  },
  IZIN: {
    method: "dispensation",
    methodLabel: "Dispensasi Sekolah",
  },
  ALPA: {
    method: "manual",
    methodLabel: "Tidak ada keterangan",
  },
};

export function AttendanceManagement() {
  const [roster, setRoster] = useState(initialStudents);
  const [classFilter, setClassFilter] = useState<ClassFilter>("VII-A");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("today");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);

  const closeSessionDialog = useCallback(
    () => setIsSessionDialogOpen(false),
    [],
  );

  const classRoster = useMemo(
    () => roster.filter((student) => student.className === classFilter),
    [classFilter, roster],
  );

  const counts = useMemo<AttendanceCounts>(() => {
    return classRoster.reduce<AttendanceCounts>(
      (accumulator, student) => {
        accumulator[student.status] += 1;
        return accumulator;
      },
      { HADIR: 0, SAKIT: 0, IZIN: 0, ALPA: 0 },
    );
  }, [classRoster]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return classRoster.filter((student) => {
      const matchesStatus =
        statusFilter === "ALL" || student.status === statusFilter;
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.nisn.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [classRoster, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleStudents = filteredStudents.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function handleClassChange(value: ClassFilter) {
    setClassFilter(value);
    setPage(1);
  }

  function handleSessionChange(value: SessionFilter) {
    setSessionFilter(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(studentId: string, status: AttendanceStatus) {
    setRoster((current) =>
      current.map((student) => {
        if (student.id !== studentId || student.status === status) {
          return student;
        }

        return {
          ...student,
          status,
          ...statusDefaults[status],
        };
      }),
    );
  }

  function handleMarkAllPresent() {
    setRoster((current) =>
      current.map((student) => {
        if (student.className !== classFilter) return student;

        return {
          ...student,
          status: "HADIR",
          method: student.status === "HADIR" ? student.method : "manual",
          methodLabel:
            student.status === "HADIR" ? student.methodLabel : "Manual Guru",
          checkInTime: student.checkInTime ?? "07:30 WITA",
        };
      }),
    );
    setStatusFilter("ALL");
    setPage(1);
    toast.success("Semua siswa ditandai hadir", {
      description: `${classRoster.length} siswa rombel ${classFilter} diperbarui.`,
    });
  }

  function handleWhatsApp(student: StudentAttendance) {
    toast.success("Pesan wali murid disiapkan", {
      description: `Pesan WhatsApp untuk wali ${student.name} siap dikirim.`,
    });
  }

  function handleViewStudent(student: StudentAttendance) {
    toast.info(`Rekap kehadiran ${student.name}`, {
      description:
        "Ringkasan kehadiran semester dan riwayat dispensasi siswa dibuka.",
    });
  }

  function handleLock() {
    setIsLocked(true);
    toast.success("Presensi sesi ini dikunci", {
      description:
        "Data kehadiran dan jurnal kelas telah difinalisasi untuk e-Rapor.",
    });
  }

  function handleUnlock() {
    setIsLocked(false);
    toast.info("Kunci presensi dibuka", {
      description: "Perubahan presensi dapat dilakukan kembali.",
    });
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AttendancePageHeader
        onOpenSession={() => setIsSessionDialogOpen(true)}
      />

      <AttendanceSummaryGrid
        counts={counts}
        totalStudents={classRoster.length}
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <FadeIn delay={0.06} className="flex flex-col gap-4 lg:col-span-8">
          <AttendanceToolbar
            classFilter={classFilter}
            sessionFilter={sessionFilter}
            statusFilter={statusFilter}
            search={search}
            counts={counts}
            visibleCount={visibleStudents.length}
            filteredCount={filteredStudents.length}
            isLocked={isLocked}
            onClassChange={handleClassChange}
            onSessionChange={handleSessionChange}
            onStatusChange={handleStatusFilterChange}
            onSearchChange={handleSearchChange}
            onMarkAllPresent={handleMarkAllPresent}
          />

          <AttendanceTable
            students={visibleStudents}
            classFilter={classFilter}
            page={safePage}
            pageCount={pageCount}
            filteredCount={filteredStudents.length}
            isLocked={isLocked}
            onPageChange={setPage}
            onStatusChange={handleStatusChange}
            onWhatsApp={handleWhatsApp}
            onViewStudent={handleViewStudent}
          />

          <AttendanceJournal
            isLocked={isLocked}
            onLock={handleLock}
            onUnlock={handleUnlock}
          />
        </FadeIn>

        <FadeIn delay={0.12} className="flex flex-col gap-4 lg:col-span-4">
          <QrPanel />
          <WeeklyTrend />
          <AtRiskPanel />
          <DocumentationPanel />
        </FadeIn>
      </div>

      <NewSessionDialog
        open={isSessionDialogOpen}
        onClose={closeSessionDialog}
      />
    </div>
  );
}
