"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";
import { FadeIn } from "@/components/ui/animations";
import { useAuthStore } from "@/lib/store/auth-store";
import { masterDataApi } from "@/lib/api/master-data";
import type {
  AttendanceDate,
  SchoolClass,
  StudentSummary,
} from "@/lib/api/master-data";
import { AttendancePageHeader } from "./page-header";
import { AttendanceTable } from "./attendance-table";
import { AttendanceToolbar } from "./attendance-toolbar";
import { AccessDeniedPlaceholder } from "./access-denied-placeholder";
import type {
  AttendanceCounts,
  AttendanceStatus,
  StudentAttendance,
} from "./types";

const statusDefaults: Record<
  AttendanceStatus,
  Pick<StudentAttendance, "method" | "methodLabel" | "checkInTime">
> = {
  hadir: {
    method: "manual",
    methodLabel: "Manual Guru",
    checkInTime: "07:30 WITA",
  },
  sakit: {
    method: "document",
    methodLabel: "Surat Dokter Valid",
  },
  izin: {
    method: "dispensation",
    methodLabel: "Dispensasi Sekolah",
  },
  alpa: {
    method: "manual",
    methodLabel: "Tidak ada keterangan",
  },
};

const avatarPalette = [
  "bg-[#FFEBEB] text-[#b71422]",
  "bg-[#EDF6FF] text-[#006398]",
  "bg-[#EDFFF6] text-[#7A941F]",
  "bg-[#FFF4DB] text-[#D97706]",
  "bg-[#F3E8FF] text-[#7C3AED]",
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

function toAttendance(
  student: StudentSummary,
  index: number,
  className: string
): StudentAttendance {
  return {
    id: student.id,
    name: student.fullName,
    initials: initials(student.fullName),
    avatarClassName: avatarPalette[index % avatarPalette.length],
    nisn: student.nomorInduk ?? student.nisn ?? "-",
    gender: student.jenisKelamin === "L" ? "Lk" : "Pr",
    rollNo: String(index + 1),
    className,
    status: "hadir",
    checkInTime: "07:30 WITA",
    method: "manual",
    methodLabel: "Manual Guru",
    note: "-",
    noteTone: "neutral",
  };
}

export function AttendanceManagement({
  initialClassId,
  initialDate,
}: {
  initialClassId?: string;
  initialDate?: string;
} = {}) {
  const user = useAuthStore((state) => state.user);

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);

  const [classFilter, setClassFilter] = useState(initialClassId ?? "");
  const [dateFilter, setDateFilter] = useState(initialDate ?? "");
  const [isSessionOpened, setIsSessionOpened] = useState(false);

  const [dates, setDates] = useState<AttendanceDate[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [datesError, setDatesError] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [baseRoster, setBaseRoster] = useState<StudentAttendance[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState<StudentAttendance[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setClassesLoading(true);
        const res = await masterDataApi.classes.list();
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat kelas");
        }
        setClasses(res.data?.data ?? []);
        setClassesError(null);
      } catch {
        if (active) {
          setClasses([]);
          setClassesError("Tidak dapat memuat daftar kelas.");
        }
      } finally {
        if (active) setClassesLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!classFilter) return;

    let active = true;
    const load = async () => {
      try {
        setDatesLoading(true);
        setStudentsLoading(true);
        const [dateRes, studentRes] = await Promise.all([
          masterDataApi.attendance.dates.list(classFilter),
          masterDataApi.students.list({ classId: classFilter }),
        ]);
        if (!active) return;

        if (dateRes.error) {
          throw new Error(dateRes.error.message ?? "Gagal memuat tanggal presensi");
        }
        if (studentRes.error) {
          throw new Error(studentRes.error.message ?? "Gagal memuat siswa");
        }

        const selectedClass = classes.find((item) => item.id === classFilter);
        const roster = (studentRes.data?.data ?? []).map((student, index) =>
          toAttendance(student, index, selectedClass?.name ?? "")
        );

        setDates(dateRes.data?.data ?? []);
        setStudents(roster);
        setBaseRoster(roster);
        setSavedSnapshot(roster);
        setDatesError(null);
        setStudentsError(null);
      } catch {
        if (active) {
          setDates([]);
          setStudents([]);
          setDatesError("Tidak dapat memuat data presensi.");
          setStudentsError("Tidak dapat memuat data presensi.");
        }
      } finally {
        if (active) {
          setDatesLoading(false);
          setStudentsLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [classFilter, classes]);

  const visibleClasses = useMemo(
    () =>
      user?.role === "admin"
        ? classes
        : classes.filter((item) => item.advisorId === user?.id),
    [classes, user?.id, user?.role]
  );

  const classOptions = useMemo(
    () => visibleClasses.map((item) => ({ value: item.id, label: item.name })),
    [visibleClasses]
  );

  const selectedClass = visibleClasses.find((item) => item.id === classFilter) ?? null;

  const dateOptions = useMemo(
    () =>
      dates.map((item) => ({
        value: item.date,
        label: `${moment(item.date).locale("id").format("dddd, D MMM YYYY")} · ${item.subjectCount} mapel`,
      })),
    [dates]
  );

  const selectedDate = dates.find((item) => item.date === dateFilter) ?? null;

  const canOpen =
    user?.role === "admin" || selectedClass?.advisorId === user?.id;

  const isWaliKelas =
    user?.role === "admin" ||
    classes.some((item) => item.advisorId === user?.id);

  const counts = useMemo<AttendanceCounts>(
    () =>
      students.reduce<AttendanceCounts>(
        (accumulator, student) => {
          accumulator[student.status] += 1;
          return accumulator;
        },
        { hadir: 0, sakit: 0, izin: 0, alpa: 0 }
      ),
    [students]
  );

  function handleClassChange(value: string) {
    setClassFilter(value);
    setDateFilter("");
    setDates([]);
    setStudents([]);
    setBaseRoster([]);
    setSavedSnapshot([]);
    setDatesError(null);
    setStudentsError(null);
    setIsSessionOpened(false);
  }

  function handleDateChange(value: string) {
    setDateFilter(value);
    setIsSessionOpened(false);
    setStudents(baseRoster);
    setSavedSnapshot(baseRoster);
  }

  function handleStatusChange(studentId: string, status: AttendanceStatus) {
    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId || student.status === status) {
          return student;
        }

        return {
          ...student,
          status,
          ...statusDefaults[status],
        };
      })
    );
  }

  function handleNoteChange(studentId: string, note: string) {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId ? { ...student, note } : student,
      ),
    );
  }

  async function handleOpenSession() {
    if (!classFilter || !dateFilter) return;
    setIsSessionOpened(true);
    setStudentsLoading(true);

    try {
      const res = await masterDataApi.attendance.records.list(
        classFilter,
        dateFilter,
      );
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal memuat catatan presensi");
      }

      const records = new Map(
        (res.data?.data?.students ?? []).map((record) => [
          record.studentId,
          record,
        ]),
      );

      const next = students.map((student) => {
        const record = records.get(student.id);
        const status = record?.status ?? "hadir";
        return {
          ...student,
          status,
          note: record?.note || "-",
          ...statusDefaults[status],
        };
      });

      setStudents(next);
      setSavedSnapshot(next);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memuat catatan presensi",
      );
    } finally {
      setStudentsLoading(false);
    }
  }

  function handleCancelSession() {
    setStudents(savedSnapshot);
    setIsSessionOpened(false);
  }

  async function handleSaveSession() {
    if (!classFilter || !dateFilter) return;
    setSaving(true);

    try {
      const res = await masterDataApi.attendance.records.save(
        classFilter,
        dateFilter,
        students.map((student) => ({
          studentId: student.id,
          status: student.status,
          note: student.note === "-" ? "" : student.note,
        })),
      );
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal menyimpan presensi");
      }

      setSavedSnapshot(students);
      setIsSessionOpened(false);
      toast.success("Presensi tersimpan", {
        description: `Presensi ${selectedClass?.name ?? "-"} · ${
          selectedDate
            ? moment(selectedDate.date).locale("id").format("dddd, D MMMM YYYY")
            : "-"
        } berhasil disimpan.`,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan presensi",
      );
    } finally {
      setSaving(false);
    }
  }

  if (classesLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#EBF0F5]">
        <Loader2 className="size-8 animate-spin text-[#b71422]" />
      </div>
    );
  }

  if (classesError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#EBF0F5] px-6">
        <p className="rounded-2xl bg-[#FEE2E2] px-4 py-3 text-center text-[13px] text-[#b91c1c]">
          {classesError}
        </p>
      </div>
    );
  }

  if (!isWaliKelas) {
    return (
      <AccessDeniedPlaceholder
        userName={user?.full_name}
        userIdentifier={user?.nomor_induk}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AttendancePageHeader />

      <FadeIn delay={0.12}>
        <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <AttendanceToolbar
            classOptions={classesLoading ? [] : classOptions}
            dateOptions={dateOptions}
            classFilter={classFilter}
            dateFilter={dateFilter}
            opened={isSessionOpened}
            canOpen={canOpen}
            counts={counts}
            studentCount={students.length}
            selectedClassLabel={selectedClass?.name ?? "-"}
            selectedDate={selectedDate}
            onClassChange={handleClassChange}
            onDateChange={handleDateChange}
            onOpenSession={handleOpenSession}
          />

          {classesError ? (
            <div className="bg-white px-4 py-3 text-[13px] text-[#b91c1c]">
              {classesError}
            </div>
          ) : null}

          {datesError ? (
            <div className="bg-white px-4 py-3 text-[13px] text-[#b91c1c]">
              {datesError}
            </div>
          ) : null}

          {studentsError ? (
            <div className="bg-white px-4 py-3 text-[13px] text-[#b91c1c]">
              {studentsError}
            </div>
          ) : null}

          <AttendanceTable
            students={students}
            classLabel={selectedClass?.name ?? "-"}
            dateLabel={
              selectedDate
                ? `${selectedDate.day}, ${moment(selectedDate.date)
                    .locale("id")
                    .format("D MMMM YYYY")}`
                : "-"
            }
            subjectCount={selectedDate?.subjectCount ?? 0}
            loading={datesLoading || studentsLoading}
            saving={saving}
            opened={isSessionOpened}
            onStatusChange={handleStatusChange}
            onNoteChange={handleNoteChange}
            onCancel={handleCancelSession}
            onSave={handleSaveSession}
          />
        </section>
      </FadeIn>
    </div>
  );
}
