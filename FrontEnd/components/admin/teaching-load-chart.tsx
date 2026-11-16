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
import type { TeachingLoadDatum } from "@/lib/api/dashboard";
import { TEACHING_LOAD_COLORS, colorAt } from "@/lib/chart-colors";

const LABEL: Record<string, string> = {
  "0 JP": "Belum dapat mapel",
  "1–12 JP": "Beban ringan",
  "13–24 JP": "Beban normal",
  "> 24 JP": "Overload",
};

type Props = {
  data?: TeachingLoadDatum[];
  loading?: boolean;
};

export function TeachingLoadChart({ data, loading = false }: Props) {
  if (loading || !data) {
    return (
      <FadeIn delay={0.1}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col gap-4 max-lg:p-4 animate-pulse">
          <div className="h-5 w-56 rounded bg-slate-200" />
          <div className="mx-auto h-56 w-56 rounded-full bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-200" />
        </div>
      </FadeIn>
    );
  }

  const radialData = data.map((item, index) => ({
    ...item,
    color: colorAt(TEACHING_LOAD_COLORS, index),
    label: LABEL[item.name] ?? item.name,
  }));
  const totalTeachers = radialData.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...radialData.map((item) => item.value), 1);
  const zero = data.find((item) => item.name === "0 JP")?.value ?? 0;
  const overload = data.find((item) => item.name === "> 24 JP")?.value ?? 0;
  const needsAttention = zero + overload;

  return (
    <FadeIn delay={0.1}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col gap-4 max-lg:p-4">
        <div className="flex items-center justify-between gap-3 max-lg:flex-wrap">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Sebaran Beban Mengajar Guru
            </h2>
            {needsAttention > 0 ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                {needsAttention} guru perlu atur ulang
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Beban mengajar seimbang
              </span>
            )}
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            {totalTeachers} guru
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
              <PolarRadiusAxis
                domain={[0, maxValue]}
                tick={false}
                axisLine={false}
              />
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
          {radialData.map((item) => (
            <span key={item.name} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>
                <strong className="font-semibold text-[#181c20]">
                  {item.value} guru
                </strong>{" "}
                {item.label.toLowerCase()}
              </span>
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
