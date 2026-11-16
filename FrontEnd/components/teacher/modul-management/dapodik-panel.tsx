"use client";

import { Cloud, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function DapodikPanel({ courseCount }: { courseCount: number }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706]">
            <Cloud className="size-5" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#1E293B]">
            Integrasi Dapodik &amp; E-Rapor
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#16A34A]">
          <span className="size-2 animate-pulse rounded-full bg-[#22C55E]" />
          Live Sinkron
        </span>
      </div>

      <p className="text-[12px] leading-5 text-[#475569]">
        Sinkronisasi otomatis nilai harian, portofolio tugas, dan presensi{" "}
        {courseCount} rombel ke database E-Rapor Kurikulum Merdeka SMK
        Mataram.
      </p>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2 text-[12px]">
        <span className="text-[#94A3B8]">Sinkronisasi Terakhir:</span>
        <span className="font-semibold text-[#1E293B]">
          Hari Ini, 07:15 WITA
        </span>
      </div>

      <button
        type="button"
        onClick={() => toast.info("Sinkronisasi Dapodik sedang disiapkan.")}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#006398] py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#004B73]"
      >
        <RefreshCw className="size-[18px]" />
        Sinkronkan Nilai &amp; Modul ke Dapodik
      </button>
    </section>
  );
}
