"use client";

import { ArrowRight, BadgeCheck, BadgeCheck as BadgeCheckIcon, Clock3, PieChart } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

const piket = [
  { initials: "BW", name: "Pawell Bennett, M.Pd", place: "Pos Gerbang Barat & Presensi", tone: "bg-[#e5deff] text-[#4331a8]", done: true },
  { initials: "SN", name: "Siti Nurhaliza, S.Psi", place: "Ruang Konseling Siswa", tone: "bg-[#e5deff] text-[#4331a8]", done: true },
  { initials: "AW", name: "Arya Wiguna, M.Cs", place: "Lab Komputer Multimedia", tone: "bg-[#eceef3] text-[#4e566c]", done: false },
];

const donutSeries = [
  { label: "Teknik Otomotif (TKR)", value: 340, color: "#6c5dd3" },
  { label: "Kuliner & Tata Boga", value: 265, color: "#a39afd" },
  { label: "Desain Komunikasi Visual (DKV)", value: 215, color: "#4331a8" },
  { label: "Umum & Normatif", value: 160, color: "#d9dce3" },
];

const total = donutSeries.reduce((sum, item) => sum + item.value, 0);

function DonutChart() {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative mx-auto size-[140px]">
      <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="img" aria-label="Distribusi Jam Pelajaran Kejuruan">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#eef0f5" strokeWidth="16" />
        {donutSeries.map(({ value, color }) => {
          const len = (value / total) * circumference;
          const offset = donutSeries.slice(0, donutSeries.findIndex((item) => item.color === color)).reduce((sum, item) => sum + (item.value / total) * circumference, 0);
          return <circle key={color} cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="16" strokeDasharray={`${Math.max(len - 2, 0)} ${circumference - Math.max(len - 2, 0)}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight text-[#181c20]"><CountUp to={total} /></span>
        <span className="mt-0.5 text-center text-[8px] font-semibold uppercase tracking-wider text-[#787584]">Total JP / MG</span>
      </div>
    </div>
  );
}

export function TeachersSidePanels() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Piket Kampus Hari Ini */}
      <section className="rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-5 text-[#181c20]"><span className="mr-1 inline-block size-1.5 rounded-full bg-[#10b981]" />Piket<br />Kampus Hari Ini</h3>
          <span className="rounded-full bg-[#eceef3] px-2.5 py-1 text-[10px] font-medium text-[#4e566c]">Selasa, 14 Apr</span>
        </div>
        <ul className="mt-4 space-y-2">
          {piket.map(({ initials, name, place, tone, done }) => (
            <li key={initials} className="flex items-center gap-3 rounded-xl bg-[#f8f9fc] px-3 py-2.5">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${tone}`}>{initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#181c20]">{name}</p>
                <p className="mt-0.5 truncate text-[10px] leading-3.5 text-[#787584]">{place}</p>
              </div>
              {done
                ? <BadgeCheckIcon className="size-5 shrink-0 text-[#059669]" aria-label="Selesai" />
                : <Clock3 className="size-5 shrink-0 text-[#787584]" aria-label="Belum" />}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => window.alert("Lihat Jadwal Piket Lengkap")} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#6c5dd3] hover:underline">
          Lihat Jadwal Piket Lengkap <ArrowRight className="size-3.5" />
        </button>
      </section>

      {/* Distribusi Jam Pelajaran Kejuruan */}
      <section className="rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-5 text-[#181c20]">Distribusi Jam Pelajaran<br />Kejuruan</h3>
          <PieChart className="size-4 shrink-0 text-[#787584]" aria-hidden="true" />
        </div>
        <div className="mt-4"><DonutChart /></div>
        <ul className="mt-4 space-y-2.5">
          {donutSeries.map(({ label, value, color }) => (
            <li key={label} className="flex items-center gap-2 text-[11px]">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
              <span className="min-w-0 flex-1 text-[#4e566c]">{label}</span>
              <span className="shrink-0 font-bold text-[#181c20]">{value}</span>
              <span className="shrink-0 text-[#787584]">Jam Pelajaran</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sertifikasi Asesor LSP */}
      <section className="rounded-2xl border border-[#e5deff] bg-[#f4f2ff] p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#6c5dd3] shadow-[0_6px_14px_-2px_rgba(108,93,211,0.4)]">
            <BadgeCheck className="size-5 text-white" aria-hidden="true" />
          </span>
          <h3 className="text-sm font-bold leading-5 text-[#181c20]">Sertifikasi Asesor<br />LSP</h3>
        </div>
        <p className="mt-3 text-[11px] leading-4 text-[#4e566c]">18 dari 22 guru produktif telah mengantongi lisensi Asesor Kompetensi BNSP untuk sertifikasi kejuruan siswa SMK.</p>
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px] font-bold">
          <button type="button" onClick={() => window.alert("Perbarui Portofolio")} className="text-[#6c5dd3] hover:underline">Perbarui Portofolio →</button>
          <button type="button" onClick={() => window.alert("Verifikasi LSP")} className="text-[#6c5dd3] hover:underline">Verifikasi LSP →</button>
        </div>
      </section>
    </div>
  );
}
