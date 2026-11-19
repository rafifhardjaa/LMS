"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ClipboardCheck,
  Clock,
  FileText,
  PencilLine,
  PlusCircle,
  Settings2,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import moment from "moment";
import { FadeIn, ScaleIn } from "@/components/ui/animations";
import type { CourseMeeting } from "@/lib/api/master-data";
import {
  ManagePertemuanPanel,
  type ManageMode,
} from "./manage-pertemuan-panel";

function formatDateLabel(date: string): string {
  return moment(date, ["DD-MM-YYYY", "YYYY-MM-DD"])
    .locale("id")
    .format("dddd, D MMMM YYYY");
}

type PertemuanStatus = "selesai" | "berlangsung" | "akan-datang";

function statusOf(date: string): PertemuanStatus {
  const meeting = moment(date, ["DD-MM-YYYY", "YYYY-MM-DD"]).startOf("day");
  const today = moment().startOf("day");
  if (meeting.isBefore(today)) return "selesai";
  if (meeting.isSame(today)) return "berlangsung";
  return "akan-datang";
}

const statusStyle: Record<PertemuanStatus, { label: string; className: string }> = {
  selesai: { label: "Selesai", className: "bg-[#F1F5F9] text-[#64748B]" },
  berlangsung: { label: "Berlangsung", className: "bg-[#EDFFF6] text-[#7A941F]" },
  "akan-datang": { label: "Akan Datang", className: "bg-[#EDF6FF] text-[#006398]" },
};

function PlaceholderBox({
  icon: Icon,
  text,
}: {
  icon: typeof FileText;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3">
      <Icon className="size-4 shrink-0 text-[#94A3B8]" />
      <p className="text-[12px] font-medium text-[#94A3B8]">{text}</p>
    </div>
  );
}

type PertemuanContentProps = {
  meeting: CourseMeeting;
  subjectId: string;
  classId: string;
  canOpenAttendance: boolean;
  meetings: CourseMeeting[];
  onMeetingsChanged: () => void;
};

export function PertemuanContent({
  meeting,
  subjectId,
  classId,
  canOpenAttendance,
  meetings,
  onMeetingsChanged,
}: PertemuanContentProps) {
  const [manageOpen, setManageOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<ManageMode | null>(null);
  const status = statusStyle[statusOf(meeting.meetingDate)];

  function openMode(mode: ManageMode) {
    setActiveMode(mode);
  }

  return (
    <div className="flex min-h-64 flex-1 flex-col gap-4">
      <section className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <FadeIn className="flex flex-col gap-2 bg-gradient-to-r from-[#b71422] to-[#8f0f1a] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-white">
              Pertemuan {meeting.meetingNumber}
            </h2>
            <p className="mt-0.5 text-[12px] font-medium text-white/80">
              {formatDateLabel(meeting.meetingDate)} · {meeting.day}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {meeting.startTime && meeting.endTime && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">
                <Clock className="size-3" />
                {`${meeting.startTime} - ${meeting.endTime}`}
              </span>
            )}
            <span
              className={`inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-bold ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-5 px-5 py-5">
          <FadeIn delay={0.1}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Materi
              </p>
              <p className="mt-1.5 text-[14px] font-semibold text-[#1E293B]">
                {meeting.title}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#475569]">
                {meeting.objective}
              </p>
              <div className="mt-3">
                <PlaceholderBox
                  icon={FileText}
                  text="Lampiran materi (integrasi menyusul)"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.16}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Tugas
              </p>
              <div className="mt-2.5 flex flex-col gap-2.5">
                <PlaceholderBox icon={FileText} text="File tugas (integrasi menyusul)" />
                <PlaceholderBox
                  icon={Upload}
                  text="Pengumpulan tugas (integrasi menyusul)"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Kuis
              </p>
              <div className="mt-2.5 flex flex-col gap-2.5">
                <PlaceholderBox icon={FileText} text="File kuis (integrasi menyusul)" />
                <PlaceholderBox
                  icon={Upload}
                  text="Pengumpulan kuis (integrasi menyusul)"
                />
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-auto flex flex-col items-start justify-between gap-3 border-t border-[#F1F5F9] px-5 py-3.5 sm:flex-row sm:items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setManageOpen((current) => !current)}
            aria-expanded={manageOpen}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] px-4 text-[12px] font-bold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422]"
          >
            <Settings2 className="size-4" />
            Manage pertemuan
            <motion.span
              animate={{ rotate: manageOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown className="size-4" />
            </motion.span>
          </motion.button>
          <div className="flex flex-wrap items-center gap-2">
            {!canOpenAttendance && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF3C7] px-2.5 py-1.5 text-[11px] font-bold text-[#D97706]">
                <TriangleAlert className="size-4" />
                Hanya bisa diakses wali kelas
              </span>
            )}
            {canOpenAttendance ? (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <Link
                  href="/teacher/presensi-siswa"
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#b71422] px-4 text-[12px] font-bold text-white transition hover:bg-[#8f0f1a]"
                >
                  <ClipboardCheck className="size-4" />
                  Buka presensi
                </Link>
              </motion.div>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-xl bg-[#b71422] px-4 text-[12px] font-bold text-white opacity-60"
              >
                <ClipboardCheck className="size-4" />
                Buka presensi
              </button>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence initial={false}>
        {manageOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[14px] font-bold text-[#1E293B]">Manage Pertemuan</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Metode Tindakan / Manajemen Data
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openMode("add")}
                className="flex items-center gap-2.5 rounded-xl border border-[#DCE5EE] bg-white px-4 py-3 text-left transition hover:border-[#b71422]/30 hover:bg-[#F8FAFC]"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EDFFF6] text-[#7A941F]">
                  <PlusCircle className="size-4" />
                </span>
                <span>
                  <span className="block text-[12px] font-bold text-[#1E293B]">
                    Tambah Baru
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[#94A3B8]">
                    Buat pertemuan baru
                  </span>
                </span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openMode("edit")}
                className="flex items-center gap-2.5 rounded-xl border border-[#DCE5EE] bg-white px-4 py-3 text-left transition hover:border-[#b71422]/30 hover:bg-[#F8FAFC]"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EDF6FF] text-[#006398]">
                  <PencilLine className="size-4" />
                </span>
                <span>
                  <span className="block text-[12px] font-bold text-[#1E293B]">
                    Perbarui
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[#94A3B8]">
                    Ubah data pertemuan
                  </span>
                </span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openMode("delete")}
                className="flex items-center gap-2.5 rounded-xl border border-[#DCE5EE] bg-white px-4 py-3 text-left transition hover:border-[#ba1a1a]/30 hover:bg-[#FFEBEB]"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFEBEB] text-[#ba1a1a]">
                  <Trash2 className="size-4" />
                </span>
                <span>
                  <span className="block text-[12px] font-bold text-[#1E293B]">
                    Hapus
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[#94A3B8]">
                    Hapus pertemuan
                  </span>
                </span>
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {activeMode && (
                <ScaleIn key={activeMode}>
                  <ManagePertemuanPanel
                    mode={activeMode}
                    subjectId={subjectId}
                    classId={classId}
                    meetings={meetings}
                    onDone={() => setActiveMode(null)}
                    onMeetingsChanged={onMeetingsChanged}
                  />
                </ScaleIn>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
