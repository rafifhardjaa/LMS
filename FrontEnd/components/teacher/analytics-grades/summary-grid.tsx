"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { summaryMetrics } from "./data";

type SummaryGridProps = {
  onScheduleRemedial: () => void;
};

export function SummaryGrid({ onScheduleRemedial }: SummaryGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaryMetrics.map((metric, index) => {
        const Icon = metric.icon;
        const FooterIcon = metric.footerIcon;

        return (
          <motion.article
            key={metric.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className={cn(
              "relative overflow-hidden rounded-[20px] border bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]",
              metric.active
                ? "border-[#E8A19B] ring-1 ring-[#b71422]/10"
                : "border-[#E2E8F0]",
            )}
          >
            {metric.active && (
              <span className="absolute inset-x-0 top-0 h-0.5 bg-[#b71422]" />
            )}

            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-semibold leading-4 text-[#64748B]">
                {metric.label}
              </p>
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  metric.iconBgClassName,
                  metric.iconTextClassName,
                )}
              >
                <Icon className="size-4" />
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
              <span className="text-[26px] font-bold leading-none tracking-[-0.04em] text-[#1E293B]">
                {metric.value}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium text-[#94A3B8]",
                  metric.active && "text-[#b71422]",
                )}
              >
                {metric.suffix}
              </span>
            </div>

            {typeof metric.progress === "number" && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]">
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

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-2.5">
              <span
                className={cn(
                  "flex min-w-0 items-center gap-1 truncate text-[10px] font-medium text-[#64748B]",
                  metric.footerLeftClassName,
                )}
              >
                {FooterIcon && <FooterIcon className="size-3 shrink-0" />}
                {metric.footerDotClassName && (
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      metric.footerDotClassName,
                    )}
                  />
                )}
                <span className="truncate">{metric.footerLeft}</span>
              </span>

              {metric.id === "remedial" ? (
                <button
                  type="button"
                  onClick={onScheduleRemedial}
                  className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-[#b71422] transition hover:underline"
                >
                  {metric.footerRight}
                  <ArrowUpRight className="size-3" />
                </button>
              ) : (
                <span
                  className={cn(
                    "shrink-0 text-[10px] font-semibold text-[#94A3B8]",
                    metric.footerRightClassName,
                  )}
                >
                  {metric.footerRight}
                </span>
              )}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
