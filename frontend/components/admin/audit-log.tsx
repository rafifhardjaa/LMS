"use client";

import { Download, FilePen, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const auditEntries = [
  {
    icon: FilePen,
    iconClassName: "bg-amber-100 text-amber-800",
    title: "Ubah Nilai Kuis Bab 2",
    time: "10 mnt lalu",
    actor: "Drs. Bambang",
    action: " mengubah nilai ",
    target: "Dimas Wahyu",
    highlightTargetClassName: "text-[#6c5dd3]",
    detail: " (68 → 82)",
  },
  {
    icon: Scale,
    iconClassName: "bg-blue-100 text-blue-800",
    title: "Perubahan Rekap Presensi",
    time: "18 mnt lalu",
    actor: "Siti Nurhaliza",
    action: " ubah presensi ",
    target: "XI TKR",
    highlightTargetClassName: "text-[#6c5dd3]",
    detail: " (Sakit → Hadir Dispen)",
  },
  {
    icon: Download,
    iconClassName: "bg-[#e5deff] text-[#4331a8]",
    title: "Ekspor Nilai Raport Ganjil",
    time: "24 mnt lalu",
    actor: "Dr. Pawell (Waka)",
    action: " mengunduh Rekap Nilai Raport Ganjil ",
    target: "",
    highlightTargetClassName: "text-[#6c5dd3]",
    detail: "(.xlsx)",
  },
];

export function AuditLog() {
  return (
    <FadeIn>
      <div className="rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-[#181c20]">
              Audit Log Keamanan Sistem
            </h2>
            <span className="text-xs text-[#787584]">
              Perekaman real-time aktivitas kritis &amp; hak akses
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> Live Sync
          </div>
        </div>

        <StaggerChildren staggerDelay={0.1} delayChildren={0.1} className="flex flex-col gap-3">
          {auditEntries.map((entry) => (
            <StaggerItem key={entry.title}>
              <motion.div
                className="flex gap-3 p-3 rounded-xl bg-[#f1f4f9]/60"
                whileHover={{ x: 4, backgroundColor: "rgba(241,244,249,0.9)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${entry.iconClassName}`}
                >
                  <entry.icon className="size-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#181c20]">
                      {entry.title}
                    </span>
                    <span className="text-[10px] text-[#787584]">{entry.time}</span>
                  </div>
                  <p className="text-xs text-[#4e566c] mt-0.5">
                    <strong className="font-semibold text-[#181c20]">
                      {entry.actor}
                    </strong>
                    {entry.action}
                    <span className={`font-semibold ${entry.highlightTargetClassName}`}>
                      {entry.target}
                    </span>
                    {entry.detail}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </FadeIn>
  );
}
