"use client";

import { ArrowRight, ChevronDown, ClipboardCheck } from "lucide-react";
import {
  classOptions,
  meetingOptions,
  subjectOptions,
} from "./data";
import type {
  AttendanceCounts,
  ClassFilter,
  MeetingFilter,
  SubjectFilter,
} from "./types";

type AttendanceToolbarProps = {
  classFilter: ClassFilter | "";
  subjectFilter: SubjectFilter;
  meetingFilter: MeetingFilter;
  opened: boolean;
  counts: AttendanceCounts;
  studentCount: number;
  onClassChange: (value: ClassFilter | "") => void;
  onSubjectChange: (value: SubjectFilter) => void;
  onMeetingChange: (value: MeetingFilter) => void;
  onOpenSession: () => void;
};

export function AttendanceToolbar({
  classFilter,
  subjectFilter,
  meetingFilter,
  opened,
  counts,
  studentCount,
  onClassChange,
  onSubjectChange,
  onMeetingChange,
  onOpenSession,
}: AttendanceToolbarProps) {
  const isReady = Boolean(classFilter && subjectFilter && meetingFilter);
  const summaryItems: { label: string; value: number; dot: string }[] = [
    { label: "Hadir", value: counts.HADIR, dot: "bg-[#22C55E]" },
    { label: "Sakit", value: counts.SAKIT, dot: "bg-[#F59E0B]" },
    { label: "Izin", value: counts.IZIN, dot: "bg-[#38BDF8]" },
    { label: "Alpa", value: counts.ALPA, dot: "bg-[#EF4444]" },
  ];
  const classLabel =
    classOptions.find((option) => option.value === classFilter)?.label ?? "-";
  const subjectLabel =
    subjectOptions.find((option) => option.value === subjectFilter)?.label ??
    "-";
  const meetingLabel =
    meetingOptions.find((option) => option.value === meetingFilter)?.label ??
    "-";

  const selectClass =
    "h-9 w-full appearance-none rounded-lg border border-white/20 bg-white/10 pl-3 pr-8 text-[11px] font-semibold text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/30";

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
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-full">
          <div className="relative">
            <label htmlFor="attendance-class" className="sr-only">
              Pilih kelas
            </label>
            <select
              id="attendance-class"
              value={classFilter}
              onChange={(event) => onClassChange(event.target.value as ClassFilter | "")}
              className={selectClass}
            >
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/70" />
          </div>

          <div className="relative">
            <label htmlFor="attendance-subject" className="sr-only">
              Pilih mata pelajaran
            </label>
            <select
              id="attendance-subject"
              value={subjectFilter}
              onChange={(event) => onSubjectChange(event.target.value)}
              className={selectClass}
            >
              {subjectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/70" />
          </div>

          <div className="relative">
            <label htmlFor="attendance-meeting" className="sr-only">
              Pilih pertemuan
            </label>
            <select
              id="attendance-meeting"
              value={meetingFilter}
              onChange={(event) => onMeetingChange(event.target.value)}
              className={selectClass}
            >
              {meetingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/70" />
          </div>
        </div>

        {isReady && (
          <div className="w-full rounded-xl border border-white/15 bg-white/10 p-3 lg:w-full">
            <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-white/70">
              Kondisi Kehadiran Hari Ini
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-center"
                >
                  <p className="flex items-center justify-center gap-1 text-[9px] font-semibold text-white/75">
                    <span className={item.dot + " size-1.5 rounded-full"} />
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold leading-none text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-4 text-white/70">
              Sesi siap dibuka — klik Buka presensi untuk menampilkan daftar
              siswa.
            </p>
          </div>
        )}
        </div>

        {isReady && (
          <div className="hidden flex-col items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 p-4 text-center lg:flex lg:w-[240px] lg:shrink-0 xl:w-[320px]">
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
          </div>
        )}

        {isReady && (
          <div className="w-full rounded-xl border border-[#F3C4C4] bg-white p-3 shadow-sm lg:w-[320px] lg:shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#FFEBEB] text-[#b71422]">
                <ClipboardCheck className="size-3.5" />
              </span>
              <p className="text-xs font-bold text-[#181c20]">
                Sesi presensi terpilih
              </p>
              <span className="ml-auto rounded-full bg-[#EDFFF6] px-2 py-0.5 text-[9px] font-bold text-[#7A941F]">
                Siap dibuka
              </span>
            </div>
            <div className="mt-2 text-[11px] leading-5 text-[#787584]">
              <p>
                <span className="font-semibold text-[#181c20]">Kelas:</span>{" "}
                {classLabel}
              </p>
              <p>
                <span className="font-semibold text-[#181c20]">
                  Mata Pelajaran:
                </span>{" "}
                {subjectLabel}
              </p>
              <p>
                <span className="font-semibold text-[#181c20]">
                  Pertemuan:
                </span>{" "}
                {meetingLabel}
              </p>
              <p>
                <span className="font-semibold text-[#181c20]">
                  Jumlah Siswa:
                </span>{" "}
                {studentCount} Siswa
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSession}
              disabled={opened}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#b71422] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8f0f1a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ClipboardCheck className="size-4" />
              {opened ? "Presensi dibuka" : "Buka presensi"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
