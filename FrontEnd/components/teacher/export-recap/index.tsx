"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import { CustomExportPanel } from "./custom-export-panel";
import {
  defaultExportFilters,
  exportDocuments,
  exportPageSize,
  formatFileSize,
  initialExportHistory,
} from "./data";
import { DocumentTable } from "./document-table";
import { DownloadHistory } from "./download-history";
import { ERaporCallout } from "./erapor-callout";
import { ExportFilters } from "./export-filters";
import { ExportPageHeader } from "./page-header";
import { ExportSummaryGrid } from "./summary-grid";
import type {
  CustomExportRequest,
  ExportDocument,
  ExportDocumentAction,
  ExportFilters as ExportFiltersState,
  ExportFormat,
  ExportHistoryItem,
  ExportTab,
} from "./types";

const formatLabels: Record<ExportFormat, string> = {
  xlsx: "XLSX",
  pdf: "PDF",
  csv: "CSV",
  zip: "ZIP",
};

function getCurrentTimeLabel() {
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Makassar",
  }).format(new Date());

  return `${time} WITA`;
}

function buildFileName(title: string, format: ExportFormat) {
  const base = title
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 42);

  return `${base}.${format}`;
}

export function ExportRecap() {
  const [filters, setFilters] = useState<ExportFiltersState>(
    defaultExportFilters,
  );
  const [activeTab, setActiveTab] = useState<ExportTab>("all");
  const [page, setPage] = useState(1);
  const [history, setHistory] =
    useState<ExportHistoryItem[]>(initialExportHistory);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncLabel, setLastSyncLabel] = useState("09:15 WITA hari ini");

  const addHistory = useCallback(
    (item: Omit<ExportHistoryItem, "id">) => {
      setHistory((current) =>
        [{ ...item, id: `history-${Date.now()}` }, ...current].slice(0, 8),
      );
    },
    [],
  );

  const filteredDocuments = useMemo(() => {
    return exportDocuments.filter((document) => {
      if (document.semester !== filters.semester) return false;

      if (
        filters.subject !== "all" &&
        !document.subjects.includes(filters.subject)
      ) {
        return false;
      }

      if (
        filters.level !== "all" &&
        !document.levels.includes(filters.level)
      ) {
        return false;
      }

      if (filters.format !== "all") {
        const documentFormats = document.actions.map(
          (action) => action.format,
        );

        if (filters.format === "csv") {
          return (
            documentFormats.includes("csv") ||
            documentFormats.includes("zip")
          );
        }

        return documentFormats.includes(filters.format);
      }

      return true;
    });
  }, [filters]);

  const categoryCounts = useMemo<Record<ExportTab, number>>(() => {
    const counts: Record<ExportTab, number> = {
      all: filteredDocuments.length,
      nilai: 0,
      presensi: 0,
      dapodik: 0,
    };

    for (const document of filteredDocuments) {
      counts[document.category] += 1;
    }

    return counts;
  }, [filteredDocuments]);

  const tabDocuments = useMemo(
    () =>
      activeTab === "all"
        ? filteredDocuments
        : filteredDocuments.filter(
            (document) => document.category === activeTab,
          ),
    [activeTab, filteredDocuments],
  );

  const pageCount = Math.max(
    1,
    Math.ceil(tabDocuments.length / exportPageSize),
  );
  const safePage = Math.min(page, pageCount);
  const visibleDocuments = tabDocuments.slice(
    (safePage - 1) * exportPageSize,
    safePage * exportPageSize,
  );
  const totalSizeMb = tabDocuments.reduce(
    (total, document) => total + document.sizeMb,
    0,
  );

  function handleFilterChange(patch: Partial<ExportFiltersState>) {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  }

  function handleTabChange(tab: ExportTab) {
    setActiveTab(tab);
    setPage(1);
  }

  function handleDocumentAction(
    document: ExportDocument,
    action: ExportDocumentAction,
  ) {
    if (action.kind === "import") {
      toast.success("Berkas siap diimpor ke e-Rapor", {
        description: `${document.title} berhasil dikirim ke layanan e-Rapor.`,
      });
      addHistory({
        fileName: buildFileName(document.title, action.format),
        meta: "Impor e-Rapor • Baru saja",
        status: "Tersinkron",
        detail: getCurrentTimeLabel(),
        tone: "blue",
        icon: "zip",
      });
      return;
    }

    toast.success(`Berkas ${formatLabels[action.format]} disiapkan`, {
      description: `${document.title} sedang diunduh.`,
    });
    addHistory({
      fileName: buildFileName(document.title, action.format),
      meta: "Dr. Pawell • Baru saja",
      status: "Sukses",
      detail: formatFileSize(document.sizeMb),
      tone: "green",
      icon:
        action.format === "pdf"
          ? "pdf"
          : action.format === "zip"
            ? "zip"
            : "sheet",
    });
  }

  function handleMoreAction(
    document: ExportDocument,
    action: "download" | "copy" | "detail",
  ) {
    if (action === "download") {
      handleDocumentAction(document, {
        id: "excel",
        label: "Excel",
        kind: "download",
        format: "xlsx",
      });
      return;
    }

    if (action === "copy") {
      navigator.clipboard
        ?.writeText(`https://simanis.sch.id/export/${document.id}`)
        .catch(() => undefined);
      toast.success("Tautan berkas disalin", {
        description: `Tautan aman untuk ${document.title} siap dibagikan.`,
      });
      return;
    }

    toast.info(`Detail ${document.title}`, {
      description: `${document.audience} • ${document.audienceNote} • Diperbarui ${document.updatedLabel}, ${document.updatedTime}.`,
    });
  }

  function handleBulkDownload() {
    if (tabDocuments.length === 0) return;

    const sizeLabel = formatFileSize(totalSizeMb);

    toast.success("Paket ekspor massal disiapkan", {
      description: `${tabDocuments.length} dokumen (${sizeLabel}) sedang diunduh sebagai arsip ZIP.`,
    });
    addHistory({
      fileName: `Paket_Rekap_${filters.semester}_${tabDocuments.length}_Dokumen.zip`,
      meta: "Unduhan massal • Baru saja",
      status: "Sukses",
      detail: sizeLabel,
      tone: "green",
      icon: "zip",
    });
  }

  function handleSchedule() {
    toast.success("Jadwal ekspor bulanan disimpan", {
      description:
        "Paket rekapitulasi akan dibuat otomatis setiap awal bulan dan dikirim ke email sekolah.",
    });
  }

  function handleCustomGenerate(request: CustomExportRequest) {
    const sizeLabel = formatFileSize(1.8 + request.componentCount * 0.4);

    toast.success("Berkas kustom sedang dibuat", {
      description: `${request.componentCount} komponen, format ${formatLabels[request.format]}, ${request.signature ? "dengan" : "tanpa"} tanda tangan digital.`,
    });
    addHistory({
      fileName: `Paket_Ekspor_Kustom.${request.format}`,
      meta: "Generator kustom • Baru saja",
      status: "Sukses",
      detail: sizeLabel,
      tone: "red",
      icon: request.format === "pdf" ? "pdf" : "sheet",
    });
  }

  function handleSync() {
    if (isSyncing) return;

    setIsSyncing(true);
    window.setTimeout(() => {
      const timeLabel = getCurrentTimeLabel();

      setIsSyncing(false);
      setLastSyncLabel(`${timeLabel} hari ini`);
      addHistory({
        fileName: "Sinkron_eRapor_Mataram.zip",
        meta: "Kirim ke Server Dapodik",
        status: "Tersinkron",
        detail: timeLabel,
        tone: "blue",
        icon: "zip",
      });
      toast.success("Basis data e-Rapor tersinkron", {
        description:
          "348 nilai siswa dan rekap presensi berhasil divalidasi dengan Dapodik.",
      });
    }, 900);
  }

  function handleShowHistory() {
    document
      .getElementById("download-history")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleCreateCustom() {
    document
      .getElementById("custom-export-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
      document
        .querySelector<HTMLInputElement>(
          "#custom-export-panel input[type=checkbox]",
        )
        ?.focus({ preventScroll: true });
    }, 400);
  }

  function handleViewAllHistory() {
    toast.info("Riwayat ekspor lengkap", {
      description:
        "Seluruh aktivitas unduhan dan sinkronisasi tersimpan pada pusat aktivitas ekspor sekolah.",
    });
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <ExportPageHeader
        isSyncing={isSyncing}
        onSync={handleSync}
        onShowHistory={handleShowHistory}
        onCreateCustom={handleCreateCustom}
      />

      <ExportSummaryGrid lastSyncLabel={lastSyncLabel} />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <FadeIn delay={0.06} className="flex flex-col gap-4 xl:col-span-8">
          <ExportFilters
            filters={filters}
            documentCount={tabDocuments.length}
            totalSizeMb={totalSizeMb}
            onFilterChange={handleFilterChange}
            onBulkDownload={handleBulkDownload}
            onSchedule={handleSchedule}
          />

          <DocumentTable
            documents={visibleDocuments}
            totalCount={tabDocuments.length}
            activeTab={activeTab}
            categoryCounts={categoryCounts}
            page={safePage}
            pageCount={pageCount}
            onTabChange={handleTabChange}
            onPageChange={setPage}
            onAction={handleDocumentAction}
            onMoreAction={handleMoreAction}
          />
        </FadeIn>

        <FadeIn delay={0.12} className="flex flex-col gap-4 xl:col-span-4">
          <CustomExportPanel onGenerate={handleCustomGenerate} />
          <DownloadHistory
            items={history}
            onViewAll={handleViewAllHistory}
          />
          <ERaporCallout />
        </FadeIn>
      </div>
    </div>
  );
}
