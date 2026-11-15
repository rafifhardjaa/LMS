"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FadeIn } from "@/components/ui/animations";

type DataChange = {
  date: string;
  tambah: number;
  ubah: number;
};

/**
 * Tren perubahan data induk 30 hari terakhir, diturunkan dari audit log:
 * berapa record baru masuk vs berapa kali data lama diubah.
 */
const changes: DataChange[] = [
  { date: "19 Okt", tambah: 24, ubah: 41 },
  { date: "23 Okt", tambah: 18, ubah: 36 },
  { date: "27 Okt", tambah: 31, ubah: 52 },
  { date: "31 Okt", tambah: 12, ubah: 28 },
  { date: "4 Nov", tambah: 26, ubah: 44 },
  { date: "8 Nov", tambah: 35, ubah: 61 },
  { date: "12 Nov", tambah: 21, ubah: 39 },
  { date: "16 Nov", tambah: 29, ubah: 47 },
];

const totalTambah = changes.reduce((sum, item) => sum + item.tambah, 0);
const totalUbah = changes.reduce((sum, item) => sum + item.ubah, 0);

export function DataChangeTrendChart() {
  return (
    <FadeIn delay={0.1}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
        <div className="flex items-center justify-between mb-4 max-lg:flex-wrap max-lg:gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Tren Perubahan Data 30 Hari
            </h2>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              +{totalTambah} record baru
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            Sumber: Audit Log
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs mb-2 max-lg:flex-wrap max-lg:gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6c5dd3]" />
            <span className="text-[#4e566c] font-medium">Tambah data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a39afd]" />
            <span className="text-[#4e566c] font-medium">Ubah data</span>
          </div>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={changes}
              margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
            >
              <defs>
                <linearGradient id="trendTambah" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6c5dd3" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#6c5dd3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trendUbah" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a39afd" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#a39afd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#f1f4f9"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#787584" }}
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
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e0e2e7",
                  fontSize: 11,
                  padding: "6px 10px",
                }}
              />
              <Area
                type="monotone"
                dataKey="ubah"
                name="Ubah data"
                stroke="#a39afd"
                strokeWidth={2.5}
                fill="url(#trendUbah)"
              />
              <Area
                type="monotone"
                dataKey="tambah"
                name="Tambah data"
                stroke="#6c5dd3"
                strokeWidth={2.5}
                fill="url(#trendTambah)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-[#4e566c] font-medium pt-2 border-t border-[#eceef3] flex items-center justify-between gap-3">
          <span>
            <strong className="text-[#181c20]">{totalUbah} kali</strong> data
            diubah
          </span>
          <span className="font-semibold text-[#6c5dd3]">
            {totalTambah + totalUbah} perubahan tercatat
          </span>
        </div>
      </div>
    </FadeIn>
  );
}
