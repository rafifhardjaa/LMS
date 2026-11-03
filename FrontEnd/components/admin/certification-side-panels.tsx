"use client";

import { BadgeCheck, CalendarRange, ChevronRight, ClipboardList, FileCheck2, FileText, PieChart, Printer, QrCode, RefreshCw } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const series = [
  { label: "TKJ", value: 140, percent: "34.0%", color: "#6c5dd3" },
  { label: "TKR", value: 115, percent: "27.9%", color: "#a39afd" },
  { label: "Tata Boga", value: 85, percent: "20.6%", color: "#10b981" },
  { label: "DKV", value: 72, percent: "17.5%", color: "#f59e0b" },
];
const total = series.reduce((sum, item) => sum + item.value, 0);
const radius = 48;
const circumference = 2 * Math.PI * radius;

const asesor = [
  { name: "Dr. Pawell S.Kom", met: "MET.000.001234 • Asesor TKJ", status: "Siaga", initials: "PW", tone: "bg-[#6c5dd3] text-white" },
  { name: "Drs. Bambang Sutrisno", met: "MET.000.003921 • Asesor TKR", status: "Siaga", initials: "BS", tone: "bg-[#a39afd] text-[#181c20]" },
  { name: "Dewa Ayu Citra S.Pd", met: "MET.000.005112 • Asesor Tata Boga", status: "Siaga", initials: "DA", tone: "bg-[#10b981] text-white" },
  { name: "Arya Wiguna M.Cs", met: "MET.000.007882 • Asesor DKV", status: "Menilai", initials: "AW", tone: "bg-[#f97316] text-white" },
];

const agenda = [
  { date: "19", title: "Uji Kompetensi TKJ – JNA Gelombang 2", detail: "Lab Komputer Jaringan 3", kuota: "Kuota: 32 Siswa" },
  { date: "21", title: "Asesmen Portofolio DKV", detail: "Studio Kreatif & Multimedia", kuota: "Kuota: 28 Siswa" },
];

const quickActions = [
  { name: "Cetak Sertifikat Massal (PDF + QR)", icon: Printer },
  { name: "Validasi Sertifikat via Nomor Seri", icon: QrCode },
  { name: "Sinkronkan Nilai ke Portal Dapodik", icon: RefreshCw },
];

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function CertificationSidePanels() {
  return (
    <aside className="flex w-full flex-col gap-6">
      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Distribusi Asesi<br />per Bidang</h2>
          <PieChart className="size-5 text-[#6c5dd3]" />
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Total 412 Calon Penerima Sertifikat.</p>
        <div className="relative mx-auto mt-5 size-[136px]">
          <svg viewBox="0 0 136 136" className="size-full -rotate-90" role="img" aria-label="Distribusi 412 asesi per bidang keahlian">
            {series.map(({ value, color }, index) => {
              const len = Math.max((value / total) * circumference - 2, 0);
              const offset = series.slice(0, index).reduce((sum, item) => sum + (item.value / total) * circumference, 0);
              return <circle key={color} cx="68" cy="68" r={radius} fill="none" stroke={color} strokeWidth="18" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-offset} />;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-[#181c20]"><CountUp to={total} /></span><span className="text-[9px] font-semibold uppercase text-[#4e566c]">Asesi</span></div>
        </div>
        <ul className="mt-4 space-y-2.5">
          {series.map(({ label, value, percent, color }) => <li key={label} className="flex items-center gap-2 text-[10px]"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} /><span className="min-w-0 flex-1 truncate text-[#181c20]">{label} ({value})</span><span className="shrink-0 font-semibold text-[#181c20]">{percent}</span></li>)}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Asesor Penguji<br />BNSP</h2>
          <button type="button" onClick={() => window.alert("Kelola Asesor Penguji")} className="shrink-0 text-[10px] font-semibold text-[#6c5dd3] hover:underline">Kelola (22)</button>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Status Lisensi MET Aktif.</p>
        <ul className="mt-4 space-y-2.5">
          {asesor.map(({ name, met, status, initials, tone }) => (
            <li key={met} className="flex items-center gap-2.5 rounded-full bg-[#f8f9fc] px-3 py-2.5">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${tone}`}>{initials}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-[#181c20]">{name}</p><p className="truncate text-[9px] text-[#787584]">{met}</p></div>
              <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold ${status === "Siaga" ? "bg-[#d1fae5] text-[#047857]" : "bg-[#fef3c7] text-[#b45309]"}`}>{status}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Agenda Asesmen<br />Terdekat</h2>
          <CalendarRange className="size-5 text-[#6c5dd3]" />
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Jadwal Uji Praktik &amp; Wawancara.</p>
        <ul className="mt-4 space-y-2.5">
          {agenda.map(({ date, title, detail, kuota }) => (
            <li key={title} className="flex items-center gap-2.5 rounded-2xl bg-[#f8f9fc] px-3 py-2.5">
              <span className="flex size-9 shrink-0 flex-col items-center justify-center rounded-xl bg-[#e5deff] text-[#4331a8]"><span className="text-[7px] font-bold uppercase leading-2">Okt</span><span className="text-xs font-bold leading-3">{date}</span></span>
              <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-[#181c20]">{title}</p><p className="truncate text-[9px] text-[#787584]">{detail}</p><p className="truncate text-[9px] font-semibold text-[#4331a8]">{kuota}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="flex items-start gap-2 text-base font-bold leading-5 text-[#181c20]"><BadgeCheck className="mt-0.5 size-4 text-[#6c5dd3]" />Quick<br />Actions LSP</h2>
        </div>
        <ul className="mt-4 space-y-2.5">
          {quickActions.map(({ name, icon: Icon }) => (
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

export { FileCheck2, ClipboardList, FileText };
