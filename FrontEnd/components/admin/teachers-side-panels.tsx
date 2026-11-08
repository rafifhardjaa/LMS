"use client";

import { PieChart } from "lucide-react";
import { CountUp } from "@/components/ui/animations";

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
    </div>
  );
}
