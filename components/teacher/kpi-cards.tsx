"use client";

import { CalendarClock, Puzzle, Video } from "lucide-react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerChildren, StaggerItem, CountUp } from "@/components/ui/animations";

export function KpiCards() {
  return (
    <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative">
      {/* My Courses */}
      <StaggerItem>
        <motion.div
          className="relative bg-white border-2 border-[#FFB3B3] rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-all group cursor-pointer"
          whileHover={{ y: -5, boxShadow: "0 12px 28px -4px rgba(183,20,34,0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                My Courses
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#b71422] tracking-tight">
                  <CountUp to={10} duration={1.2} />
                </span>
                <span className="text-[11px] font-bold text-[#b71422] tracking-wide uppercase">
                  Active
                </span>
              </div>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#FFEBEB] flex items-center justify-center text-[#b71422]"
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <Video className="size-6" />
            </motion.div>
          </div>
          <div className="absolute -bottom-2.5 left-10 w-4 h-4 bg-white border-r-2 border-b-2 border-[#FFB3B3] rotate-45 shadow-xs" />
        </motion.div>
      </StaggerItem>

      {/* Homework */}
      <StaggerItem>
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          whileHover={{ y: -5, boxShadow: "0 12px 28px -4px rgba(0,99,152,0.12)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                Homework
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#006398] tracking-tight">
                  <CountUp to={13} duration={1.2} />
                </span>
                <span className="text-[11px] font-bold text-[#006398] tracking-wide uppercase">
                  Due Today
                </span>
              </div>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#006398]"
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <BookOpen className="size-6" />
            </motion.div>
          </div>
        </motion.div>
      </StaggerItem>

      {/* Timetable */}
      <StaggerItem>
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          whileHover={{ y: -5, boxShadow: "0 12px 28px -4px rgba(22,163,74,0.12)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                Timetable
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#16A34A] tracking-tight">
                  <CountUp to={7} duration={1.2} />
                </span>
                <span className="text-[11px] font-bold text-[#16A34A] tracking-wide uppercase">
                  Today
                </span>
              </div>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]"
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <CalendarClock className="size-6" />
            </motion.div>
          </div>
        </motion.div>
      </StaggerItem>

      {/* Q&A Activity */}
      <StaggerItem>
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          whileHover={{ y: -5, boxShadow: "0 12px 28px -4px rgba(147,51,234,0.12)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                Q&amp;A Activity
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold text-[#9333EA] tracking-tight">
                  <CountUp to={17} duration={1.2} />
                </span>
                <span className="text-[11px] font-bold text-[#9333EA] tracking-wide uppercase">
                  New Posts
                </span>
              </div>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-[#9333EA]"
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <Puzzle className="size-6" />
            </motion.div>
          </div>
        </motion.div>
      </StaggerItem>
    </StaggerChildren>
  );
}
