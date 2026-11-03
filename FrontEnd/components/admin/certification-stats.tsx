"use client";

import { Award, ClipboardCheck, Layers, Users } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function CertificationStats() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Total Asesi<br />Terdaftar</p>
          <Users className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={412} /> <span className="text-base">Siswa</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]">
          <span className="rounded-full bg-[#d1fae5] px-2 py-1 font-semibold text-[#047857]">↗ +94.2%</span>
          <span className="text-right">Tingkat Kelulusan<br />KOS</span>
        </div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Skema Sertifikasi<br />Aktif</p>
          <Layers className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={8} /> <span className="text-base">Skema BNSP</span></p>
        <div className="mt-auto flex items-center rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px]"><span className="rounded-full bg-[#e5deff] px-2 py-1 font-semibold text-[#4331a8]">TKJ • TKR • BOGA • DKV</span></div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Asesor Berlisensi<br />BNSP</p>
          <ClipboardCheck className="size-9 rounded-2xl bg-[#d1fae5] p-2 text-[#047857]" />
        </div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={22} /> <span className="text-base">Asesor</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span className="flex items-center gap-1 rounded-full bg-[#d1fae5] px-2 py-1 font-semibold text-[#047857]">● 100% Siaga &amp;<br />Terlisensi</span><span className="text-right font-semibold">MET<br />Valid</span></div>
      </section>
      <section className={`${card} flex min-h-[200px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">E-Sertifikat<br />Terverifikasi</p>
          <Award className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={388} /> <span className="text-base">Terbit</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]"><span className="flex items-center gap-1 rounded-full bg-[#d1fae5] px-2 py-1 font-semibold text-[#047857]">● Blangko 100%<br />Valid</span><span className="text-right">QR Keaslian<br />Aktif</span></div>
      </section>
    </div>
  );
}
