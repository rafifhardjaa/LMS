"use client";

import Link from "next/link";
import { Check, ChevronRight, Home, PlusCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";

export function TaskMaterialHeader() {
  return (
    <FadeIn>
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#94A3B8]">
              <Link
                href="/teacher/dashboard"
                className="flex items-center gap-1 transition-colors hover:text-[#b71422]"
              >
                <Home className="size-3.5" />
                Dashboard
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-[#b71422]">
                Tugas &amp; Materi Pembelajaran
              </span>
            </div>
            <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
              Manajemen Tugas, Modul &amp; Materi Pembelajaran
            </h1>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[#475569]">
              Kelola distribusi lembar kerja siswa (LKPD), modul digital, slide
              presentasi interaktif, serta evaluasi antrean asesmen formatif
              lintas rombel kelas SMK Mataram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Form unggah modul akan dihubungkan ke penyimpanan berkas.",
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-[#F1F5F9] px-4 py-2.5 text-[13px] font-semibold text-[#1E293B] transition-colors hover:bg-[#E2E8F0] active:scale-[0.98]"
            >
              <Upload className="size-[18px] text-[#475569]" />
              + Unggah Modul
            </button>
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Form tugas baru akan dihubungkan ke modul penilaian.",
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-[#b71422] px-4 py-2.5 text-[13px] font-semibold text-white shadow-md transition-colors hover:bg-[#db3237] active:scale-[0.98]"
            >
              <PlusCircle className="size-[18px]" />
              + Buat Tugas Baru
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] px-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#22C55E]" />
            <span className="text-[12px] font-semibold text-[#1E293B]">
              Kurikulum Merdeka Kejuruan 2024/2025
            </span>
            <span className="text-[#94A3B8]">•</span>
            <span className="text-[12px] text-[#475569]">
              Sinkronisasi Dapodik &amp; E-Rapor Aktif (Terakhir: Hari ini,
              08:30 WITA)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex size-4 items-center justify-center rounded-full bg-[#E0F2FE] text-[#006398]">
              <Check className="size-3" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006398]">
              Terverifikasi Akademik
            </span>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
