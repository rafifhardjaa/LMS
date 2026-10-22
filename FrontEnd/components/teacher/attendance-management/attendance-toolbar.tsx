"use client";

import {
  ChevronDown,
  ListChecks,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  classOptions,
  sessionOptions,
  statusLabels,
  totalStudents,
} from "./data";
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
  search: string;
  counts: AttendanceCounts;
  visibleCount: number;
  filteredCount: number;
  isLocked: boolean;
  onClassChange: (value: ClassFilter) => void;
  onSessionChange: (value: SessionFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSearchChange: (value: string) => void;
  onMarkAllPresent: () => void;
};

export function AttendanceToolbar({
  classFilter,
  sessionFilter,
  statusFilter,
  search,
  counts,
  visibleCount,
  filteredCount,
  isLocked,
  onClassChange,
  onSessionChange,
  onStatusChange,
  onSearchChange,
  onMarkAllPresent,
}: AttendanceToolbarProps) {
  const isFiltering = Boolean(search.trim()) || statusFilter !== "ALL";

  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
              className="h-9 w-full appearance-none rounded-lg border border-transparent bg-[#F1F5F9] pl-3 pr-8 text-[11px] font-bold text-[#1E293B] outline-none transition focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40 sm:w-auto"
            >
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
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
              className="h-9 w-full appearance-none rounded-lg border border-transparent bg-[#F1F5F9] pl-3 pr-8 text-[10px] font-semibold text-[#334155] outline-none transition focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40 sm:w-auto"
            >
              {sessionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
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
              className="h-9 w-full appearance-none rounded-lg border border-transparent bg-[#F1F5F9] pl-3 pr-8 text-[10px] font-semibold text-[#334155] outline-none transition focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40 sm:w-auto"
            >
              <option value="ALL">Semua Status ({totalStudents})</option>
              <option value="HADIR">Hanya Hadir ({counts.HADIR})</option>
              <option value="SAKIT">Hanya Sakit ({counts.SAKIT})</option>
              <option value="IZIN">Hanya Izin ({counts.IZIN})</option>
              <option value="ALPA">Hanya Alpa ({counts.ALPA})</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
          </div>
        </div>

        <button
          type="button"
          onClick={onMarkAllPresent}
          disabled={isLocked}
          title={
            isLocked
              ? "Presensi sudah difinalisasi"
              : "Tandai seluruh siswa hadir"
          }
          className={cn(
            "flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-[10px] font-bold transition",
            isLocked
              ? "cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]"
              : "bg-[#FFEBEB] text-[#b71422] hover:bg-[#b71422] hover:text-white",
          )}
        >
          <ListChecks className="size-4" />
          Tandai Semua Hadir
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
        <label htmlFor="attendance-search" className="sr-only">
          Cari siswa
        </label>
        <input
          id="attendance-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama siswa atau NISN (contoh: Sarah, 00792014)..."
          className="h-9 w-full rounded-lg border border-transparent bg-[#F1F5F9] pl-9 pr-[168px] text-[11px] font-medium text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40 [&::-webkit-search-cancel-button]:hidden"
        />
        {search && (
          <button
            type="button"
            aria-label="Hapus pencarian"
            onClick={() => onSearchChange("")}
            className="absolute right-[162px] top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#E2E8F0] text-[#64748B] transition hover:bg-[#CBD5E1]"
          >
            <X className="size-3" />
          </button>
        )}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-[0.04em] text-[#94A3B8]">
          {isFiltering
            ? `Menemukan ${filteredCount} siswa`
            : `Menampilkan ${visibleCount} dari ${totalStudents} siswa aktif`}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[9px] font-semibold text-[#94A3B8]">
        {(["HADIR", "SAKIT", "IZIN", "ALPA"] as const).map((status) => (
          <span key={status} className="inline-flex items-center gap-1">
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "HADIR" && "bg-[#16A34A]",
                status === "SAKIT" && "bg-[#D97706]",
                status === "IZIN" && "bg-[#0284C7]",
                status === "ALPA" && "bg-[#DC2626]",
              )}
            />
            {statusLabels[status]}
          </span>
        ))}
        {isLocked && (
          <span className="ml-auto rounded-full bg-[#FEF3C7] px-2 py-1 text-[9px] font-bold text-[#D97706]">
            Sesi terkunci
          </span>
        )}
      </div>
    </div>
  );
}
