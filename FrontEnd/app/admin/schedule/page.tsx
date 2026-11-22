"use client";

import { useState } from "react";
import { AddScheduleDialog } from "@/components/admin/add-schedule-dialog";
import { ScheduleSidePanels } from "@/components/admin/schedule-side-panels";
import { ScheduleTable } from "@/components/admin/schedule-table";
import type { JadwalPelajaran } from "@/lib/api/master-data";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function SchedulePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [schedules, setSchedules] = useState<JadwalPelajaran[]>([]);

  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <FadeIn>
        <SlideIn direction="left">
          <div className="max-w-[470px]">
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[30px]">Manajemen Jadwal Pelajaran &amp; Sesi Belajar</h1>
            <p className="mt-2 text-[13px] leading-5 text-[#4e566c]">Kelola sesi belajar, alokasi jam, dan validasi jadwal rombel SMK Mataram.</p>
          </div>
        </SlideIn>
      </FadeIn>
      <FadeIn>
        <ScheduleTable aside={<ScheduleSidePanels />} refreshKey={refreshKey} onDataLoaded={setSchedules} />
      </FadeIn>
      <AddScheduleDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={() => setRefreshKey((k) => k + 1)} schedules={schedules} />
    </div>
  );
}
