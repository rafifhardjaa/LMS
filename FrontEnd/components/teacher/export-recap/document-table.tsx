"use client";

import { useEffect, useState } from "react";
import {
  Braces,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  Eye,
  FileSearch,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  GraduationCap,
  Link2,
  MoreVertical,
  RefreshCw,
  Table2,
  Upload,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportPageSize, exportTabs } from "./data";
import type {
  ExportChipTone,
  ExportDocument,
  ExportDocumentAction,
  ExportIconTone,
  ExportTab,
} from "./types";

type DocumentTableProps = {
  documents: ExportDocument[];
  totalCount: number;
  activeTab: ExportTab;
  categoryCounts: Record<ExportTab, number>;
  page: number;
  pageCount: number;
  onTabChange: (tab: ExportTab) => void;
  onPageChange: (page: number) => void;
  onAction: (document: ExportDocument, action: ExportDocumentAction) => void;
  onMoreAction: (
    document: ExportDocument,
    action: "download" | "copy" | "detail",
  ) => void;
};

const iconToneClassName: Record<ExportIconTone, string> = {
  red: "bg-[#FFEBEB] text-[#b71422]",
  green: "bg-[#DCFCE7] text-[#16A34A]",
  blue: "bg-[#E0F2FE] text-[#0284C7]",
  amber: "bg-[#FEF3C7] text-[#D97706]",
  purple: "bg-[#F3E8FF] text-[#9333EA]",
};

const documentIconByTone = {
  red: Table2,
  green: UserCheck,
  blue: RefreshCw,
  amber: ClipboardCheck,
  purple: GraduationCap,
};

const chipToneClassName: Record<ExportChipTone, string> = {
  green: "bg-[#DCFCE7] text-[#16A34A]",
  red: "bg-[#FFEBEB] text-[#b71422]",
  blue: "bg-[#E0F2FE] text-[#0284C7]",
  slate: "bg-[#F1F5F9] text-[#475569]",
};

function actionClassName(action: ExportDocumentAction) {
  if (action.kind === "import") {
    return "bg-[#006398] text-white hover:bg-[#00527e]";
  }

  if (action.format === "pdf") {
    return "bg-white text-[#b71422] hover:bg-[#FFEBEB]";
  }

  if (action.format === "csv" || action.format === "zip") {
    return "bg-white text-[#0284C7] hover:bg-[#E0F2FE]";
  }

  return "bg-white text-[#16A34A] hover:bg-[#DCFCE7]";
}

function ActionIcon({ action }: { action: ExportDocumentAction }) {
  if (action.kind === "import") return <Upload className="size-3" />;
  if (action.format === "pdf") return <FileText className="size-3" />;
  if (action.format === "csv") return <Braces className="size-3" />;
  if (action.format === "zip") return <FolderArchive className="size-3" />;
  return <FileSpreadsheet className="size-3" />;
}

export function DocumentTable({
  documents,
  totalCount,
  activeTab,
  categoryCounts,
  page,
  pageCount,
  onTabChange,
  onPageChange,
  onAction,
  onMoreAction,
}: DocumentTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;

    function handleOutsideClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest(`[data-export-menu="${openMenuId}"]`)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openMenuId]);

  const startIndex = totalCount === 0 ? 0 : (page - 1) * exportPageSize;
  const endIndex = Math.min(startIndex + exportPageSize, totalCount);

  function handleMoreAction(
    document: ExportDocument,
    action: "download" | "copy" | "detail",
  ) {
    setOpenMenuId(null);
    onMoreAction(document, action);
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 p-4 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#1E293B]">
            Daftar Berkas Rekapitulasi &amp; Leger Siap Unduh
          </h2>
          <p className="mt-0.5 text-[10px] text-[#94A3B8]">
            Data terkompilasi otomatis berdasarkan kalkulasi rapor kurikulum
            merdeka.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Kategori berkas ekspor"
          className="flex w-full flex-wrap items-center gap-1 rounded-xl bg-[#F8FAFC] p-1"
        >
          {exportTabs.map((tab) => {
            const isActive = tab.value === activeTab;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[9px] font-bold transition",
                  isActive
                    ? "bg-white text-[#b71422] shadow-sm"
                    : "text-[#94A3B8] hover:text-[#1E293B]",
                )}
              >
                {tab.label} ({categoryCounts[tab.value]})
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[17%]" />
            <col className="w-[9%]" />
            <col className="w-[13%]" />
            <col className="w-[27%]" />
          </colgroup>
          <thead>
            <tr className="bg-[#F8FAFC] text-[8px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
              <th className="px-4 py-2.5">Nama Dokumen &amp; Spesifikasi</th>
              <th className="px-3 py-2.5">Rombel / Sasaran</th>
              <th className="px-3 py-2.5">Ukuran</th>
              <th className="px-3 py-2.5">Terakhir Diperbarui</th>
              <th className="px-2 py-2.5 text-right">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => {
              const DocIcon = documentIconByTone[document.iconTone];
              const isMenuOpen = openMenuId === document.id;

              return (
                <tr
                  key={document.id}
                  className={cn(
                    "border-b border-[#F1F5F9] transition-colors last:border-b-0 hover:bg-[#F8FAFC]",
                    index % 2 === 1 && "bg-[#F8FAFC]/60",
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                          iconToneClassName[document.iconTone],
                        )}
                      >
                        <DocIcon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p
                          title={document.title}
                          className="line-clamp-2 text-[11px] font-bold leading-4 text-[#1E293B]"
                        >
                          {document.title}
                        </p>
                        <p
                          title={document.description}
                          className="mt-0.5 truncate text-[9px] text-[#94A3B8]"
                        >
                          {document.description}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {document.chips.map((chip) => (
                            <span
                              key={chip.label}
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[8px] font-semibold",
                                chipToneClassName[chip.tone],
                              )}
                            >
                              {chip.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <p className="text-[10px] font-semibold text-[#1E293B]">
                      {document.audience}
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#94A3B8]">
                      {document.audienceNote}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[9px] text-[#475569]">
                    {document.sizeMb < 1
                      ? `${Math.round(document.sizeMb * 1000)} KB`
                      : `${document.sizeMb.toFixed(1)} MB`}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="text-[10px] font-semibold text-[#1E293B]">
                      {document.updatedLabel}
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#94A3B8]">
                      {document.updatedTime}
                    </p>
                  </td>

                  <td className="px-2 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {document.actions.map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          title={`${action.label} - ${document.title}`}
                          aria-label={`${action.label} ${document.title}`}
                          onClick={() => onAction(document, action)}
                          className={cn(
                            "flex h-7 items-center gap-1 rounded-lg px-1.5 text-[9px] font-bold shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition",
                            actionClassName(action),
                          )}
                        >
                          <ActionIcon action={action} />
                          {action.label}
                        </button>
                      ))}

                      <div
                        className="relative"
                        data-export-menu={document.id}
                      >
                        <button
                          type="button"
                          title={`Aksi lainnya ${document.title}`}
                          aria-label={`Aksi lainnya ${document.title}`}
                          aria-expanded={isMenuOpen}
                          onClick={() =>
                            setOpenMenuId(isMenuOpen ? null : document.id)
                          }
                          className="flex size-7 items-center justify-center rounded-lg bg-white text-[#475569] shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition hover:bg-[#F1F5F9]"
                        >
                          <MoreVertical className="size-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-[0_12px_24px_-4px_rgba(30,41,59,0.15)]">
                            <button
                              type="button"
                              onClick={() =>
                                handleMoreAction(document, "download")
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[9px] font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                            >
                              <Download className="size-3" />
                              Unduh ulang
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMoreAction(document, "copy")
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[9px] font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                            >
                              <Link2 className="size-3" />
                              Salin tautan
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMoreAction(document, "detail")
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[9px] font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                            >
                              <Eye className="size-3" />
                              Lihat detail berkas
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalCount === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
            <FileSearch className="size-4" />
          </span>
          <p className="mt-2 text-xs font-semibold text-[#334155]">
            Tidak ada berkas yang cocok
          </p>
          <p className="mt-0.5 max-w-sm text-[10px] leading-4 text-[#94A3B8]">
            Ubah kombinasi semester, mata pelajaran, rombel, atau format berkas.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-[#94A3B8]">
          <span>
            Menampilkan{" "}
            <span className="font-bold text-[#475569]">
              {totalCount === 0
                ? "0"
                : `${startIndex + 1}–${endIndex}`}
            </span>{" "}
            dari {totalCount} paket rekapitulasi aktif
          </span>
          {totalCount > 0 && (
            <>
              <span className="size-1 rounded-full bg-[#94A3B8]" />
              <span className="font-semibold text-[#16A34A]">
                Semua data terverifikasi
              </span>
            </>
          )}
        </div>

        {pageCount > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
              className="flex size-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#94A3B8] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => onPageChange(pageNumber)}
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-[10px] font-bold transition",
                    page === pageNumber
                      ? "bg-[#b71422] text-white shadow-sm"
                      : "bg-[#F8FAFC] text-[#1E293B] hover:bg-[#F1F5F9]",
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
              aria-label="Halaman berikutnya"
              className="flex size-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#94A3B8] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
