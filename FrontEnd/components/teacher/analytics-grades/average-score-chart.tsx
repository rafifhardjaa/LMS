"use client";

import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { kktp } from "./data";
import type { StudentGrade } from "./types";

type AverageScoreChartProps = {
  students: StudentGrade[];
  classLabel: string;
};

export function AverageScoreChart({
  students,
  classLabel,
}: AverageScoreChartProps) {
  const values = students
    .map((student) => student.nilai)
    .filter((nilai): nilai is number => nilai !== null);

  const average = values.length
    ? Number((values.reduce((total, value) => total + value, 0) / values.length).toFixed(1))
    : 0;

  const data = [{ className: classLabel === "-" ? "Belum ada kelas" : classLabel, average }];

  return (
    <section className="flex flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <BarChart3 className="size-4" />
          </span>
          <div>
            <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
              Rata-Rata Nilai
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Nilai siswa pada tugas/kuis terpilih
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-[#b71422]">
          KKTP {kktp.toFixed(1)}
        </span>
      </div>

      <div className="mt-4 h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="className"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 600 }}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 9 }}
              width={30}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              formatter={(value) => [
                `${Number(value).toFixed(1)} / 100`,
                "Rata-rata",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                fontSize: 11,
                boxShadow: "0 8px 24px -12px rgba(15,23,42,0.24)",
              }}
            />
            <Bar
              dataKey="average"
              name="Rata-rata"
              fill="#b71422"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#F1F5F9] pt-3">
        <span className="text-[10px] font-semibold text-[#64748B]">
          Rata-rata keseluruhan
        </span>
        <span
          className={cn(
            "text-[10px] font-bold",
            average >= kktp ? "text-[#16A34A]" : "text-[#b71422]",
          )}
        >
          {average.toFixed(1)} / 100
        </span>
      </div>
    </section>
  );
}
