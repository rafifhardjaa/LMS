"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { AttendancePageHeader } from "./page-header";
import { AttendanceSummaryGrid } from "./summary-grid";
import { AttendanceTable } from "./attendance-table";
import { AttendanceToolbar } from "./attendance-toolbar";
import { students as initialStudents } from "./data";
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

  function handleClassChange(value: ClassFilter | "") {
    setClassFilter(value);
    setIsSessionOpened(false);
  }

  function handleSubjectChange(value: SubjectFilter) {
    setSubjectFilter(value);
    setIsSessionOpened(false);
  }

  function handleMeetingChange(value: MeetingFilter) {
    setMeetingFilter(value);
    setIsSessionOpened(false);
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

  function handleCancelSession() {
    setIsSessionOpened(false);
  }

  function handleSaveSession() {
    setIsSessionOpened(false);
    toast.success("Presensi tersimpan", {
      description: `Presensi rombel ${classFilter} untuk pertemuan ${
        meetingFilter ? `ke-${meetingFilter}` : "terpilih"
      } berhasil disimpan.`,
    });
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AttendancePageHeader />

      <SlideIn direction="down" delay={0.05}>
        <AttendanceSummaryGrid
          counts={counts}
          totalStudents={classRoster.length}
        />
      </SlideIn>

      <FadeIn delay={0.12}>
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
            students={classRoster}
            classFilter={classFilter}
            opened={isSessionOpened}
            onStatusChange={handleStatusChange}
            onCancel={handleCancelSession}
            onSave={handleSaveSession}
          />
        </section>
      </FadeIn>
    </div>
  );
}
