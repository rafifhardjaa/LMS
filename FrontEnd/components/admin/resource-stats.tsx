"use client";

import { BookOpen, CloudCog, Construction, GraduationCap } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function ResourceStats() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Total Modul<br />Aktif</p>
          <BookOpen className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={142} /> <span className="text-base">Modul</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]">
          <span className="flex items-center gap-1 font-semibold text-[#047857]">● 100%<br />KOSP</span>
          <span className="flex items-center gap-1">Semester Ganjil<br />2026/2027</span>
        </div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Modul Kejuruan<br />&amp; Lab</p>
          <Construction className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={88} /> <span className="text-base">Modul</span> <span className="rounded-full bg-[#e5deff] px-2 py-1 text-[11px] font-semibold text-[#4331a8]">62.0% Porsi</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span>4 Konsentrasi: TKJ, Boga,<br />DKV &amp; TKR</span><span className="text-right font-semibold">Fase F<br />Dominan</span></div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Modul Umum<br />&amp; Adaptif</p>
          <GraduationCap className="size-9 rounded-2xl bg-[#eceef3] p-2 text-[#4e566c]" />
        </div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={54} /> <span className="text-base">Modul</span> <span className="rounded-full bg-[#eceef3] px-2 py-1 text-[11px] font-semibold text-[#4e566c]">38.0% Porsi</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span>Matematika, Bahasa,<br />IPAS &amp; Agama</span><span className="text-right font-semibold">Fase E<br />&amp; F</span></div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Penyimpanan<br />Cloud</p>
          <CloudCog className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-1 flex items-baseline gap-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={78.4} decimals={1} /><span className="text-xs font-normal leading-4 text-[#787584]">/150 GB</span></p>
        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#4e566c]"><span className="flex items-center gap-1 font-semibold text-[#047857]">● 52.2%<br />Aman</span><span>Backup<br />Harian</span></div>
        <div className="mt-auto h-2 rounded-full bg-[#eceef3]"><div className="h-full rounded-full bg-[#6c5dd3]" style={{ width: "52.2%" }} /></div>
      </section>
    </div>
  );
}
