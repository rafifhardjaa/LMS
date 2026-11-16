export const READINESS_COLORS = [
  "#6c5dd3",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
] as const;

export const TEACHING_LOAD_COLORS = [
  "#06b6d4",
  "#84cc16",
  "#ef4444",
  "#a855f7",
] as const;

export const SCHEDULE_DAY_COLORS = [
  "#14b8a6",
  "#f97316",
  "#22c55e",
  "#6366f1",
  "#0ea5e9",
  "#f43f5e",
] as const;

export const SCHEDULE_SERIES_COLORS = {
  tanpaGuru: "#eab308",
  bentrok: "#f472b6",
} as const;

export const STUDENT_DISTRIBUTION_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#65a30d",
  "#dc2626",
  "#db2777",
  "#9333ea",
  "#0d9488",
  "#16a34a",
] as const;

export const CHART_SPARE_COLORS = ["#818cf8", "#fbbf24", "#0284c7"] as const;

export function colorAt(colors: readonly string[], index: number): string {
  return colors[index % colors.length];
}
