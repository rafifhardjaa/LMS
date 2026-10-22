"use client";

import { motion } from "framer-motion";
import { StaggerChildren, StaggerItem } from "@/components/ui/animations";
import type { Kpi } from "./types";

const kpiToneClasses = {
  primary: "bg-[#FFEBEB] text-[#b71422]",
  blue: "bg-[#E0F2FE] text-[#0284C7]",
  green: "bg-[#DCFCE7] text-[#16A34A]",
  amber: "bg-[#FEF3C7] text-[#D97706]",
} as const;

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <StaggerChildren
      staggerDelay={0.06}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {kpis.map((kpi) => (
        <StaggerItem key={kpi.label} className="h-full">
          <motion.div
            whileHover={{
              y: -2,
              boxShadow: "0 8px 20px -8px rgba(0,0,0,0.16)",
            }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="h-full rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
                  {kpi.label}
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold leading-8 tracking-tight text-[#1E293B]">
                    {kpi.value}
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-[0.06em] ${kpi.unitClassName}`}
                  >
                    {kpi.unit}
                  </span>
                </div>
              </div>
              <div
                className={`flex size-10 flex-shrink-0 items-center justify-center rounded-xl ${kpiToneClasses[kpi.tone]}`}
              >
                <kpi.icon className="size-[22px]" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-2 text-[12px] text-[#475569]">
              <span className="flex min-w-0 items-center gap-1.5">
                {kpi.dotClassName && (
                  <span
                    className={`size-2 flex-shrink-0 rounded-full ${kpi.dotClassName}`}
                  />
                )}
                <span className="truncate">{kpi.footerLeft}</span>
              </span>
              {kpi.footerRight && (
                <span
                  className={`flex-shrink-0 font-semibold ${kpi.footerRightClassName ?? ""}`}
                >
                  {kpi.footerRight}
                </span>
              )}
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
