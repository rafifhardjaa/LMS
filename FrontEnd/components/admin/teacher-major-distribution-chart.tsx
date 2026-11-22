"use client";

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
import { GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { STUDENT_DISTRIBUTION_COLORS, colorAt } from "@/lib/chart-colors";

export type TeacherMajorDatum = {
  major: string;
  total: number;
};

type Props = {
  data?: TeacherMajorDatum[];
  loading?: boolean;
};

export function TeacherMajorDistributionChart({ data, loading = false }: Props) {
  if (loading || !data) {
    return (
      <FadeIn delay={0.14}>
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e0e2e7]/40 bg-white p-6 shadow-sm max-lg:p-4 animate-pulse">
          <div className="h-5 w-56 rounded bg-slate-200" />
          <div className="h-56 w-full rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-200" />
        </div>
      </FadeIn>
    );
  }

  const chartData = data.map((item, index) => ({
    ...item,
    color: colorAt(STUDENT_DISTRIBUTION_COLORS, index),
  }));
  const total = chartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <FadeIn delay={0.14}>
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e0e2e7]/40 bg-white p-6 shadow-sm max-lg:p-4">
        <div className="flex items-center justify-between gap-3 max-lg:flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#e5deff] text-[#6c5dd3]">
              <GraduationCap className="size-4" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#181c20]">
                Distribusi Guru per Jurusan
              </h2>
              <p className="text-[11px] text-[#787584]">
                Jumlah guru pengampu tiap konsentrasi keahlian
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[#e0e2e7]/50 bg-[#f1f4f9] px-3 py-1 text-xs font-semibold text-[#4e566c]">
            {total} guru
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#e0e2e7"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#787584" }}
              />
              <YAxis
                type="category"
                dataKey="major"
                width={64}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#4e566c", fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(108,93,211,0.06)" }}
                formatter={(value) => [`${value ?? 0} guru`, "Jumlah"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e0e2e7",
                  fontSize: 11,
                }}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={12}>
                {chartData.map((item) => (
                  <Cell key={item.major} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-[#eceef3] pt-3 text-[11px] text-[#4e566c]">
          {chartData.map((item) => (
            <span key={item.major} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <strong className="font-semibold text-[#181c20]">{item.major}</strong>
              <span>{item.total} guru</span>
            </span>
          ))}
          {!chartData.length ? (
            <span className="text-[#787584]">Belum ada data jurusan.</span>
          ) : null}
        </div>
      </div>
    </FadeIn>
  );
}
