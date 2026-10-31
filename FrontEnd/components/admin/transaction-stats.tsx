"use client";

import { CircleCheck, Landmark, ReceiptText, Wallet } from "lucide-react";

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function TransactionStats() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <section className={`${card} flex min-h-[212px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Penerimaan Bulan Ini</p>
          <ReceiptText className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-2 text-[26px] font-bold leading-8 text-[#181c20]">Rp<br />412.850.000</p>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]"><span className="font-semibold text-[#047857]">↗ +8.4%</span> vs bulan lalu (Target 94.2% tercapai)</p>
        <div className="mt-auto pt-3"><div className="h-2 rounded-full bg-[#eceef3]"><div className="h-full rounded-full bg-[#6c5dd3]" style={{ width: "94.2%" }} /></div></div>
      </section>

      <section className={`${card} flex min-h-[212px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Tertunggak (SPP &amp; LSP–P1)</p>
          <Wallet className="size-9 rounded-2xl bg-[#fee2e2] p-2 text-[#dc2626]" />
        </div>
        <p className="mt-2 text-[26px] font-bold leading-8 text-[#dc2626]">Rp<br />28.400.000</p>
        <p className="mt-2 flex items-center gap-2 text-[11px]"><span className="rounded-full bg-[#fee2e2] px-2 py-1 font-semibold text-[#dc2626]">42 Siswa / Asesi</span><span className="text-[#787584]">Jatuh tempo 10 Okt</span></p>
        <div className="mt-auto pt-3"><div className="h-2 rounded-full bg-[#eceef3]"><div className="h-full rounded-full bg-[#dc2626]" style={{ width: "18%" }} /></div></div>
      </section>

      <section className={`${card} flex min-h-[212px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Transaksi Sukses Hari Ini</p>
          <CircleCheck className="size-9 rounded-2xl bg-[#d1fae5] p-2 text-[#047857]" />
        </div>
        <p className="mt-2 text-[26px] font-bold leading-8 text-[#181c20]">156 <span className="text-base">Transaksi</span></p>
        <p className="mt-2 flex items-center justify-between gap-2 text-[11px]"><span className="font-semibold text-[#047857]">● Gateway VA<br />&amp; QRIS</span><span className="text-right text-[#4e566c]">Rp<br />48.750.000<br />masuk</span></p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[10px] text-[#4e566c]"><span>00:00 WITA</span><span className="font-semibold">Terakhir: 3 mnt lalu</span></div>
      </section>

      <section className={`${card} flex min-h-[212px] flex-col`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Saldo Rekening Penampung</p>
          <Landmark className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
        </div>
        <p className="mt-2 text-[26px] font-bold leading-8 text-[#181c20]">Rp<br />1.248.600.000</p>
        <p className="mt-2 grid grid-cols-2 gap-2 text-[10px] leading-4 text-[#4e566c]"><span><b className="text-[#181c20]">BSI Giro:</b> Rp 780jt •</span><span><b className="text-[#181c20]">NTB Syariah:</b> Rp 468,6jt</span></p>
        <div className="mt-auto flex items-center gap-1.5 rounded-full bg-[#f8f9fc] px-3 py-2 text-[10px] font-semibold text-[#047857]"><span className="size-1.5 rounded-full bg-[#10b981]" /> Terverifikasi Otomatis Kliring Bi-FAST</div>
      </section>
    </div>
  );
}
