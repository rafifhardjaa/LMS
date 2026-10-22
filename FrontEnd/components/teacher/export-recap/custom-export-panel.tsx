"use client";

import { useState } from "react";
import {
  Braces,
  Download,
  FileText,
  SlidersHorizontal,
  Table2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  customExportComponents,
  customFormatOptions,
} from "./data";
import type {
  CustomExportFormat,
  CustomExportRequest,
} from "./types";

type CustomExportPanelProps = {
  onGenerate: (request: CustomExportRequest) => void;
};

const formatIcons = {
  xlsx: Table2,
  pdf: FileText,
  csv: Braces,
};

export function CustomExportPanel({ onGenerate }: CustomExportPanelProps) {
  const [components, setComponents] = useState(() =>
    customExportComponents.map((component) => ({
      ...component,
      checked: component.defaultChecked,
    })),
  );
  const [format, setFormat] = useState<CustomExportFormat>("xlsx");
  const [signature, setSignature] = useState(true);

  const selectedCount = components.filter(
    (component) => component.checked,
  ).length;

  function toggleComponent(id: string) {
    setComponents((current) =>
      current.map((component) =>
        component.id === id
          ? { ...component, checked: !component.checked }
          : component,
      ),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onGenerate({
      format,
      componentCount: selectedCount,
      signature,
    });
  }

  return (
    <section
      id="custom-export-panel"
      className="scroll-mt-24 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
          <SlidersHorizontal className="size-4" />
        </span>
        <div>
          <h2 className="text-[13px] font-bold text-[#1E293B]">
            Parameter Ekspor Kustom
          </h2>
          <p className="text-[9px] text-[#94A3B8]">
            Sesuaikan modul laporan per kebutuhan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
            Komponen yang Disertakan:
          </span>

          {components.map((component) => (
            <label
              key={component.id}
              className={cn(
                "flex cursor-pointer items-start gap-2 rounded-xl bg-[#F8FAFC] p-2 transition-colors hover:bg-[#F1F5F9]",
                !component.checked && "opacity-75",
              )}
            >
              <input
                type="checkbox"
                checked={component.checked}
                onChange={() => toggleComponent(component.id)}
                className="mt-0.5 size-3.5 shrink-0 cursor-pointer rounded accent-[#b71422]"
              />
              <span className="flex flex-col">
                <span className="text-[10px] font-bold leading-4 text-[#1E293B]">
                  {component.label}
                </span>
                <span className="text-[9px] leading-4 text-[#94A3B8]">
                  {component.description}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-[#F1F5F9] p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-[#1E293B]">
              QR Validasi &amp; Tanda Tangan Digital
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={signature}
              aria-label="QR Validasi dan Tanda Tangan Digital"
              onClick={() => setSignature((current) => !current)}
              className={cn(
                "relative h-5 w-10 shrink-0 rounded-full transition-colors",
                signature ? "bg-[#b71422]" : "bg-[#CBD5E1]",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
                  signature ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
          <p className="text-[9px] leading-4 text-[#94A3B8]">
            Disahkan secara resmi oleh Kepala Sekolah SMK Mataram (Dr. H. M.
            Zulkifli, M.Pd).
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
            Pilih Format Output:
          </span>
          <div
            role="radiogroup"
            aria-label="Pilih format output"
            className="grid grid-cols-3 gap-1.5"
          >
            {customFormatOptions.map((option) => {
              const Icon = formatIcons[option.value];
              const isActive = format === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setFormat(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-center transition",
                    isActive
                      ? "bg-[#FFEBEB] text-[#b71422]"
                      : "bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="text-[9px] font-bold leading-3">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="mt-0.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#b71422] px-4 text-[10px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(183,20,34,0.75)] transition hover:bg-[#a1121f] active:scale-[0.98]"
        >
          <Download className="size-4" />
          Generate Berkas Kustom Sekarang
        </button>
      </form>
    </section>
  );
}
