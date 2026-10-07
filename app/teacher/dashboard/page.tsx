"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { KpiCards } from "@/components/teacher/kpi-cards";
import { CourseCards } from "@/components/teacher/course-cards";
import { TaskManager } from "@/components/teacher/task-manager";
import { StudentGrades } from "@/components/teacher/student-grades";
import { QuickLinks } from "@/components/teacher/quick-links";
import { ExportCard } from "@/components/teacher/export-card";
import { Attendance } from "@/components/teacher/attendance";
import { CoursePerformance } from "@/components/teacher/course-performance";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function GuruDashboardPage() {
  return (
    <div className="w-full bg-[#EBF0F5] text-[#1E293B]">
      <div className="w-full">
        <motion.div
          className="w-full bg-white rounded-[20px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] min-h-[calc(100vh-2rem-4rem)] p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col w-full gap-6">
            {/* Teacher Status Bar & Breadcrumb Banner */}
            <FadeIn>
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F8FAFC] px-4 py-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#FFEBEB] rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-[11px] tracking-wider text-[#b71422] uppercase font-bold">
                      Sesi Aktif Guru TA 2024/2025
                    </span>
                  </div>
                  <span className="text-[#94A3B8] text-[13px] hidden lg:inline">|</span>
                  <span className="text-[#475569] text-[13px] hidden lg:inline">
                    Ruang Kendala Pengampu:{" "}
                    <strong className="text-[#1E293B] font-semibold">
                      Fisika Terapan &amp; Sains Terpadu
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#94A3B8] text-[13px]">
                    Terakhir sinkronisasi: 14:02 WIB
                  </span>
                  <motion.button
                    type="button"
                    className="px-3 py-1 bg-white hover:bg-[#FFEBEB] text-[#b71422] text-[12px] font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <RefreshCw className="size-4" />
                    Sinkronkan LMS
                  </motion.button>
                </div>
              </div>
            </FadeIn>

            {/* MAIN WORKSPACE (2-COLUMN GRID: 65% / 35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT MAIN COLUMN */}
              <SlideIn direction="left" className="lg:col-span-8 flex flex-col gap-6">
                <KpiCards />
                <CourseCards />
                <TaskManager />
                <StudentGrades />
              </SlideIn>

              {/* RIGHT SIDEBAR COLUMN */}
              <SlideIn direction="right" delay={0.1} className="lg:col-span-4 flex flex-col gap-6">
                <QuickLinks />
                <ExportCard />
                <Attendance />
                <CoursePerformance />
              </SlideIn>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
