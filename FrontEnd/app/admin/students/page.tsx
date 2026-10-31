"use client";

import { Download, RefreshCw, UserPlus } from "lucide-react";
import { StudentStats } from "@/components/admin/student-stats";
import { StudentsSidePanels } from "@/components/admin/students-side-panels";
import { StudentsTable } from "@/components/admin/students-table";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function StudentsPage() {
  return (
    <div className="flex w-full flex-col gap-7 pt-4">
      <FadeIn>
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <SlideIn direction="left">
            <div className="max-w-[480px]">
              <div className="mb-2 flex items-center gap-2 max-lg:flex-wrap text-[11px] font-medium text-[#4e566c]">
                <span className="rounded-full bg-[#e5deff] px-3 py-1 text-[#4331a8]">SMK MATARAM • KURIKULUM MERDEKA</span>
                <span>• Tahun Ajaran 2026/2027 Ganjil (Fase E &amp; F)</span>
              </div>
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[32px]">Manajemen Siswa &amp; Peserta Didik</h1>
              <p className="mt-2 text-sm leading-6 text-[#4e566c]">Kelola data 1.842 siswa aktif, distribusi rombel kelas, status aktivasi akun SSO Dapodik, dan rekap kelengkapan administrasi peserta didik SMK Mataram.</p>
            </div>
          </SlideIn>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => window.alert("Ekspor Data")} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e0e2e7] bg-white px-4 text-sm font-semibold text-[#181c20] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#f8f9fc]"><Download className="size-4 text-[#4e566c]" /> Ekspor Data</button>
            <button type="button" onClick={() => window.alert("Sinkronisasi Dapodik")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e5deff] px-4 text-sm font-semibold text-[#4331a8] hover:bg-[#d9d0ff]"><RefreshCw className="size-4" /> Sinkronisasi Dapodik</button>
            <button type="button" onClick={() => window.alert("Tambah Siswa Baru")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#6c5dd3] px-5 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(108,93,211,0.35)] hover:bg-[#5343b9]"><UserPlus className="size-4" /> + Tambah Siswa Baru</button>
          </div>
        </div>
      </FadeIn>
      <StudentStats />
      <StudentsTable aside={<StudentsSidePanels />} />
    </div>
  );
}
