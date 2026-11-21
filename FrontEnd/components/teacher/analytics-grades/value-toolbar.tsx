"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import type { JurusanOption } from "@/components/admin/searchable-dropdown";
import { SearchableDropdown } from "@/components/admin/searchable-dropdown";
import { StaggerChildren, StaggerItem } from "@/components/ui/animations";

type ValueToolbarProps = {
  classOptions: JurusanOption[];
  subjectOptions: JurusanOption[];
  assessmentOptions: JurusanOption[];
  classFilter: string;
  subjectFilter: string;
  assessmentFilter: string;
  opened: boolean;
  studentCount: number;
  selectedClassLabel: string;
  selectedSubjectLabel: string;
  selectedAssessmentLabel: string;
  onClassChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onAssessmentChange: (value: string) => void;
  onOpen: () => void;
};

export function ValueToolbar({
  classOptions,
  subjectOptions,
  assessmentOptions,
  classFilter,
  subjectFilter,
  assessmentFilter,
  opened,
  studentCount,
  selectedClassLabel,
  selectedSubjectLabel,
  selectedAssessmentLabel,
  onClassChange,
  onSubjectChange,
  onAssessmentChange,
  onOpen,
}: ValueToolbarProps) {
  const isReady = Boolean(classFilter && subjectFilter && assessmentFilter);

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

      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
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
              onChange={onSubjectChange}
            />
          </StaggerItem>
          <StaggerItem key="assessment">
            <SearchableDropdown
              id="value-assessment"
              value={assessmentFilter}
              options={assessmentOptions}
              label="Pilih asesmen"
              searchPlaceholder="Cari asesmen..."
              emptyMessage="Asesmen tidak ditemukan."
              variant="ghost"
              onChange={onAssessmentChange}
            />
          </StaggerItem>
        </StaggerChildren>

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
                  <span className="font-semibold text-[#181c20]">Asesmen:</span>{" "}
                  {selectedAssessmentLabel}
                </p>
                <p>
                  <span className="font-semibold text-[#181c20]">Siswa:</span>{" "}
                  {studentCount} siswa
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
