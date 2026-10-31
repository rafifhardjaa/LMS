"use client";

import { Cloud, Download, FolderOpen, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Material } from "./types";

export function MaterialPanel({ materials }: { materials: Material[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="size-[22px] text-[#006398]" />
          <h2 className="text-[18px] font-semibold tracking-tight text-[#1E293B]">
            Modul &amp; Bahan Ajar
          </h2>
        </div>
        <button
          type="button"
          onClick={() =>
            toast.info("Form unggah modul akan dihubungkan ke backend.")
          }
          aria-label="Tambah modul ajar"
          className="flex size-8 items-center justify-center rounded-full bg-[#F1F5F9] text-[#475569] transition-colors hover:bg-[#FFEBEB] hover:text-[#b71422]"
        >
          <Plus className="size-[18px]" />
        </button>
      </div>

      {materials.length > 0 ? (
        materials.map((material) => {
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
              className="group flex items-start justify-between gap-2 rounded-xl bg-[#F8FAFC] p-3 text-left transition-colors hover:bg-[#F1F5F9]"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`flex size-9 flex-shrink-0 items-center justify-center rounded-lg ${material.iconBgClassName} ${material.iconTextClassName}`}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[12px] font-semibold text-[#1E293B] transition-colors group-hover:text-[#b71422]">
                    {material.title}
                  </span>
                  <span className="truncate text-[11px] text-[#94A3B8]">
                    {material.meta}
                  </span>
                </span>
              </div>
              <ActionIcon className="mt-1 size-[18px] flex-shrink-0 text-[#94A3B8] transition-colors group-hover:text-[#b71422]" />
            </button>
          );
        })
      ) : (
        <p className="rounded-xl bg-[#F8FAFC] px-3 py-6 text-center text-[12px] text-[#94A3B8]">
          Tidak ada materi yang cocok dengan pencarian.
        </p>
      )}

      <button
        type="button"
        onClick={() =>
          toast.info("Google Drive guru akan dihubungkan pada tahap integrasi.")
        }
        className="mt-1 flex items-center justify-between rounded-xl bg-[#006398]/5 px-3 py-2.5 text-left text-[12px] font-semibold text-[#006398] transition-colors hover:bg-[#006398]/10"
      >
        <span className="flex items-center gap-2">
          <Cloud className="size-5" />
          Google Drive Guru (Kapasitas: 84 GB / 100 GB)
        </span>
        <span className="text-[16px]">›</span>
      </button>
    </section>
  );
}
