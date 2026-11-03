"use client";

import { BookOpen, ChevronRight, FileText, MessageCircle, RefreshCw } from "lucide-react";

const kas = [
  { label: "Teknik Komputer & Jaringan", value: "Rp 148.500.000", percent: "36%", width: 100, color: "bg-[#6c5dd3]" },
  { label: "Desain Komunikasi Visual (DKV)", value: "Rp 115.600.000", percent: "28%", width: 78, color: "bg-[#6c5dd3]" },
  { label: "Kuliner / Tata Boga", value: "Rp 86.750.000", percent: "21%", width: 58, color: "bg-[#10b981]" },
  { label: "Teknik Otomotif / Kendaraan", value: "Rp 62.000.000", percent: "15%", width: 42, color: "bg-[#4e566c]" },
];

const kanal = [
  { label: "Virtual Account", percent: 62, color: "#6c5dd3" },
  { label: "QRIS Dinamis", percent: 24, color: "#10b981" },
  { label: "Bank Transfer", percent: 10, color: "#a39afd" },
  { label: "Loket TU (Tunai)", percent: 4, color: "#4e566c" },
];
const radius = 48;
const circumference = 2 * Math.PI * radius;

const mutasi = [
  { name: "M. Rizky Saput", detail: "Rp 350.000 • E-Wallet BSI" },
  { name: "Annisa Pratiwi", detail: "Rp 450.000 • Transfer BCA" },
  { name: "Bayu Aditva", detail: "Rp 700.000 • Setor Tunai" },
];

const actions = [
  { name: "Cetak Buku Kas Umum (BKU)", icon: BookOpen },
  { name: "Broadcast WhatsApp Pengingat SPP", icon: MessageCircle },
  { name: "Sinkronkan ke E-Rapor & Kelulusan", icon: RefreshCw },
];

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function TransactionSidePanels() {
  return (
    <aside className="flex w-full flex-col gap-6">
      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Komposisi Arus Kas</h2>
          <span className="rounded-full bg-[#e5deff] px-2.5 py-1 text-[10px] font-semibold text-[#4331a8]">Semester Ganjil</span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Realisasi per Kompetensi Keahlian.</p>
        <ul className="mt-4 space-y-3">
          {kas.map(({ label, value, percent, width, color }) => (
            <li key={label}>
              <div className="flex items-center justify-between gap-2 text-[10px]"><span className="min-w-0 truncate font-semibold text-[#181c20]">{label}</span><span className="shrink-0 text-[#787584]">{value} ({percent})</span></div>
              <div className="mt-1.5 h-2 rounded-full bg-[#eceef3]"><div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} /></div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[10px] text-[#4e566c]"><span>Total teralokasi operasional</span><b className="text-[#181c20]">Rp 412.850.000</b></div>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Kanal Pembayaran Siswa</h2>
          <button type="button" aria-label="Muat ulang data kanal" onClick={() => window.alert("Muat Ulang Kanal Pembayaran")} className="text-[#6c5dd3] hover:text-[#4331a8]"><RefreshCw className="size-4" /></button>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Distribusi metode bayar bulan ini.</p>
        <div className="relative mx-auto mt-4 size-[128px]">
          <svg viewBox="0 0 136 136" className="size-full -rotate-90" role="img" aria-label="Distribusi kanal pembayaran: Virtual Account 62%, QRIS 24%, Transfer 10%, Tunai 4%">
            {kanal.map(({ percent, color }, index) => {
              const len = Math.max((percent / 100) * circumference - 2, 0);
              const offset = kanal.slice(0, index).reduce((sum, item) => sum + (item.percent / 100) * circumference, 0);
              return <circle key={color} cx="68" cy="68" r={radius} fill="none" stroke={color} strokeWidth="18" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-offset} />;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-[#181c20]">86%</span><span className="text-[9px] font-semibold uppercase text-[#4e566c]">Digital</span></div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
          {kanal.map(({ label, percent, color }) => <li key={label} className="flex items-center gap-1.5 text-[10px]"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} /><span className="min-w-0 flex-1 truncate text-[#181c20]">{label}</span><span className="shrink-0 font-semibold text-[#181c20]">{percent}%</span></li>)}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Antrean Mutasi Manual</h2>
          <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold"><span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[#b45309]">3</span><button type="button" onClick={() => window.alert("Lihat Semua Mutasi Manual")} className="text-[#6c5dd3] hover:underline">Semua (8)</button></span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Verifikasi bukti transfer offline.</p>
        <ul className="mt-4 space-y-2.5">
          {mutasi.map(({ name, detail }) => (
            <li key={name} className="flex items-center gap-2.5 rounded-2xl bg-[#f8f9fc] px-3 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#6c5dd3]"><FileText className="size-4" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-[#181c20]">{name}</p><p className="truncate text-[9px] text-[#787584]">{detail}</p></div>
              <button type="button" onClick={() => window.alert(`Lihat Bukti Mutasi: ${name}`)} className="shrink-0 text-[9px] font-semibold text-[#6c5dd3] hover:underline">Bukti</button>
              <button type="button" onClick={() => window.alert(`Setujui Mutasi: ${name}`)} className="shrink-0 rounded-full bg-[#5343b9] px-2.5 py-1 text-[9px] font-semibold text-white hover:bg-[#4331a8]">Setuju</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h2 className="text-base font-bold leading-5 text-[#181c20]">Aksi Cepat<br />Biro Keuangan</h2>
        <ul className="mt-4 space-y-2.5">
          {actions.map(({ name, icon: Icon }) => (
            <li key={name}>
              <button type="button" onClick={() => window.alert(name)} className="flex w-full items-center gap-2.5 rounded-2xl bg-[#f8f9fc] px-3 py-2.5 text-left hover:bg-[#e5deff]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#6c5dd3] shadow-sm"><Icon className="size-4" /></span>
                <span className="min-w-0 flex-1 text-[10px] font-semibold leading-4 text-[#181c20]">{name}</span>
                <ChevronRight className="size-3.5 shrink-0 text-[#787584]" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
