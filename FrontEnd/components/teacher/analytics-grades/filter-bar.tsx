"use client";

import {
  ChevronDown,
  Flag,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { assessmentOptions, classOptions, kktp } from "./data";
import type { AssessmentFilter, ClassFilter } from "./types";

type AnalyticsFilterBarProps = {
  classFilter: ClassFilter;
  assessmentFilter: AssessmentFilter;
  search: string;
  onClassChange: (value: ClassFilter) => void;
  onAssessmentChange: (value: AssessmentFilter) => void;
  onSearchChange: (value: string) => void;
};

export function AnalyticsFilterBar({
  classFilter,
  assessmentFilter,
  search,
  onClassChange,
  onAssessmentChange,
  onSearchChange,
}: AnalyticsFilterBarProps) {
  return (
    <div className="grid gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] sm:grid-cols-2 xl:grid-cols-[1.05fr_1.25fr_auto_1fr]">
      <div className="relative">
        <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
        <label htmlFor="analytics-class" className="sr-only">
          Pilih kelas
        </label>
        <select
          id="analytics-class"
          value={classFilter}
          onChange={(event) =>
            onClassChange(event.target.value as ClassFilter)
          }
          className="h-10 w-full appearance-none rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] pl-9 pr-8 text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
        >
          {classOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#64748B]" />
      </div>

      <div className="relative">
        <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
        <label htmlFor="analytics-assessment" className="sr-only">
          Jenis asesmen
        </label>
        <select
          id="analytics-assessment"
          value={assessmentFilter}
          onChange={(event) =>
            onAssessmentChange(event.target.value as AssessmentFilter)
          }
          className="h-10 w-full appearance-none rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] pl-9 pr-8 text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
        >
          {assessmentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#64748B]" />
      </div>

      <div className="flex h-10 items-center gap-2 rounded-xl border border-[#E8D5D4] bg-[#FFF8F8] px-3">
        <Flag className="size-4 text-[#b71422]" />
        <span className="whitespace-nowrap text-xs font-medium text-[#64748B]">
          Target:{" "}
          <span className="font-bold text-[#b71422]">
            KKTP {kktp.toFixed(1)}
          </span>
        </span>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
        <label htmlFor="analytics-search" className="sr-only">
          Cari siswa
        </label>
        <input
          id="analytics-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama atau NISN siswa..."
          className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] pl-9 pr-9 text-xs font-medium text-[#334155] outline-none transition placeholder:text-[#94A3B8] focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10 [&::-webkit-search-cancel-button]:hidden"
        />
        {search && (
          <button
            type="button"
            aria-label="Hapus pencarian"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#E2E8F0] text-[#64748B] transition hover:bg-[#CBD5E1]"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}
