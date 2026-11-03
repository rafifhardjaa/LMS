"use client";

import { Clock3, FileText, FileVideo, Image, ShieldCheck, SlidersHorizontal, TrendingUp, Users, Zap } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const series = [
  { label: "PDF Dokumen", value: 82, percent: "58%", color: "#4331a8", icon: FileText },
  { label: "Slide Presentasi", value: 34, percent: "24%", color: "#6c5dd3", icon: FileText },
  { label: "Video Tutorial", value: 17, percent: "12%", color: "#4e566c", icon: FileVideo },
  { label: "Jobsheet & Assets", value: 9, percent: "6%", color: "#a39afd", icon: Image },
];
const total = series.reduce((sum, item) => sum + item.value, 0);
const radius = 48;
const circumference = 2 * Math.PI * radius;

const review = [
  { label: "Lolos Verifikasi KOSP", value: "134 Modul", tone: "text-[#047857] bg-[#d1fae5]", icon: ShieldCheck },
  { label: "Menunggu Telaah Baru", value: "4 Modul", tone: "text-[#b45309] bg-[#fef3c7]", icon: Clock3 },
  { label: "Revisi Catatan Kurikulum", value: "4 Modul", tone: "text-[#dc2626] bg-[#fee2e2]", icon: Users },
];

const popular = [
  { name: "Algoritma Dijkstra & Graf", detail: "Fase F • XI TKJ", downloads: 342 },
  { name: "Engine Management System", detail: "Fase F • XII TKR", downloads: 298 },
  { name: "Artisan Sourdough Bakery", detail: "Fase F • XI Kuliner", downloads: 254 },
];

const actions = [
  { name: "Bagikan ke Google Classroom", detail: "Sinkronkan silabus kelas langsung" },
  { name: "Backup ke Google Drive Guru", detail: "Arsip mingguan otomatis terenkripsi" },
  { name: "Perbarui Versi Template Ajar", detail: "Standardisasi format dokumen 2026" },
];

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function ResourceSidePanels() {
  return (
    <aside className="flex w-full flex-col gap-6">
      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Distribusi Tipe<br />Berkas</h2>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Komposisi 142 berkas materi aktif yang tersimpan pada repositori digital sekolah.</p>
        <div className="relative mx-auto mt-5 size-[136px]">
          <svg viewBox="0 0 136 136" className="size-full -rotate-90" role="img" aria-label="Distribusi 142 berkas modul per tipe">
            {series.map(({ value, color }, index) => {
              const len = Math.max((value / total) * circumference - 2, 0);
              const offset = series.slice(0, index).reduce((sum, item) => sum + (item.value / total) * circumference, 0);
              return <circle key={color} cx="68" cy="68" r={radius} fill="none" stroke={color} strokeWidth="18" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-offset} />;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-[#181c20]"><CountUp to={total} /></span><span className="text-[9px] font-semibold uppercase text-[#4e566c]">Modul</span></div>
        </div>
        <ul className="mt-4 space-y-2.5">
          {series.map(({ label, value, percent, color }) => <li key={label} className="flex items-center gap-2 text-[10px]"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} /><span className="min-w-0 flex-1 truncate text-[#181c20]">{label}</span><span className="shrink-0 font-semibold text-[#181c20]">{value}</span><span className="shrink-0 text-[#787584]">({percent})</span></li>)}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Status Telaah<br />Waka Kurikulum</h2>
          <span className="rounded-full bg-[#e5deff] px-2.5 py-1 text-[10px] font-semibold text-[#4331a8]">Waka Ready</span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Tim Penjamin Mutu Pembelajaran.</p>
        <ul className="mt-4 space-y-2.5">
          {review.map(({ label, value, tone, icon: Icon }) => (
            <li key={label} className="flex items-center gap-2.5 rounded-full bg-[#f8f9fc] px-3 py-2.5">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${tone}`}><Icon className="size-4" /></span>
              <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#181c20]">{label}</span>
              <span className="shrink-0 text-[10px] font-bold text-[#6c5dd3]">{value}</span>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => window.alert("Buka Antrean Validasi Waka")} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#f1f4f9] text-xs font-semibold text-[#181c20] hover:bg-[#e5deff]"><SlidersHorizontal className="size-4" /> Buka Antrean Validasi Waka</button>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Modul<br />Terpopuler</h2>
          <TrendingUp className="size-5 text-[#6c5dd3]" />
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#787584]">Frekuensi unduh materi tertinggi.</p>
        <ul className="mt-4 space-y-2.5">
          {popular.map(({ name, detail, downloads }, index) => (
            <li key={name} className="flex items-center gap-2.5 rounded-full bg-[#f8f9fc] px-3 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0edff] text-[10px] font-bold text-[#6c5dd3]">{index + 1}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-[#181c20]">{name}</p><p className="truncate text-[9px] text-[#787584]">{detail}</p></div>
              <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-[#6c5dd3]">↓ {downloads}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-5 text-[#181c20]">Aksi Cepat<br />Repositori</h2>
          <Zap className="size-5 text-[#6c5dd3]" />
        </div>
        <ul className="mt-4 space-y-2.5">
          {actions.map(({ name, detail }) => (
            <li key={name}>
              <button type="button" onClick={() => window.alert(name)} className="flex w-full items-center gap-2.5 rounded-2xl bg-[#f8f9fc] px-3 py-2.5 text-left hover:bg-[#e5deff]">
                <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-[#181c20]">{name}</p><p className="truncate text-[9px] text-[#787584]">{detail}</p></div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
