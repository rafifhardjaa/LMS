import { BookOpen, Eye, FolderOpen, Play, PlayCircle } from "lucide-react";
import type { BackendModule } from "@/lib/api/types";

export type SubjectKey =
  | "cs"
  | "physics"
  | "math"
  | "vocational"
  | "language"
  | "other";

export type ProgressStatus =
  | "completed"
  | "in_progress"
  | "new"
  | "loading"
  | "not_enrolled"
  | "error";

export type ModuleProgress = {
  percentage: number | null;
  loading: boolean;
  errorStatus?: number;
};

type InfoItem = { icon: typeof BookOpen; text: string };

export type ModuleCard = {
  id: string;
  title: string;
  kicker: string;
  desc: string;
  subjectId: string;
  subjectLabel: string;
  subjectClass: string;
  accentTextClass: string;
  accentBarClass: string;
  tag: string;
  tagClass: string;
  image: string | null;
  info: InfoItem[];
  progress: number | null;
  status: ProgressStatus;
  createdAt: string;
  action: string;
  actionIcon: typeof Play;
};

type SubjectTheme = {
  badgeClass: string;
  accentTextClass: string;
  accentBarClass: string;
  defaultImage: string | null;
};

const subjectThemes: Record<SubjectKey, SubjectTheme> = {
  cs: {
    badgeClass: "bg-[#0d5c52] text-white",
    accentTextClass: "text-[#0d5c52]",
    accentBarClass: "bg-[#0d5c52]",
    defaultImage: "/modules/algo-big-o.jpg",
  },
  physics: {
    badgeClass: "bg-[#00796b] text-white",
    accentTextClass: "text-[#00796b]",
    accentBarClass: "bg-[#00796b]",
    defaultImage: "/modules/thermo-wave.jpg",
  },
  math: {
    badgeClass: "bg-[#0d5c52] text-white",
    accentTextClass: "text-[#0d5c52]",
    accentBarClass: "bg-[#0d5c52]",
    defaultImage: "/modules/calc-matrix.jpg",
  },
  vocational: {
    badgeClass: "bg-[#0d5c52] text-white",
    accentTextClass: "text-[#0d5c52]",
    accentBarClass: "bg-[#0d5c52]",
    defaultImage: "/modules/uiux-dkv.jpg",
  },
  language: {
    badgeClass: "bg-[#00796b] text-white",
    accentTextClass: "text-[#00796b]",
    accentBarClass: "bg-[#00796b]",
    defaultImage: "/modules/english-research.jpg",
  },
  other: {
    badgeClass: "bg-[#3f4946] text-white",
    accentTextClass: "text-[#3f4946]",
    accentBarClass: "bg-[#3f4946]",
    defaultImage: null,
  },
};

function subjectKeyFromName(name: string | null): SubjectKey {
  const value = (name ?? "").toLowerCase();
  if (value.includes("informatika") || value.includes("komputasi")) return "cs";
  if (value.includes("fisika")) return "physics";
  if (value.includes("matematika")) return "math";
  if (value.includes("bahasa") || value.includes("english")) return "language";
  if (
    value.includes("dkv") ||
    value.includes("desain") ||
    value.includes("kejuruan") ||
    value.includes("tkr")
  ) {
    return "vocational";
  }
  return "other";
}

export function buildSubjectTabs(modules: BackendModule[]) {
  const seen = new Map<string, string>();
  for (const item of modules) {
    if (!seen.has(item.subject_id)) {
      seen.set(item.subject_id, item.subject_name ?? "Mata Pelajaran");
    }
  }

  return [
    { id: "all", label: "Semua Mata Pelajaran" },
    ...[...seen].map(([id, label]) => ({ id, label })),
  ];
}

export function toModuleCard(
  module: BackendModule,
  progress: ModuleProgress
): ModuleCard {
  const theme = subjectThemes[subjectKeyFromName(module.subject_name)];
  const subjectLabel = module.subject_name ?? "Mata Pelajaran";
  const percentage = progress.percentage;
  const status: ProgressStatus = progress.loading
    ? "loading"
    : percentage !== null
      ? percentage >= 100
        ? "completed"
        : percentage > 0
          ? "in_progress"
          : "new"
      : progress.errorStatus === 403
        ? "not_enrolled"
        : "error";

  return {
    id: module.id,
    title: module.title,
    kicker: `MODUL ${module.order_index + 1} • ${subjectLabel.toUpperCase()}`,
    desc:
      module.description ??
      "Materi pembelajaran terstruktur untuk mata pelajaran ini.",
    subjectId: module.subject_id,
    subjectLabel,
    subjectClass: theme.badgeClass,
    accentTextClass: theme.accentTextClass,
    accentBarClass: theme.accentBarClass,
    tag: module.teacher_name ?? "Modul Pembelajaran",
    tagClass: "bg-white/90 text-[#0d5c52] backdrop-blur-sm",
    image: theme.defaultImage,
    info: [
      { icon: BookOpen, text: "Modul Pembelajaran" },
      { icon: FolderOpen, text: "Materi & Diskusi" },
    ],
    progress: percentage,
    status,
    createdAt: module.created_at,
    action:
      status === "completed"
        ? "Ulas Kembali"
        : status === "new"
          ? "Mulai Belajar"
          : "Buka Modul",
    actionIcon:
      status === "completed" ? Eye : status === "new" ? Play : PlayCircle,
  };
}

export function progressDisplay(module: ModuleCard) {
  switch (module.status) {
    case "loading":
      return {
        text: "Menghitung progress...",
        textClass: "text-[#6f7976]",
        barClass: "bg-[#cee8e1]",
      };
    case "not_enrolled":
      return {
        text: "Belum terdaftar di mapel",
        textClass: "text-[#6f7976]",
        barClass: "bg-[#bec9c5]",
      };
    case "error":
      return {
        text: "Progress gagal dimuat",
        textClass: "text-[#93000a]",
        barClass: "bg-[#ffdad6]",
      };
    case "new":
      return {
        text: "0% Belum Dimulai",
        textClass: "text-[#6f7976]",
        barClass: "bg-[#bec9c5]",
      };
    case "completed":
      return {
        text: "100% Selesai",
        textClass: "text-[#0d5c52] flex items-center gap-1",
        barClass: module.accentBarClass,
      };
    default:
      return {
        text: `${module.progress ?? 0}% Selesai`,
        textClass: module.accentTextClass,
        barClass: module.accentBarClass,
      };
  }
}
