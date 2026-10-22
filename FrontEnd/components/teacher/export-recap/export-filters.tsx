"use client";

import {
  CalendarClock,
  ChevronDown,
  FolderArchive,
} from "lucide-react";
import {
  formatFilterOptions,
  formatFileSize,
  levelOptions,
  semesterOptions,
  subjectOptions,
} from "./data";
import type {
  ExportFilters,
  ExportLevel,
  ExportSemester,
  ExportSubject,
} from "./types";

type ExportFiltersProps = {
  filters: ExportFilters;
  documentCount: number;
  totalSizeMb: number;
  onFilterChange: (patch: Partial<ExportFilters>) => void;
  onBulkDownload: () => void;
  onSchedule: () => void;
};

type FilterSelectProps = {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[8px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-transparent bg-[#F8FAFC] pl-2.5 pr-7 text-[10px] font-semibold text-[#1E293B] outline-none transition hover:bg-[#F1F5F9] focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
      </div>
    </div>
  );
}

export function ExportFilters({
  filters,
  documentCount,
  totalSizeMb,
  onFilterChange,
  onBulkDownload,
  onSchedule,
}: ExportFiltersProps) {
  const totalSizeLabel = formatFileSize(totalSizeMb);

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1.1fr_1.1fr]">
        <FilterSelect
          id="export-semester"
          label="Tahun Ajaran / Semester"
          value={filters.semester}
          options={semesterOptions}
          onChange={(value) =>
            onFilterChange({ semester: value as ExportSemester })
          }
        />
        <FilterSelect
          id="export-subject"
          label="Mata Pelajaran"
          value={filters.subject}
          options={subjectOptions}
          onChange={(value) =>
            onFilterChange({ subject: value as ExportSubject | "all" })
          }
        />
        <FilterSelect
          id="export-level"
          label="Tingkat / Rombel"
          value={filters.level}
          options={levelOptions}
          onChange={(value) =>
            onFilterChange({ level: value as ExportLevel | "all" })
          }
        />
        <FilterSelect
          id="export-format"
          label="Format Berkas"
          value={filters.format}
          options={formatFilterOptions}
          onChange={(value) =>
            onFilterChange({
              format: value as ExportFilters["format"],
            })
          }
        />
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-[#F8FAFC] p-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#b71422]" />
          <span className="text-[10px] font-bold text-[#1E293B]">
            {documentCount} Dokumen Terseleksi Siap Ekspor
          </span>
          <span className="text-[9px] text-[#94A3B8]">
            (Estimasi Total: {totalSizeLabel})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onSchedule}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-[9px] font-bold text-[#334155] shadow-[0_1px_4px_rgba(15,23,42,0.05)] transition hover:bg-[#F1F5F9]"
          >
            <CalendarClock className="size-3.5 text-[#94A3B8]" />
            Jadwalkan Ekspor Bulanan
          </button>
          <button
            type="button"
            onClick={onBulkDownload}
            disabled={documentCount === 0}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#b71422] px-3 text-[9px] font-bold text-white shadow-[0_6px_14px_-6px_rgba(183,20,34,0.7)] transition hover:bg-[#a1121f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FolderArchive className="size-3.5" />
            Unduh Semua (.zip - {totalSizeLabel})
          </button>
        </div>
      </div>
    </section>
  );
}
