"use client";

import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  GraduationCap,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  CountUp,
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";

const trajectory = {
  rank: 3,
  rankTotal: 32,
  gpa: 3.78,
  completed: 8,
  total: 12,
  progress: 67,
};

type StatItem = {
  label: string;
  to: number;
  icon: LucideIcon;
  suffix?: string;
  decimals?: number;
  locale?: boolean;
};

const stats: StatItem[] = [
  {
    label: "Peringkat",
    to: trajectory.rank,
    suffix: ` / ${trajectory.rankTotal}`,
    icon: Award,
  },
  {
    label: "IPK",
    to: trajectory.gpa,
    decimals: 2,
    locale: true,
    icon: GraduationCap,
  },
  {
    label: "Progres",
    to: trajectory.progress,
    suffix: "%",
    icon: TrendingUp,
  },
];

export function Trajectory() {
  return (
    <FadeIn>
      <section className="rounded-[20px] border border-[#cee8e1]/60 bg-white p-5 shadow-[0_1px_8px_rgba(7,31,28,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-2.5 rounded-full bg-[#0d5c52]" />
            <h3 className="text-[20px] font-semibold tracking-tight text-[#071f1c]">
              Trajectory Akademik
            </h3>
          </div>
          <span className="rounded-full bg-[#edf7f4] px-2.5 py-1 text-[11px] font-semibold text-[#0d5c52]">
            Peringkat {trajectory.rank} / {trajectory.rankTotal}
          </span>
        </div>

        <StaggerChildren
          staggerDelay={0.08}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <StaggerItem key={stat.label}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start justify-between rounded-2xl border border-[#cee8e1]/60 bg-white p-4 shadow-[0_1px_8px_rgba(7,31,28,0.04)]"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-[26px] font-bold tracking-tight text-[#0d5c52]">
                      <CountUp
                        to={stat.to}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                        locale={stat.locale}
                        duration={1.2}
                      />
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e0f2f1] text-[#0d5c52]">
                    <Icon className="size-5" />
                  </span>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#e2e8f0]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#0d5c52] to-[#14b8a6]"
              initial={{ width: 0 }}
              animate={{ width: `${trajectory.progress}%` }}
              transition={{ duration: 0.8, delay: 0.25 }}
            />
          </div>
          <p className="mt-1 text-xs text-[#536360]">
            {trajectory.completed}/{trajectory.total} modul selesai (
            {trajectory.progress}%)
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e6f2ef] pt-3">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748B]">
            <CheckCircle className="size-3.5 text-[#16a34a]" />
            {trajectory.completed}/{trajectory.total} modul selesai • Data pratinjau
          </span>
          <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[9px] font-bold text-[#166534]">
            Sesuai rencana
          </span>
        </div>
      </section>
    </FadeIn>
  );
}
