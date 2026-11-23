"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  ClipboardList,
  Clock,
  Download,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { FadeIn } from "@/components/ui/animations";
import type { Assignment, CourseMeeting } from "@/lib/api/master-data";
import {
  FileDropzone,
  fileBadgeClass,
  fileExtension,
  formatSize,
  type PendingFile,
} from "@/components/teacher/modul-management/detail/file-dropzone";

type SubmissionSlot = "tugasSubmission" | "kuisSubmission";

type StudentPertemuanContentProps = {
  meeting: CourseMeeting;
  materiFiles: PendingFile[];
  tugasTeacherFiles: PendingFile[];
  kuisTeacherFiles: PendingFile[];
  tugasFiles: PendingFile[];
  kuisFiles: PendingFile[];
  tugas: Assignment[];
  kuis: Assignment[];
  onTugasFilesChange: (assignmentId: string, files: PendingFile[]) => void;
  onKuisFilesChange: (assignmentId: string, files: PendingFile[]) => void;
  onUpload: (
    slot: SubmissionSlot,
    files: PendingFile[],
    assignmentId: string,
  ) => Promise<void> | void;
  uploading: boolean;
  onDelete: (slot: SubmissionSlot, item: PendingFile) => Promise<void> | void;
  deleting: boolean;
};

function formatDateLabel(date: string): string {
  return moment(date, ["DD-MM-YYYY", "YYYY-MM-DD"])
    .locale("id")
    .format("dddd, D MMMM YYYY");
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return moment(iso).locale("id").format("D MMM YYYY · HH:mm");
}

function deadlineTone(deadlineAt: string): {
  label: string;
  className: string;
} {
  const now = moment();
  const due = moment(deadlineAt);

  if (due.isBefore(now)) {
    return { label: "Lewat", className: "bg-[#FFEBEB] text-black" };
  }
  if (due.diff(now, "hours") <= 48) {
    return { label: "Mepet", className: "bg-[#FEF3C7] text-black" };
  }
  return { label: "Aman", className: "bg-[#EDFFF6] text-black" };
}

const EMPTY_TEXT =
  "rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-[12px] font-medium text-[#94A3B8]";
const EMPTY_TEXT_BLACK =
  "rounded-lg bg-white/60 px-3 py-2 text-center text-[12px] font-medium text-black";

const TASK_CARD_TONES = {
  tugas: {
    bg: "#EAFBF8",
    border: "rgba(0,0,0,0.18)",
  },
  kuis: {
    bg: "#F2FBE8",
    border: "rgba(0,0,0,0.18)",
  },
} as const;

function ClampText({
  text,
  textClassName = "text-[#64748B]",
  actionClassName = "text-[#0d5c52]",
}: {
  text: string;
  textClassName?: string;
  actionClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const longText = text.length > 120;

  return (
    <div>
      <p
        className={`text-[12px] leading-5 ${textClassName} ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {text}
      </p>
      {longText && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className={`mt-1 text-[11px] font-extrabold ${actionClassName} transition hover:underline`}
        >
          {expanded ? "Sembunyikan" : "Baca selengkapnya"}
        </button>
      )}
    </div>
  );
}

function TeacherFileList({
  files,
  textBlack = false,
}: {
  files: PendingFile[];
  textBlack?: boolean;
}) {
  if (files.length === 0) return null;

  const badgeTextClass = textBlack ? "text-black" : "text-[#0d5c52]";
  const nameTextClass = textBlack ? "text-black" : "text-[#1E293B]";
  const sizeTextClass = textBlack ? "text-black" : "text-[#64748B]";

  return (
    <div>
      <span className={`mb-1.5 inline-flex rounded bg-[#edf7f4] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${badgeTextClass}`}>
        Dari guru
      </span>
      <ul className="flex flex-wrap gap-1.5">
      {files.map((item) => {
        const extension = fileExtension(item.name);
        const content = (
          <>
            <span
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-extrabold tracking-wide ${fileBadgeClass(
                extension,
              )}`}
            >
              {extension}
            </span>
            <span className={`max-w-[220px] truncate font-semibold ${nameTextClass}`}>
              {item.name}
            </span>
            <span className={`shrink-0 font-medium ${sizeTextClass}`}>
              {formatSize(item.size)}
            </span>
            <Download className="size-3 shrink-0 text-[#0d5c52]" />
          </>
        );

        return (
          <li key={item.clientId}>
            {item.fileUrl ? (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noreferrer"
                title={`Buka ${item.name}`}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white py-1 pl-2.5 pr-2 text-[12px] transition hover:border-[#0d5c52]/40 hover:bg-[#edf7f4]"
              >
                {content}
              </a>
            ) : (
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white py-1 pl-2.5 pr-2 text-[12px]">
                {content}
              </span>
            )}
          </li>
        );
      })}
      </ul>
    </div>
  );
}

type StudentSubmissionPanelProps = {
  files: PendingFile[];
  onDelete: (item: PendingFile) => void;
  deleting: boolean;
};

function StudentSubmissionPanel({
  files,
  onDelete,
  deleting,
}: StudentSubmissionPanelProps) {
  if (files.length === 0) {
    return (
      <p className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-[12px] font-medium text-black">
        Belum ada pengumpulan
      </p>
    );
  }

  return (
    <div>
      <span className="mb-1.5 inline-flex rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-black">
        Milik siswa
      </span>
      <ul className="flex flex-col gap-1.5">
        {files.map((item) => {
        const extension = fileExtension(item.name);
        return (
          <li
            key={item.clientId}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white p-2"
          >
            <span
              className={`flex h-6 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-extrabold tracking-wide ${fileBadgeClass(
                extension,
              )}`}
            >
              {extension}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-black">
                {item.name}
              </p>
              <p className="text-[10px] font-medium text-black">
                {formatSize(item.size)}
              </p>
            </div>
            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noreferrer"
                title={`Buka ${item.name}`}
                aria-label={`Buka ${item.name}`}
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#EDF7F4] hover:text-[#0d5c52]"
              >
                <Download className="size-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => onDelete(item)}
              disabled={deleting}
              aria-label={`Hapus ${item.name}`}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#FFEBEB] hover:text-[#b71422] disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        );
        })}
      </ul>
    </div>
  );
}

export function StudentPertemuanContent({
  meeting,
  materiFiles,
  tugasTeacherFiles,
  kuisTeacherFiles,
  tugasFiles,
  kuisFiles,
  tugas,
  kuis,
  onTugasFilesChange,
  onKuisFilesChange,
  onUpload,
  uploading,
  onDelete,
  deleting,
}: StudentPertemuanContentProps) {
  const [expandedKey, setExpandedKey] = useState<string>("materi");

  function toggle(key: string) {
    setExpandedKey((current) => (current === key ? "" : key));
  }

  function renderAssignmentSection(
    kind: "tugas" | "kuis",
    teacherFiles: PendingFile[],
    assignments: Assignment[],
    files: PendingFile[],
    onFilesChange: (assignmentId: string, next: PendingFile[]) => void,
  ) {
    const slot: SubmissionSlot =
      kind === "tugas" ? "tugasSubmission" : "kuisSubmission";
    const accent = kind === "tugas" ? "tugas" : "kuis";
    const KindIcon = kind === "tugas" ? ClipboardList : ClipboardCheck;
    const emptyText =
      kind === "tugas"
        ? "Tidak ada tugas di pertemuan ini"
        : "Tidak ada kuis di pertemuan ini";

    return (
      <FadeIn delay={kind === "tugas" ? 0.16 : 0.22}>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#94A3B8]">
            {kind === "tugas" ? "Tugas" : "Kuis"}
          </p>
          <div className="mt-2.5 flex flex-col gap-3">
            {assignments.length === 0 ? (
              <p className={EMPTY_TEXT_BLACK}>{emptyText}</p>
            ) : (
              assignments.map((assignment) => {
                const key = `${kind}:${assignment.id}`;
                const tone = deadlineTone(assignment.deadlineAt);
                const assignedTeacherFiles = teacherFiles.filter(
                  (file) => file.assignmentId === assignment.id,
                );
                const visibleTeacherFiles =
                  assignedTeacherFiles.length > 0
                    ? assignedTeacherFiles
                    : teacherFiles.filter((file) => !file.assignmentId);
                const submissionFiles = files.filter(
                  (file) => file.assignmentId === assignment.id,
                );
                const cardTone = TASK_CARD_TONES[kind];

                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      backgroundColor: cardTone.bg,
                      borderColor: cardTone.border,
                    }}
                    className="overflow-hidden rounded-2xl border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="flex flex-col gap-3 border-b-2 border-[#0d5c52]/15 p-4 md:border-b-0 md:border-r-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-start gap-2">
                              <KindIcon className="mt-0.5 size-4 shrink-0 text-[#0d5c52]" />
                              <p className="text-[14px] font-extrabold tracking-tight text-black">
                                {assignment.title}
                              </p>
                            </div>
                            {assignment.description && (
                              <div className="mt-1">
                                <ClampText
                                  text={assignment.description}
                                  textClassName="text-black"
                                  actionClassName="text-black"
                                />
                              </div>
                            )}
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center self-start rounded-full px-2.5 py-1 text-[10px] font-bold sm:self-auto ${tone.className}`}
                          >
                            {tone.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-black">
                          <span className="inline-flex items-center gap-1">
                            Mulai · {formatDateTime(assignment.startAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3 text-[#D97706]" />
                            Batas · {formatDateTime(assignment.deadlineAt)}
                          </span>
                        </div>

                        {visibleTeacherFiles.length > 0 && (
                          <div className="border-t-2 border-[#0d5c52]/10 pt-3">
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-black">
                              {kind === "tugas" ? "File tugas" : "File kuis"}
                            </p>
                            <TeacherFileList files={visibleTeacherFiles} textBlack />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 rounded-xl bg-white/70 p-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-black">
                          Pengumpulan {kind}
                        </p>
                        <StudentSubmissionPanel
                          files={submissionFiles}
                          onDelete={(item) => onDelete(slot, item)}
                          deleting={deleting}
                        />
                      </div>
                    </div>

                    <div className="border-t-2 border-[#0d5c52]/15 bg-white/60 p-3">
                      <FileDropzone
                        accent={accent}
                        label={
                          kind === "tugas"
                            ? "Pengumpulan tugas"
                            : "Pengumpulan kuis"
                        }
                        labelClassName="font-extrabold text-black"
                        files={submissionFiles}
                        onChange={(next) =>
                          onFilesChange(assignment.id, next)
                        }
                        expanded={expandedKey === key}
                        onToggle={() => toggle(key)}
                        onUploadAll={(items) =>
                          onUpload(slot, items, assignment.id)
                        }
                        uploading={uploading}
                        onDelete={(item) => onDelete(slot, item)}
                        deleting={deleting}
                        showSavedFiles={false}
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="flex min-h-64 flex-1 flex-col gap-4">
      <section className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <FadeIn className="flex flex-col gap-2 bg-gradient-to-r from-[#0d5c52] to-[#071f1c] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[15px] font-extrabold tracking-tight text-white">
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
            <Link
              href="/student/module-course"
              className="inline-flex h-7 items-center rounded-full bg-white/15 px-2.5 text-[11px] font-bold text-white transition hover:bg-white/25"
            >
              Kembali
            </Link>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-5 px-5 py-5">
          <FadeIn delay={0.1}>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#94A3B8]">
                Materi
              </p>
              <p className="mt-1.5 text-[14px] font-extrabold text-[#1E293B]">
                {meeting.title}
              </p>
              <div className="mt-1">
                <ClampText text={meeting.objective} />
              </div>
              <div className="mt-3">
                {materiFiles.length === 0 ? (
                  <p className={EMPTY_TEXT}>Materi ini belum diunggah</p>
                ) : (
                  <TeacherFileList files={materiFiles} />
                )}
              </div>
            </div>
          </FadeIn>

          {renderAssignmentSection(
            "tugas",
            tugasTeacherFiles,
            tugas,
            tugasFiles,
            onTugasFilesChange,
          )}
          {renderAssignmentSection(
            "kuis",
            kuisTeacherFiles,
            kuis,
            kuisFiles,
            onKuisFilesChange,
          )}
        </div>
      </section>
    </div>
  );
}
