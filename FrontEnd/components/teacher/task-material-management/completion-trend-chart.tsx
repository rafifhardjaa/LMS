"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CompletionTrendPoint } from "./types";

export function CompletionTrendChart({
  data,
}: {
  data: CompletionTrendPoint[];
}) {
  const total = data.reduce(
    (sum, point) => sum + point.onTime + point.late,
    0,
  );
  const late = data.reduce((sum, point) => sum + point.late, 0);
  const onTimeRate = total ? Math.round(((total - late) / total) * 100) : 0;

  return (
    <section className="flex flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F4FB] text-[#006398]">
            <BarChart3 className="size-4" />
          </span>
          <div>
            <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
              Tren Pengumpulan 7 Hari
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Tepat waktu vs terlambat
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E8F4FB] px-2 py-1 text-[9px] font-bold text-[#006398]">
          <TrendingUp className="size-3" />
          {onTimeRate}% tepat waktu
        </span>
      </div>

      <div className="mt-4 h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={4}
            margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 600 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 9 }}
              width={30}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                fontSize: 11,
                boxShadow: "0 8px 24px -12px rgba(15,23,42,0.24)",
              }}
            />
            <Bar
              dataKey="onTime"
              name="Tepat waktu"
              fill="#006398"
              radius={[4, 4, 0, 0]}
              barSize={10}
            />
            <Bar
              dataKey="late"
              name="Terlambat"
              fill="#D97706"
              radius={[4, 4, 0, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3">
        <div className="flex items-center gap-4 text-[10px] font-semibold text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#006398]" />
            Tepat waktu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#D97706]" />
            Terlambat
          </span>
        </div>
        <span className="text-[10px] font-medium text-[#94A3B8]">
          {total} pengumpulan
        </span>
      </div>
    </section>
  );
}
