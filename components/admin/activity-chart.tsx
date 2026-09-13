"use client";

import { useState } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

type DayBar = {
  label: string;
  fullName: string;
  info: string;
  active?: boolean;
  segs: [number, number, number];
};

const days: DayBar[] = [
  { label: "Sab", fullName: "Sabtu", info: "1,412 Siswa (87%)", segs: [24, 48, 56] },
  { label: "Min", fullName: "Minggu", info: "1,565 Siswa (91%)", segs: [16, 32, 80] },
  { label: "Sen", fullName: "Senin", info: "1,651 Siswa (93%)", segs: [32, 56, 64] },
  { label: "Sel", fullName: "Selasa", active: true, info: "1,732 Siswa (94%)", segs: [20, 64, 96] },
  { label: "Rab", fullName: "Rabu", info: "1,598 Siswa (92%)", segs: [24, 40, 72] },
  { label: "Kam", fullName: "Kamis", info: "1,487 Siswa (90%)", segs: [16, 48, 56] },
  { label: "Jum", fullName: "Jumat", info: "1,650 Siswa (93%)", segs: [24, 56, 64] },
];

const segmentColors = ["#e2e8f0", "#a39afd", "#6c5dd3"] as const;

export function ActivityChart() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <FadeIn>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#181c20]">
              Monitoring Aktivitas Sekolah Mingguan
            </h2>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <ArrowUp className="size-[13px]" /> +23.1%
            </span>
          </div>
          <button
            type="button"
            className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#4e566c] text-xs font-semibold flex items-center gap-1.5 border border-[#e0e2e7]/50"
          >
            <span>Apr 25 - Apr 29</span>
            <ChevronDown className="size-[14px]" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6c5dd3]" />
            <span className="text-[#4e566c] font-medium">Pengerjaan Tugas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a39afd]" />
            <span className="text-[#4e566c] font-medium">Presensi Mapel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]" />
            <span className="text-[#4e566c] font-medium">Konseling BK</span>
          </div>
        </div>

        <StaggerChildren
          staggerDelay={0.07}
          delayChildren={0.1}
          className="relative w-full h-52 flex items-end justify-between px-2 pt-6"
        >
          {days.map((day) => {
            const isHovered = hovered === day.label;
            return (
              <StaggerItem key={day.label}>
                <div
                  className="relative flex flex-col items-center gap-2 h-full justify-end"
                  onMouseEnter={() => setHovered(day.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {isHovered && (
                    <motion.div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#181c20] text-white text-[11px] font-bold px-2 py-1 rounded shadow-md z-20"
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      {day.fullName}: {day.info}
                    </motion.div>
                  )}

                  <motion.div
                    className={`w-7 flex flex-col rounded-md overflow-hidden ${
                      day.active ? "ring-2 ring-[#6c5dd3] ring-offset-1" : ""
                    }`}
                    whileHover={{ scaleX: 1.15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {day.segs.map((h, i) => (
                      <motion.div
                        key={i}
                        style={{ backgroundColor: segmentColors[i] }}
                        className="w-full"
                        initial={{ height: 0 }}
                        animate={{ height: h }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ))}
                  </motion.div>
                  <span
                    className={`text-[11px] font-semibold ${
                      day.active ? "text-[#6c5dd3] font-bold" : "text-[#787584]"
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </FadeIn>
  );
}
