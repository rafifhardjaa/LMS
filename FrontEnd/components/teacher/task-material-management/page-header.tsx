"use client";

import { ClipboardList } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";

export function TaskMaterialHeader() {
  return (
    <FadeIn>
      <section className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFEBEB] text-[#b71422] shadow-sm">
          <ClipboardList className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b71422]">
            Manajemen Penilaian
          </p>
          <h1 className="mt-1 text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
            Kelola Tugas &amp; Penilaian Siswa
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[#475569]">
            Kelola lembar kerja siswa (LKPD) dan tugas praktikum, pantau
            pengumpulan siswa, lalu nilai jawaban dalam satu tempat.
          </p>
        </div>
      </section>
    </FadeIn>
  );
}
