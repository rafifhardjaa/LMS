"use client";

import {
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FadeIn } from "@/components/ui/animations";

const radialData = [
  { name: "0 JP", value: 7, color: "#ef4444", label: "Belum dapat mapel" },
  { name: "1–12 JP", value: 18, color: "#f59e0b", label: "Beban ringan" },
  { name: "13–24 JP", value: 82, color: "#6c5dd3", label: "Beban normal" },
  { name: "> 24 JP", value: 11, color: "#a39afd", label: "Overload" },
];

const totalTeachers = radialData.reduce((sum, item) => sum + item.value, 0);
const maxValue = Math.max(...radialData.map((item) => item.value));

export function TeachingLoadChart() {
  return (
    <FadeIn delay={0.1}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col gap-4 max-lg:p-4">
        <div className="flex items-center justify-between gap-3 max-lg:flex-wrap">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Sebaran Beban Mengajar Guru
            </h2>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
              18 guru perlu atur ulang
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            {totalTeachers} guru aktif
          </span>
        </div>

        <div className="mx-auto h-56 w-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={104}
              data={radialData}
              layout="centric"
            >
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#4e566c", fontWeight: 600 }}
              />
              <PolarRadiusAxis domain={[0, maxValue]} tick={false} axisLine={false} />
              <RadialBar dataKey="value" background cornerRadius={6}>
                {radialData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </RadialBar>
              <Tooltip
                cursor={{ fill: "rgba(108,93,211,0.06)" }}
                formatter={(value, name) => [`${value ?? 0} guru`, name]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e0e2e7",
                  fontSize: 11,
                  padding: "6px 10px",
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#eceef3] pt-3 text-[11px] text-[#4e566c]">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ef4444]" />
            <span>
              <strong className="font-semibold text-[#181c20]">7 guru</strong> belum dapat mapel
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f59e0b]" />
            <span>
              <strong className="font-semibold text-[#181c20]">18 guru</strong> beban ringan
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#6c5dd3]" />
            <span>
              <strong className="font-semibold text-[#181c20]">82 guru</strong> beban normal
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#a39afd]" />
            <span className="font-semibold text-[#a39afd]">
              <strong>11 guru</strong> overload
            </span>
          </span>
        </div>
      </div>
    </FadeIn>
  );
}
