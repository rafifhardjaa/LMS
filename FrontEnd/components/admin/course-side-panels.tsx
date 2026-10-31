"use client";

import { BadgeCheck, BookOpenCheck, Building2, ChevronRight, Clock3, Monitor, PieChart, Wrench, Utensils } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const series = [
  { label: "Teknik Kendaraan Ringan (TKR)", value: 340, percent: "34.7%", color: "#4331a8" },
  { label: "Kuliner & Tata Boga", value: 265, percent: "27.0%", color: "#6c5dd3" },
  { label: "Desain Komunikasi Visual (DKV)", value: 215, percent: "21.9%", color: "#a39afd" },
  { label: "Perhotelan & Hospitality", value: 160, percent: "16.4%", color: "#4e566c" },
];
const total = series.reduce((sum, item) => sum + item.value, 0);
const radius = 48;
const circumference = 2 * Math.PI * radius;

const resources = [
  { name: "Lab Komputer Multimedia", detail: "Sesi Desain 3D • Kis XI DKV 1", value: "92%", icon: Monitor },
  { name: "Bengkel Otomotif Utama", detail: "Tune Up Injeksi • Kis XII TKR 2", value: "85%", icon: Wrench },
  { name: "Kitchen Lab & Patiseri", detail: "Baking Croissant • Kis XII", value: "80%", icon: Utensils },
];

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function CourseSidePanels() {
  return (
    <aside className="flex w-full flex-col gap-6">
      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-bold leading-5 text-[#181c20]"><PieChart className="size-5 text-[#6c5dd3]" />Distribusi Jam<br />Pelajaran</h2>
          <span className="text-right text-[10px] leading-4 text-[#4e566c]"><b className="text-sm text-[#181c20]">980 JP</b><br />Total</span>
        </div>
        <p className="mt-3 text-[11px] leading-4 text-[#787584]">Alokasi mingguan berdasarkan 4 konsentrasi kejuruan dan program adaptif.</p>
        <div className="relative mx-auto mt-5 size-[136px]">
          <svg viewBox="0 0 136 136" className="size-full -rotate-90" role="img" aria-label="Distribusi 980 Jam Pelajaran per minggu">
            {series.map(({ value, color }, index) => {
              const len = Math.max((value / total) * circumference - 2, 0);
              const offset = series.slice(0, index).reduce((sum, item) => sum + (item.value / total) * circumference, 0);
              return <circle key={color} cx="68" cy="68" r={radius} fill="none" stroke={color} strokeWidth="18" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-offset} />;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-[#181c20]"><CountUp to={total} /></span><span className="text-[9px] font-semibold uppercase text-[#4e566c]">JP/Minggu</span></div>
        </div>
        <ul className="mt-4 space-y-2.5">
          {series.map(({ label, value, percent, color }) => <li key={label} className="flex items-center gap-2 text-[10px]"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} /><span className="min-w-0 flex-1 truncate text-[#181c20]">{label}</span><span className="shrink-0 font-semibold text-[#181c20]">{value} JP</span><span className="shrink-0 text-[#787584]">({percent})</span></li>)}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2"><h2 className="flex items-start gap-2 text-base font-bold leading-5 text-[#181c20]"><BookOpenCheck className="mt-0.5 size-4 text-[#6c5dd3]" />Validasi Perangkat<br />Ajar</h2><span className="rounded-full bg-[#d1fae5] px-2.5 py-1 text-[10px] font-semibold text-[#047857]">Audit OK</span></div>
        <p className="mt-3 text-[11px] leading-4 text-[#787584]">Progress verifikasi kelengkapan dokumen pengajaran oleh Waka Kurikulum.</p>
        <div className="mt-4 space-y-3.5">
          <Progress label="Alur Tujuan Pembelajaran (ATP)" count="35/35 (100%)" width="100%" note="35 Mapel lengkap & siap ajar" />
          <Progress label="Modul Ajar Berdiferensiasi" count="33/35 (94.2%)" width="94.2%" note="Sisa 2 mapel sedang revisi pengayaan" />
          <Progress label="Bank Soal Asesmen (STS/SAS)" count="31/35 (88.5%)" width="88.5%" note="Kisi-kisi soal tengah semester ganjil" />
        </div>
        <button type="button" onClick={() => window.alert("Verifikasi Perangkat Kurikulum")} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#f1f4f9] text-xs font-semibold text-[#6c5dd3] hover:bg-[#e5deff]"><BadgeCheck className="size-4" /> Verifikasi Perangkat Kurikulum</button>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2"><h2 className="flex items-start gap-2 text-base font-bold leading-5 text-[#181c20]"><Building2 className="mt-0.5 size-4 text-[#6c5dd3]" />Ruang Lab &amp;<br />Bengkel</h2><span className="rounded-full bg-[#e5deff] px-2.5 py-1 text-[10px] font-semibold text-[#4331a8]">● Live Hari Ini</span></div>
        <ul className="mt-4 space-y-2.5">
          {resources.map(({ name, detail, value, icon: Icon }) => <li key={name} className="flex items-center gap-2.5 rounded-full bg-[#f8f9fc] px-3 py-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0edff] text-[#6c5dd3]"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-[#181c20]">{name}</p><p className="truncate text-[9px] text-[#787584]">{detail}</p></div><span className="shrink-0 text-right text-[10px] font-bold text-[#6c5dd3]">{value}<br /><span className="font-medium text-[#059669]">Aktif</span></span></li>)}
        </ul>
        <button type="button" onClick={() => window.alert("Buka Matriks Jadwal Roster")} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#f1f4f9] text-xs font-semibold text-[#181c20] hover:bg-[#e5deff]"><Clock3 className="size-4" /> Buka Matriks Jadwal Roster <ChevronRight className="size-3.5" /></button>
      </section>
    </aside>
  );
}

function Progress({ label, count, width, note }: { label: string; count: string; width: string; note: string }) {
  return <div><div className="flex items-start justify-between gap-2 text-[10px] font-semibold text-[#181c20]"><span>{label}</span><span className="shrink-0 text-[#4331a8]">{count}</span></div><div className="mt-1.5 h-1.5 rounded-full bg-[#eceef3]"><div className="h-full rounded-full bg-[#6c5dd3]" style={{ width }} /></div><p className="mt-1 text-[9px] text-[#787584]">{note}</p></div>;
}
