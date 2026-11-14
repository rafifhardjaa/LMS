"use client";

import { useEffect, useState } from "react";
import { DoorClosed, KeyRound, TrendingUp, UserCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { CountUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";
import type { StudentStats } from "@/lib/api/master-data";

export function StudentStats() {
  const [stats, setStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    let active = true;
    masterDataApi.students
      .stats()
      .then((res) => {
        if (active) setStats(res.data?.data ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const total = stats?.total ?? 0;
  const activeCount = stats?.active ?? 0;
  const needActivation = stats?.needActivation ?? 0;
  const onboardedPct = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  const cards = [
    {
      label: <>Total Siswa<br />Aktif</>,
      value: total,
      suffix: " Siswa",
      icon: Users,
      tone: "bg-[#e5deff] text-[#6c5dd3]",
      footer: <span className="rounded-full bg-[#ecfdf5] px-2 py-1 text-[#047857]">● 100% Terverifikasi Dapodik</span>,
    },
    {
      label: <>Distribusi<br />Rombel</>,
      value: stats?.filledClasses ?? 0,
      suffix: " Rombel Aktif",
      icon: DoorClosed,
      tone: "bg-[#dbeafe] text-[#4e566c]",
      footer: <><span className="rounded-full bg-[#eceef3] px-2 py-1 text-[#4e566c]">4<br />Konsentrasi</span><span className="text-[#787584]">Fase E (18) &amp; F<br />(36)</span></>,
    },
    {
      label: <>Status Akun<br />SSO</>,
      value: activeCount,
      suffix: " Aktif",
      icon: KeyRound,
      tone: "bg-[#d1fae5] text-[#065f46]",
      footer: <><span className="rounded-full bg-[#e5deff] px-2 py-1 text-[#4331a8]">{onboardedPct}%<br />Onboarded</span><span className="text-[#dc2626]">{needActivation} Belum<br />Aktivasi</span></>,
    },
    {
      label: <>Presensi &amp;<br />Disiplin</>,
      value: 96.2,
      suffix: "% Kehadiran",
      decimals: 1,
      icon: UserCheck,
      tone: "bg-[#ecfdf5] text-[#059669]",
      footer: <><span className="flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-1 text-[#047857]"><TrendingUp className="size-3.5 shrink-0" /> Status<br />Prima</span><span className="text-[#787584]">(Target Min.<br />85%)</span></>,
    },
  ];

  return (
    <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerDelay={0.06}>
      {cards.map(({ label, value, suffix, decimals, icon: Icon, tone, footer }, index) => (
        <StaggerItem key={index}>
          <motion.div
            className="flex h-[160px] flex-col rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]"
            whileHover={{ y: -4, boxShadow: "0 12px 28px -4px rgba(0,0,0,0.08)" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase leading-[18px] tracking-[0.02em] text-[#4e566c]">{label}</p>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-2 whitespace-nowrap text-[24px] font-bold leading-7 tracking-tight text-[#181c20]"><CountUp to={value} decimals={decimals} /><span className="ml-1 text-xs font-normal text-[#787584]">{suffix}</span></p>
            <div className="mt-auto flex min-h-7 items-center justify-between gap-1 text-[9px] leading-[11px]">{footer}</div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
