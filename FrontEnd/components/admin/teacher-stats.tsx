"use client";

import { BadgeCheck, BookOpen, Construction, Hourglass, IdCard } from "lucide-react";
import { CountUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const stats = [
  { label: <>Total Guru<br />Terdaftar</>, value: 35, suffix: " Guru", icon: IdCard, tone: "bg-[#e5deff] text-[#6c5dd3]", footer: <><span className="rounded-full bg-[#ecfdf5] px-2 py-1 text-[#047857]">● 100% Terverifikasi</span><span className="text-[#787584]">Akun<br />Dapodik Aktif</span></> },
  { label: <>Kejuruan &<br />Produktif</>, value: 22, suffix: " Pendidik", icon: Construction, tone: "bg-[#e5deff] text-[#6c5dd3]", footer: <><span className="text-[#4e566c]">Tata Boga, TKR, DKV</span><span className="rounded-full bg-[#e5deff] px-2 py-1 text-[#4331a8]">62.8%<br />Beban</span></> },
  { label: <>Normatif &<br />Adaptif</>, value: 13, suffix: " Pendidik", icon: BookOpen, tone: "bg-[#dbeafe] text-[#4e566c]", footer: <><span className="text-[#4e566c]">Matematika, Bhs, IP</span><span className="rounded-full bg-[#eceef3] px-2 py-1 text-[#4e566c]">37.2%<br />Beban</span></> },
  { label: <>Rata-rata Beban<br />Jam</>, value: 28, suffix: " Jam Pelajaran / Minggu", icon: Hourglass, tone: "bg-[#d1fae5] text-[#065f46]", footer: <><span className="flex items-center gap-1 text-[#047857]"><BadgeCheck className="size-5 shrink-0" /> Standar<br />Kemendikbud</span><span className="text-[#787584]">Min. 24 –<br />Max. 36 Jam Pelajaran</span></> },
];

export function TeacherStats() {
  return (
    <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerDelay={0.06}>
      {stats.map(({ label, value, suffix, icon: Icon, tone, footer }, index) => (
        <StaggerItem key={index}>
          <div className="flex h-[160px] flex-col rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase leading-[18px] tracking-[0.02em] text-[#4e566c]">{label}</p>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-2 whitespace-nowrap text-[24px] font-bold leading-7 tracking-tight text-[#181c20]"><CountUp to={value} /><span className="ml-1 text-xs font-normal text-[#787584]">{suffix}</span></p>
            <div className="mt-auto flex min-h-7 items-center justify-between gap-1 text-[9px] leading-[11px]">{footer}</div>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
