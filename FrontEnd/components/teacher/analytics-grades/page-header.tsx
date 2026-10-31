"use client";

import { useState } from "react";
import {
  ChevronRight,
  CloudCheck,
  Download,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnalyticsPageHeaderProps = {
  onInputGrade: () => void;
};

export function AnalyticsPageHeader({
  onInputGrade,
}: AnalyticsPageHeaderProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  function handleSync() {
    if (isSyncing) return;

    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      toast.success("Sinkronisasi e-Rapor selesai", {
        description: "35 nilai siswa berhasil divalidasi dengan Dapodik.",
      });
    }, 900);
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium tracking-[0.02em] text-[#64748B]"
        >
          <span>Dashboard</span>
          <ChevronRight className="size-3.5 text-[#94A3B8]" />
          <span>Analitik &amp; Nilai</span>
          <ChevronRight className="size-3.5 text-[#94A3B8]" />
          <span className="text-[#b71422]">Fisika Terapan (VII-A)</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#1E293B]">
            Analitik &amp; Nilai
          </h1>
          <span className="inline-flex items-center rounded-full border border-[#EFC3C0] bg-[#FFF1F0] px-2.5 py-1 text-[11px] font-semibold text-[#b71422]">
            TA 2024/2025
          </span>
        </div>

        <p className="mt-1.5 max-w-[640px] text-sm leading-6 text-[#64748B]">
          Pantau distribusi capaian, ketuntasan KKTP, dan tindak lanjut
          diagnostik siswa dalam satu dasbor terpadu.
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
          <CloudCheck className="size-3.5 text-[#16A34A]" />
          Dapodik tersinkron
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#94A3B8]">09:15 WITA</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 rounded-xl border-[#DCE5EE] bg-white px-3.5 text-xs font-semibold text-[#334155] shadow-none hover:bg-[#F8FAFC]"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw
            className={cn("size-4", isSyncing && "animate-spin")}
          />
          {isSyncing ? "Sinkronisasi..." : "Sinkron e-Rapor"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 rounded-xl border-[#DCE5EE] bg-white px-3.5 text-xs font-semibold text-[#334155] shadow-none hover:bg-[#F8FAFC]"
          onClick={() =>
            toast.info("Ekspor ledger disiapkan", {
              description: "File nilai akan diunduh dalam format PDF resmi.",
            })
          }
        >
          <Download className="size-4" />
          Ekspor Ledger
        </Button>

        <Button
          type="button"
          className="h-10 gap-2 rounded-xl bg-[#b71422] px-4 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(183,20,34,0.7)] hover:bg-[#a1121f]"
          onClick={onInputGrade}
        >
          <PlusCircle className="size-4" />
          Input Nilai Baru
        </Button>
      </div>
    </div>
  );
}
