"use client";

import { FadeIn, SlideIn } from "@/components/ui/animations";

export function StudentModulesHeader() {
  return (
    <FadeIn>
      <div className="min-w-0">
        <SlideIn direction="left">
          <h1 className="mt-1 text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
            Jadwal &amp; Modul Saya
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[#475569]">
            Lihat jadwal pelajaran kelas Anda, lalu buka modul ajar dan materi
            pembelajaran terkait.
          </p>
        </SlideIn>
      </div>
    </FadeIn>
  );
}
