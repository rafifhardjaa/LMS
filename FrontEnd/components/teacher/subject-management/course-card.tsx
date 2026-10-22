"use client";

import {
  ArrowRight,
  Clock,
  DoorOpen,
  MoreVertical,
  PencilLine,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StaggerItem } from "@/components/ui/animations";
import type { Course } from "./types";

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;

  return (
    <StaggerItem className="h-full">
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: "0 12px 24px -12px rgba(0,0,0,0.18)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="flex h-full flex-col justify-between rounded-2xl bg-white p-4 shadow-sm"
      >
        <div>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`flex size-11 flex-shrink-0 items-center justify-center rounded-xl ${course.iconBgClassName} ${course.iconTextClassName}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[16px] font-semibold text-[#1E293B]">
                    {course.className}
                  </span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${course.badgeClassName}`}
                  >
                    {course.badge}
                  </span>
                </div>
                <span className="block truncate text-[13px] text-[#475569]">
                  {course.subject}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Opsi ${course.subject} ${course.className}`}
              onClick={() =>
                toast.info(
                  "Menu aksi modul akan tersedia di tahap berikutnya.",
                )
              }
              className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#1E293B]"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <DoorOpen className="size-[14px]" />
              {course.room}
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-[14px]" />
              {course.weeklyHours}
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="flex items-center gap-1">
              <Users className="size-[14px]" />
              {course.students} Siswa
            </span>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
              <span className="truncate font-semibold text-[#475569]">
                {course.chapter}
              </span>
              <span
                className={`flex-shrink-0 font-bold ${course.progressTextClassName}`}
              >
                {course.progress}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F8FAFC]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${course.progressBarClassName}`}
              />
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl bg-[#F8FAFC] p-2 text-center">
            <div className="py-0.5">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Rata-Rata Nilai
              </span>
              <span className="text-[13px] font-semibold text-[#1E293B]">
                {course.average}
              </span>
            </div>
            <div className="py-0.5">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Kehadiran
              </span>
              <span className="text-[13px] font-semibold text-[#22C55E]">
                {course.attendance}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              toast.info(
                "Silabus dan modul ajar akan ditautkan ke halaman detail.",
              )
            }
            className="flex items-center gap-1 text-[13px] font-semibold text-[#b71422] transition-colors hover:text-[#db3237] hover:underline"
          >
            Buka Silabus &amp; Modul
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              toast.info("Input nilai akan dihubungkan ke modul penilaian.")
            }
            className="flex items-center gap-1 rounded-lg bg-[#F8FAFC] px-2.5 py-1.5 text-[12px] text-[#1E293B] transition-colors hover:bg-[#F1F5F9]"
          >
            <PencilLine className="size-4 text-[#006398]" />
            Input Nilai
          </button>
        </div>
      </motion.div>
    </StaggerItem>
  );
}
