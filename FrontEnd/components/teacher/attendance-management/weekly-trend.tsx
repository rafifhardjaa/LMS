"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { weeklyTrend } from "./data";

export function WeeklyTrend() {
  const [selectedDay, setSelectedDay] = useState("Rab");

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[12px] font-bold text-[#1E293B]">
          Tren Kehadiran Mingguan
        </h2>
        <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#006B2C]">
          Pekan ke-12
        </span>
      </div>

      <div className="grid h-32 grid-cols-5 items-end gap-2 px-2 pt-5">
        {weeklyTrend.map((point) => {
          const isSelected = selectedDay === point.day;
          const visualHeight = 34 + ((point.value - 88) / 12) * 66;

          return (
            <button
              key={point.day}
              type="button"
              onClick={() => setSelectedDay(point.day)}
              aria-pressed={isSelected}
              title={`${point.day}: ${point.value}%`}
              className="group flex h-full flex-col items-center justify-end gap-1.5"
            >
              <span
                className={cn(
                  "text-[8px] font-bold transition-opacity",
                  isSelected
                    ? "text-[#b71422] opacity-100"
                    : "text-[#94A3B8] opacity-0 group-hover:opacity-100",
                )}
              >
                {point.value}%
              </span>
              <span
                className={cn(
                  "w-full rounded-t-lg transition-all",
                  point.tone === "active" && "bg-[#b71422] shadow-sm",
                  point.tone === "success" &&
                    "bg-[#DCFCE7] group-hover:bg-[#00873A]",
                  point.tone === "muted" && "bg-[#EFF4FF]",
                )}
                style={{ height: `${visualHeight}%` }}
              />
              <span
                className={cn(
                  "text-[10px] font-bold",
                  isSelected
                    ? "text-[#b71422]"
                    : point.tone === "muted"
                      ? "text-[#94A3B8]"
                      : "text-[#334155]",
                )}
              >
                {point.day}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-[#EFF4FF] px-2.5 py-2 text-[10px] text-[#475569]">
        <span className="flex items-center gap-1">
          <TrendingUp className="size-3.5 text-[#16A34A]" />
          Rata-rata 5 Hari Terakhir:
        </span>
        <span className="text-[11px] font-bold text-[#1E293B]">94.7%</span>
      </div>
    </section>
  );
}
