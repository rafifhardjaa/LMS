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

type DailyCoverage = {
  day: string;
  fullName: string;
  terisi: number;
  kosong: number;
  bentrok: number;
};

/**
 * Tutupan jadwal per hari. Sesi bentrok (guru/kelas dobel) dan slot kosong
 * adalah dua hal yang paling sering dicek admin di halaman Jadwal.
 */
const coverage: DailyCoverage[] = [
  { day: "Sen", fullName: "Senin", terisi: 44, kosong: 6, bentrok: 2 },
  { day: "Sel", fullName: "Selasa", terisi: 46, kosong: 4, bentrok: 2 },
  { day: "Rab", fullName: "Rabu", terisi: 42, kosong: 8, bentrok: 2 },
  { day: "Kam", fullName: "Kamis", terisi: 45, kosong: 5, bentrok: 2 },
  { day: "Jum", fullName: "Jumat", terisi: 30, kosong: 4, bentrok: 1 },
  { day: "Sab", fullName: "Sabtu", terisi: 28, kosong: 2, bentrok: 0 },
];

const totalTerisi = coverage.reduce((sum, item) => sum + item.terisi, 0);
const totalKosong = coverage.reduce((sum, item) => sum + item.kosong, 0);
const totalBentrok = coverage.reduce((sum, item) => sum + item.bentrok, 0);

export function ScheduleCoverageChart() {
  return (
    <FadeIn>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between max-lg:p-4">
        <div className="flex items-center justify-between mb-4 max-lg:flex-wrap max-lg:gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Tutupan Jadwal per Hari
            </h2>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
              {totalBentrok} sesi bentrok
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold border border-[#e0e2e7]/50">
            {totalTerisi + totalKosong + totalBentrok} sesi / minggu
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs mb-2 max-lg:flex-wrap max-lg:gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6c5dd3]" />
            <span className="text-[#4e566c] font-medium">Terisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]" />
            <span className="text-[#4e566c] font-medium">Slot kosong</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[#4e566c] font-medium">Bentrok</span>
          </div>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={coverage}
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
                name="Slot kosong"
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
            <strong className="text-[#181c20]">{totalKosong} slot</strong> masih
            kosong minggu ini
          </span>
          <span className="font-semibold text-red-600">
            {totalBentrok} bentrok harus diselesaikan
          </span>
        </div>
      </div>
    </FadeIn>
  );
}
