"use client";

import { useState } from "react";
import {
  ChevronRight,
  CloudSync,
  PlusCircle,
  Table2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AttendancePageHeaderProps = {
  onOpenSession: () => void;
};

export function AttendancePageHeader({
  onOpenSession,
}: AttendancePageHeaderProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  function handleSync() {
    if (isSyncing) return;

    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      toast.success("Sinkronisasi Dapodik selesai", {
        description:
          "Presensi 35 siswa dan jurnal kelas berhasil dikirim ke e-Rapor.",
      });
    }, 900);
  }

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]"
        >
          <span>Dashboard</span>
          <ChevronRight className="size-3.5" />
          <span className="text-[#475569]">Presensi &amp; Siswa</span>
          <ChevronRight className="size-3.5" />
          <span className="rounded-full bg-[#FFEBEB] px-2.5 py-1 text-[10px] font-bold text-[#b71422]">
            VII-A • Fisika Terapan &amp; Informatika
          </span>
        </nav>

        <div className="flex items-stretch gap-3">
          <span className="mt-0.5 w-2.5 shrink-0 rounded-full bg-[#b71422]" />
          <div>
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#1E293B]">
              Presensi Harian &amp; Manajemen Kehadiran Siswa
            </h1>
            <p className="mt-1 max-w-[720px] text-sm leading-6 text-[#475569]">
              Pencatatan kehadiran kelas tatap muka &amp; praktikum lab,
              sinkronisasi Dapodik real-time, monitoring dispensasi/sakit,
              dan rekap semester.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 rounded-xl border-[#E2E8F0] bg-white px-3.5 text-xs font-semibold text-[#334155] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:bg-[#F8FAFC]"
          onClick={() =>
            toast.info("Rekap presensi disiapkan", {
              description:
                "File Excel rekap kehadiran rombel akan segera diunduh.",
            })
          }
        >
          <Table2 className="size-4 text-[#16A34A]" />
          Rekap Presensi (.xlsx)
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 rounded-xl border-[#E2E8F0] bg-white px-3.5 text-xs font-semibold text-[#006398] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:bg-[#F8FAFC]"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <CloudSync
            className={cn("size-4", isSyncing && "animate-pulse")}
          />
          {isSyncing ? "Sinkronisasi..." : "Sinkronkan ke Dapodik & e-Rapor"}
        </Button>

        <Button
          type="button"
          className="h-10 gap-2 rounded-xl bg-[#b71422] px-4 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(183,20,34,0.7)] hover:bg-[#a1121f]"
          onClick={onOpenSession}
        >
          <PlusCircle className="size-4" />
          Buka Sesi Presensi Baru
        </Button>
      </div>
    </div>
  );
}
