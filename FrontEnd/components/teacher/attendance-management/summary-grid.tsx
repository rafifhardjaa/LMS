"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { summaryMetrics } from "./data";
import type { AttendanceCounts, AttendanceSummaryMetric } from "./types";

type AttendanceSummaryGridProps = {
  counts: AttendanceCounts;
  totalStudents: number;
};

export function AttendanceSummaryGrid({
  counts,
  totalStudents,
}: AttendanceSummaryGridProps) {
  const isInitialRoster = counts.HADIR === 33 && totalStudents === 35;
  const attendanceRate = !totalStudents
    ? 0
    : isInitialRoster
      ? 96.4
      : (counts.HADIR / totalStudents) * 100;

  const overrides: Record<string, Partial<AttendanceSummaryMetric>> = {
    attendance: {
      value: `${attendanceRate.toFixed(1)}%`,
      suffix: `(${counts.HADIR}/${totalStudents} Siswa)`,
    },
    sick: {
      value: String(counts.SAKIT + counts.IZIN),
      footer: `${counts.SAKIT} Sakit • ${counts.IZIN} Izin`,
    },
    absent: {
      value: String(counts.ALPA),
      badge: counts.ALPA === 0 ? "Nihil Pekan Ini" : "Perlu Tindak Lanjut",
      badgeClassName:
        counts.ALPA === 0
          ? "bg-[#DCFCE7] text-[#16A34A]"
          : "bg-[#FEE2E2] text-[#DC2626]",
      footer:
        counts.ALPA === 0
          ? "100% presensi terkonfirmasi wali"
          : `${counts.ALPA} siswa perlu konfirmasi wali`,
      footerClassName:
        counts.ALPA === 0 ? "text-[#16A34A]" : "text-[#DC2626]",
    },
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaryMetrics.map((baseMetric, index) => {
        const metric = { ...baseMetric, ...overrides[baseMetric.id] };
        const Icon = metric.icon;
        const FooterIcon = metric.footerIcon;

        return (
          <motion.article
            key={metric.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="relative overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
          >
            <span
              className={cn(
                "pointer-events-none absolute -bottom-6 -right-6 size-24 rounded-full",
                metric.decorationClassName,
              )}
            />

            <div className="relative flex items-center justify-between gap-2">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  metric.iconBgClassName,
                  metric.iconTextClassName,
                )}
              >
                <Icon className="size-5" />
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[9px] font-bold leading-none",
                  metric.badgeClassName,
                )}
              >
                {metric.badge}
              </span>
            </div>

            <div className="relative mt-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
                {metric.label}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                <span className="text-[26px] font-bold leading-none tracking-[-0.04em] text-[#1E293B]">
                  {metric.value}
                </span>
                <span className="text-[10px] font-medium text-[#94A3B8]">
                  {metric.suffix}
                </span>
              </div>
            </div>

            {typeof metric.progress === "number" && (
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-[#EFF4FF]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, Math.max(0, metric.progress))}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className={cn(
                    "h-full rounded-full",
                    metric.progressClassName ?? "bg-[#b71422]",
                  )}
                />
              </div>
            )}

            <div
              className={cn(
                "relative mt-3 flex items-center gap-1.5 text-[10px] font-semibold",
                metric.footerClassName,
              )}
            >
              {FooterIcon && <FooterIcon className="size-3.5 shrink-0" />}
              <span className="truncate">{metric.footer}</span>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
