"use client";

import { FadeIn } from "@/components/ui/animations";

export function TaskMaterialHeader() {
  return (
    <FadeIn>
      <section className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
          Kelola Tugas &amp; Penilaian Siswa
        </h1>
        <p className="max-w-3xl text-[13px] leading-5 text-[#475569]">
          Kelola lembar kerja siswa (LKPD) dan tugas praktikum, pantau
          pengumpulan siswa, lalu nilai jawaban dalam satu tempat.
        </p>
      </section>
    </FadeIn>
  );
}
