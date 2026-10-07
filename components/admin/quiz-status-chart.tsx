"use client";

import { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/animations";

export function QuizStatusChart() {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeIn delay={0.1}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Status Pengerjaan Kuis &amp; Tugas Harian
            </h2>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <TrendingUp className="size-[13px]" /> 92.4%
            </span>
          </div>
          <button
            type="button"
            className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold flex items-center gap-1.5 border border-[#e0e2e7]/50"
          >
            <span>Minggu Ini</span>
            <ChevronDown className="size-[14px]" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6c5dd3]" />
            <span className="text-[#4e566c] font-medium">Tuntas KKM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-[#4e566c] font-medium">Remedial / Belum Kumpul</span>
          </div>
        </div>

        <div
          className="relative w-full h-52 flex flex-col justify-end"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && (
            <motion.div
              className="absolute left-1/4 top-3 bg-[#6c5dd3] text-white text-[11px] px-2.5 py-1 rounded-lg shadow-md z-10 flex flex-col gap-0.5"
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <span className="font-bold">Senin - Evaluasi Rombel</span>
              <span>Tuntas: 1,698 / Remedial: 144</span>
            </motion.div>
          )}

          <svg viewBox="0 0 400 130" className="w-full h-36 overflow-visible cursor-pointer">
            <defs>
              <linearGradient id="curveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6c5dd3" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6c5dd3" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 100 Q 50 10 100 20 T 200 60 T 300 30 T 400 50 L 400 130 L 0 130 Z"
              fill="url(#curveFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.path
              d="M 0 100 Q 50 10 100 20 T 200 60 T 300 30 T 400 50"
              fill="none"
              stroke="#6c5dd3"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
            />
            <motion.circle
              cx="100"
              cy="20"
              r="5"
              fill="#6c5dd3"
              stroke="#ffffff"
              strokeWidth="2.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.9, type: "spring" }}
            />
          </svg>

          <div className="flex items-center justify-between text-[11px] font-semibold px-2 pt-2 border-t border-[#eceef3]">
            <span className="text-[#787584]">Sab</span>
            <span className="text-[#6c5dd3] font-bold">Min</span>
            <span className="text-[#787584]">Sen</span>
            <span className="text-[#787584]">Sel</span>
            <span className="text-[#787584]">Rab</span>
            <span className="text-[#787584]">Kam</span>
            <span className="text-[#787584]">Jum</span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
