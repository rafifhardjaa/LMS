"use client";

import {
  CheckCircle2,
  ClipboardList,
  Loader2,
  Search,
  Undo2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { statusButtonStyles } from "./data";
import type { AttendanceStatus, StudentAttendance } from "./types";

type AttendanceTableProps = {
  students: StudentAttendance[];
  classLabel: string;
  dateLabel: string;
  subjectCount: number;
  loading: boolean;
  opened: boolean;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function AttendanceTable({
  students,
  classLabel,
  dateLabel,
  subjectCount,
  loading,
  opened,
  onStatusChange,
  onCancel,
  onSave,
}: AttendanceTableProps) {
  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div
          key="placeholder"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center bg-white px-6 py-16 text-center"
        >
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex size-16 items-center justify-center rounded-2xl border border-[#F3C4C4] bg-[#FFEBEB] text-[#b71422]"
          >
            <ClipboardList className="size-8" />
          </motion.span>
          <p className="mt-4 text-sm font-bold text-[#1E293B]">
            Pilih terlebih dahulu sesi presensi
          </p>
          <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#94A3B8]">
            Lengkapi filter kelas, mata pelajaran, dan pertemuan pada header di
            atas, lalu klik &quot;Buka presensi&quot;.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="table"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3 }}
          className="bg-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[6%]" />
                <col className="w-[34%]" />
                <col className="w-[10%]" />
                <col className="w-[24%]" />
                <col className="w-[26%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#EFF4FF] text-[8px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
                  <th className="px-3 py-3 text-center">No</th>
                  <th className="px-3 py-3">Nama Lengkap</th>
                  <th className="px-3 py-3 text-center">Jenis Kelamin</th>
                  <th className="px-3 py-3">Nomor Induk</th>
                  <th className="px-3 py-3 text-center">Status Kehadiran</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {students.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.03, 0.45),
                    }}
                    className={cn(
                      "transition-colors hover:bg-[#F8FAFC]",
                      student.status === "SAKIT" && "bg-[#FEF3C7]/10",
                      student.status === "IZIN" && "bg-[#E0F2FE]/10",
                      student.status === "ALPA" && "bg-[#FEE2E2]/10",
                    )}
                  >
                    <td className="px-3 py-3 text-center text-[10px] font-bold text-[#94A3B8]">
                      {index + 1}
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
                        <p className="truncate text-[11px] font-bold text-[#1E293B]">
                          {student.name}
                        </p>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-center text-[10px] font-semibold text-[#475569]">
                      {student.gender}
                    </td>

                    <td className="px-3 py-3 font-mono text-[11px] font-medium text-[#475569]">
                      {student.nisn}
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
                              onClick={() => onStatusChange(student.id, status)}
                              className={cn(
                                "flex size-7 items-center justify-center rounded text-[10px] font-bold transition",
                                isActive
                                  ? statusButtonStyles[status].active
                                  : cn(
                                      "text-[#94A3B8]",
                                      statusButtonStyles[status].hover,
                                    ),
                              )}
                            >
                              {status.charAt(0)}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-6 py-10 text-[12px] font-semibold text-[#94A3B8]">
              <Loader2 className="size-4 animate-spin text-[#b71422]" />
              Memuat data presensi…
            </div>
          ) : null}

          {!loading && students.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center px-6 py-12 text-center"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
                <Search className="size-4" />
              </span>
              <p className="mt-2 text-xs font-semibold text-[#334155]">
                Tidak ada siswa di kelas ini
              </p>
              <p className="mt-0.5 max-w-sm text-[10px] leading-4 text-[#94A3B8]">
                Ubah filter kelas atau mata pelajaran untuk melihat daftar presensi.
              </p>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#F1F5F9] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-medium text-[#94A3B8]">
              Menampilkan {students.length} siswa · {classLabel} · {dateLabel} ·{" "}
              {subjectCount} mapel
            </p>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCancel}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Undo2 className="size-4" />
                Batal
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSave}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-[#b71422] px-4 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(183,20,34,0.7)] transition hover:bg-[#8f0f1a]"
              >
                <CheckCircle2 className="size-4" />
                Simpan presensi
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
