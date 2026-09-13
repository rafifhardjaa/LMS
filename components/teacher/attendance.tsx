"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";

type Marker = "H" | "S" | "I" | "A";

const statusClass: Record<Marker, { selected: string; hover: string }> = {
  H: { selected: "bg-[#DCFCE7] text-[#16A34A] font-bold", hover: "hover:bg-[#DCFCE7]" },
  S: { selected: "bg-[#FEF3C7] text-[#D97706] font-bold", hover: "hover:bg-[#FEF3C7]" },
  I: { selected: "bg-[#E0F2FE] text-[#0284C7] font-bold", hover: "hover:bg-[#E0F2FE]" },
  A: { selected: "bg-[#FEE2E2] text-[#DC2626] font-bold", hover: "hover:bg-[#FEE2E2]" },
};

const students = [
  { id: 1, name: "John Kurt (#02)", initial: "H" as Marker },
  { id: 2, name: "Lisa Hilton (#05)", initial: "H" as Marker },
];

const stats = [
  { value: "96.4%", label: "HADIR", className: "bg-[#DCFCE7]/60 text-[#16A34A]" },
  { value: "2.1%", label: "SAKIT", className: "bg-[#FEF3C7]/60 text-[#D97706]" },
  { value: "1.0%", label: "IZIN", className: "bg-[#E0F2FE]/60 text-[#0284C7]" },
  { value: "0.5%", label: "ALPA", className: "bg-[#FEE2E2]/60 text-[#DC2626]" },
];

export function Attendance() {
  const [state, setState] = useState<Record<number, Marker>>(() =>
    Object.fromEntries(students.map((s) => [s.id, s.initial]))
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#b71422] uppercase">
            Presensi Harian Terpadu
          </span>
          <h4 className="text-[16px] font-semibold text-[#1E293B]">
            Rekap Presensi Siswa VII-A
          </h4>
        </div>
        <span className="text-[12px] font-semibold text-[#1E293B] bg-[#F8FAFC] px-2 py-1 rounded-md">
          Hari Ini
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center my-1">
        {stats.map((s) => (
          <div key={s.label} className={`p-2 rounded-xl ${s.className}`}>
            <span className="block text-[26px] font-bold tracking-tight">
              {s.value}
            </span>
            <span className="text-[11px] font-bold text-[#475569]">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded-xl"
          >
            <span className="text-[14px] font-semibold text-[#1E293B] truncate max-w-[140px]">
              {s.name}
            </span>
            <div className="flex items-center gap-1">
              {(["H", "S", "I", "A"] as Marker[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, [s.id]: m }))
                  }
                  className={`w-7 h-7 rounded-lg text-[11px] ${
                    state[s.id] === m
                      ? statusClass[m].selected
                      : `bg-white text-[#94A3B8] ${statusClass[m].hover}`
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-1 w-full py-2 bg-[#F8FAFC] hover:bg-[#FFEBEB] text-[#b71422] text-[14px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
      >
        <BadgeCheck className="size-[18px]" /> Simpan Presensi Hari Ini
      </button>
    </div>
  );
}