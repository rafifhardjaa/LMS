"use client";

import { Award, CirclePlus, CloudCog, Download } from "lucide-react";
import { CertificationSidePanels } from "@/components/admin/certification-side-panels";
import { CertificationStats } from "@/components/admin/certification-stats";
import { CertificationTable } from "@/components/admin/certification-table";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function CertificationPage() {
  return (
    <div className="flex w-full flex-col gap-4 pt-2">
      <FadeIn>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-[#e5deff] px-3 py-1 text-[#4331a8]">● SMK MATARAM • PUSAT SERTIFIKASI PROFESI (LSP-P1)</span>
          <span className="rounded-full bg-[#e5deff] px-3 py-1 text-[#4331a8]">T.A. 2026/2027 GANJIL</span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#d1fae5] px-3 py-1 text-[#047857]"><CloudCog className="size-3.5" /> BNSP Terhubung (API v3.2)</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#787584]">🕐 Sinkronisasi Terakhir: Hari ini, 08:42 WIB</p>
        <section className="mt-4 flex flex-col justify-between gap-5 rounded-2xl border border-[#eef0f5] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)] xl:flex-row xl:items-center">
          <SlideIn direction="left">
            <div className="flex max-w-[620px] items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4f2ff]"><Award className="size-6 text-[#6c5dd3]" /></span>
              <div className="min-w-0">
                <h1 className="text-[26px] font-bold leading-tight tracking-[-0.6px] text-[#181c20] sm:text-[28px]">Sertifikasi Profesi &amp; Lisensi<br className="hidden sm:block" /> LSP-P1 SMK Mataram</h1>
                <p className="mt-2 text-[13px] leading-5 text-[#4e566c]">Kelola 412 pendaftar asesmen keahlian, 8 skema lisensi BNSP, penugasan 22 asesor penguji berlisensi MET, hingga penerbitan e-sertifikat digital ber-QR.</p>
              </div>
            </div>
          </SlideIn>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => window.alert("Unduh Rekap (.xlsx)")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"><Download className="size-4" /> Unduh Rekap (.xlsx)</button>
            <button type="button" onClick={() => window.alert("Sinkronisasi BNSP")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"><CloudCog className="size-4" /> Sinkronisasi BNSP</button>
            <button type="button" onClick={() => window.alert("Ajukan Uji Kompetensi Baru")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"><CirclePlus className="size-4" /> Ajukan Uji Kompetensi Baru</button>
          </div>
        </section>
      </FadeIn>
      <CertificationStats />
      <CertificationTable aside={<CertificationSidePanels />} />
    </div>
  );
}
