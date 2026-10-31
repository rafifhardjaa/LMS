"use client";

import { Download, Database, UserPlus } from "lucide-react";
import { TeacherStats } from "@/components/admin/teacher-stats";
import { TeachersSidePanels } from "@/components/admin/teachers-side-panels";
import { TeachersTable } from "@/components/admin/teachers-table";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function TeachersPage() {
  return (
    <div className="flex w-full flex-col gap-7 pt-4">
      <FadeIn>
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <SlideIn direction="left">
            <div className="max-w-[440px]">
              <div className="mb-2 flex items-center gap-2 max-lg:flex-wrap text-[11px] font-medium text-[#4e566c]">
                <span className="rounded-full bg-[#e5deff] px-3 py-1 text-[#4331a8]">SMK MATARAM • KURIKULUM MERDEKA</span>
                <span>T.A. 2026/2027 Ganjil</span>
              </div>
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[32px]">Manajemen Tenaga Pendidik & Guru</h1>
              <p className="mt-2 text-sm leading-6 text-[#4e566c]">Kelola data guru pengampu, distribusi mata pelajaran, status beban mengajar (Jam Pelajaran), dan akun Dapodik SMK Mataram.</p>
            </div>
          </SlideIn>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => window.alert("Ekspor PDF/Excel") } className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e0e2e7] bg-white px-4 text-sm font-semibold text-[#181c20] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#f8f9fc]"><Download className="size-4 text-[#4e566c]" /> Ekspor PDF/Excel</button>
            <button type="button" onClick={() => window.alert("Impor Data Dapodik") } className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e0e2e7] bg-white px-4 text-sm font-semibold text-[#181c20] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#f8f9fc]"><Database className="size-4 text-[#6c5dd3]" /> Impor Data Dapodik</button>
            <button type="button" onClick={() => window.alert("Tambah Guru Baru") } className="inline-flex h-10 items-center gap-2 rounded-full bg-[#6c5dd3] px-5 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(108,93,211,0.35)] hover:bg-[#5343b9]"><UserPlus className="size-4" /> + Tambah Guru Baru</button>
          </div>
        </div>
      </FadeIn>
      <TeacherStats />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TeachersTable />
        <TeachersSidePanels />
      </div>
    </div>
  );
}
