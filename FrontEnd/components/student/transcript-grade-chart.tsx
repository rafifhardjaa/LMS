"use client";

import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BAR_COLORS = ["#0d5c52", "#14b8a6", "#7A941F"];

export function TranscriptGradeChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <section className="flex flex-col rounded-xl border border-[#cee8e1]/60 bg-white p-5 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#edf7f4] text-[#0d5c52]">
          <BarChart3 className="size-4" />
        </span>
        <div>
          <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
            Rata-Rata Nilai per Kategori
          </h2>
          <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
            Nilai akhir seluruh mata pelajaran semester ini
          </p>
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="28%">
            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748B", fontWeight: 600 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              width={32}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(13,92,82,0.05)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                fontSize: 11,
              }}
              formatter={(value) => [
                typeof value === "number" ? value.toFixed(1) : value,
                "Rata-rata",
              ]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
