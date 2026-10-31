"use client";

import { ChevronDown, Search } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { categoryTabs } from "./data";
import type {
  CategoryCounts,
  CategoryTab,
  LevelFilter,
  StatusFilter,
} from "./types";

type SubjectFiltersProps = {
  activeTab: CategoryTab;
  levelFilter: LevelFilter;
  statusFilter: StatusFilter;
  search: string;
  categoryCounts: CategoryCounts;
  onTabChange: (tab: CategoryTab) => void;
  onLevelChange: (level: LevelFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (value: string) => void;
};

export function SubjectFilters({
  activeTab,
  levelFilter,
  statusFilter,
  search,
  categoryCounts,
  onTabChange,
  onLevelChange,
  onStatusChange,
  onSearchChange,
}: SubjectFiltersProps) {
  return (
    <FadeIn delay={0.08}>
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex w-full items-center gap-1 overflow-x-auto pb-1 lg:w-auto lg:pb-0">
            {categoryTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  aria-pressed={isActive}
                  className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                    isActive
                      ? "bg-[#FFEBEB] text-[#b71422] shadow-sm"
                      : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  }`}
                >
                  {tab.label}
                  {tab.id !== "arsip" && ` (${categoryCounts[tab.id]})`}
                </button>
              );
            })}
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:flex-nowrap lg:w-auto">
            <label className="relative flex items-center gap-1 rounded-lg bg-[#F8FAFC] py-1.5 pl-2.5 pr-7 text-[12px] text-[#475569]">
              <span className="text-[#94A3B8]">Tingkat:</span>
              <select
                value={levelFilter}
                onChange={(event) =>
                  onLevelChange(event.target.value as LevelFilter)
                }
                className="max-w-[86px] cursor-pointer appearance-none bg-transparent font-semibold text-[#1E293B] outline-none"
                aria-label="Filter tingkat kelas"
              >
                <option value="all">Semua</option>
                <option value="VI">Kelas VI</option>
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 size-4 text-[#94A3B8]" />
            </label>

            <label className="relative flex items-center gap-1 rounded-lg bg-[#F8FAFC] py-1.5 pl-2.5 pr-7 text-[12px] text-[#475569]">
              <span className="text-[#94A3B8]">Status:</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  onStatusChange(event.target.value as StatusFilter)
                }
                className="max-w-[92px] cursor-pointer appearance-none bg-transparent font-semibold text-[#1E293B] outline-none"
                aria-label="Filter status rombel"
              >
                <option value="all">Semua</option>
                <option value="lengkap">Lengkap</option>
                <option value="remedial">Remedial</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 size-4 text-[#94A3B8]" />
            </label>

            <div className="relative min-w-[180px] flex-1 sm:w-60">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari modul atau topik..."
                aria-label="Cari modul atau topik"
                className="w-full rounded-lg bg-[#F8FAFC] py-1.5 pl-8 pr-3 text-[12px] text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]"
              />
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
