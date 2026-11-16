"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FadeIn } from "@/components/ui/animations";
import type { StudentDistributionDatum } from "@/lib/api/dashboard";
import { STUDENT_DISTRIBUTION_COLORS, colorAt } from "@/lib/chart-colors";

type Props = {
  data?: StudentDistributionDatum[];
  loading?: boolean;
};

export function StudentDistributionChart({ data, loading = false }: Props) {
  if (loading || !data) {
    return (
      <FadeIn delay={0.1}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col gap-4 max-lg:p-4 animate-pulse">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="w-full h-64 rounded-xl bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-200" />
        </div>
      </FadeIn>
    );
  }

  if (data.length === 0) {
    return (
      <FadeIn delay={0.1}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
          <h2 className="text-lg font-bold text-[#181c20]">
            Distribusi Siswa per Jurusan
          </h2>
          <div className="flex items-center justify-center h-64 text-sm text-[#787584]">
            Belum ada data siswa
          </div>
        </div>
      </FadeIn>
    );
  }

  const totalStudents = data.reduce((sum, item) => sum + item.total, 0);
  const jurusanCount = data.filter((item) => item.majorCode !== "TANPA").length;
  const largest = [...data].sort((a, b) => b.total - a.total)[0]!;

  return (
    <FadeIn delay={0.1}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
        <div className="flex items-center justify-between mb-4 max-lg:flex-wrap max-lg:gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Distribusi Siswa per Jurusan
            </h2>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              {totalStudents} siswa
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            {jurusanCount} jurusan
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs mb-2 max-lg:flex-wrap max-lg:gap-y-2">
          <span className="text-[#4e566c] font-medium">
            Warna mewakili jurusan
          </span>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 40, bottom: 0, left: 0 }}
              barCategoryGap={12}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#787584" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="majorCode"
                width={56}
                tick={{ fontSize: 11, fill: "#181c20", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(108,93,211,0.06)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload as
                    | StudentDistributionDatum
                    | undefined;
                  if (!d) return null;
                  return (
                    <div
                      style={{
                        borderRadius: 12,
                        border: "1px solid #e0e2e7",
                        background: "#fff",
                        fontSize: 11,
                        padding: "6px 10px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                          color: "#181c20",
                          marginBottom: 2,
                        }}
                      >
                        {d.majorName}
                      </p>
                      <p style={{ color: "#4e566c" }}>
                        Total: {d.total} siswa
                      </p>
                      <p style={{ color: "#4e566c" }}>
                        Kelas X: {d.x} · XI: {d.xi} · XII: {d.xii}
                      </p>
                      {d.tanpa > 0 && (
                        <p style={{ color: "#4e566c" }}>
                          Tanpa Rombel: {d.tanpa}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey="total" name="Siswa" barSize={16} radius={[0, 8, 8, 0]}>
                {data.map((item, index) => (
                  <Cell
                    key={item.majorCode}
                    fill={colorAt(STUDENT_DISTRIBUTION_COLORS, index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-[#4e566c] font-medium pt-2 border-t border-[#eceef3] flex items-center justify-between gap-3">
          <span>
            Terbanyak:{" "}
            <strong className="text-[#181c20]">{largest.majorName}</strong>{" "}
            {largest.total} siswa
          </span>
          <span className="font-semibold text-[#6c5dd3]">
            {totalStudents} siswa terdaftar
          </span>
        </div>
      </div>
    </FadeIn>
  );
}
