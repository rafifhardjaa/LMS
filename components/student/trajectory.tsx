"use client";

import { Brain, Code, FunctionSquare } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

type Course = {
  name: string;
  sub: string;
  icon: typeof Code;
  iconClassName: string;
  percent: string;
  percentClassName: string;
  segments: string[];
  started: string;
  status: string;
  statusClassName: string;
};

const courses: Course[] = [
  {
    name: "Computer Science",
    sub: "Data Structures & Algorithms",
    icon: Code,
    iconClassName: "bg-[#e0f2f1] text-[#00796b]",
    percent: "72%",
    percentClassName: "bg-[#e0f2f1] text-[#00796b]",
    segments: [
      "bg-[#00796b]",
      "bg-[#00796b]",
      "bg-[#00796b]",
      "bg-[#00796b]",
      "bg-[#00796b]/25",
    ],
    started: "18/25 Lessons",
    status: "Active",
    statusClassName: "text-[#00796b]",
  },
  {
    name: "Further Mathematics",
    sub: "Differential Calculus",
    icon: FunctionSquare,
    iconClassName: "bg-[#e6f4f1] text-[#0d5c52]",
    percent: "65%",
    percentClassName: "bg-[#e6f4f1] text-[#0d5c52]",
    segments: [
      "bg-[#0d5c52]",
      "bg-[#0d5c52]",
      "bg-[#0d5c52]",
      "bg-[#0d5c52]/30",
      "bg-[#0d5c52]/20",
    ],
    started: "13/20 Lessons",
    status: "On Track",
    statusClassName: "text-[#0d5c52]",
  },
  {
    name: "AI & Applied Physics",
    sub: "Electromagnetism & Neural Nets",
    icon: Brain,
    iconClassName: "bg-[#ccfbf1] text-[#0f766e]",
    percent: "54%",
    percentClassName: "bg-[#ccfbf1] text-[#0f766e]",
    segments: [
      "bg-[#0f766e]",
      "bg-[#0f766e]",
      "bg-[#0f766e]/40",
      "bg-[#0f766e]/20",
      "bg-[#0f766e]/20",
    ],
    started: "11/20 Lessons",
    status: "Scheduled",
    statusClassName: "text-[#0f766e]",
  },
];

export function Trajectory() {
  return (
    <section className="flex flex-col gap-2">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d5c52]" />
            <span className="text-[15px] font-semibold text-[#071f1c]">
              Current Study Trajectory
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#536360]">
            Term 2 • 2024
          </span>
        </div>
      </FadeIn>

      <StaggerChildren staggerDelay={0.1} delayChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map(({ segments, status, ...c }) => (
          <StaggerItem key={c.name}>
            <motion.div
              className="bg-white rounded-xl p-4 flex flex-col justify-between border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] h-full"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -4px rgba(7,31,28,0.07)",
                borderColor: "rgba(13,92,82,0.3)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <motion.div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconClassName}`}
                    whileHover={{ rotate: -8, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <c.icon className="size-[22px]" />
                  </motion.div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${c.percentClassName}`}
                  >
                    {c.percent}
                  </span>
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-[15px] font-semibold text-[#071f1c] truncate">
                    {c.name}
                  </h3>
                  <p className="text-[12px] text-[#536360] truncate">{c.sub}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <div className="flex items-center gap-1 w-full">
                  {segments.map((cls, i) => (
                    <motion.div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${cls}`}
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[#536360] text-[11px] pt-1">
                  <span>{c.started}</span>
                  <span className={`font-medium ${c.statusClassName}`}>
                    {status}
                  </span>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
