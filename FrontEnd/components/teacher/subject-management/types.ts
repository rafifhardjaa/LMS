import type { LucideIcon } from "lucide-react";

export type Category = "fisika" | "sains" | "informatika";
export type CourseStatus = "lengkap" | "remedial";
export type CourseLevel = "VI" | "VII" | "VIII";
export type CategoryTab = "all" | Category | "arsip";
export type LevelFilter = "all" | CourseLevel;
export type StatusFilter = "all" | CourseStatus;
export type ModuleState = "done" | "active" | "scheduled";

export type Course = {
  id: string;
  level: CourseLevel;
  className: string;
  subject: string;
  category: Category;
  status: CourseStatus;
  badge: string;
  badgeClassName: string;
  room: string;
  weeklyHours: string;
  students: number;
  chapter: string;
  progress: number;
  progressBarClassName: string;
  progressTextClassName: string;
  average: string;
  attendance: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconTextClassName: string;
};

export type Kpi = {
  label: string;
  value: string;
  unit: string;
  unitClassName: string;
  icon: LucideIcon;
  tone: "primary" | "blue" | "green" | "amber";
  footerLeft: string;
  footerRight?: string;
  footerRightClassName?: string;
  dotClassName?: string;
};

export type CurriculumModule = {
  number: string;
  title: string;
  meta: string;
  status: string;
  state: ModuleState;
};

export type AdminItem = {
  label: string;
  status: string;
  done: boolean;
};

export type CategoryCounts = Record<CategoryTab, number>;
