"use client";

import { Fingerprint, Loader, Mail, MessageSquareText, TriangleAlert } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const donutSeries = [
  { label: "Teknik Kendaraan Ringan (TKR)", value: 520, percent: 28.2, color: "#4331a8" },
  { label: "Kuliner & Tata Boga", value: 480, percent: 26.0, color: "#6c5dd3" },
  { label: "Desain Komunikasi Visual (DKV)", value: 450, percent: 24.4, color: "#a39afd" },
  { label: "Perhotelan & Hospitality", value: 392, percent: 21.3, color: "#4e566c" },
];

const total = donutSeries.reduce((sum, item) => sum + item.value, 0);

const cases = [
  { name: "Jim Anderson (XI TKR 1)", badge: "Presensi < 82%", badgeTone: "bg-[#fee2e2] text-[#dc2626]", bg: "bg-[#fef6f5]", text: "Tercatat 4 hari alfa beruntun. Butuh intervensi wali kelas dan panggilan konseling bimbingan karakter." },
  { name: "Sarah Azzahra (XII DKV 1)", badge: "Bimbingan LKS", badgeTone: "bg-[#e5deff] text-[#4331a8]", bg: "bg-[#f6f5ff]", text: "Jadwal mentoring portofolio Graphic Design Technology untuk seleksi tingkat Provinsi NTB pekan depan." },
];

const card = "rounded-2xl border border-[#eef0f5] bg-white p-6 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

function DonutChart() {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative mx-auto size-[136px]">
      <svg viewBox="0 0 136 136" className="size-full -rotate-90" role="img" aria-label="Distribusi siswa per program keahlian">
        {donutSeries.map(({ value, color }, index) => {
          const len = Math.max((value / total) * circumference - 1.5, 0);
          const offset = donutSeries.slice(0, index).reduce((sum, item) => sum + (item.value / total) * circumference, 0);
          return <circle key={color} cx="68" cy="68" r={radius} fill="none" stroke={color} strokeWidth="18" strokeDasharray={`${len} ${circumference - len}`} strokeDashoffset={-offset} />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tracking-tight text-[#181c20]"><CountUp to={total} /></span>
        <span className="text-[11px] text-[#4e566c]">Siswa</span>
      </div>
    </div>
  );
}

export function StudentsSidePanels() {
  return (
    <aside className="flex w-full flex-col gap-6">
      {/* Distribusi Program Keahlian */}
      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex items-center gap-2 text-lg font-semibold leading-[26px] text-[#181c20]"><Loader className="size-4 shrink-0 text-[#6c5dd3]" aria-hidden="true" />Distribusi<br />Program Keahlian</h3>
          <span className="rounded-full bg-[#eceef3] px-2 py-0.5 text-[10px] leading-3 text-[#4e566c]">4<br />Konsentrasi</span>
        </div>
        <div className="mt-5"><DonutChart /></div>
        <ul className="mt-6 space-y-4">
          {donutSeries.map(({ label, value, percent, color }) => (
            <li key={label}>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[#181c20]">{label}</span>
                <span className="shrink-0 text-[#181c20]">{value} ({percent.toFixed(1)}%)</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-[#eceef3]"><div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} /></div>
            </li>
          ))}
        </ul>
      </section>

      {/* Perhatian Khusus & BK */}
      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex items-start gap-2 text-lg font-semibold leading-[26px] text-[#181c20]"><TriangleAlert className="mt-1 size-4 shrink-0 text-[#dc2626]" aria-hidden="true" />Perhatian Khusus &amp;<br />BK</h3>
          <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-[10px] leading-3 text-[#dc2626]">2<br />Kasus</span>
        </div>
        <ul className="mt-5 space-y-3">
          {cases.map(({ name, badge, badgeTone, bg, text }) => (
            <li key={name} className={`rounded-2xl px-3 py-3 ${bg}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-[#181c20]">{name}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] leading-3 ${badgeTone}`}>{badge}</span>
              </div>
              <p className="mt-2 text-[11px] leading-[14px] text-[#4e566c]">{text}</p>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => window.alert("Buka Portal BK SiManis")} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#eceef3] text-sm font-medium text-[#181c20] hover:bg-[#e0e2e7]">
          <Fingerprint className="size-4 text-[#6c5dd3]" aria-hidden="true" /> Buka Portal BK SiManis
        </button>
      </section>

      {/* Aktivasi SSO */}
      <section className="rounded-2xl bg-[#6c5dd3] p-6 text-white shadow-[0_12px_28px_-6px_rgba(108,93,211,0.55)]">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20"><Mail className="size-4" aria-hidden="true" /></span>
          <div>
            <h3 className="text-sm font-semibold">27 Siswa Belum Aktivasi SSO</h3>
            <p className="mt-1 text-[11px] leading-[18px] text-white/85">Sebanyak 27 siswa kelas X baru belum memverifikasi kredensial akun Google Workspace SMK Mataram.</p>
          </div>
        </div>
        <button type="button" onClick={() => window.alert("Broadcast WhatsApp Aktivasi")} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-[#4331a8] hover:bg-[#f4f2ff]">
          <MessageSquareText className="size-4" aria-hidden="true" /> Broadcast WhatsApp Aktivasi
        </button>
        <p className="mt-3 text-center text-[10px] leading-[14px] text-white/75">Format pesan otomatis terhubung ke nomor wali santri/orang tua</p>
      </section>
    </aside>
  );
}
