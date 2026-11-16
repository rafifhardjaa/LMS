import type { LucideIcon } from "lucide-react";

export type ModuleState = "done" | "active" | "scheduled";

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
