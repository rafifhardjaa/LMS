"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  CloudCheck,
  FileText,
  Files,
} from "lucide-react";

type ExportSummaryGridProps = {
  lastSyncLabel: string;
};

const cardClassName =
  "relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]";

export function ExportSummaryGrid({
  lastSyncLabel,
}: ExportSummaryGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={cardClassName}
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-[#b71422]" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
              Total Ledger Siap Unduh
            </span>
            <span className="mt-1 text-[26px] font-bold leading-none tracking-[-0.02em] text-[#1E293B]">
              10 Rombel
            </span>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <FileText className="size-5" />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <span className="text-[#94A3B8]">Fisika &amp; Informatika</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[9px] font-bold text-[#16A34A]">
            <span className="size-1.5 rounded-full bg-[#22C55E]" />
            Fase E &amp; F 100%
          </span>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className={cardClassName}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
              Presensi Terverifikasi
            </span>
            <span className="mt-1 text-[26px] font-bold leading-none tracking-[-0.02em] text-[#1E293B]">
              96.4%
            </span>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#16A34A]">
            <CheckCircle2 className="size-5" />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <span className="text-[#94A3B8]">Semester Genap</span>
          <span className="font-semibold text-[#1E293B]">348 Siswa Sinkron</span>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className={cardClassName}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
              Format Tersedia
            </span>
            <span className="mt-1 text-[26px] font-bold leading-none tracking-[-0.02em] text-[#1E293B]">
              4 Format
            </span>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
            <Files className="size-5" />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-1 text-[10px] text-[#94A3B8]">
          {[".XLSX", ".PDF", ".CSV", ".ZIP"].map((format) => (
            <span
              key={format}
              className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#1E293B]"
            >
              {format}
            </span>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className={cardClassName}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
              Status Sinkron Dapodik
            </span>
            <span className="mt-1 text-[20px] font-semibold leading-tight tracking-[-0.01em] text-[#1E293B]">
              Terverifikasi
            </span>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#9333EA]">
            <CloudCheck className="size-5" />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <span className="text-[#94A3B8]">{lastSyncLabel}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#22C55E]" />0
            Anomali Data
          </span>
        </div>
      </motion.article>
    </div>
  );
}
