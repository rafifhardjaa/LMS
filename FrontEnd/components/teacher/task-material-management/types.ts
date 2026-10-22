import type { LucideIcon } from "lucide-react";

export type ResourceTab = "all" | "tugas" | "materi" | "kuis";
export type ClassFilter = "all" | "VII - A" | "VII - B" | "VIII - A";
export type SubjectFilter = "all" | "fisika" | "informatika" | "jaringan";
export type TabCounts = Record<ResourceTab, number>;

export type SummaryMetric = {
  label: string;
  value: string;
  unit: string;
  unitClassName: string;
  meta: string;
  metaClassName?: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconTextClassName: string;
  progress: number;
  progressClassName: string;
  active?: boolean;
};

export type Assignment = {
  id: string;
  badge: string;
  subject: string;
  subjectKey: Exclude<SubjectFilter, "all">;
  classes: Exclude<ClassFilter, "all">[];
  title: string;
  description: string;
  dueLabel: string;
  dueTone: "urgent" | "normal";
  submitted: number;
  total: number;
  percentage: number;
  accentClassName: string;
  iconBgClassName: string;
  iconTextClassName: string;
  progressClassName: string;
  percentageClassName: string;
  secondaryLabel: string;
  secondaryIcon: LucideIcon;
  primaryLabel: string;
  primaryIcon: LucideIcon;
  primaryTone: "primary" | "blue" | "neutral";
  showArchive?: boolean;
};

export type MaterialFormat = "pdf" | "slides" | "video";

export type Material = {
  id: string;
  title: string;
  meta: string;
  subject: string;
  subjectKey: Exclude<SubjectFilter, "all">;
  format: MaterialFormat;
  icon: LucideIcon;
  iconBgClassName: string;
  iconTextClassName: string;
  actionLabel: string;
};

export type GradingItem = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  nisn: string;
  className: string;
  fileName: string;
  subject: string;
  fileIcon: LucideIcon;
  fileIconClassName: string;
  submittedAt: string;
  submittedAtTone: "urgent" | "neutral";
  conformity: string;
  conformityTone: "success" | "warning";
};

export type DeadlineItem = {
  id: string;
  title: string;
  note: string;
  badge: string;
  badgeClassName: string;
  dotClassName: string;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  hoverClassName: string;
};
