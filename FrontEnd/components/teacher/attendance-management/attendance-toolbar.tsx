"use client";

import { ChevronDown } from "lucide-react";
import { classOptions, sessionOptions, totalStudents } from "./data";
import type {
  AttendanceCounts,
  ClassFilter,
  SessionFilter,
  StatusFilter,
} from "./types";

type AttendanceToolbarProps = {
  classFilter: ClassFilter;
  sessionFilter: SessionFilter;
  statusFilter: StatusFilter;
  counts: AttendanceCounts;
  onClassChange: (value: ClassFilter) => void;
  onSessionChange: (value: SessionFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
};

export function AttendanceToolbar({
  classFilter,
  sessionFilter,
  statusFilter,
  counts,
  onClassChange,
  onSessionChange,
  onStatusChange,
}: AttendanceToolbarProps) {
  return (
    <div className="flex flex-col gap-3 bg-gradient-to-r from-[#b71422] to-[#8f0f1a] px-4 py-4">
      <div className="flex items-center gap-2">
        <h2 className="text-[13px] font-bold text-white">
          Presensi Kelas Tatap Muka &amp; Lab Praktikum
        </h2>
        <span className="size-2 animate-pulse rounded-full bg-[#22C55E]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-white/80">
          Sinkronisasi SiManis Aktif
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <label htmlFor="attendance-class" className="sr-only">
            Pilih rombel
          </label>
          <select
            id="attendance-class"
            value={classFilter}
            onChange={(event) =>
              onClassChange(event.target.value as ClassFilter)
            }
            className="h-9 w-full appearance-none rounded-lg border border-white/20 bg-white/10 pl-3 pr-8 text-[11px] font-bold text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/30 sm:w-auto"
          >
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/70" />
        </div>

        <div className="relative">
          <label htmlFor="attendance-session" className="sr-only">
            Pilih sesi presensi
          </label>
          <select
            id="attendance-session"
            value={sessionFilter}
            onChange={(event) =>
              onSessionChange(event.target.value as SessionFilter)
            }
            className="h-9 w-full appearance-none rounded-lg border border-white/20 bg-white/10 pl-3 pr-8 text-[10px] font-semibold text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/30 sm:w-auto"
          >
            {sessionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/70" />
        </div>

        <div className="relative">
          <label htmlFor="attendance-status" className="sr-only">
            Filter status kehadiran
          </label>
          <select
            id="attendance-status"
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value as StatusFilter)
            }
            className="h-9 w-full appearance-none rounded-lg border border-white/20 bg-white/10 pl-3 pr-8 text-[10px] font-semibold text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/30 sm:w-auto"
          >
            <option value="ALL">Semua Status ({totalStudents})</option>
            <option value="HADIR">Hanya Hadir ({counts.HADIR})</option>
            <option value="SAKIT">Hanya Sakit ({counts.SAKIT})</option>
            <option value="IZIN">Hanya Izin ({counts.IZIN})</option>
            <option value="ALPA">Hanya Alpa ({counts.ALPA})</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/70" />
        </div>
      </div>
    </div>
  );
}
