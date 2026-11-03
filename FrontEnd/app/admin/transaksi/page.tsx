"use client";

import { CirclePlus, Download, ArrowLeftRight } from "lucide-react";
import { TransactionSidePanels } from "@/components/admin/transaction-side-panels";
import { TransactionStats } from "@/components/admin/transaction-stats";
import { TransactionTable } from "@/components/admin/transaction-table";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function TransactionPage() {
  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <FadeIn>
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#eef0f5] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)] xl:flex-row xl:items-center">
          <SlideIn direction="left">
            <div className="max-w-[560px]">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#4331a8]">
                <span className="rounded-full bg-[#e5deff] px-3 py-1">● BIRO KEUANGAN &amp; ADMINISTRASI SPP</span>
                <span className="flex items-center gap-1.5 rounded-full bg-[#d1fae5] px-3 py-1 text-[#047857]">● Host-to-Host Gateway Live (BSI &amp; NTB Syariah)</span>
              </div>
              <h1 className="text-[26px] font-bold leading-tight tracking-[-0.6px] text-[#181c20] sm:text-[28px]">Pusat Transaksi &amp; Keuangan Siswa<br className="hidden sm:block" /></h1>
              <p className="mt-2 text-[13px] leading-5 text-[#4e566c]">Pengelolaan real-time pembayaran SPP reguler, asesmen sertifikasi LSP-P1, CBT semester, infaq komite, serta automasi rekonsiliasi kas perbankan SMK Mataram.</p>
            </div>
          </SlideIn>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => window.alert("Ekspor Rekap Transaksi (.xlsx)")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"><Download className="size-4" /> Ekspor Rekap (.xlsx)</button>
            <button type="button" onClick={() => window.alert("Rekonsiliasi Bank")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"><ArrowLeftRight className="size-4" /> Rekonsiliasi Bank</button>
            <button type="button" onClick={() => window.alert("Buat Tagihan / Invoice")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"><CirclePlus className="size-4" /> Buat Tagihan / Invoice</button>
          </div>
        </section>
      </FadeIn>
      <TransactionStats />
      <TransactionTable aside={<TransactionSidePanels />} />
    </div>
  );
}
