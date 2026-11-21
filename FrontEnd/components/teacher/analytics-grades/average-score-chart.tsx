"use client";

import { useMemo } from "react";
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
import { classOptions, getFinalScore, kktp, students } from "./data";
import { cn } from "@/lib/utils";

export function AverageScoreChart() {
  const data = useMemo(
    () =>
      classOptions.map((option) => {
        const classStudents = students.filter(
          (student) => student.className === option.value,
        );

        const average = classStudents.length
          ? Number(
              (
                classStudents.reduce(
                  (total, student) => total + getFinalScore(student),
                  0,
                ) / classStudents.length
              ).toFixed(1),
            )
          : 0;

        return {
          className: option.value,
          average,
          count: classStudents.length,
        };
      }),
    [],
  );

  const overallAverage = useMemo(() => {
    if (!students.length) return 0;

    return Number(
      (
        students.reduce(
          (total, student) => total + getFinalScore(student),
          0,
        ) / students.length
      ).toFixed(1),
    );
  }, []);

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
              Nilai akhir siswa per kelas
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
            overallAverage >= kktp ? "text-[#16A34A]" : "text-[#b71422]",
          )}
        >
          {overallAverage.toFixed(1)} / 100
        </span>
      </div>
    </section>
  );
}
