"use client";

import {
  FileSignature,
  FileText,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  CountUp,
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";
import { meetings } from "./data";

const capaianPembelajaranDefault =
  "Capaian pembelajaran mata pelajaran ini belum diisi.";

const bobotPenilaian = [
  { persen: "20%", label: "Tugas", icon: FileText, color: "#006398" },
  { persen: "20%", label: "Kuis", icon: FileText, color: "#D97706" },
  { persen: "30%", label: "UTS", icon: FileSignature, color: "#7C3AED" },
  { persen: "30%", label: "UAS", icon: GraduationCap, color: "#b71422" },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type Accent = "teacher" | "student";

const ACCENT_STYLES: Record<
  Accent,
  { header: string; avatarBg: string; avatarText: string; bullet: string }
> = {
  teacher: {
    header: "bg-gradient-to-r from-[#b71422] to-[#8f0f1a]",
    avatarBg: "bg-[#FFEBEB]",
    avatarText: "text-[#b71422]",
    bullet: "bg-[#b71422]",
  },
  student: {
    header: "bg-gradient-to-r from-[#0d5c52] to-[#071f1c]",
    avatarBg: "bg-[#d4eee7]",
    avatarText: "text-[#0d5c52]",
    bullet: "bg-[#0d5c52]",
  },
};

type CourseInfoContentProps = {
  subjectName: string;
  capaianPembelajaran?: string | null;
  pesertaCount?: number;
  teacherName?: string | null;
  meetingCount?: number;
  accent?: Accent;
};

export function CourseInfoContent({
  subjectName,
  capaianPembelajaran,
  pesertaCount,
  teacherName,
  meetingCount,
  accent = "teacher",
}: CourseInfoContentProps) {
  const styles = ACCENT_STYLES[accent];
  const isStudent = accent === "student";
  const displayTeacher = teacherName?.trim() || "-";

  const capaianText = capaianPembelajaran?.trim() || capaianPembelajaranDefault;
  const capaianItems = capaianText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^\d+[.)]\s*(.*)$/);
      return { nomor: match ? Number(line.match(/^\d+/)![0]) : index + 1, teks: match ? match[1] : line };
    });

  const stats = [
    { label: "Peserta", value: pesertaCount ?? 0 },
    { label: "Pertemuan", value: meetingCount ?? meetings.length },
    { label: "Semester", value: "Periode aktif" },
  ];

  return (
    <section className="flex min-h-64 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <FadeIn className={`px-5 py-4 ${styles.header}`}>
        <h2
          className={`text-[15px] text-white ${
            isStudent ? "font-extrabold tracking-tight" : "font-bold"
          }`}
        >
          Info Pembelajaran
        </h2>
        <p
          className={`mt-0.5 text-[12px] text-white/80 ${
            isStudent ? "font-semibold" : "font-medium"
          }`}
        >
          {subjectName}
        </p>
      </FadeIn>

      <div className="flex flex-col gap-5 px-5 py-5">
        <div
          className={`flex items-center gap-3 ${
            isStudent ? "border-b-2 border-[#0d5c52]/10 pb-5" : ""
          }`}
        >
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${styles.avatarBg} ${styles.avatarText} text-[15px] font-bold`}
          >
            {initials(displayTeacher)}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Guru Pengampu
            </p>
            <p
              className={`truncate text-[14px] text-[#1E293B] ${
                isStudent ? "font-extrabold" : "font-bold"
              }`}
            >
              {displayTeacher}
            </p>
          </div>
        </div>

        <div
          className={`grid grid-cols-3 divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 ${
            isStudent ? "divide-x-2 border-t-2 border-[#0d5c52]" : "divide-x"
          }`}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 text-center">
              <p
                className={`text-[18px] text-[#1E293B] ${
                  isStudent ? "font-extrabold" : "font-bold"
                }`}
              >
                {typeof stat.value === "number" ? (
                  <CountUp to={stat.value} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#94A3B8]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div
          className={isStudent ? "border-t-2 border-[#0d5c52]/10 pt-5" : ""}
        >
          <p
            className={`text-[14px] text-[#1E293B] ${
              isStudent ? "font-extrabold" : "font-semibold"
            }`}
          >
            Capaian Pembelajaran
          </p>
          <StaggerChildren
            as="ol"
            className="mt-2.5 flex flex-col gap-2.5"
          >
            {capaianItems.map((item) => (
              <StaggerItem
                key={item.nomor}
                className="flex items-start gap-2.5"
              >
                <span className={`mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full ${styles.bullet} text-[11px] font-bold text-white`}>
                  {item.nomor}
                </span>
                <p className="text-[13px] leading-6 text-[#475569]">{item.teks}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        <div
          className={isStudent ? "border-t-2 border-[#0d5c52]/10 pt-5" : ""}
        >
          <p
            className={`text-[14px] text-[#1E293B] ${
              isStudent ? "font-extrabold" : "font-semibold"
            }`}
          >
            Bobot Penilaian
          </p>
          <StaggerChildren className="mt-2.5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {bobotPenilaian.map((item) => {
              const Icon = item.icon;
              const nilai = parseInt(item.persen, 10);
              return (
                <StaggerItem
                  key={item.label}
                  className="border-b border-[#E2E8F0] pb-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" style={{ color: item.color }} />
                    <span className="text-[16px] font-bold text-[#1E293B]">
                      {item.persen}
                    </span>
                    <span className="text-[13px] text-[#475569]">{item.label}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${nilai}%` }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
