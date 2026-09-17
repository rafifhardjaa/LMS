"use client";

import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem, CountUp } from "@/components/ui/animations";
import { useRef } from "react";
import { useInView } from "framer-motion";

const gradeRows = [
  {
    name: "Computer Science",
    dotClassName: "bg-[#00796b]",
    score: "94/100",
    scoreTo: 94,
    grade: "A",
    gradeClassName: "bg-[#e0f2f1] text-[#00796b]",
  },
  {
    name: "Further Mathematics",
    dotClassName: "bg-[#0d5c52]",
    score: "89/100",
    scoreTo: 89,
    grade: "A-",
    gradeClassName: "bg-[#e6f4f1] text-[#0d5c52]",
  },
  {
    name: "Applied Physics",
    dotClassName: "bg-[#0f766e]",
    score: "84/100",
    scoreTo: 84,
    grade: "B+",
    gradeClassName: "bg-[#ccfbf1] text-[#0f766e]",
  },
];

function AttendanceGauge() {
  const ref = useRef<SVGPathElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  return (
    <div className="p-2 rounded-xl bg-[#edf7f4]/70 border border-[#cee8e1]/50 flex flex-col items-center text-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#cee8e1"
            strokeWidth="3.5"
            strokeOpacity="0.7"
          />
          <motion.path
            ref={ref}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#0d5c52"
            strokeDasharray="96.5, 100"
            strokeLinecap="round"
            strokeWidth="3.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 0.965, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-[15px] font-bold text-[#071f1c]">
          96%
        </span>
      </div>
      <span className="text-[11px] font-semibold text-[#071f1c] mt-1">
        96.5% Attendance
      </span>
      <span className="text-[10px] text-[#0d5c52] font-medium">
        Excellent Standing
      </span>
    </div>
  );
}

export function AcademicMetrics() {
  return (
    <FadeIn delay={0.1}>
      <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#071f1c]">
            Academic Metrics
          </h3>
          <span className="px-2 py-0.5 rounded bg-[#e2f2ee] text-[#0d5c52] text-[11px] font-bold">
            2023/24 S1
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          {/* Attendance gauge */}
          <AttendanceGauge />

          {/* GPA */}
          <motion.div
            className="p-2 rounded-xl bg-[#edf7f4]/70 border border-[#cee8e1]/50 flex flex-col items-center justify-center text-center h-full"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-[32px] font-extrabold text-[#0d5c52] leading-tight">
              <CountUp to={3.88} decimals={2} duration={1.5} />
            </span>
            <span className="text-[11px] font-semibold text-[#536360]">
              Cumulative GPA
            </span>
            <span className="text-[10px] text-[#536360] mt-0.5">
              Scale: 4.00
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-[#536360] uppercase tracking-wider">
            Course Performance
          </span>
          <StaggerChildren staggerDelay={0.08} delayChildren={0.1} className="flex flex-col gap-1.5">
            {gradeRows.map((r) => (
              <StaggerItem key={r.name}>
                <motion.div
                  className="flex items-center justify-between p-2 rounded-lg bg-[#edf7f4]/60 border border-[#cee8e1]/40"
                  whileHover={{ x: 3, backgroundColor: "rgba(237,247,244,0.9)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${r.dotClassName}`} />
                    <span className="text-[14px] font-semibold text-[#071f1c]">
                      {r.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-[#536360]">
                      {r.score}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${r.gradeClassName}`}
                    >
                      {r.grade}
                    </span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        <motion.button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#0d5c52] text-white hover:bg-[#00433b] text-[13px] font-semibold shadow-[0_4px_16px_rgba(13,92,82,0.25)] transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="size-[18px]" />
          Export Official Transcript (PDF)
        </motion.button>
      </div>
    </FadeIn>
  );
}
