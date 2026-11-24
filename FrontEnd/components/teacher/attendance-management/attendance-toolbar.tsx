"use client";

import { ArrowRight, ClipboardCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchableDropdown } from "@/components/admin/searchable-dropdown";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";
import type { AttendanceDate } from "@/lib/api/master-data";
import type { AttendanceCounts } from "./types";

export type DropdownOption = { value: string; label: string };

type AttendanceToolbarProps = {
  classOptions: DropdownOption[];
  dateOptions: DropdownOption[];
  classFilter: string;
  dateFilter: string;
  opened: boolean;
  closesAt?: string | null;
  canOpen: boolean;
  counts: AttendanceCounts;
  studentCount: number;
  selectedClassLabel: string;
  selectedDate: AttendanceDate | null;
  onClassChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onOpenSession: () => void;
};

export function AttendanceToolbar({
  classOptions,
  dateOptions,
  classFilter,
  dateFilter,
  opened,
  closesAt,
  canOpen,
  counts,
  studentCount,
  selectedClassLabel,
  selectedDate,
  onClassChange,
  onDateChange,
  onOpenSession,
}: AttendanceToolbarProps) {
  const isReady = Boolean(classFilter && dateFilter);
  const summaryItems: { label: string; value: number; dot: string }[] = [
    { label: "Hadir", value: counts.hadir, dot: "bg-[#22C55E]" },
    { label: "Sakit", value: counts.sakit, dot: "bg-[#F59E0B]" },
    { label: "Izin", value: counts.izin, dot: "bg-[#38BDF8]" },
    { label: "Alpa", value: counts.alpa, dot: "bg-[#EF4444]" },
  ];
  const subjectNames = (selectedDate?.subjects ?? [])
    .map((subject) => subject.name)
    .join(", ");

  return (
    <div className="flex flex-col gap-3 bg-gradient-to-r from-[#b71422] to-[#8f0f1a] px-4 py-4">
      <div className="flex items-center gap-2">
        <h2 className="text-[13px] font-bold text-white">
          Presensi Kelas Tatap Muka &amp; Lab Praktikum
        </h2>
        <span className="size-2 animate-pulse rounded-full bg-[#22C55E]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-white/80">
          Sinkronisasi SiManis Aktif
        </span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        <div className="flex w-full flex-col gap-3 lg:min-w-0 lg:flex-1">
          <StaggerChildren
            className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-full"
            staggerDelay={0.08}
            delayChildren={0.05}
          >
            <StaggerItem key="class">
              <SearchableDropdown
                id="attendance-class"
                value={classFilter}
                options={classOptions}
                label="Pilih kelas"
                searchPlaceholder="Cari kelas..."
                emptyMessage="Kelas tidak ditemukan."
                variant="ghost"
                onChange={onClassChange}
              />
            </StaggerItem>
            <StaggerItem key="date">
              <SearchableDropdown
                id="attendance-date"
                value={dateFilter}
                options={dateOptions}
                label="Pilih tanggal presensi"
                searchPlaceholder="Cari tanggal..."
                emptyMessage="Tanggal tidak ditemukan."
                variant="ghost"
                onChange={onDateChange}
              />
            </StaggerItem>
          </StaggerChildren>

          <AnimatePresence>
            {isReady && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="w-full rounded-xl border border-white/15 bg-white/10 p-3 lg:w-full"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-white/70">
                  Kondisi Kehadiran Siswa
                </p>
                <StaggerChildren className="mt-2 grid grid-cols-4 gap-2" staggerDelay={0.06}>
                  {summaryItems.map((item) => (
                    <StaggerItem key={item.label}>
                      <div className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-center">
                        <p className="flex items-center justify-center gap-1 text-[9px] font-semibold text-white/75">
                          <span className={item.dot + " size-1.5 rounded-full"} />
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-[13px] font-bold leading-none text-white">
                          {item.value}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
                <p className="mt-2 text-[10px] leading-4 text-white/70">
                  Pilih tanggal, lalu klik Buka presensi untuk menampilkan daftar
                  siswa.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isReady && (
            <motion.div
              key="callout"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="hidden flex-col items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 p-4 text-center lg:flex lg:w-[240px] lg:shrink-0 xl:w-[320px]"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-white/15 text-white">
                <ClipboardCheck className="size-7" />
              </span>
              <div>
                <p className="text-[12px] font-bold text-white">
                  Sesi siap dibuka
                </p>
                <p className="mt-0.5 text-[10px] leading-4 text-white/70">
                  Lanjutkan ke card di sebelah kanan
                </p>
              </div>
              <ArrowRight className="size-4 text-white/70" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReady && (
            <motion.div
              key="info-card"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="w-full rounded-xl border border-[#F3C4C4] bg-white p-3 shadow-sm lg:w-[360px] lg:shrink-0"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#FFEBEB] text-[#b71422]">
                  <ClipboardCheck className="size-3.5" />
                </span>
                <p className="text-xs font-bold text-[#181c20]">
                  Sesi presensi terpilih
                </p>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    canOpen
                      ? "bg-[#EDFFF6] text-[#7A941F]"
                      : "bg-[#FFEBEB] text-[#ba1a1a]"
                  }`}
                >
                  {canOpen ? "Wali kelas" : "Bukan wali kelas"}
                </span>
              </div>
              <div className="mt-2 text-[11px] leading-5 text-[#787584]">
                <p>
                  <span className="font-semibold text-[#181c20]">Kelas:</span>{" "}
                  {selectedClassLabel}
                </p>
                <p>
                  <span className="font-semibold text-[#181c20]">Tanggal:</span>{" "}
                  {selectedDate
                    ? `${selectedDate.day}, ${selectedDate.date}`
                    : "-"}
                </p>
                <p>
                  <span className="font-semibold text-[#181c20]">Jumlah Siswa:</span>{" "}
                  {studentCount} Siswa
                </p>
                <p>
                  <span className="font-semibold text-[#181c20]">Jumlah Mapel:</span>{" "}
                  {selectedDate?.subjectCount ?? 0} Mapel
                </p>
                {subjectNames ? (
                  <p title={subjectNames}>
                    <span className="font-semibold text-[#181c20]">Mapel:</span>{" "}
                    <span className="line-clamp-2">{subjectNames}</span>
                  </p>
                ) : null}
              </div>
              {!canOpen ? (
                <p className="mt-2 rounded-lg bg-[#FFEBEB] px-2.5 py-1.5 text-[10px] leading-4 text-[#ba1a1a]">
                  Hanya wali kelas yang dapat membuka presensi kelas ini.
                </p>
              ) : null}
              <motion.button
                type="button"
                whileHover={{ scale: canOpen && !opened ? 1.02 : 1 }}
                whileTap={{ scale: canOpen && !opened ? 0.97 : 1 }}
                onClick={onOpenSession}
                disabled={!canOpen || opened}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#b71422] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8f0f1a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ClipboardCheck className="size-4" />
                {opened ? "Presensi dibuka" : "Buka presensi"}
              </motion.button>
              {opened && closesAt && (
                <p className="mt-2 text-center text-[10px] font-semibold text-white/80">
                  Berakhir pukul{" "}
                  {new Date(closesAt).toLocaleTimeString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
