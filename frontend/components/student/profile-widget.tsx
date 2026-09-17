"use client";

import { Award, Check, User } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem, CountUp, PulseDot } from "@/components/ui/animations";

const streakDays = [
  { label: "Su", state: "done" },
  { label: "Mo", state: "done" },
  { label: "Tu", state: "done" },
  { label: "We", state: "done" },
  { label: "Th", state: "done" },
  { label: "Fr", state: "today" },
  { label: "Sa", state: "upcoming" },
];

export function ProfileWidget() {
  return (
    <FadeIn>
      <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-[#0d5c52] flex items-center justify-center text-white shadow-sm ring-2 ring-[#0d5c52]/20"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <User className="size-8" />
            </motion.div>
            <PulseDot className="bg-[#14b8a6] ring-2 ring-white" wrapClassName="absolute bottom-0 right-0" size="size-4" />
          </motion.div>
          <FadeIn delay={0.1} className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-semibold text-[#071f1c] truncate">
              Sebastian
            </h3>
            <span className="text-[12px] text-[#536360] truncate">
              Grade 12 • Natural Sciences
            </span>
            <span className="text-[11px] font-semibold text-[#536360] mt-0.5">
              St. Edmund&apos;s College
            </span>
          </FadeIn>
        </div>

        {/* Student ID */}
        <motion.div
          className="flex items-center justify-between p-2 rounded-xl bg-[#edf7f4] border border-[#cee8e1]/50 text-[11px] font-semibold"
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <span className="text-[#536360]">Student ID:</span>
          <span className="font-bold text-[#071f1c] font-mono tracking-wider">
            #ST-2024-8891
          </span>
        </motion.div>

        {/* Ranking */}
        <motion.div
          className="p-2 rounded-xl bg-[#edf7f4] border border-[#cee8e1]/60 flex items-center gap-2 text-[#0d5c52]"
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, -4, 0] }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeInOut" }}
          >
            <Award className="size-6 flex-shrink-0" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#071f1c]">
              3rd Ranking Distinction
            </span>
            <span className="text-[12px] text-[#536360]">
              Top 2% Class Standing in STEM
            </span>
          </div>
        </motion.div>

        {/* Streak */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#071f1c] flex items-center gap-1">
              🔥 <CountUp to={6} duration={1.2} className="inline" /> Days
              Learning Streak
            </span>
            <motion.span
              className="text-[11px] font-bold text-[#0d5c52]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
            >
              +120 XP
            </motion.span>
          </div>
          <StaggerChildren staggerDelay={0.06} delayChildren={0.3} className="grid grid-cols-7 gap-1 pt-1">
            {streakDays.map((d) => (
              <StaggerItem key={d.label}>
                <div className="flex flex-col items-center gap-1">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      d.state === "done"
                        ? "bg-[#0d5c52] text-white"
                        : d.state === "today"
                          ? "bg-[#14b8a6] text-[#00433b] shadow-md"
                          : "bg-[#edf7f4] text-[#536360] border border-[#cee8e1]/60"
                    }`}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    {d.state === "done" ? (
                      <Check className="size-4" />
                    ) : d.state === "today" ? (
                      <Check className="size-4" />
                    ) : (
                      <span className="text-[11px]">--</span>
                    )}
                  </motion.div>
                  <span
                    className={`text-[11px] ${
                      d.state === "today"
                        ? "font-bold text-[#0d5c52]"
                        : "text-[#536360]"
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </FadeIn>
  );
}
