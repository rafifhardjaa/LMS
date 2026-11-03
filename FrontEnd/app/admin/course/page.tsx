"use client";

import { CirclePlus, Download, RefreshCw } from "lucide-react";
import { CourseSidePanels } from "@/components/admin/course-side-panels";
import { CourseStats } from "@/components/admin/course-stats";
import { CourseTable } from "@/components/admin/course-table";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function CoursePage() {
  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <FadeIn>
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#eef0f5] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)] xl:flex-row xl:items-center">
          <SlideIn direction="left">
            <div className="max-w-[470px]">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#4331a8]">
                <span className="rounded-full bg-[#e5deff] px-3 py-1">● SMK MATARAM • KURIKULUM MERDEKA</span>
                <span className="rounded-full bg-[#eceef3] px-3 py-1 text-[#4e566c]">T.A. 2026/2027 GANJIL • FASE E &amp; F</span>
              </div>
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[30px]">Manajemen Mata<br className="hidden sm:block" /> Pelajaran &amp; Kurikulum</h1>
              <p className="mt-2 text-[13px] leading-5 text-[#4e566c]">Kelola 35 mata pelajaran aktif, distribusi kelompok kejuruan &amp; umum, alokasi jam pelajaran (JP), dan pemetaan modul kurikulum merdeka SMK Mataram.</p>
            </div>
          </SlideIn>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => window.alert("Ekspor KOSP (PDF/XLS)")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"><Download className="size-4" /> Ekspor KOSP (PDF/XLS)</button>
            <button type="button" onClick={() => window.alert("Sinkron Dapodik")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e5deff] px-4 text-sm font-semibold text-[#4331a8] hover:bg-[#d9d0ff]"><RefreshCw className="size-4" /> Sinkron Dapodik</button>
            <button type="button" onClick={() => window.alert("Tambah Mapel Baru")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"><CirclePlus className="size-4" /> Tambah Mapel Baru</button>
          </div>
        </section>
      </FadeIn>
      <CourseStats />
      <CourseTable aside={<CourseSidePanels />} />
    </div>
  );
}
