"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  PencilLine,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFinalScore, getStudentStatus, pageSize, totalStudents } from "./data";
import type { StudentGrade } from "./types";

type GradeLedgerProps = {
  students: StudentGrade[];
  onScheduleRemedial: (student: StudentGrade) => void;
  onEditNote: (student: StudentGrade) => void;
  onViewDetail: (student: StudentGrade) => void;
};

type SortDirection = "asc" | "desc";

export function GradeLedger({
  students,
  onScheduleRemedial,
  onEditNote,
  onViewDetail,
}: GradeLedgerProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const sortedStudents = useMemo(
    () =>
      [...students].sort((first, second) => {
        const firstScore = getFinalScore(first);
        const secondScore = getFinalScore(second);

        return sortDirection === "desc"
          ? secondScore - firstScore
          : firstScore - secondScore;
      }),
    [sortDirection, students],
  );

  const pageCount = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * pageSize;
  const visibleStudents = sortedStudents.slice(
    startIndex,
    startIndex + pageSize,
  );
  const endIndex = Math.min(startIndex + pageSize, sortedStudents.length);

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#1E293B]">
            Rincian Leger Nilai Siswa
          </h2>
          <p className="mt-0.5 text-[11px] leading-4 text-[#64748B]">
            Bobot: Formatif 30% • STS 30% • Praktik Lab 40%
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setSortDirection((current) =>
              current === "desc" ? "asc" : "desc",
            )
          }
          className="inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#DCE5EE] bg-[#F8FAFC] px-3 text-[11px] font-semibold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422] sm:self-auto"
        >
          <ArrowUpDown className="size-3.5" />
          Nilai Akhir{" "}
          {sortDirection === "desc" ? "Tertinggi" : "Terendah"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-[#F8FAFC] text-[9px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
              <th className="px-5 py-3">Nama Siswa</th>
              <th className="px-3 py-3 text-center">Formatif</th>
              <th className="px-3 py-3 text-center">STS</th>
              <th className="px-3 py-3 text-center">Praktik Lab</th>
              <th className="px-3 py-3 text-center">Nilai Akhir</th>
              <th className="px-3 py-3">Status KKTP</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F5F9]">
            {visibleStudents.map((student) => {
              const finalScore = getFinalScore(student);
              const status = getStudentStatus(student);

              return (
                <tr
                  key={student.id}
                  className={cn(
                    "group transition-colors hover:bg-[#F8FAFC]",
                    status.tone === "danger" && "bg-[#FFFBFB]",
                  )}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                          student.avatarClassName,
                        )}
                      >
                        {student.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-[#1E293B]">
                          {student.name}
                        </p>
                        <p className="mt-0.5 text-[9px] font-medium text-[#94A3B8]">
                          {student.nisn} • {student.rollNo}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-[11px] font-medium tabular-nums text-[#475569]">
                    {student.formatif}
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-[11px] font-medium tabular-nums text-[#475569]">
                    {student.sts}
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-[11px] font-medium tabular-nums text-[#475569]">
                    {student.praktik}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex min-w-14 items-center justify-center rounded-lg px-2 py-1 font-mono text-[12px] font-bold tabular-nums",
                        status.tone === "success"
                          ? "bg-[#DCFCE7]/70 text-[#15803D]"
                          : "bg-[#FEE2E2] text-[#b71422]",
                      )}
                    >
                      {finalScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold leading-3",
                        status.className,
                      )}
                    >
                      {status.tone === "success" ? (
                        <Check className="size-3 shrink-0" />
                      ) : (
                        <TriangleAlert className="size-3 shrink-0" />
                      )}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-xs font-semibold text-[#334155]">
            Belum ada data nilai siswa
          </p>
          <p className="mt-0.5 max-w-sm text-[10px] leading-4 text-[#94A3B8]">
            Data nilai akan muncul di sini setelah siswa dan asesmen tersedia.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] font-medium text-[#64748B]">
          Menampilkan{" "}
          <span className="font-bold text-[#334155]">
            {sortedStudents.length === 0 ? "0" : `${startIndex + 1}-${endIndex}`}
          </span>{" "}
          dari {totalStudents} siswa terdaftar
        </p>

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
    </section>
  );
}
