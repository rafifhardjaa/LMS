"use client";

import { useState } from "react";
import { CourseMasterData } from "@/components/admin/course-master-data";
import { AddSubjectDialog } from "@/components/admin/add-subject-dialog";
import { FadeIn, SlideIn } from "@/components/ui/animations";

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
        </div>
      </FadeIn>
      <FadeIn>
        <CourseMasterData
          refreshKey={refreshKey}
          onAddSubject={() => setAddOpen(true)}
        />
      </FadeIn>
      <AddSubjectDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  );
}
