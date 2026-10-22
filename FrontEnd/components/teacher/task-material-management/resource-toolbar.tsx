"use client";

import { BookOpen, ChevronDown, Search, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import {
  classOptions,
  resourceTabs,
  subjectOptions,
} from "./data";
import type {
  ClassFilter,
  ResourceTab,
  SubjectFilter,
  TabCounts,
} from "./types";

type ResourceToolbarProps = {
  activeTab: ResourceTab;
  classFilter: ClassFilter;
  subjectFilter: SubjectFilter;
  search: string;
  counts: TabCounts;
  onTabChange: (tab: ResourceTab) => void;
  onClassChange: (value: ClassFilter) => void;
  onSubjectChange: (value: SubjectFilter) => void;
  onSearchChange: (value: string) => void;
};

export function ResourceToolbar({
  activeTab,
  classFilter,
  subjectFilter,
  search,
  counts,
  onTabChange,
  onClassChange,
  onSubjectChange,
  onSearchChange,
}: ResourceToolbarProps) {
  return (
    <FadeIn delay={0.08}>
      <section className="flex flex-col items-stretch justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {resourceTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-pressed={isActive}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "bg-[#b71422] text-white shadow-sm"
                    : "bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                }`}
              >
                {tab.label} ({counts[tab.id]})
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <label className="relative flex items-center gap-1 rounded-lg bg-[#F1F5F9] py-2 pl-2.5 pr-7 text-[12px] text-[#475569]">
            <Users className="size-[16px] text-[#94A3B8]" />
            <select
              value={classFilter}
              onChange={(event) =>
                onClassChange(event.target.value as ClassFilter)
              }
              className="max-w-[104px] cursor-pointer appearance-none bg-transparent font-semibold text-[#1E293B] outline-none"
              aria-label="Filter kelas"
            >
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 size-4 text-[#94A3B8]" />
          </label>

          <label className="relative flex items-center gap-1 rounded-lg bg-[#F1F5F9] py-2 pl-2.5 pr-7 text-[12px] text-[#475569]">
            <BookOpen className="size-[16px] text-[#94A3B8]" />
            <select
              value={subjectFilter}
              onChange={(event) =>
                onSubjectChange(event.target.value as SubjectFilter)
              }
              className="max-w-[112px] cursor-pointer appearance-none bg-transparent font-semibold text-[#1E293B] outline-none"
              aria-label="Filter mata pelajaran"
            >
              {subjectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 size-4 text-[#94A3B8]" />
          </label>

          <div className="relative min-w-[180px] flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari materi, LKPD..."
              aria-label="Cari materi atau LKPD"
              className="w-full rounded-lg bg-[#F1F5F9] py-2 pl-8 pr-3 text-[12px] text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]"
            />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
