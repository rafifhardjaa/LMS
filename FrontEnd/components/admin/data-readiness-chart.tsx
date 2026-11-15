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

type Readiness = {
  entity: string;
  pct: number;
  gap: string;
};

/**
 * Kelengkapan data induk per entitas. Satu grafik mewakili seluruh menu admin:
 * bar terpendek = halaman yang paling perlu dibereskan lebih dulu.
 */
const readiness: Readiness[] = [
  { entity: "Siswa", pct: 96, gap: "74 siswa belum punya rombel" },
  { entity: "Guru", pct: 94, gap: "7 guru belum dapat mapel" },
  { entity: "Mapel", pct: 86, gap: "5 mapel tanpa guru pengampu" },
  { entity: "Rombel", pct: 100, gap: "Semua rombel lengkap" },
  { entity: "Jadwal", pct: 84, gap: "9 sesi bentrok, 4 slot kosong" },
];

const barColor = (pct: number) => {
  if (pct >= 95) return "#6c5dd3";
  if (pct >= 85) return "#f59e0b";
  return "#ef4444";
};

const worst = [...readiness].sort((a, b) => a.pct - b.pct)[0];

export function DataReadinessChart() {
  return (
    <FadeIn>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
        <div className="flex items-center justify-between mb-4 max-lg:flex-wrap max-lg:gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Kesiapan Data Master
            </h2>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              3 entitas belum 95%
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            T.A. 2026/2027 Ganjil
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6c5dd3]" />
            <span className="text-[#4e566c] font-medium">Lengkap (≥95%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[#4e566c] font-medium">Perlu dilengkapi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[#4e566c] font-medium">Kritis (&lt;85%)</span>
          </div>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={readiness}
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
                x={100}
                stroke="#e0e2e7"
                strokeDasharray="3 3"
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
                {readiness.map((item) => (
                  <Cell key={item.entity} fill={barColor(item.pct)} />
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
