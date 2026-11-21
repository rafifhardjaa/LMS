import {
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  FileImage,
  ListChecks,
} from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import type {
  Assignment as ApiAssignment,
  AssignmentGradingRow,
} from "@/lib/api/master-data";
import type {
  Assignment,
  CompletionTrendPoint,
  GradingItem,
  GradingStatusSlice,
  SubjectFilter,
} from "./types";

const avatarPalettes = [
  "bg-[#006398] text-white",
  "bg-[#E0F2FE] text-[#0284C7]",
  "bg-[#DCE9FF] text-[#006398]",
  "bg-[#F3E8FF] text-[#9333EA]",
  "bg-[#FFEBEB] text-[#b71422]",
  "bg-[#DCFCE7] text-[#16A34A]",
];

function subjectKey(
  code: string | null,
  name: string,
): Exclude<SubjectFilter, "all"> {
  const value = `${code ?? ""} ${name}`.toLowerCase();
  if (value.includes("jaringan") || value.includes("tjkt")) return "jaringan";
  if (value.includes("informatika") || value.includes("pplg")) {
    return "informatika";
  }
  return "fisika";
}

function assignmentStatus(deadlineAt: string): Assignment["status"] {
  const deadline = moment(deadlineAt);
  const now = moment();
  if (deadline.isBefore(now)) return "done";
  if (deadline.diff(now, "days") <= 3) return "dueSoon";
  return "active";
}

function percentageClass(percent: number) {
  if (percent >= 80) return "text-[#16A34A]";
  if (percent >= 50) return "text-[#D97706]";
  return "text-[#b71422]";
}

export function mapAssignment(
  row: ApiAssignment,
  context: { subjectName: string; subjectCode: string | null; className: string },
): Assignment {
  const summary = row.summary;
  const percent = summary?.percent ?? 0;
  const isQuiz = row.type === "kuis";

  return {
    id: row.id,
    subject: context.subjectCode || context.subjectName,
    subjectKey: subjectKey(context.subjectCode, context.subjectName),
    classes: [context.className],
    status: assignmentStatus(row.deadlineAt),
    title: row.title,
    description: row.description || "Belum ada deskripsi untuk tugas ini.",
    startLabel: moment(row.startAt).locale("id").format("D MMM YYYY, HH:mm"),
    dueLabel: moment(row.deadlineAt).locale("id").format("D MMM YYYY, HH:mm"),
    submitted: summary?.submitted ?? 0,
    total: summary?.totalStudents ?? 0,
    percentage: percent,
    percentageClassName: percentageClass(percent),
    secondaryLabel: isQuiz ? "Detail kuis" : "Detail tugas",
    secondaryIcon: isQuiz ? ListChecks : FileText,
    primaryLabel: "Periksa Jawaban",
    primaryIcon: ClipboardCheck,
    primaryTone: isQuiz ? "blue" : "primary",
  };
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function fileIconFor(mimeType: string, fileName: string) {
  const value = `${mimeType} ${fileName}`.toLowerCase();
  if (value.includes("sheet") || value.includes("excel") || value.endsWith(".xlsx")) {
    return FileSpreadsheet;
  }
  if (value.includes("image") || value.endsWith(".png") || value.endsWith(".jpg")) {
    return FileImage;
  }
  return FileText;
}

export function mapGradingRow(row: AssignmentGradingRow, index: number): GradingItem {
  return {
    id: row.id,
    name: row.name,
    initials: initialsOf(row.name),
    avatarClassName: avatarPalettes[index % avatarPalettes.length]!,
    nisn: row.nisn,
    className: row.className,
    assignmentId: row.assignmentId,
    taskTitle: row.taskTitle,
    subject: row.subject,
    fileName: row.fileName,
    fileUrl: row.fileUrl,
    fileIcon: fileIconFor(row.mimeType, row.fileName),
    fileIconClassName: "text-[#006398]",
    submittedAt: moment(row.submittedAt).locale("id").fromNow(),
    submittedAtTone: row.submittedAtTone,
    status: row.status,
    score: row.score,
  };
}

export function deriveCompletionTrend(
  rows: AssignmentGradingRow[],
  assignments: ApiAssignment[],
): CompletionTrendPoint[] {
  const deadlines = new Map(assignments.map((item) => [item.id, item.deadlineAt]));
  const days = Array.from({ length: 7 }, (_, index) =>
    moment().startOf("day").subtract(6 - index, "days"),
  );

  const result = days.map((day) => ({
    day: day.locale("id").format("ddd"),
    onTime: 0,
    late: 0,
  }));

  for (const row of rows) {
    const submitted = moment(row.submittedAt);
    const dayIndex = days.findIndex((day) => submitted.isSame(day, "day"));
    if (dayIndex < 0) continue;

    const deadline = deadlines.get(row.assignmentId);
    const late = deadline ? submitted.isAfter(moment(deadline)) : false;
    if (late) result[dayIndex]!.late += 1;
    else result[dayIndex]!.onTime += 1;
  }

  return result;
}

export function deriveGradingStatus(
  rows: AssignmentGradingRow[],
): GradingStatusSlice[] {
  const counts = rows.reduce(
    (acc, row) => {
      acc[row.status] += 1;
      return acc;
    },
    { graded: 0, pending: 0, revision: 0 },
  );

  return [
    { id: "graded", label: "Sudah dinilai", value: counts.graded, color: "#16A34A" },
    { id: "pending", label: "Menunggu", value: counts.pending, color: "#b71422" },
    { id: "revision", label: "Perlu revisi", value: counts.revision, color: "#D97706" },
  ];
}
