"use client";

import { BookOpen, Clock3, Construction, GraduationCap, ShieldCheck } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function CourseStats() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <section className={`${card} flex min-h-[232px] flex-col`}>
        <div className="flex items-start justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Total Mapel Aktif</p>
          <BookOpen className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-2 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={35} /> Mapel</p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span>Struktur<br />Regulasi</span><span className="flex items-center gap-1 font-semibold text-[#6c5dd3]"><ShieldCheck className="size-3.5" />100% Sesuai<br />Kemendikbud</span></div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Mapel Kejuruan<br />(Produktif)</p><Construction className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" /></div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={22} /> <span className="text-base">Mapel</span> <span className="rounded-full bg-[#e5deff] px-2 py-1 text-[11px] text-[#4331a8]">62.8%</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span>4 Konsentrasi: TKR, Boga,<br />DKV &amp; Perhotelan</span><span className="text-right font-semibold">Fase F<br />Fokus</span></div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Mapel Umum &amp;<br />Adaptif</p><GraduationCap className="size-9 rounded-2xl bg-[#eceef3] p-2 text-[#4e566c]" /></div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={13} /> <span className="text-base">Mapel</span> <span className="rounded-full bg-[#eceef3] px-2 py-1 text-[11px] text-[#4e566c]">37.2%</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span>Mtk, BI, Bing, PKn, Ag,<br />&amp; Fisika</span><span className="text-right font-semibold">Fase E<br />&amp; F</span></div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Beban Jam<br />Pelajaran</p><Clock3 className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" /></div>
        <p className="mt-1 flex items-center gap-2 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={980} /><span className="text-xs font-normal leading-4">/ Minggu</span></p>
        <p className="text-[25px] font-bold leading-7 text-[#181c20]">JP</p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span className="flex items-center gap-1 font-semibold text-[#4331a8]">● 100%<br />Terdistribusi</span><span>≥24 JP<br />Guru</span></div>
      </section>
    </div>
  );
}
