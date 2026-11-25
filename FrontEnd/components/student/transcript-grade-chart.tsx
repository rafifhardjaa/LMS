"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { BarChart3 } from "lucide-react";

export function TranscriptGradeChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <section className="flex flex-col rounded-xl border border-[#cee8e1]/60 bg-white p-5 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]">
      <div className="flex items-center gap-2.5">
        <BarChart3 className="size-4 text-[#0d5c52]" />
        <div>
          <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
            Rata-Rata Komponen Penilaian
          </h2>
          <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
            JP dikonversi ke skala 100 berdasarkan nilai JP tertinggi
          </p>
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#64748B", fontWeight: 600 }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <Radar
              name="Rata-rata"
              dataKey="value"
              stroke="#0d5c52"
              fill="#0d5c52"
              fillOpacity={0.18}
              strokeWidth={2}
            />
            <Tooltip
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
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
