"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpDown,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  PencilLine,
  Search,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFinalScore, getStudentStatus, pageSize } from "./data";
import type { StudentGrade } from "./types";

type GradeLedgerProps = {
  students: StudentGrade[];
  classFilter: string;
  subjectFilter: string;
  assessmentFilter: string;
  classLabel: string;
  subjectLabel: string;
  assessmentLabel: string;
  opened: boolean;
  onScheduleRemedial: (student: StudentGrade) => void;
  onEditNote: (student: StudentGrade) => void;
  onViewDetail: (student: StudentGrade) => void;
  onChangeFilter: () => void;
  onBack: () => void;
  onDownload: (rows: StudentGrade[]) => void;
  remedialOnly?: boolean;
};

type SortDirection = "asc" | "desc";

export function GradeLedger({
  students,
  classFilter,
  subjectFilter,
  assessmentFilter,
  classLabel,
  subjectLabel,
  assessmentLabel,
  opened,
  onScheduleRemedial,
  onEditNote,
  onViewDetail,
  onChangeFilter,
  onBack,
  onDownload,
  remedialOnly = false,
}: GradeLedgerProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const filteredStudents = useMemo(() => {
    if (remedialOnly) {
      return students.filter(
        (student) => getStudentStatus(student).tone === "danger",
      );
    }

    return students.filter(
      (student) =>
        student.className === classFilter && student.subject === subjectFilter,
    );
  }, [classFilter, remedialOnly, students, subjectFilter]);

  const sortedStudents = useMemo(
    () =>
      [...filteredStudents].sort((first, second) => {
        const firstScore = getFinalScore(first);
        const secondScore = getFinalScore(second);

        return sortDirection === "desc"
          ? secondScore - firstScore
          : firstScore - secondScore;
      }),
    [filteredStudents, sortDirection],
  );

  const pageCount = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * pageSize;
  const visibleStudents = sortedStudents.slice(
    startIndex,
    startIndex + pageSize,
  );
  const endIndex = Math.min(startIndex + pageSize, sortedStudents.length);

  function isFocusedColumn(column: "formatif" | "sts" | "praktik") {
    return assessmentFilter === column;
  }

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
            Pilih terlebih dahulu filter nilai
          </p>
          <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#94A3B8]">
            Lengkapi filter kelas, mapel, dan asesmen pada toolbar di atas, lalu
            klik &quot;Tampilkan nilai&quot;.
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
          <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                {remedialOnly
                  ? "Daftar Siswa Perlu Remidi"
                  : "Rincian Leger Nilai Siswa"}
              </h2>
              <p className="mt-0.5 text-[11px] leading-4 text-[#64748B]">
                {remedialOnly
                  ? "Siswa dengan nilai di bawah KKTP"
                  : "Bobot: Formatif 30% • STS 30% • Praktik Lab 40%"}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE5EE] bg-white px-3 text-[11px] font-semibold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422]"
              >
                <ArrowLeft className="size-3.5" />
                Kembali
              </button>

              <button
                type="button"
                onClick={() => onDownload(sortedStudents)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE5EE] bg-white px-3 text-[11px] font-semibold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422]"
              >
                <Download className="size-3.5" />
                Unduh .xlsx
              </button>

              <button
                type="button"
                onClick={() =>
                  setSortDirection((current) =>
                    current === "desc" ? "asc" : "desc",
                  )
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE5EE] bg-[#F8FAFC] px-3 text-[11px] font-semibold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422]"
              >
                <ArrowUpDown className="size-3.5" />
                Nilai Akhir {sortDirection === "desc" ? "Tertinggi" : "Terendah"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[6%]" />
                <col className="w-[27%]" />
                <col className="w-[9%]" />
                <col className="w-[9%]" />
                <col className="w-[10%]" />
                <col className="w-[11%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#FECACA] bg-[#FFF1F0] text-[8px] font-bold uppercase tracking-[0.06em] text-[#b71422]">
                  <th className="px-3 py-3 text-center">No</th>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-3 py-3 text-center">Formatif</th>
                  <th className="px-3 py-3 text-center">STS</th>
                  <th className="px-3 py-3 text-center">Praktik Lab</th>
                  <th className="px-3 py-3 text-center">Nilai Akhir</th>
                  <th className="px-3 py-3">Status KKTP</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {visibleStudents.map((student, index) => {
                  const finalScore = getFinalScore(student);
                  const status = getStudentStatus(student);

                  return (
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
                        status.tone === "danger" && "bg-[#FFFBFB]",
                      )}
                    >
                      <td className="px-3 py-3 text-center text-[10px] font-bold text-[#94A3B8]">
                        {startIndex + index + 1}
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
                            <p className="mt-0.5 truncate text-[9px] font-medium text-[#94A3B8]">
                              {student.nisn} • {student.rollNo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className={cn(
                          "px-3 py-3 text-center font-mono text-[11px] font-medium tabular-nums text-[#475569]",
                          isFocusedColumn("formatif") && "bg-[#FFF8F8]/60 text-[#b71422]",
                        )}
                      >
                        {student.formatif}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-3 text-center font-mono text-[11px] font-medium tabular-nums text-[#475569]",
                          isFocusedColumn("sts") && "bg-[#FFF8F8]/60 text-[#b71422]",
                        )}
                      >
                        {student.sts}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-3 text-center font-mono text-[11px] font-medium tabular-nums text-[#475569]",
                          isFocusedColumn("praktik") && "bg-[#FFF8F8]/60 text-[#b71422]",
                        )}
                      >
                        {student.praktik}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={cn(
                            "font-mono text-[12px] font-bold tabular-nums",
                            status.tone === "success"
                              ? "text-[#15803D]"
                              : "text-[#b71422]",
                          )}
                        >
                          {finalScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "text-[9px] font-bold leading-3",
                            status.tone === "success"
                              ? "text-[#16A34A]"
                              : "text-[#b71422]",
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {status.tone === "danger" ? (
                            <button
                              type="button"
                              onClick={() => onScheduleRemedial(student)}
                              className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#F3C6C3] bg-[#FFF1F0] px-2 text-[9px] font-bold text-[#b71422] transition hover:bg-[#FFE4E1]"
                            >
                              <CalendarClock className="size-3" />
                              Bimbingan
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                title={`Catatan ${student.name}`}
                                aria-label={`Catatan ${student.name}`}
                                onClick={() => onEditNote(student)}
                                className="flex size-7 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#FFEBEB] hover:text-[#b71422]"
                              >
                                <PencilLine className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                title={`Lihat detail ${student.name}`}
                                aria-label={`Lihat detail ${student.name}`}
                                onClick={() => onViewDetail(student)}
                                className="flex size-7 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#E0F2FE] hover:text-[#006398]"
                              >
                                <Eye className="size-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center px-6 py-12 text-center"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
                <Search className="size-4" />
              </span>
              <p className="mt-2 text-xs font-semibold text-[#334155]">
                {remedialOnly
                  ? "Tidak ada siswa perlu remidi"
                  : "Tidak ada siswa pada filter ini"}
              </p>
              <p className="mt-0.5 max-w-sm text-[10px] leading-4 text-[#94A3B8]">
                {remedialOnly
                  ? "Semua siswa berada di atas KKTP."
                  : "Ubah kelas atau mata pelajaran untuk melihat daftar nilai siswa."}
              </p>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#F1F5F9] bg-white px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-medium text-[#94A3B8]">
              Menampilkan{" "}
              <span className="font-bold text-[#334155]">
                {sortedStudents.length === 0 ? "0" : `${startIndex + 1}-${endIndex}`}
              </span>{" "}
              dari {sortedStudents.length} siswa
              {remedialOnly
                ? " perlu remidi"
                : ` · ${classLabel} · ${subjectLabel} · ${assessmentLabel}`}
            </p>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {!remedialOnly && (
                <button
                  type="button"
                  onClick={onChangeFilter}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <Undo2 className="size-3.5" />
                  Ubah filter
                </button>
              )}

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Halaman sebelumnya"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                  className="flex size-7 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" />
                </button>

                {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      aria-current={safePage === pageNumber ? "page" : undefined}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg text-[10px] font-bold transition",
                        safePage === pageNumber
                          ? "bg-[#b71422] text-white shadow-sm"
                          : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]",
                      )}
                    >
                      {pageNumber}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  aria-label="Halaman berikutnya"
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                  disabled={safePage === pageCount}
                  className="flex size-7 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
