"use client";

import Link from "next/link";
import {
  ChevronRight,
  CloudDownload,
  History,
  LayoutGrid,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ExportPageHeaderProps = {
  isSyncing: boolean;
  onSync: () => void;
  onShowHistory: () => void;
  onCreateCustom: () => void;
};

export function ExportPageHeader({
  isSyncing,
  onSync,
  onShowHistory,
  onCreateCustom,
}: ExportPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]"
        >
          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center gap-1 transition hover:text-[#b71422]"
          >
            <LayoutGrid className="size-3.5" />
            Dashboard
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-semibold text-[#1E293B]">
            Ekspor Rekap &amp; Laporan Akademik
          </span>
        </nav>

        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#1E293B]">
          Pusat Ekspor Rekap &amp; Laporan Akademik
        </h1>
        <p className="mt-1.5 max-w-[760px] text-sm leading-6 text-[#475569]">
          Unduh rekapitulasi data nilai rapor siswa, leger kurikulum merdeka,
          presensi berkala tatap muka/praktikum, dan sinkronisasi siap-unggah
          Dapodik &amp; e-Rapor SMK Mataram.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 xl:max-w-[540px] xl:justify-end">
        <button
          type="button"
          onClick={onShowHistory}
          className="flex h-10 items-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-[#334155] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:bg-[#F8FAFC] active:scale-[0.98]"
        >
          <History className="size-4 text-[#94A3B8]" />
          Riwayat Ekspor Terakhir
        </button>

        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          className="flex h-10 items-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-[#006398] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:bg-[#F8FAFC] disabled:cursor-wait disabled:opacity-70"
        >
          <RefreshCw className={cn("size-4", isSyncing && "animate-spin")} />
          {isSyncing ? "Sinkronisasi..." : "Sinkronkan Basis Data e-Rapor"}
        </button>

        <button
          type="button"
          onClick={onCreateCustom}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#b71422] px-4 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(183,20,34,0.7)] transition hover:bg-[#a1121f] active:scale-[0.98]"
        >
          <CloudDownload className="size-4" />
          + Buat Paket Ekspor Kustom
        </button>
      </div>
    </div>
  );
}
