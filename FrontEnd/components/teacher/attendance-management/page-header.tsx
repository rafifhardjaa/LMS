"use client";

import { FadeIn, SlideIn } from "@/components/ui/animations";

export function AttendancePageHeader() {
  return (
    <FadeIn>
      <SlideIn direction="left">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#1E293B]">
          Presensi Harian &amp; Manajemen Kehadiran Siswa
        </h1>
        <p className="mt-1 max-w-[720px] text-sm leading-6 text-[#475569]">
          Pencatatan kehadiran kelas tatap muka &amp; praktikum lab,
          sinkronisasi Dapodik real-time, monitoring dispensasi/sakit,
          dan rekap semester.
        </p>
      </SlideIn>
    </FadeIn>
  );
}
