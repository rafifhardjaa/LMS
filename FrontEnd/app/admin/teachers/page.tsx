"use client";

import { useState } from "react";
import { Download, UserPlus, UserRoundCheck } from "lucide-react";
import { motion } from "framer-motion";
import { TeachersSidePanels } from "@/components/admin/teachers-side-panels";
import { TeachersTable } from "@/components/admin/teachers-table";
import { AddTeacherDialog } from "@/components/admin/add-teacher-dialog";
import { AddPlacementDialog } from "@/components/admin/add-placement-dialog";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";
import { useAuthStore } from "@/lib/store/auth-store";

export default function TeachersPage() {
  const role = useAuthStore((state) => state.user?.role ?? "admin");
  const isAdmin = role === "admin";
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
          <StaggerChildren staggerDelay={0.08} delayChildren={0.15} className="flex flex-wrap items-center gap-3">
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Ekspor PDF/Excel")}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e0e2e7] bg-white px-4 text-sm font-semibold text-[#181c20] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#f8f9fc]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="size-4 text-[#4e566c]" /> Ekspor PDF/Excel
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => setPlacementOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e0e2e7] bg-white px-4 text-sm font-semibold text-[#181c20] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#f8f9fc]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <UserRoundCheck className="size-4 text-[#6c5dd3]" /> Penempatan
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => setAddTeacherOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#6c5dd3] px-5 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(108,93,211,0.35)] hover:bg-[#5343b9]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <UserPlus className="size-4" /> + Tambah Guru Baru
              </motion.button>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <TeachersTable key={refreshKey} isAdmin={isAdmin} onTeacherAdded={() => setRefreshKey(k => k + 1)} />
          <TeachersSidePanels />
        </div>
      </FadeIn>

      <AddTeacherDialog open={addTeacherOpen} onOpenChange={setAddTeacherOpen} onSuccess={() => setRefreshKey(k => k + 1)} />
      <AddPlacementDialog open={placementOpen} onOpenChange={setPlacementOpen} onSuccess={() => setRefreshKey(k => k + 1)} />
    </div>
  );
}