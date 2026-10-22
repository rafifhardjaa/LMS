import type { LucideIcon } from "lucide-react";

export type ClassFilter = "VII-A" | "VII-B" | "VI-A" | "VI-B" | "VIII-A";
export type AssessmentFilter = "all" | "formatif" | "sts" | "praktik";
export type GradeTone = "success" | "danger";

export type SummaryMetric = {
  id: "average" | "completion" | "remedial" | "sync";
  label: string;
  value: string;
  suffix: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconTextClassName: string;
  footerLeft: string;
  footerLeftClassName?: string;
  footerRight: string;
  footerRightClassName?: string;
  footerIcon?: LucideIcon;
  footerDotClassName?: string;
  progress?: number;
  progressClassName?: string;
  active?: boolean;
};

export type StudentGrade = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  nisn: string;
  rollNo: string;
  className: ClassFilter;
  formatif: number;
  sts: number;
  praktik: number;
  remedialReason?: string;
};

export type GradeStatus = {
  label: string;
  className: string;
  tone: GradeTone;
};

export type DistributionTier = {
  id: string;
  label: string;
  students: number;
  range: string;
  share: string;
  height: number;
  barClassName: string;
  labelClassName: string;
  cardClassName: string;
  predicate: string;
  status: string;
  statusClassName: string;
};

export type DiagnosticTopic = {
  id: string;
  title: string;
  percent: number;
  percentLabel: string;
  textClassName: string;
  barClassName: string;
  note: string;
  noteClassName?: string;
  isLow?: boolean;
};

export type RemedialGroup = {
  id: string;
  students: string;
  status: string;
  statusClassName: string;
  schedule: string;
  room?: string;
  waiting?: boolean;
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconTextClassName: string;
  hoverGroupClassName: string;
  danger?: boolean;
};
