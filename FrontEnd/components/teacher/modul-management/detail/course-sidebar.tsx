"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { meetings } from "./data";

type CourseSidebarProps = {
  subjectName: string;
  classLabel: string;
  majorName?: string | null;
};

export function CourseSidebar({ subjectName, classLabel, majorName }: CourseSidebarProps) {
  const [courseOpen, setCourseOpen] = useState(true);

  return (
    <aside className="max-h-[calc(100vh-13rem)] w-full shrink-0 overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-72">
      <div className="border-b border-[#F1F5F9] pb-3">
        <h2 className="text-[15px] font-bold leading-6 text-[#1E293B]">
          {subjectName} - {classLabel}
        </h2>
        {majorName && (
          <p className="mt-1 text-[11px] font-semibold text-[#94A3B8]">{majorName}</p>
        )}
      </div>

      <div className="border-b border-[#F1F5F9] py-3">
        <p className="flex items-center gap-2 text-[14px] font-bold text-[#1E293B]">
          <Users className="size-4 text-[#006398]" />
          Peserta
        </p>
        <p className="mt-1.5 pl-6 text-[11px] text-[#94A3B8]">Konten menyusul</p>
      </div>

      <div className="pt-3">
        <button
          type="button"
          onClick={() => setCourseOpen((current) => !current)}
          aria-expanded={courseOpen}
          className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left"
        >
          <span className="flex items-center gap-2 text-[14px] font-bold text-[#1E293B]">
            <BookOpen className="size-4 text-[#006398]" />
            Course
          </span>
          <ChevronDown
            className={cn(
              "size-4.5 text-[#94A3B8] transition-transform",
              courseOpen && "rotate-180",
            )}
          />
        </button>

        {courseOpen && (
          <ul className="mt-2 divide-y divide-[#E2E8F0]">
            <li className="cursor-pointer px-1 py-2.5 transition-colors hover:bg-[#F8FAFC]">
              <p className="text-[13px] font-bold text-[#1E293B]">Info pembelajaran</p>
              <p className="mt-0.5 text-[11px] text-[#94A3B8]">Konten menyusul</p>
            </li>
            {meetings.map((meeting) => (
              <li
                key={meeting.label}
                className="cursor-pointer px-1 py-2.5 transition-colors hover:bg-[#F8FAFC]"
              >
                <p className="text-[13px] font-bold text-[#1E293B]">{meeting.label}</p>
                <p className="mt-0.5 text-[11px] text-[#94A3B8]">{meeting.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
