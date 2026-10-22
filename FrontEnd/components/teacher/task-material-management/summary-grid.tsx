"use client";

import { motion } from "framer-motion";
import { StaggerChildren, StaggerItem } from "@/components/ui/animations";
import type { SummaryMetric } from "./types";

export function SummaryGrid({ metrics }: { metrics: SummaryMetric[] }) {
  return (
    <StaggerChildren
      staggerDelay={0.06}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <StaggerItem key={metric.label} className="h-full">
            <motion.div
              whileHover={{
                y: -2,
                boxShadow: "0 8px 20px -8px rgba(0,0,0,0.16)",
              }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className={`flex h-full flex-col justify-between rounded-2xl p-4 shadow-sm ${
                metric.active
                  ? "bg-gradient-to-br from-white to-[#FFEBEB]/30"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
                  {metric.label}
                </span>
                <div
                  className={`flex size-9 flex-shrink-0 items-center justify-center rounded-xl ${metric.iconBgClassName} ${metric.iconTextClassName}`}
                >
                  <Icon className="size-[20px]" />
                </div>
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[26px] font-bold leading-8 tracking-tight text-[#1E293B]">
                    {metric.value}
                  </span>
                  <span
                    className={`text-[12px] font-semibold ${metric.unitClassName}`}
                  >
                    {metric.unit}
                  </span>
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 text-[12px] ${metric.metaClassName ?? "text-[#475569]"}`}
                >
                  {metric.active && (
                    <span className="size-1.5 flex-shrink-0 rounded-full bg-[#b71422]" />
                  )}
                  <span className="truncate">{metric.meta}</span>
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${metric.progressClassName}`}
                />
              </div>
            </motion.div>
          </StaggerItem>
        );
      })}
    </StaggerChildren>
  );
}
