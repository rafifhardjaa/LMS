"use client";

import { ShieldCheck, TrendingUp } from "lucide-react";

const metrics = {
  overallProgress: 68,
  completedModules: 8,
  totalModules: 12,
  quizzesCompleted: 6,
  attendance: 92,
};

export function AcademicMetrics() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-start gap-3">
        <TrendingUp className="size-5 text-[#0d5c52]" />
        <div>
          <h3 className="text-sm font-semibold text-[#071f1c]">Ringkasan Akademik</h3>
          <p className="text-xs text-[#536360]">Data pratinjau</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs text-[#536360]">Progress Akademik</h4>
          <div className="mt-2">
            <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0d5c52] to-[#14b8a6]"
                style={{ width: `${metrics.overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#536360] mt-1">{metrics.overallProgress}%</p>
          </div>
        </div>
        <div>
          <h4 className="text-xs text-[#536360]">Modul Dikerjakan</h4>
          <p className="mt-1 text-sm">
            {metrics.completedModules}/{metrics.totalModules}
          </p>
        </div>
        <div>
          <h4 className="text-xs text-[#536360]">Kuis Dikerjakan</h4>
          <p className="mt-1 text-sm">{metrics.quizzesCompleted} kuis</p>
        </div>
        <div>
          <h4 className="text-xs text-[#536360]">Absensi</h4>
          <p className="mt-1 text-sm">{metrics.attendance}%</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="bg-[#f0fdf4] rounded-xl p-3 flex items-center gap-2">
          <ShieldCheck className="size-4 text-[#16a34a]" />
          <span className="text-xs text-[#052e16]">Dapodik Valid</span>
        </div>
        <div className="bg-[#edf7f4] rounded-xl p-3 flex items-center gap-2">
          <TrendingUp className="size-4 text-[#0d5c52]" />
          <span className="text-xs text-[#071f1c]">Aktif</span>
        </div>
      </div>
    </div>
  );
}
