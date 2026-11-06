"use client";

import { CalendarCheck2, CalendarPlus, Download } from "lucide-react";
import { motion } from "framer-motion";
import { ScheduleSidePanels } from "@/components/admin/schedule-side-panels";
import { ScheduleStats } from "@/components/admin/schedule-stats";
import { ScheduleTable } from "@/components/admin/schedule-table";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

export default function SchedulePage() {
  return (
    <div className="flex w-full flex-col gap-4 pt-2">
      <FadeIn>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-[#eceef3] px-3 py-1 text-[#4e566c]">● SMK MATARAM • TIMETABLE KURIKULUM MERDEKA</span>
        </div>
        <section className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#eef0f5] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(32,44,90,0.04)] xl:flex-row xl:items-center xl:justify-between xl:gap-6">
          <SlideIn direction="left" className="flex min-w-0 flex-1 items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4f2ff]"><CalendarCheck2 className="size-5 text-[#6c5dd3]" /></span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold leading-snug tracking-tight text-[#181c20] sm:text-2xl">Manajemen Jadwal Pelajaran &amp; Sesi Belajar</h1>              </div>
              <p className="mt-1.5 max-w-[620px] text-xs leading-5 text-[#4e566c]">Pusat pengelolaan distribusi jadwal 810 sesi pembelajaran mingguan SMK Mataram (Senin-Jumat, Sesi 1-6 / 07:00-15:00) terverifikasi bebas bentrok.</p>
            </div>
          </SlideIn>
          <StaggerChildren staggerDelay={0.08} delayChildren={0.15} className="flex shrink-0 flex-wrap items-center gap-2">
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Export Jadwal (.xlsx/.pdf)")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="size-4" /> Export Jadwal (.xlsx/.pdf)
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Tambah Sesi Jadwal")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <CalendarPlus className="size-4" /> + Tambah Sesi Jadwal
              </motion.button>
            </StaggerItem>
          </StaggerChildren>
        </section>
      </FadeIn>
      <ScheduleStats />
      <FadeIn>
        <ScheduleTable aside={<ScheduleSidePanels />} />
      </FadeIn>
    </div>
  );
}