"use client";

import { Search } from "lucide-react";
import {
  FadeIn,
  StaggerChildren,
} from "@/components/ui/animations";
import { CourseCard } from "./course-card";
import type { Course } from "./types";

type CourseGridProps = {
  courses: Course[];
  filterKey: string;
  onReset: () => void;
};

export function CourseGrid({ courses, filterKey, onReset }: CourseGridProps) {
  if (courses.length > 0) {
    return (
      <StaggerChildren
        key={filterKey}
        staggerDelay={0.05}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </StaggerChildren>
    );
  }

  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#FFEBEB] text-[#b71422]">
          <Search className="size-6" />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-[#1E293B]">
            Tidak ada rombel yang cocok
          </h3>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Ubah filter tingkat, status, atau kata kunci pencarian.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="mt-1 rounded-lg bg-[#FFEBEB] px-4 py-2 text-[13px] font-semibold text-[#b71422] transition-colors hover:bg-[#FFDADA]"
        >
          Reset Filter
        </button>
      </div>
    </FadeIn>
  );
}
