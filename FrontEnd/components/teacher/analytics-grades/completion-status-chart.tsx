"use client";

import { useMemo } from "react";
import { UsersRound } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { classOptions, getStudentStatus, students } from "./data";

export function CompletionStatusChart() {
  const data = useMemo(
    () =>
      classOptions.map((option) => {
        const classStudents = students.filter(
          (student) => student.className === option.value,
        );
        const statuses = classStudents.map((student) =>
          getStudentStatus(student),
        );

        return {
          className: option.value,
          tuntas: statuses.filter((status) => status.tone === "success").length,
          remidi: statuses.filter((status) => status.tone === "danger").length,
        };
      }),
    [],
  );

  const totalTuntas = data.reduce((total, item) => total + item.tuntas, 0);
  const totalRemidi = data.reduce((total, item) => total + item.remidi, 0);

  return (
    <section className="flex flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#16A34A]">
            <UsersRound className="size-4" />
          </span>
          <div>
            <h2 className="text-[13px] font-bold leading-4 text-[#1E293B]">
              Siswa Tuntas &amp; Remidi
            </h2>
            <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
              Jumlah siswa per kelas berdasarkan KKTP
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-[#16A34A]">
          {totalTuntas} tuntas
        </span>
      </div>

      <div className="mt-4 h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={4}
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
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 9 }}
              width={30}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                fontSize: 11,
                boxShadow: "0 8px 24px -12px rgba(15,23,42,0.24)",
              }}
            />
            <Bar
              dataKey="tuntas"
              name="Tuntas"
              fill="#16A34A"
              radius={[4, 4, 0, 0]}
              barSize={10}
            />
            <Bar
              dataKey="remidi"
              name="Remidi"
              fill="#b71422"
              radius={[4, 4, 0, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3">
        <div className="flex items-center gap-4 text-[10px] font-semibold text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#16A34A]" />
            Tuntas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#b71422]" />
            Remidi
          </span>
        </div>
        <span className="text-[10px] font-medium text-[#94A3B8]">
          {totalRemidi} perlu remedial
        </span>
      </div>
    </section>
  );
}
