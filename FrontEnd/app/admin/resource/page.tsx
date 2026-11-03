"use client";

import { CloudUpload, Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { ResourceSidePanels } from "@/components/admin/resource-side-panels";
import { ResourceStats } from "@/components/admin/resource-stats";
import { ResourceTable } from "@/components/admin/resource-table";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

export default function ResourcePage() {
  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <FadeIn>
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#eef0f5] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)] xl:flex-row xl:items-center">
          <SlideIn direction="left">
            <div className="max-w-[520px]">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#4331a8]">
                <span className="rounded-full bg-[#e5deff] px-3 py-1">● SMK MATARAM • KURIKULUM MERDEKA</span>
                <span className="rounded-full bg-[#eceef3] px-3 py-1 text-[#4e566c]">T.A. 2026/2027 GANJIL • BANK MODUL DIGITAL</span>
              </div>
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[30px]">Repositori &amp; Manajemen<br className="hidden sm:block" /> Modul Pembelajaran (Resource)</h1>
              <p className="mt-2 text-[13px] leading-5 text-[#4e566c]">Pusat pengelolaan 142 modul ajar digital, bahan tayang presentasi, jobsheet praktikum lab, dan bank perangkat ajar terverifikasi waka kurikulum untuk 4 konsentrasi kejuruan.</p>
            </div>
          </SlideIn>
          <StaggerChildren staggerDelay={0.08} delayChildren={0.15} className="flex flex-wrap items-center gap-2">
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Unduh Rekap Modul (.xlsx)")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="size-4" /> Unduh Rekap (.xlsx)
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Sinkronisasi PMM")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <RefreshCw className="size-4" /> Sinkronisasi PMM
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                onClick={() => window.alert("Unggah Modul Baru")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <CloudUpload className="size-4" /> Unggah Modul Baru
              </motion.button>
            </StaggerItem>
          </StaggerChildren>
        </section>
      </FadeIn>
      <ResourceStats />
      <FadeIn>
        <ResourceTable aside={<ResourceSidePanels />} />
      </FadeIn>
    </div>
  );
}
