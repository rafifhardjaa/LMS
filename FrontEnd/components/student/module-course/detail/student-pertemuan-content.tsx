"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Download, Trash2 } from "lucide-react";
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
    return { label: "Lewat", className: "bg-[#FFEBEB] text-[#b71422]" };
  }
  if (due.diff(now, "hours") <= 48) {
    return { label: "Mepet", className: "bg-[#FEF3C7] text-[#D97706]" };
  }
  return { label: "Aman", className: "bg-[#EDFFF6] text-[#7A941F]" };
}

const EMPTY_TEXT =
  "rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-[12px] font-medium text-[#94A3B8]";

function TeacherFileList({ files }: { files: PendingFile[] }) {
  if (files.length === 0) return null;

  return (
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
            <span className="max-w-[220px] truncate font-semibold text-[#1E293B]">
              {item.name}
            </span>
            <span className="shrink-0 font-medium text-[#64748B]">
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
      <p className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-[12px] font-medium text-[#94A3B8]">
        Belum ada pengumpulan
      </p>
    );
  }

  return (
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
              <p className="truncate text-[12px] font-semibold text-[#1E293B]">
                {item.name}
              </p>
              <p className="text-[10px] font-medium text-[#94A3B8]">
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
    const emptyText =
      kind === "tugas"
        ? "Tidak ada tugas di pertemuan ini"
        : "Tidak ada kuis di pertemuan ini";

    return (
      <FadeIn delay={kind === "tugas" ? 0.16 : 0.22}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
            {kind === "tugas" ? "Tugas" : "Kuis"}
          </p>
          <div className="mt-2.5 flex flex-col gap-3">
            {assignments.length === 0 ? (
              <p className={EMPTY_TEXT}>{emptyText}</p>
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

                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 md:border-b-0 md:border-r">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#1E293B]">
                              {assignment.title}
                            </p>
                            {assignment.description && (
                              <p className="mt-1 text-[12px] leading-5 text-[#64748B]">
                                {assignment.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center self-start rounded-full px-2.5 py-1 text-[10px] font-bold sm:self-auto ${tone.className}`}
                          >
                            {tone.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-[#64748B]">
                          <span className="inline-flex items-center gap-1">
                            Mulai · {formatDateTime(assignment.startAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3 text-[#D97706]" />
                            Batas · {formatDateTime(assignment.deadlineAt)}
                          </span>
                        </div>

                        {visibleTeacherFiles.length > 0 && (
                          <div className="border-t border-[#F1F5F9] pt-3">
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                              {kind === "tugas" ? "File tugas" : "File kuis"}
                            </p>
                            <TeacherFileList files={visibleTeacherFiles} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Pengumpulan {kind}
                        </p>
                        <StudentSubmissionPanel
                          files={submissionFiles}
                          onDelete={(item) => onDelete(slot, item)}
                          deleting={deleting}
                        />
                      </div>
                    </div>

                    <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <FileDropzone
                        accent={accent}
                        label={
                          kind === "tugas"
                            ? "Pengumpulan tugas"
                            : "Pengumpulan kuis"
                        }
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
