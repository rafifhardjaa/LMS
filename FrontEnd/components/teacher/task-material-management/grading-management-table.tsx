"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  PencilLine,
} from "lucide-react";
import { toast } from "sonner";
import type { Assignment, GradingItem, GradingStatus } from "./types";

const PAGE_SIZE = 10;

const statusStyles: Record<
  GradingStatus,
  { label: string; className: string }
> = {
  pending: { label: "Menunggu penilaian", className: "text-[#b71422]" },
  graded: { label: "Sudah dinilai", className: "text-[#16A34A]" },
  revision: { label: "Perlu revisi", className: "text-[#B45309]" },
};

type GradingManagementTableProps = {
  rows: GradingItem[];
  filter: Assignment | null;
  onBack: () => void;
  onUpdateScore: (item: GradingItem, score: number) => Promise<void> | void;
};

export function GradingManagementTable({
  rows,
  filter,
  onBack,
  onUpdateScore,
}: GradingManagementTableProps) {
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [scoreDraft, setScoreDraft] = useState("");
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, rows.length);
  const visibleRows = rows.slice(startIndex, endIndex);

  function startEditingScore(item: GradingItem) {
    setEditingScoreId(item.id);
    setScoreDraft(item.score === null ? "" : String(item.score));
  }

  async function commitScore(item: GradingItem) {
    const parsed = Number(scoreDraft);

    if (
      scoreDraft.trim() === "" ||
      Number.isNaN(parsed) ||
      parsed < 0 ||
      parsed > 100
    ) {
      toast.error("Nilai harus berupa angka 0–100.");
      return;
    }

    await onUpdateScore(item, Math.round(parsed));
    setEditingScoreId(null);
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#1E293B]">
              Manajemen Antrean Penilaian
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              {filter
                ? `${rows.length} pengumpulan untuk tugas ini • halaman ${safePage} dari ${pageCount}`
                : `${rows.length} pengumpulan • halaman ${safePage} dari ${pageCount}`}
            </p>
            {filter && (
              <div className="mt-1.5 flex max-w-full flex-wrap items-center gap-1.5">
                <span
                  className="inline-flex max-w-full items-center truncate text-[10px] font-semibold text-[#b71422]"
                  title={`${filter.subject} • ${filter.classes.join(" & ")}`}
                >
                  {filter.subject} • {filter.classes.join(" & ")}
                </span>
                <span
                  className="max-w-[280px] truncate text-[10px] font-medium text-[#64748B]"
                  title={filter.title}
                >
                  {filter.title}
                </span>
              </div>
            )}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#DCE5EE] bg-[#F8FAFC] px-3 text-[11px] font-semibold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422] sm:self-auto"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke Daftar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1170px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[80px]" />
            <col className="w-[210px]" />
            <col className="w-[230px]" />
            <col className="w-[190px]" />
            <col className="w-[120px]" />
            <col className="w-[150px]" />
            <col className="w-[80px]" />
            <col className="w-[110px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#FECACA] bg-[#FFF1F0] text-[10px] font-bold uppercase tracking-[0.05em] text-[#b71422]">
              <th className="px-5 py-3">No</th>
              <th className="px-3 py-3">Siswa</th>
              <th className="px-3 py-3">Tugas</th>
              <th className="px-3 py-3">Berkas</th>
              <th className="px-3 py-3">Dikumpul</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-center">Nilai</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F5F9]">
            {visibleRows.map((item, index) => {
              const FileIcon = item.fileIcon;
              const status = statusStyles[item.status];
              const itemNumber = startIndex + index + 1;

              return (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-[#F8FAFC]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold tabular-nums text-[#1E293B]">
                        {itemNumber}
                      </span>
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={`Unduh ${item.fileName}`}
                        aria-label={`Unduh ${item.fileName}`}
                        className="flex size-7 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#E8F4FB] hover:text-[#006398]"
                      >
                        <Download className="size-3.5" />
                      </a>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.avatarClassName}`}
                      >
                        {item.initials}
                      </span>
                      <div className="min-w-0">
                        <p
                          className="truncate text-[12px] font-bold text-[#1E293B]"
                          title={item.name}
                        >
                          {item.name}
                        </p>
                        <p
                          className="mt-0.5 truncate text-[10px] font-medium text-[#94A3B8]"
                          title={`${item.nisn} • ${item.className}`}
                        >
                          {item.nisn} • {item.className}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <p
                      className="truncate text-[12px] font-semibold text-[#1E293B]"
                      title={item.taskTitle}
                    >
                      {item.taskTitle}
                    </p>
                    <p
                      className="mt-0.5 truncate text-[10px] font-medium text-[#94A3B8]"
                      title={item.subject}
                    >
                      {item.subject}
                    </p>
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className="inline-flex w-full min-w-0 items-center gap-1.5 text-[12px] font-semibold text-[#475569]"
                      title={item.fileName}
                    >
                      <FileIcon
                        className={`size-3.5 shrink-0 ${item.fileIconClassName}`}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {item.fileName}
                      </span>
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold ${
                        item.submittedAtTone === "urgent"
                          ? "text-[#b71422]"
                          : "text-[#475569]"
                      }`}
                      title={item.submittedAt}
                    >
                      <Clock3 className="size-3 shrink-0" />
                      {item.submittedAt}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-block max-w-full truncate text-[10px] font-semibold ${status.className}`}
                      title={status.label}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-center">
                    {editingScoreId === item.id ? (
                      <input
                        autoFocus
                        type="number"
                        min={0}
                        max={100}
                        inputMode="numeric"
                        value={scoreDraft}
                        aria-label={`Nilai ${item.name}`}
                        onChange={(event) => setScoreDraft(event.target.value)}
                        onBlur={() => commitScore(item)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            event.currentTarget.blur();
                          }

                          if (event.key === "Escape") {
                            event.preventDefault();
                            setEditingScoreId(null);
                          }
                        }}
                        className="h-8 w-16 rounded-md border border-[#b71422]/40 bg-white px-2 text-center font-mono text-[12px] font-bold tabular-nums text-[#1E293B] outline-none focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                      />
                    ) : item.score === null ? (
                      <span className="text-[12px] font-semibold text-[#94A3B8]">
                        —
                      </span>
                    ) : (
                      <span className="font-mono text-[12px] font-bold tabular-nums text-[#1E293B]">
                        {item.score}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        title={
                          item.score === null
                            ? `Input nilai ${item.name}`
                            : `Update nilai ${item.name}`
                        }
                        aria-label={
                          item.score === null
                            ? `Input nilai ${item.name}`
                            : `Update nilai ${item.name}`
                        }
                        onClick={() => startEditingScore(item)}
                        className="flex size-8 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#FFEBEB] hover:text-[#b71422]"
                      >
                        <PencilLine className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center">
                  <p className="text-xs font-semibold text-[#334155]">
                    Belum ada pengumpulan untuk tugas ini
                  </p>
                  <p className="mt-1 text-[10px] text-[#94A3B8]">
                    Pengumpulan siswa akan tampil di sini setelah mereka
                    mengumpulkan berkas.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-medium text-[#64748B]">
          Menampilkan{" "}
          <span className="font-bold text-[#334155]">
            {rows.length === 0 ? "0" : `${startIndex + 1}-${endIndex}`}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-[#334155]">{rows.length}</span>{" "}
          pengumpulan{filter ? " untuk tugas ini" : ""}
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
                className={`flex size-7 items-center justify-center rounded-lg text-[10px] font-bold transition ${
                  safePage === pageNumber
                    ? "bg-[#b71422] text-white shadow-sm"
                    : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
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
