"use client";

import { useState } from "react";
import { Download, RefreshCw, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { StudentStats } from "@/components/admin/student-stats";
import { StudentsSidePanels } from "@/components/admin/students-side-panels";
import { StudentsTable } from "@/components/admin/students-table";
import { AddStudentDialog } from "@/components/admin/add-student-dialog";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

export default function StudentsPage() {
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
          <StaggerChildren staggerDelay={0.08} delayChildren={0.15} className="flex flex-wrap items-center gap-3">
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Ekspor Data")}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e0e2e7] bg-white px-4 text-sm font-semibold text-[#181c20] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#f8f9fc]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="size-4 text-[#4e566c]" /> Ekspor Data
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Sinkronisasi Dapodik")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e5deff] px-4 text-sm font-semibold text-[#4331a8] hover:bg-[#d9d0ff]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <RefreshCw className="size-4" /> Sinkronisasi Dapodik
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => setAddStudentOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#6c5dd3] px-5 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(108,93,211,0.35)] hover:bg-[#5343b9]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <UserPlus className="size-4" /> + Tambah Siswa Baru
              </motion.button>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </FadeIn>
      <StudentStats />
      <FadeIn>
        <StudentsTable key={refreshKey} aside={<StudentsSidePanels />} />
      </FadeIn>

      <AddStudentDialog
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        onSuccess={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  );
}
