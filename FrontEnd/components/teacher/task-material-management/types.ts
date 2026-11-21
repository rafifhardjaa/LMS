import type { LucideIcon } from "lucide-react";

export type ResourceTab = "tugas" | "kuis";
export type ClassFilter = string;
export type SubjectFilter = "all" | "fisika" | "informatika" | "jaringan";
export type AssignmentStatus = "dueSoon" | "active" | "done";
export type GradingStatus = "pending" | "graded" | "revision";

export type Assignment = {
  id: string;
  subject: string;
  subjectKey: Exclude<SubjectFilter, "all">;
  classes: Exclude<ClassFilter, "all">[];
  status: AssignmentStatus;
  title: string;
  description: string;
  startLabel: string;
  dueLabel: string;
  submitted: number;
  total: number;
  percentage: number;
  percentageClassName: string;
  secondaryLabel: string;
  secondaryIcon: LucideIcon;
  primaryLabel: string;
  primaryIcon: LucideIcon;
  primaryTone: "primary" | "blue" | "neutral";
  showArchive?: boolean;
};

export type GradingItem = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  nisn: string;
  className: string;
  assignmentId: string;
  taskTitle: string;
  subject: string;
  fileName: string;
  fileUrl: string;
  fileIcon: LucideIcon;
  fileIconClassName: string;
  submittedAt: string;
  submittedAtTone: "urgent" | "neutral";
  status: GradingStatus;
  score: number | null;
};

export type CompletionTrendPoint = {
  day: string;
  onTime: number;
  late: number;
};

export type GradingStatusSlice = {
  id: string;
  label: string;
  value: number;
  color: string;
};
