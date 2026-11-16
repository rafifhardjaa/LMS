"use client";

import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FadeIn } from "@/components/ui/animations";
import type { ReadinessDatum } from "@/lib/api/dashboard";
import { READINESS_COLORS, colorAt } from "@/lib/chart-colors";

type Props = {
  data?: ReadinessDatum[];
  loading?: boolean;
};

export function DataReadinessChart({ data, loading = false }: Props) {
  if (loading || !data) {
    return (
      <FadeIn>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col gap-4 max-lg:p-4 animate-pulse">
          <div className="h-5 w-44 rounded bg-slate-200" />
          <div className="h-5 w-56 rounded bg-slate-200" />
          <div className="w-full h-56 rounded-xl bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-200" />
        </div>
      </FadeIn>
    );
  }

  if (data.length === 0) {
    return (
      <FadeIn>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
          <h2 className="text-lg font-bold text-[#181c20]">
            Kesiapan Data Master
          </h2>
          <div className="flex items-center justify-center h-56 text-sm text-[#787584]">
            Belum ada data kesiapan
          </div>
        </div>
      </FadeIn>
    );
  }

  const worst = [...data].sort((a, b) => a.pct - b.pct)[0]!;
  const below95 = data.filter((item) => item.pct < 95).length;

  return (
    <FadeIn>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
        <div className="flex items-center justify-between mb-4 max-lg:flex-wrap max-lg:gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Kesiapan Data Master
            </h2>
            {below95 > 0 ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                {below95} entitas belum 95%
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Semua entitas siap
              </span>
            )}
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            T.A. 2026/2027 Ganjil
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs mb-2">
          <span className="text-[#4e566c] font-medium">
            Garis putus-putus = target kelengkapan 95%
          </span>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 36, bottom: 0, left: 0 }}
              barCategoryGap={12}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value: number) => `${value}%`}
                tick={{ fontSize: 11, fill: "#787584" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="entity"
                width={64}
                tick={{ fontSize: 11, fill: "#181c20", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine
                x={95}
                stroke="#e0e2e7"
                strokeDasharray="3 3"
                label={{
                  value: "Target 95%",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "#787584",
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(108,93,211,0.06)" }}
                formatter={(value) => [`${value ?? 0}% lengkap`, "Kelengkapan"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e0e2e7",
                  fontSize: 11,
                  padding: "6px 10px",
                }}
              />
              <Bar dataKey="pct" barSize={16} radius={[0, 8, 8, 0]}>
                {data.map((item, index) => (
                  <Cell
                    key={item.entity}
                    fill={colorAt(READINESS_COLORS, index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-[#4e566c] font-medium pt-2 border-t border-[#eceef3] flex items-center justify-between gap-3">
          <span>
            Paling tertinggal:{" "}
            <strong className="text-[#181c20]">{worst.entity}</strong>{" "}
            {worst.pct}%
          </span>
          <span className="font-semibold text-red-600">{worst.gap}</span>
        </div>
      </div>
    </FadeIn>
  );
}
