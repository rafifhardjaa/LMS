"use client";

import { Download, FolderOpen, Play } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "./empty-state";
import type { Material } from "./types";

type MaterialLibraryProps = {
  materials: Material[];
  onReset: () => void;
};

export function MaterialLibrary({
  materials,
  onReset,
}: MaterialLibraryProps) {
  if (materials.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="Tidak ada materi yang cocok"
        description="Ubah filter mata pelajaran atau kata kunci untuk menampilkan modul dan slide lain."
        actionLabel="Reset filter"
        onAction={onReset}
      />
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FolderOpen className="size-[22px] text-[#006398]" />
        <h2 className="text-[20px] font-semibold tracking-tight text-[#1E293B]">
          Materi &amp; Slide Ajar
        </h2>
        <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#006398]">
          {materials.length} Modul
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {materials.map((material) => {
          const Icon = material.icon;
          const ActionIcon =
            material.format === "video" ? Play : Download;

          return (
            <button
              key={material.id}
              type="button"
              onClick={() =>
                toast.info(
                  material.format === "video"
                    ? "Pemutar materi akan dihubungkan ke media pembelajaran."
                    : "Unduhan materi akan dihubungkan ke penyimpanan berkas.",
                )
              }
              className="flex flex-col rounded-2xl bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex size-10 flex-shrink-0 items-center justify-center rounded-xl ${material.iconBgClassName} ${material.iconTextClassName}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="rounded-full bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                  {material.subject}
                </span>
              </div>
              <h3 className="mt-3 text-[14px] font-semibold leading-5 text-[#1E293B]">
                {material.title}
              </h3>
              <p className="mt-1 text-[11px] text-[#94A3B8]">
                {material.meta}
              </p>
              <span className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-[#b71422]">
                <ActionIcon className="size-4" />
                {material.actionLabel}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
