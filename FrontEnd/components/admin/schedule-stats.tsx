"use client";

import { Calendar, Clock, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { CountUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function ScheduleStats() {
  return (
    <StaggerChildren className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerDelay={0.06}>
      <StaggerItem>
        <motion.section
          className={`${card} flex min-h-[200px] flex-col`}
          whileHover={{ y: -4, boxShadow: "0 12px 28px -4px rgba(0,0,0,0.08)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Total Sesi<br />Terjadwal</p>
            <Calendar className="size-9 rounded-2xl bg-[#f4f2ff] p-2 text-[#6c5dd3]" />
          </div>
          <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={810} /> <span className="text-base">Sesi Mingguan</span></p>
          <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]">
            <span className="rounded-full bg-[#e5deff] px-2 py-1 font-semibold text-[#4331a8]">↗ Senin - Jumat</span>
            <span className="text-right">162 Sesi / Hari</span>
          </div>
        </motion.section>
      </StaggerItem>
      <StaggerItem>
        <motion.section
          className={`${card} flex min-h-[200px] flex-col`}
          whileHover={{ y: -4, boxShadow: "0 12px 28px -4px rgba(0,0,0,0.08)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Jam Operasional<br />Harian</p>
            <Clock className="size-9 rounded-2xl bg-[#e4dfff] p-2 text-[#6c5dd3]" />
          </div>
          <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]">07:00 – 15:00</p>
          <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]">
            <span className="rounded-full bg-[#e5deff] px-2 py-1 font-semibold text-[#4331a8]">6 Sesi per Hari</span>
            <span className="text-right">Durasi 60-90 Menit</span>
          </div>
        </motion.section>
      </StaggerItem>
      <StaggerItem>
        <motion.section
          className={`${card} flex min-h-[200px] flex-col`}
          whileHover={{ y: -4, boxShadow: "0 12px 28px -4px rgba(0,0,0,0.08)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Kepatuhan &amp;<br />Integritas</p>
            <ShieldCheck className="size-9 rounded-2xl bg-[#d1fae5] p-2 text-[#047857]" />
          </div>
          <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={100} /> <span className="text-base text-[#059669] font-semibold">Valid</span></p>
          <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]">
            <span className="flex items-center gap-1 rounded-full bg-[#d1fae5] px-2 py-1 font-semibold text-[#047857]">● 0 Bentrok Ruang/Jam</span>
            <span className="text-right">0 Luar Jam</span>
          </div>
        </motion.section>
      </StaggerItem>
      <StaggerItem>
        <motion.section
          className={`${card} flex min-h-[200px] flex-col`}
          whileHover={{ y: -4, boxShadow: "0 12px 28px -4px rgba(0,0,0,0.08)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">Distribusi Rombel<br />Aktif</p>
            <Users className="size-9 rounded-2xl bg-[#e5deff] p-2 text-[#6c5dd3]" />
          </div>
          <p className="mt-1 text-[27px] font-bold leading-8 text-[#181c20]"><CountUp to={18} /> <span className="text-base">Rombel Aktif</span></p>
          <div className="mt-auto flex items-center justify-between rounded-full bg-[#f8f9fc] px-3 py-2 text-[11px] text-[#4e566c]">
            <span className="rounded-full bg-[#e5deff] px-2 py-1 font-semibold text-[#4331a8]">X • XI • XII</span>
            <span className="text-right">9 Bidang Kejuruan</span>
          </div>
        </motion.section>
      </StaggerItem>
    </StaggerChildren>
  );
}