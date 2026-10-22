"use client";

import {
  Check,
  Clock3,
  Download,
  Eye,
  LockOpen,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import type { CurriculumModule } from "./types";

export function CurriculumPanel({
  modules,
}: {
  modules: CurriculumModule[];
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#FFEBEB] text-[#b71422]">
            <TrendingUpIcon />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-[#1E293B]">
              Capaian Pembelajaran (CP) &amp; Alur Tujuan (ATP)
            </h2>
            <p className="text-[12px] text-[#94A3B8]">
              Distribusi materi ajar semester genap pada program keahlian
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-[#F8FAFC] px-2.5 py-1 text-[12px] font-semibold text-[#006398]">
          Fase E • Semester Genap
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {modules.map((module) => (
          <CurriculumModuleRow key={module.number} module={module} />
        ))}
      </div>
    </section>
  );
}

function CurriculumModuleRow({ module }: { module: CurriculumModule }) {
  const isActive = module.state === "active";
  const isScheduled = module.state === "scheduled";

  const rowClassName = isActive
    ? "bg-[#FFEBEB]/60"
    : isScheduled
      ? "bg-[#F8FAFC] opacity-75 hover:opacity-100"
      : "bg-[#F8FAFC] hover:bg-[#F1F5F9]";

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-xl p-2 transition-colors ${rowClassName}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full ${
            module.state === "done"
              ? "bg-[#22C55E] text-white"
              : isActive
                ? "bg-[#b71422] text-white"
                : "bg-[#E2E8F0] text-[#94A3B8]"
          }`}
        >
          {module.state === "done" ? (
            <Check className="size-4" />
          ) : isActive ? (
            <Play className="size-3.5 fill-current" />
          ) : (
            <Clock3 className="size-3.5" />
          )}
        </div>
        <div className="min-w-0">
          <span className="block truncate text-[13px] font-semibold text-[#1E293B]">
            Modul {module.number}: {module.title}
          </span>
          <span
            className={`block truncate text-[11px] ${isActive ? "text-[#b71422]" : "text-[#94A3B8]"}`}
          >
            {module.meta}
          </span>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <span
          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            module.state === "done"
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : isActive
                ? "bg-white text-[#b71422]"
                : "bg-white text-[#94A3B8]"
          }`}
        >
          {module.status}
        </span>
        <button
          type="button"
          aria-label={`Aksi modul ${module.number}`}
          onClick={() =>
            toast.info(
              "Aksi modul akan dihubungkan ke halaman pengelolaan.",
            )
          }
          className={`flex size-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-white hover:text-[#1E293B] ${
            isActive ? "bg-white text-[#b71422] shadow-xs" : ""
          }`}
        >
          {module.state === "done" ? (
            <Download className="size-[18px]" />
          ) : isActive ? (
            <Eye className="size-[18px]" />
          ) : (
            <LockOpen className="size-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}
