import type { LucideIcon } from "lucide-react";

export type AttendanceStatus = "HADIR" | "SAKIT" | "IZIN" | "ALPA";
export type CheckInMethod =
  | "qr"
  | "geo"
  | "face"
  | "manual"
  | "document"
  | "dispensation";
export type AttendanceTone =
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "danger";
export type ClassFilter = "VII-A" | "VII-B" | "VIII-A" | "VIII-C";
export type SessionFilter = "today" | "yesterday" | "last-week";
export type StatusFilter = "ALL" | AttendanceStatus;

export type StudentAttendance = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  nisn: string;
  gender: "Lk" | "Pr";
  rollNo: string;
  className: ClassFilter;
  status: AttendanceStatus;
  checkInTime?: string;
  method: CheckInMethod;
  methodLabel: string;
  note: string;
  noteTone?: AttendanceTone;
};

export type AttendanceCounts = Record<AttendanceStatus, number>;

export type AttendanceSummaryMetric = {
  id: "attendance" | "sick" | "absent" | "semester";
  label: string;
  value: string;
  suffix: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconTextClassName: string;
  badge: string;
  badgeClassName: string;
  footer: string;
  footerClassName: string;
  footerIcon?: LucideIcon;
  progress?: number;
  progressClassName?: string;
  decorationClassName: string;
};

export type WeeklyTrendPoint = {
  day: string;
  value: number;
  tone: "success" | "active" | "muted";
};

export type AttendancePhoto = {
  id: string;
  src: string;
  label: string;
};

export type AtRiskStudent = {
  name: string;
  initials: string;
  nisn: string;
  percentage: number;
  note: string;
};
