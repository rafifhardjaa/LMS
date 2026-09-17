"use client";

import { ArrowUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerChildren, StaggerItem, CountUp } from "@/components/ui/animations";

type InitAvatar = { text: string; className: string };

type Metric = {
  label: string;
  value: string;
  countTo: number;
  countSuffix?: string;
  countDecimals?: number;
  countLocale?: boolean;
  trend: { icon: "arrow" | "check"; text: string; className: string };
  cardClassName: string;
  footerDividerClassName: string;
  avatars: InitAvatar[];
  footerLeft: string;
  footerRight: string;
  footerRightClassName: string;
};

const metrics: Metric[] = [
  {
    label: "Total Siswa Aktif",
    value: "1,842",
    countTo: 1842,
    countLocale: true,
    trend: { icon: "arrow", text: "+12.05%", className: "bg-emerald-100 text-emerald-800" },
    cardClassName: "bg-[#f4f2ff] border-[#ebe5ff]",
    footerDividerClassName: "border-[#e2dcff]/60",
    avatars: [
      { text: "AZ", className: "bg-[#6c5dd3] text-white" },
      { text: "DW", className: "bg-[#5b51af] text-white" },
      { text: "+", className: "bg-[#c7bfff] text-[#180065]" },
    ],
    footerLeft: "SMK Mataram",
    footerRight: "Terverifikasi Dapodik",
    footerRightClassName: "text-emerald-700",
  },
  {
    label: "Kelas & Rombel SMK",
    value: "54",
    countTo: 54,
    trend: { icon: "check", text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
    cardClassName: "bg-[#fff7ed] border-[#ffeed8]",
    footerDividerClassName: "border-[#fed7aa]/50",
    avatars: [
      { text: "TB", className: "bg-amber-500 text-white" },
      { text: "TKR", className: "bg-amber-600 text-white" },
      { text: "PH", className: "bg-amber-500 text-white" },
      { text: "DKV", className: "bg-amber-300 text-amber-900" },
    ],
    footerLeft: "Tata Boga, TKR, Perhotelan, DKV",
    footerRight: "4 Kejuruan Aktif",
    footerRightClassName: "text-amber-800",
  },
  {
    label: "Plotting Guru & Mapel",
    value: "35",
    countTo: 35,
    trend: { icon: "arrow", text: "100%", className: "bg-emerald-100 text-emerald-800" },
    cardClassName: "bg-[#eff6ff] border-[#dbeafe]",
    footerDividerClassName: "border-[#bfdbfe]/50",
    avatars: [
      { text: "BS", className: "bg-blue-500 text-white" },
      { text: "+", className: "bg-blue-300 text-blue-900" },
    ],
    footerLeft: "35 Mapel Aktif",
    footerRight: "35 Guru Mapel Terdistribusi",
    footerRightClassName: "text-blue-700",
  },
  {
    label: "Kehadiran & Tugas Harian",
    value: "97.4%",
    countTo: 97.4,
    countSuffix: "%",
    countDecimals: 1,
    trend: { icon: "arrow", text: "+2.1%", className: "bg-emerald-100 text-emerald-800" },
    cardClassName: "bg-[#ecfdf5] border-[#d1fae5]",
    footerDividerClassName: "border-[#a7f3d0]/50",
    avatars: [
      { text: "✓", className: "bg-emerald-600 text-white" },
      { text: "%", className: "bg-emerald-300 text-emerald-900" },
    ],
    footerLeft: "Kehadiran Rata-rata",
    footerRight: "88.6% Tuntas Jobsheet",
    footerRightClassName: "text-emerald-700",
  },
];

export function MetricCards() {
  return (
    <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {metrics.map((m) => (
        <StaggerItem key={m.label}>
          <motion.div
            className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between gap-3 h-full ${m.cardClassName}`}
            whileHover={{ y: -4, boxShadow: "0 8px 24px -4px rgba(0,0,0,0.10)" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#4e566c] font-semibold">{m.label}</span>
              <div className="flex items-center -space-x-1.5">
                {m.avatars.map((a, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white ${a.className}`}
                  >
                    {a.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[28px] font-bold text-[#181c20] tracking-tight leading-none">
                <CountUp
                  to={m.countTo}
                  suffix={m.countSuffix}
                  decimals={m.countDecimals ?? 0}
                  locale={m.countLocale}
                  duration={1.4}
                />
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${m.trend.className}`}
              >
                {m.trend.icon === "arrow" ? (
                  <ArrowUp className="size-[13px]" />
                ) : (
                  <CheckCircle2 className="size-[13px]" />
                )}
                {m.trend.text}
              </span>
            </div>
            <div className={`text-[11px] text-[#4e566c] font-medium pt-1 border-t ${m.footerDividerClassName} flex items-center justify-between`}>
              <span>{m.footerLeft}</span>
              <span className={`font-semibold ${m.footerRightClassName}`}>{m.footerRight}</span>
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
