"use client";

import { useState } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { GradingStatusSlice } from "./types";

export function GradingStatusChart({ data }: { data: GradingStatusSlice[] }) {
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const graded = data.find((slice) => slice.id === "graded")?.value ?? 0;
  const gradedRate = total ? Math.round((graded / total) * 100) : 0;
  const active = activeSlice === null ? null : data[activeSlice];
  const activeRate = active && total ? Math.round((active.value / total) * 100) : 0;

  return (
    <section className="flex flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <PieChartIcon className="size-4" />
          </span>
          <div>
            <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
              Status Penilaian
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Sebaran berkas yang masuk
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-[#475569]">
          {total} berkas
        </span>
      </div>

      <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-[170px] w-full max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                stroke="none"
                onMouseEnter={(_, index) => setActiveSlice(index)}
                onMouseLeave={() => setActiveSlice(null)}
              >
                {data.map((slice) => (
                  <Cell key={slice.id} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold leading-none tracking-[-0.04em] text-[#1E293B]">
              {total}
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
              Total
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          {data.map((slice) => (
            <div
              key={slice.id}
              className="flex items-center justify-between gap-3"
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#475569]">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                {slice.label}
              </span>
              <span className="text-[12px] font-bold text-[#1E293B]">
                {slice.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-3 flex min-h-5 items-center gap-1.5 text-[10px]"
        aria-live="polite"
      >
        {active ? (
          <>
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: active.color }}
            />
            <span className="truncate font-semibold text-[#334155]">
              {active.label}
            </span>
            <span className="shrink-0 text-[#94A3B8]">
              {active.value} berkas • {activeRate}%
            </span>
          </>
        ) : (
          <span className="text-[#94A3B8]">
            Arahkan kursor ke donut untuk melihat detail.
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#F1F5F9] pt-3">
        <span className="text-[10px] font-semibold text-[#64748B]">
          Progres penilaian
        </span>
        <span className="text-[10px] font-bold text-[#006398]">
          {gradedRate}% selesai
        </span>
      </div>
    </section>
  );
}
