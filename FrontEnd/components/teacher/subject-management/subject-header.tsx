"use client";

import { CalendarDays, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";

export function SubjectHeader({ courseCount }: { courseCount: number }) {
  return (
    <FadeIn>
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#94A3B8]">
            <span>Dashboard</span>
            <ChevronRight className="size-3.5" />
            <span className="text-[#b71422]">
              Mata Pelajaran &amp; Kurikulum
            </span>
          </div>
          <h1 className="mt-1 text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
            Manajemen Mata Pelajaran &amp; Kurikulum Pengampu
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[#475569]">
            Kelola rombel kelas aktif, distribusi alur tujuan pembelajaran (ATP),
            materi ajar, serta sinkronisasi e-KTSP &amp; Kurikulum Merdeka SMK
            Mataram.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              toast.info("Jadwal sesi mengikuti kalender akademik.")
            }
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#1E293B] shadow-sm transition-colors hover:bg-[#F8FAFC]"
          >
            <CalendarDays className="size-[18px] text-[#006398]" />
            Jadwal Sesi ({courseCount})
          </button>
          <button
            type="button"
            onClick={() =>
              toast.info("Impor Dapodik akan dihubungkan pada tahap integrasi.")
            }
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#1E293B] shadow-sm transition-colors hover:bg-[#F8FAFC]"
          >
            <RefreshCw className="size-[18px] text-[#475569]" />
            Impor Dapodik
          </button>
          <button
            type="button"
            onClick={() =>
              toast.info(
                "Form tambah modul ajar segera dihubungkan ke backend.",
              )
            }
            className="flex items-center gap-1.5 rounded-lg bg-[#b71422] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#db3237] active:scale-[0.98]"
          >
            <Plus className="size-5" />
            Tambah Modul Ajar
          </button>
        </div>
      </div>
    </FadeIn>
  );
}
