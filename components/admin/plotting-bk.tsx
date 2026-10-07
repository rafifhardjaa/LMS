"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const counselors = [
  {
    initials: "SN",
    avatarClassName: "bg-[#e4dfff] text-[#433995]",
    name: "Siti Nurhaliza, S.Psi",
    detail: "Konselor Tingkat X (Boga 1 & 2)",
    booking: "14 / 20 Sesi Terbooking",
    bookingClassName: "text-[#6c5dd3]",
    barClassName: "bg-[#6c5dd3]",
    widthPct: 70,
  },
  {
    initials: "BT",
    avatarClassName: "bg-[#e5deff] text-[#4331a8]",
    name: "Bagus Triyono, M.Psi",
    detail: "Konselor Tingkat XI (TKR & Otomotif)",
    booking: "9 / 20 Sesi Terbooking",
    bookingClassName: "text-emerald-700",
    barClassName: "bg-emerald-600",
    widthPct: 45,
  },
  {
    initials: "MK",
    avatarClassName: "bg-amber-100 text-amber-900",
    name: "Maya Kusuma, S.Pd",
    detail: "Bimbingan Karir & PKL XII (DKV & Perhotelan)",
    booking: "18 / 20 Sesi Terbooking",
    bookingClassName: "text-[#5b51af]",
    barClassName: "bg-[#5b51af]",
    widthPct: 90,
  },
];

export function PlottingBk() {
  return (
    <FadeIn delay={0.1}>
      <div className="rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-[#181c20]">
              Plotting Guru BK &amp; Konseling Terarah
            </h2>
            <span className="text-xs text-[#787584]">
              Alokasi pendampingan konseling siswa per rombel &amp; kuota booking
            </span>
          </div>
          <button type="button" className="text-xs font-bold text-[#6c5dd3] hover:underline">
            + Atur Plotting BK
          </button>
        </div>

        <StaggerChildren staggerDelay={0.1} delayChildren={0.1} className="flex flex-col gap-3">
          {counselors.map((c) => (
            <StaggerItem key={c.name}>
              <motion.div
                className="p-3 rounded-xl bg-[#f1f4f9]/60 flex items-center justify-between"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${c.avatarClassName}`}
                  >
                    {c.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-[#181c20]">{c.name}</span>
                    <span className="text-[10px] text-[#787584]">{c.detail}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold ${c.bookingClassName}`}>
                    {c.booking}
                  </span>
                  <div className="w-24 h-1.5 rounded-full bg-[#e0e2e7] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${c.barClassName}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.widthPct}%` }}
                      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </FadeIn>
  );
}
