"use client";

import { BookOpen, CheckCircle, GraduationCap } from "lucide-react";

const trajectory = {
  rank: "3 dari 32",
  gpa: "3,78",
  completed: 8,
  total: 12,
  progress: 67,
};

export function Trajectory() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-center gap-4">
        <GraduationCap className="size-6 text-[#0d5c52]" />
        <div>
          <h3 className="text-sm font-medium text-[#071f1c]">Trajectory Akademik</h3>
          <p className="text-xs text-[#536360]">
            Peringkat {trajectory.rank} • IPK {trajectory.gpa}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0d5c52] to-[#14b8a6]"
            style={{ width: `${trajectory.progress}%` }}
          />
        </div>
        <p className="text-xs text-[#536360] mt-1">
          {trajectory.completed}/{trajectory.total} modul selesai ({trajectory.progress}%)
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <CheckCircle className="size-4 text-[#10b981]" />
        <span className="text-xs text-[#536360]">Proses belajar berjalan sesuai rencana</span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#787584]">
        <BookOpen className="size-3.5" />
        Data pratinjau
      </div>
    </div>
  );
}
