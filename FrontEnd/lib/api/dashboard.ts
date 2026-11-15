import { apiFetch } from "./client";
import type { ApiSuccess } from "./types";

export interface ReadinessDatum {
  entity: string;
  pct: number;
  gap: string;
}

export interface TeachingLoadDatum {
  name: string;
  value: number;
}

export interface ScheduleCoverageDatum {
  day: string;
  fullName: string;
  terisi: number;
  kosong: number;
  bentrok: number;
}

export interface StudentDistributionDatum {
  majorCode: string;
  majorName: string;
  x: number;
  xi: number;
  xii: number;
  tanpa: number;
  total: number;
}

export interface DashboardStats {
  readiness: ReadinessDatum[];
  teachingLoad: TeachingLoadDatum[];
  scheduleCoverage: ScheduleCoverageDatum[];
  studentDistribution: StudentDistributionDatum[];
}

export const dashboardApi = {
  stats: () => apiFetch<ApiSuccess<DashboardStats>>("/api/v1/dashboard/stats"),
} as const;
