"use client";

import { FadeIn, SlideIn } from "@/components/ui/animations";

export function ModulesHeader() {
  return (
    <FadeIn>
      <div className="min-w-0">
        <SlideIn direction="left">
          <h1 className="mt-1 text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
            Manajemen Modul &amp; Course Pengampu
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[#475569]">
            Kelola rombel kelas aktif, distribusi alur tujuan pembelajaran (ATP),
            materi ajar, serta sinkronisasi e-KTSP &amp; Kurikulum Merdeka SMK
            Mataram.
          </p>
        </SlideIn>
      </div>
    </FadeIn>
  );
}
