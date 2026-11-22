"use client";

import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { motion } from "framer-motion";
import { CourseMasterData } from "@/components/admin/course-master-data";
import { AddSubjectDialog } from "@/components/admin/add-subject-dialog";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

export default function CoursePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <FadeIn>
        <div className="flex flex-col gap-5">
          <SlideIn direction="left">
            <div className="max-w-[470px]">
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[30px]">Manajemen Mata<br className="hidden sm:block" /> Pelajaran &amp; Kurikulum</h1>
              <p className="mt-2 text-[13px] leading-5 text-[#4e566c]">Kelola master data jurusan, mata pelajaran kejuruan &amp; umum per tingkatan, rombongan belajar, serta guru pengampu SMK Mataram.</p>
            </div>
          </SlideIn>
          <StaggerChildren staggerDelay={0.08} delayChildren={0.15} className="flex flex-wrap items-center gap-2">
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <CirclePlus className="size-4" /> Tambah Mapel Baru
              </motion.button>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </FadeIn>
      <FadeIn>
        <CourseMasterData refreshKey={refreshKey} />
      </FadeIn>
      <AddSubjectDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  );
}
