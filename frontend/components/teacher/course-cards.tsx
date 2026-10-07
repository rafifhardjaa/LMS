"use client";

import { ArrowRight, Bookmark, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

type Course = {
  badge: string;
  badgeClassName: string;
  className: string;
  name: string;
  schedule: string;
};

const courses: Course[] = [
  {
    badge: "En",
    badgeClassName: "bg-[#E0F2FE] text-[#0284C7] shadow-xs",
    className: "VI - A",
    name: "English Literature",
    schedule: "08:00",
  },
  {
    badge: "🌱",
    badgeClassName: "bg-[#FEF3C7] text-[#D97706]",
    className: "VI - B",
    name: "Environmental Science",
    schedule: "09:30",
  },
  {
    badge: "➗",
    badgeClassName: "bg-[#F3E8FF] text-[#9333EA]",
    className: "VI - A",
    name: "Mathematics",
    schedule: "10:45",
  },
  {
    badge: "⚛️",
    badgeClassName: "bg-[#DCFCE7] text-[#16A34A]",
    className: "VI - B",
    name: "Science (Fisika Dasar)",
    schedule: "13:00",
  },
  {
    badge: "➗",
    badgeClassName: "bg-[#F3E8FF] text-[#9333EA]",
    className: "VII - A",
    name: "Mathematics",
    schedule: "Besok",
  },
  {
    badge: "🏛️",
    badgeClassName: "bg-[#FEE2E2] text-[#DC2626]",
    className: "VII - B",
    name: "Social Science",
    schedule: "Besok",
  },
  {
    badge: "⚛️",
    badgeClassName: "bg-[#DCFCE7] text-[#16A34A]",
    className: "VII - B",
    name: "Science (Fisika Modern)",
    schedule: "Kamis",
  },
  {
    badge: "En",
    badgeClassName: "bg-[#E0F2FE] text-[#0284C7] shadow-xs",
    className: "VII - B",
    name: "English Literature",
    schedule: "Jumat",
  },
  {
    badge: "🌱",
    badgeClassName: "bg-[#FEF3C7] text-[#D97706]",
    className: "VII - B",
    name: "Environmental Science",
    schedule: "14:15",
  },
  {
    badge: "En",
    badgeClassName: "bg-[#E0F2FE] text-[#0284C7] shadow-xs",
    className: "VIII - A",
    name: "English Literature",
    schedule: "15:30",
  },
];

export function CourseCards() {
  return (
    <FadeIn delay={0.05}>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#b71422] rounded-full" />
            <h3 className="text-[20px] font-semibold text-[#1E293B] tracking-tight">
              Rombel &amp; Mata Pelajaran Aktif (My Courses)
            </h3>
            <span className="bg-[#F8FAFC] px-2 py-0.5 text-[#94A3B8] text-[12px] font-semibold rounded-full">
              10 Kelas Aktif
            </span>
          </div>
        </div>

        <StaggerChildren staggerDelay={0.06} delayChildren={0.05} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <StaggerItem key={`${course.className}-${course.name}`}>
              <motion.div
                className="bg-[#F8FAFC] rounded-xl p-2 shadow-sm flex flex-col justify-between h-full"
                whileHover={{
                  y: -4,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 8px 20px -4px rgba(0,0,0,0.10)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center ${course.badgeClassName}`}
                  >
                    {course.badge}
                  </span>
                  <motion.div whileHover={{ scale: 1.2, color: "#b71422" }}>
                    <Bookmark className="size-[18px] text-[#94A3B8] cursor-pointer" />
                  </motion.div>
                </div>
                <div className="mt-2">
                  <h4 className="text-[14px] font-semibold text-[#1E293B]">
                    {course.className}
                  </h4>
                  <p className="text-[12px] text-[#475569] truncate">{course.name}</p>
                </div>
                <div className="mt-4 pt-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#94A3B8] flex items-center gap-1">
                    <Clock className="size-3" /> {course.schedule}
                  </span>
                  <motion.button
                    type="button"
                    className="text-[12px] font-semibold text-[#b71422] flex items-center gap-0.5"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    View Course <ChevronRight className="size-[14px]" />
                  </motion.button>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="mt-4 pt-1 flex justify-end border-t border-[#EBF0F5]">
          <motion.a
            href="#"
            className="text-[#b71422] hover:text-[#db3237] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            GO TO COURSE PAGE <ArrowRight className="size-4" />
          </motion.a>
        </div>
      </div>
    </FadeIn>
  );
}
