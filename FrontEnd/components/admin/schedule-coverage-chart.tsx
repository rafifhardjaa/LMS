"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FadeIn } from "@/components/ui/animations";
import type { ScheduleCoverageDatum } from "@/lib/api/dashboard";

type Props = {
  data?: ScheduleCoverageDatum[];
  loading?: boolean;
};

export function ScheduleCoverageChart({ data, loading = false }: Props) {
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
            Tutupan Jadwal per Hari
          </h2>
          <div className="flex items-center justify-center h-56 text-sm text-[#787584]">
            Belum ada jadwal tersusun
          </div>
        </div>
      </FadeIn>
    );
  }

  const totalTerisi = data.reduce((sum, item) => sum + item.terisi, 0);
  const totalKosong = data.reduce((sum, item) => sum + item.kosong, 0);
  const totalBentrok = data.reduce((sum, item) => sum + item.bentrok, 0);

  return (
    <FadeIn>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
        <div className="flex items-center justify-between mb-4 max-lg:flex-wrap max-lg:gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Tutupan Jadwal per Hari
            </h2>
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                totalBentrok > 0
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {totalBentrok} sesi bentrok
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            {totalTerisi + totalKosong} sesi / minggu
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs mb-2 max-lg:flex-wrap max-lg:gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6c5dd3]" />
            <span className="text-[#4e566c] font-medium">Terisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]" />
            <span className="text-[#4e566c] font-medium">Tanpa guru</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[#4e566c] font-medium">Bentrok</span>
          </div>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
              barCategoryGap={22}
            >
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#4e566c", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#787584" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(108,93,211,0.06)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e0e2e7",
                  fontSize: 11,
                  padding: "6px 10px",
                }}
              />
              <Bar
                dataKey="terisi"
                name="Terisi"
                stackId="sesi"
                fill="#6c5dd3"
                barSize={28}
              />
              <Bar
                dataKey="kosong"
                name="Tanpa guru"
                stackId="sesi"
                fill="#e2e8f0"
                barSize={28}
              />
              <Bar
                dataKey="bentrok"
                name="Bentrok"
                stackId="sesi"
                fill="#ef4444"
                barSize={28}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-[#4e566c] font-medium pt-2 border-t border-[#eceef3] flex items-center justify-between gap-3">
          <span>
            <strong className="text-[#181c20]">{totalKosong} sesi</strong> tanpa
            guru minggu ini
          </span>
          <span className="font-semibold text-red-600">
            {totalBentrok} bentrok harus diselesaikan
          </span>
        </div>
      </div>
    </FadeIn>
  );
}
