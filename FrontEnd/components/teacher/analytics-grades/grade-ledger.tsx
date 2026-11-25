"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  Loader2,
  PencilLine,
  Search,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getStudentStatus, pageSize } from "./data";
import type { StudentGrade } from "./types";

type GradeLedgerProps = {
  students: StudentGrade[];
  classLabel: string;
  subjectLabel: string;
  assignmentLabel: string;
  opened: boolean;
  onSaveGrade: (student: StudentGrade, score: number) => Promise<boolean>;
  onChangeFilter: () => void;
  onBack: () => void;
  onDownload: (rows: StudentGrade[]) => void;
  remedialOnly?: boolean;
};

type SortDirection = "asc" | "desc";

export function GradeLedger({
  students,
  classLabel,
  subjectLabel,
  assignmentLabel,
  opened,
  onSaveGrade,
  onChangeFilter,
  onBack,
  onDownload,
  remedialOnly = false,
}: GradeLedgerProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftScore, setDraftScore] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const scoreInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!editingId) return;

    const input = scoreInputRef.current;
    if (!input) return;

    input.focus();
    input.select();
  }, [editingId]);

  function startEditing(student: StudentGrade) {
    if (!student.submissionId || savingRef.current) return;

    setEditingId(student.id);
    setDraftScore(student.nilai === null ? "" : String(student.nilai));
  }

  function cancelEditing() {
    setEditingId(null);
    setDraftScore("");
  }

  async function saveEditing(student: StudentGrade) {
    if (savingRef.current) return;

    const raw = draftScore.trim().replace(",", ".");
    const score = Number(raw);

    if (!raw) {
      toast.error("Nilai wajib diisi.");
      return;
    }

    if (!Number.isFinite(score) || score < 0 || score > 100) {
      toast.error("Nilai harus berupa angka 0–100.");
      return;
    }

    savingRef.current = true;
    setSavingId(student.id);
    try {
      const saved = await onSaveGrade(student, score);
      if (saved) cancelEditing();
    } catch (error) {
      toast.error("Gagal menyimpan nilai", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    } finally {
      savingRef.current = false;
      setSavingId(null);
    }
  }

  const sortedStudents = [...students].sort((first, second) => {
    const firstScore = first.nilai ?? -1;
    const secondScore = second.nilai ?? -1;

    return sortDirection === "desc"
      ? secondScore - firstScore
      : firstScore - secondScore;
  });

  const pageCount = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * pageSize;
  const visibleStudents = sortedStudents.slice(
    startIndex,
    startIndex + pageSize,
  );
  const endIndex = Math.min(startIndex + pageSize, sortedStudents.length);

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
            Lengkapi filter kelas, mapel, dan tugas/kuis pada toolbar di atas,
            lalu klik &quot;Tampilkan nilai&quot;.
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
                  : "Menampilkan seluruh siswa kelas berdasarkan nilai tugas/kuis terpilih"}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  cancelEditing();
                  onBack();
                }}
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
                onClick={() => {
                  cancelEditing();
                  setSortDirection((current) =>
                    current === "desc" ? "asc" : "desc",
                  );
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE5EE] bg-[#F8FAFC] px-3 text-[11px] font-semibold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422]"
              >
                <ArrowUpDown className="size-3.5" />
                Nilai {sortDirection === "desc" ? "Tertinggi" : "Terendah"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[7%]" />
                <col className="w-[27%]" />
                <col className="w-[19%]" />
                <col className="w-[14%]" />
                <col className="w-[18%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#FECACA] bg-[#FFF1F0] text-[8px] font-bold uppercase tracking-[0.06em] text-[#b71422]">
                  <th className="px-3 py-3 text-center">No</th>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-3 py-3">NISN</th>
                  <th className="px-3 py-3 text-center">Nilai</th>
                  <th className="px-3 py-3">Status KKTP</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {visibleStudents.map((student, index) => {
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
                          <p className="truncate text-[11px] font-bold text-[#1E293B]">
                            {student.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] font-medium text-[#475569]">
                        {student.nisn}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {editingId === student.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              ref={scoreInputRef}
                              type="number"
                              inputMode="decimal"
                              min={0}
                              max={100}
                              step={0.1}
                              value={draftScore}
                              onChange={(event) =>
                                setDraftScore(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  void saveEditing(student);
                                }

                                if (event.key === "Escape") {
                                  event.preventDefault();
                                  cancelEditing();
                                }
                              }}
                              disabled={savingId === student.id}
                              aria-label={`Nilai ${student.name}`}
                              className="h-7 w-12 rounded-md border border-[#F3C6C3] bg-white px-1 text-center font-mono text-[11px] font-bold tabular-nums text-[#1E293B] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/15 disabled:opacity-50"
                            />
                            <button
                              type="button"
                              onClick={() => void saveEditing(student)}
                              disabled={savingId === student.id}
                              title="Simpan nilai"
                              aria-label={`Simpan nilai ${student.name}`}
                              className="flex size-6 items-center justify-center rounded-lg bg-[#b71422] text-white transition hover:bg-[#9e101d] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {savingId === student.id ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <Check className="size-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span
                            className={cn(
                              "font-mono text-[12px] font-bold tabular-nums",
                              student.nilai === null
                                ? "text-[#94A3B8]"
                                : status.tone === "success"
                                  ? "text-[#15803D]"
                                  : "text-[#b71422]",
                            )}
                          >
                            {student.nilai === null
                              ? "—"
                              : student.nilai.toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "text-[9px] font-bold leading-3",
                            status.className,
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {editingId === student.id ? (
                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={savingId === student.id}
                              title={`Batal mengubah nilai ${student.name}`}
                              aria-label={`Batal mengubah nilai ${student.name}`}
                              className="flex size-7 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#FFEBEB] hover:text-[#b71422] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <X className="size-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              title={
                                student.submissionId
                                  ? `${student.nilai === null ? "Input" : "Perbarui"} nilai ${student.name}`
                                  : "Siswa belum mengumpulkan tugas"
                              }
                              aria-label={
                                student.submissionId
                                  ? `${student.nilai === null ? "Input" : "Perbarui"} nilai ${student.name}`
                                  : "Siswa belum mengumpulkan tugas"
                              }
                              onClick={() => startEditing(student)}
                              disabled={!student.submissionId || savingId !== null}
                              className="flex size-7 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#FFEBEB] hover:text-[#b71422] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <PencilLine className="size-3.5" />
                            </button>
                          )}

                          {student.fileUrl ? (
                            <a
                              href={student.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={`Lihat berkas ${student.fileName || student.name}`}
                              aria-label={`Lihat berkas ${student.fileName || student.name}`}
                              className="flex size-7 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#E0F2FE] hover:text-[#006398]"
                            >
                              <Eye className="size-3.5" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              title="Siswa belum mengumpulkan berkas"
                              aria-label="Berkas belum tersedia"
                              className="flex size-7 items-center justify-center rounded-lg text-[#94A3B8] transition disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Eye className="size-3.5" />
                            </button>
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
                  : "Ubah kelas, mapel, atau tugas/kuis untuk melihat daftar nilai siswa."}
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
                : ` · ${classLabel} · ${subjectLabel} · ${assignmentLabel}`}
            </p>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {!remedialOnly && (
                <button
                  type="button"
                  onClick={() => {
                    cancelEditing();
                    onChangeFilter();
                  }}
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
                  onClick={() => {
                    cancelEditing();
                    setPage((current) => Math.max(1, current - 1));
                  }}
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
                      onClick={() => {
                        cancelEditing();
                        setPage(pageNumber);
                      }}
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
                  onClick={() => {
                    cancelEditing();
                    setPage((current) => Math.min(pageCount, current + 1));
                  }}
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
