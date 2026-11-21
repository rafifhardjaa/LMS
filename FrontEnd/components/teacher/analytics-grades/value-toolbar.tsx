"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import type { JurusanOption } from "@/components/admin/searchable-dropdown";
import { SearchableDropdown } from "@/components/admin/searchable-dropdown";
import { StaggerChildren, StaggerItem } from "@/components/ui/animations";
import { cn } from "@/lib/utils";

type ValueToolbarProps = {
  classOptions: JurusanOption[];
  subjectOptions: JurusanOption[];
  assignmentOptions: JurusanOption[];
  classFilter: string;
  subjectFilter: string;
  assignmentFilter: string;
  opened: boolean;
  studentStats: {
    total: number;
    tuntas: number;
    remidi: number;
  };
  selectedClassLabel: string;
  selectedSubjectLabel: string;
  selectedAssignmentLabel: string;
  onClassChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onAssignmentChange: (value: string) => void;
  onOpen: () => void;
};

export function ValueToolbar({
  classOptions,
  subjectOptions,
  assignmentOptions,
  classFilter,
  subjectFilter,
  assignmentFilter,
  opened,
  studentStats,
  selectedClassLabel,
  selectedSubjectLabel,
  selectedAssignmentLabel,
  onClassChange,
  onSubjectChange,
  onAssignmentChange,
  onOpen,
}: ValueToolbarProps) {
  const isReady = Boolean(classFilter && subjectFilter && assignmentFilter);

  return (
    <div className="flex flex-col gap-3 bg-gradient-to-r from-[#b71422] to-[#8f0f1a] px-4 py-4">
      <div className="flex items-center gap-2">
        <h2 className="text-[13px] font-bold text-white">
          Filter Leger Nilai Siswa
        </h2>
        <span className="size-2 animate-pulse rounded-full bg-[#22C55E]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-white/80">
          Data Nilai Siap Ditampilkan
        </span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-2">
          <StaggerChildren
            className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-full"
            staggerDelay={0.08}
            delayChildren={0.05}
          >
            <StaggerItem key="class">
              <SearchableDropdown
                id="value-class"
                value={classFilter}
                options={classOptions}
                label="Pilih kelas"
                searchPlaceholder="Cari kelas..."
                emptyMessage="Kelas tidak ditemukan."
                variant="ghost"
                onChange={onClassChange}
              />
            </StaggerItem>
            <StaggerItem key="subject">
              <SearchableDropdown
                id="value-subject"
                value={subjectFilter}
                options={subjectOptions}
                label="Pilih mata pelajaran"
                searchPlaceholder="Cari mapel..."
                emptyMessage="Mapel tidak ditemukan."
                variant="ghost"
                disabled={!classFilter}
                onChange={onSubjectChange}
              />
            </StaggerItem>
            <StaggerItem key="assignment">
              <SearchableDropdown
                id="value-assignment"
                value={assignmentFilter}
                options={assignmentOptions}
                label="Pilih tugas/kuis"
                searchPlaceholder="Cari tugas atau kuis..."
                emptyMessage="Tugas/kuis tidak ditemukan."
                variant="ghost"
                disabled={!classFilter || !subjectFilter}
                onChange={onAssignmentChange}
              />
            </StaggerItem>
          </StaggerChildren>

          <AnimatePresence>
            {isReady && (
              <motion.div
                key="value-stats"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-3 gap-2 rounded-xl border border-white/15 bg-white/10 p-3"
              >
                {[
                  { label: "Total Siswa", value: studentStats.total, dot: "bg-white" },
                  { label: "Tuntas", value: studentStats.tuntas, dot: "bg-[#86EFAC]" },
                  {
                    label: "Perlu Remidi",
                    value: studentStats.remidi,
                    dot: "bg-[#FCA5A5]",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-center"
                  >
                    <p className="flex items-center justify-center gap-1 text-[9px] font-semibold text-white/75">
                      <span className={cn("size-1.5 rounded-full", item.dot)} />
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[13px] font-bold leading-none text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isReady && (
            <motion.div
              key="value-summary"
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
                  Filter siap ditampilkan
                </p>
              </div>
              <div className="mt-2 text-[11px] leading-5 text-[#787584]">
                <p>
                  <span className="font-semibold text-[#181c20]">Kelas:</span>{" "}
                  {selectedClassLabel}
                </p>
                <p>
                  <span className="font-semibold text-[#181c20]">Mapel:</span>{" "}
                  {selectedSubjectLabel}
                </p>
                <p>
                  <span className="font-semibold text-[#181c20]">Tugas/Kuis:</span>{" "}
                  {selectedAssignmentLabel}
                </p>
                <p>
                  <span className="font-semibold text-[#181c20]">Siswa:</span>{" "}
                  {studentStats.total} siswa
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: isReady && !opened ? 1.02 : 1 }}
                whileTap={{ scale: isReady && !opened ? 0.97 : 1 }}
                onClick={onOpen}
                disabled={!isReady || opened}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#b71422] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8f0f1a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowRight className="size-4" />
                {opened ? "Nilai ditampilkan" : "Tampilkan nilai"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
