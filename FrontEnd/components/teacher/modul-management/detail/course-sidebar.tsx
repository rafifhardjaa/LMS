"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type MeetingListItem = {
  label: string;
  date: string;
};

type Accent = "teacher" | "student";

const ACCENT_STYLES: Record<Accent, { selected: string; icon: string }> = {
  teacher: { selected: "text-[#b71422]", icon: "text-[#006398]" },
  student: { selected: "text-[#0d5c52]", icon: "text-[#14b8a6]" },
};

type CourseSidebarProps = {
  subjectName: string;
  classLabel: string;
  majorName?: string | null;
  selectedKey: string;
  onSelect: (key: string) => void;
  pesertaCount?: number | null;
  meetings: MeetingListItem[];
  accent?: Accent;
};

export function CourseSidebar({
  subjectName,
  classLabel,
  majorName,
  selectedKey,
  onSelect,
  pesertaCount,
  meetings,
  accent = "teacher",
}: CourseSidebarProps) {
  const [courseOpen, setCourseOpen] = useState(true);
  const styles = ACCENT_STYLES[accent];

  return (
    <aside className="max-h-[calc(100vh-8.5rem)] w-full shrink-0 overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-72">
      <div className="border-b border-[#F1F5F9] pb-3">
        <h2 className="text-[15px] font-bold leading-6 text-[#1E293B]">
          {subjectName} - {classLabel}
        </h2>
        {majorName && (
          <p className="mt-1 text-[11px] font-semibold text-[#94A3B8]">{majorName}</p>
        )}
      </div>

      <div className="border-b border-[#F1F5F9] py-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect("peserta")}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left text-[14px] font-bold transition-colors hover:bg-[#F8FAFC]",
            selectedKey === "peserta" ? styles.selected : "text-[#1E293B]",
          )}
        >
          <Users className={`size-4 ${styles.icon}`} />
          Peserta
        </motion.button>
        <p className="mt-0.5 pl-7 text-[11px] text-[#94A3B8]">
          {pesertaCount === null || pesertaCount === undefined
            ? "Konten menyusul"
            : `${pesertaCount} siswa`}
        </p>
      </div>

      <div className="pt-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCourseOpen((current) => !current)}
          aria-expanded={courseOpen}
          className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left"
        >
          <span className="flex items-center gap-2 text-[14px] font-bold text-[#1E293B]">
            <BookOpen className={`size-4 ${styles.icon}`} />
            Course
          </span>
          <motion.span
            animate={{ rotate: courseOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="size-4.5 text-[#94A3B8]" />
          </motion.span>
        </motion.button>

        <AnimatePresence initial={false}>
          {courseOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-2 divide-y divide-[#E2E8F0] overflow-hidden"
            >
              <li>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect("info")}
                  className={cn(
                    "w-full px-1 py-2.5 text-left transition-colors hover:bg-[#F8FAFC]",
                    selectedKey === "info" && "bg-[#F8FAFC]",
                  )}
                >
                  <p
                    className={cn(
                      "text-[13px] font-bold",
                      selectedKey === "info" ? styles.selected : "text-[#1E293B]",
                    )}
                  >
                    Info pembelajaran
                  </p>
                </motion.button>
              </li>
              {meetings.map((meeting) => (
                <li key={meeting.label}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect(meeting.label)}
                    className={cn(
                      "w-full px-1 py-2.5 text-left transition-colors hover:bg-[#F8FAFC]",
                      selectedKey === meeting.label && "bg-[#F8FAFC]",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[13px] font-bold",
                        selectedKey === meeting.label
                          ? styles.selected
                          : "text-[#1E293B]",
                      )}
                    >
                      {meeting.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#94A3B8]">{meeting.date}</p>
                  </motion.button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
