"use client";

import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  IdCard,
  MapPin,
  Medal,
  MessageCircle,
  Paperclip,
  QrCode,
  ReceiptText,
  ScanFace,
  Search,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { pageSize, statusButtonStyles } from "./data";
import type {
  AttendanceStatus,
  AttendanceTone,
  ClassFilter,
  StudentAttendance,
} from "./types";

type AttendanceTableProps = {
  students: StudentAttendance[];
  classFilter: ClassFilter;
  page: number;
  pageCount: number;
  filteredCount: number;
  isLocked: boolean;
  onPageChange: (page: number) => void;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onWhatsApp: (student: StudentAttendance) => void;
  onViewStudent: (student: StudentAttendance) => void;
};

const noteToneClassName: Record<AttendanceTone, string> = {
  neutral: "bg-[#F1F5F9] text-[#475569]",
  success: "bg-[#DCFCE7] text-[#16A34A]",
  warning: "bg-[#FEF3C7] text-[#D97706]",
  info: "bg-[#E0F2FE] text-[#0284C7]",
  danger: "bg-[#FFEBEB] text-[#b71422]",
};

const methodIcons = {
  qr: QrCode,
  geo: MapPin,
  face: ScanFace,
  manual: CalendarClock,
  document: ReceiptText,
  dispensation: Medal,
};

const methodIconClassName = {
  qr: "text-[#16A34A]",
  geo: "text-[#0284C7]",
  face: "text-[#16A34A]",
  manual: "text-[#D97706]",
  document: "text-[#D97706]",
  dispensation: "text-[#0284C7]",
};

function CheckInCell({ student }: { student: StudentAttendance }) {
  if (student.status === "SAKIT") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#D97706]">
        <ReceiptText className="size-3.5 shrink-0" />
        Surat Dokter Valid
      </div>
    );
  }

  if (student.status === "IZIN") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0284C7]">
        <Medal className="size-3.5 shrink-0" />
        Dispensasi Sekolah
      </div>
    );
  }

  if (student.status === "ALPA") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#DC2626]">
        <TriangleAlert className="size-3.5 shrink-0" />
        Tidak ada keterangan
      </div>
    );
  }

  const Icon = methodIcons[student.method];

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-[#334155]">
      <Icon
        className={cn("size-3.5 shrink-0", methodIconClassName[student.method])}
      />
      <span className="font-semibold">{student.checkInTime ?? "07:30 WITA"}</span>
      <span className="text-[8px] font-bold uppercase tracking-[0.04em] text-[#94A3B8]">
        ({student.methodLabel})
      </span>
    </div>
  );
}

export function AttendanceTable({
  students,
  classFilter,
  page,
  pageCount,
  filteredCount,
  isLocked,
  onPageChange,
  onStatusChange,
  onWhatsApp,
  onViewStudent,
}: AttendanceTableProps) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + students.length, filteredCount);

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 bg-[#F8FAFC] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-bold text-[#1E293B]">
            Presensi Kelas Tatap Muka &amp; Lab Praktikum
          </h2>
          <span className="size-2 animate-pulse rounded-full bg-[#22C55E]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.04em] text-[#006B2C]">
            Sinkronisasi SiManis Aktif
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[8px] font-bold uppercase tracking-[0.04em] text-[#94A3B8]">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-[#16A34A]" />
            H = Hadir
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-[#D97706]" />
            S = Sakit
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-[#0284C7]" />
            I = Izin
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-[#DC2626]" />
            A = Alpa
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[28%]" />
            <col className="w-[20%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[11%]" />
          </colgroup>
          <thead>
            <tr className="bg-[#EFF4FF] text-[8px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
              <th className="px-3 py-3 text-center">No</th>
              <th className="px-3 py-3">Nama Lengkap &amp; Identitas</th>
              <th className="px-3 py-3 text-center">Status Kehadiran</th>
              <th className="px-3 py-3">Waktu &amp; Metode Check-in</th>
              <th className="px-3 py-3">Catatan Guru / Keterangan</th>
              <th className="px-2 py-3 text-right">Aksi Cepat</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F5F9]">
            {students.map((student) => (
              <tr
                key={student.id}
                className={cn(
                  "transition-colors hover:bg-[#F8FAFC]",
                  student.status === "SAKIT" && "bg-[#FEF3C7]/10",
                  student.status === "IZIN" && "bg-[#E0F2FE]/10",
                  student.status === "ALPA" && "bg-[#FEE2E2]/10",
                )}
              >
                <td className="px-3 py-3 text-center text-[10px] font-bold text-[#94A3B8]">
                  {student.rollNo}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        student.avatarClassName,
                      )}
                    >
                      {student.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-[#1E293B]">
                        {student.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] font-medium text-[#94A3B8]">
                        {student.nisn} • {student.gender}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <div className="mx-auto flex w-fit items-center gap-1 rounded-lg bg-[#EFF4FF] p-1">
                    {(
                      ["HADIR", "SAKIT", "IZIN", "ALPA"] as AttendanceStatus[]
                    ).map((status) => {
                      const isActive = student.status === status;

                      return (
                        <button
                          key={status}
                          type="button"
                          aria-pressed={isActive}
                          aria-label={`${student.name}: ${status}`}
                          disabled={isLocked}
                          onClick={() => onStatusChange(student.id, status)}
                          className={cn(
                            "flex size-7 items-center justify-center rounded text-[10px] font-bold transition",
                            isActive
                              ? statusButtonStyles[status].active
                              : cn(
                                  "text-[#94A3B8]",
                                  statusButtonStyles[status].hover,
                                ),
                            isLocked && "cursor-not-allowed opacity-60",
                          )}
                        >
                          {status.charAt(0)}
                        </button>
                      );
                    })}
                  </div>
                </td>

                <td className="px-3 py-3">
                  <CheckInCell student={student} />
                </td>

                <td className="px-3 py-3">
                  <span
                    title={student.note}
                    className={cn(
                      "inline-flex max-w-[190px] items-center gap-1 truncate rounded-md px-2 py-1 text-[9px] font-semibold",
                      noteToneClassName[student.noteTone ?? "neutral"],
                    )}
                  >
                    {student.note.includes("PDF") && (
                      <Paperclip className="size-3 shrink-0" />
                    )}
                    <span className="truncate">{student.note}</span>
                  </span>
                </td>

                <td className="px-2 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title={`Hubungi wali ${student.name}`}
                      aria-label={`Hubungi wali ${student.name}`}
                      onClick={() => onWhatsApp(student)}
                      className="flex size-7 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569] transition hover:bg-[#FFEBEB] hover:text-[#b71422]"
                    >
                      <MessageCircle className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title={`Lihat rekap ${student.name}`}
                      aria-label={`Lihat rekap ${student.name}`}
                      onClick={() => onViewStudent(student)}
                      className="flex size-7 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569] transition hover:bg-[#FFEBEB] hover:text-[#b71422]"
                    >
                      <IdCard className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
            <Search className="size-4" />
          </span>
          <p className="mt-2 text-xs font-semibold text-[#334155]">
            Tidak ada siswa yang cocok
          </p>
          <p className="mt-0.5 max-w-sm text-[10px] leading-4 text-[#94A3B8]">
            Ubah kata kunci atau filter status untuk melihat daftar presensi.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] font-medium text-[#94A3B8]">
          Menampilkan baris{" "}
          <span className="font-bold text-[#475569]">
            {filteredCount === 0 ? "0" : `${startIndex + 1}–${endIndex}`}
          </span>{" "}
          dari total {filteredCount} siswa aktif rombel {classFilter}
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex h-7 items-center gap-0.5 rounded-lg bg-[#F1F5F9] px-2 text-[9px] font-bold text-[#475569] transition hover:bg-[#FFEBEB] hover:text-[#b71422] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-3" />
            Sebelumnya
          </button>

          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={page === pageNumber ? "page" : undefined}
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg text-[9px] font-bold transition",
                  page === pageNumber
                    ? "bg-[#b71422] text-white shadow-sm"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#FFEBEB] hover:text-[#b71422]",
                )}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
            className="flex h-7 items-center gap-0.5 rounded-lg bg-[#F1F5F9] px-2 text-[9px] font-bold text-[#475569] transition hover:bg-[#FFEBEB] hover:text-[#b71422] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Selanjutnya
            <ChevronRight className="size-3" />
          </button>
        </div>
      </div>
    </section>
  );
}
