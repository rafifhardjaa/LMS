"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import { AttendancePageHeader } from "./page-header";
import { AttendanceSummaryGrid } from "./summary-grid";
import { AttendanceTable } from "./attendance-table";
import { AttendanceToolbar } from "./attendance-toolbar";
import { pageSize, students as initialStudents } from "./data";
import type {
  AttendanceCounts,
  AttendanceStatus,
  ClassFilter,
  MeetingFilter,
  StudentAttendance,
  SubjectFilter,
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
  const [classFilter, setClassFilter] = useState<ClassFilter | "">("");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("");
  const [meetingFilter, setMeetingFilter] = useState<MeetingFilter>("");
  const [isSessionOpened, setIsSessionOpened] = useState(false);
  const [page, setPage] = useState(1);

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

  const pageCount = Math.max(1, Math.ceil(classRoster.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleStudents = classRoster.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function handleClassChange(value: ClassFilter | "") {
    setClassFilter(value);
    setIsSessionOpened(false);
    setPage(1);
  }

  function handleSubjectChange(value: SubjectFilter) {
    setSubjectFilter(value);
    setIsSessionOpened(false);
    setPage(1);
  }

  function handleMeetingChange(value: MeetingFilter) {
    setMeetingFilter(value);
    setIsSessionOpened(false);
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

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AttendancePageHeader />

      <AttendanceSummaryGrid
        counts={counts}
        totalStudents={classRoster.length}
      />

      <FadeIn delay={0.06}>
        <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <AttendanceToolbar
            classFilter={classFilter}
            subjectFilter={subjectFilter}
            meetingFilter={meetingFilter}
            opened={isSessionOpened}
            counts={counts}
            studentCount={classRoster.length}
            onClassChange={handleClassChange}
            onSubjectChange={handleSubjectChange}
            onMeetingChange={handleMeetingChange}
            onOpenSession={() => setIsSessionOpened(true)}
          />

          <AttendanceTable
            students={visibleStudents}
            classFilter={classFilter}
            page={safePage}
            pageCount={pageCount}
            filteredCount={classRoster.length}
            opened={isSessionOpened}
            onPageChange={setPage}
            onStatusChange={handleStatusChange}
            onWhatsApp={handleWhatsApp}
            onViewStudent={handleViewStudent}
          />
        </section>
      </FadeIn>
    </div>
  );
}
