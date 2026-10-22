"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  Info,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { assessmentOptions, classOptions, kktp } from "./data";

type GradeInputDialogProps = {
  open: boolean;
  onClose: () => void;
};

type InputMode = "manual" | "excel";

export function GradeInputDialog({ open, onClose }: GradeInputDialogProps) {
  const [mode, setMode] = useState<InputMode>("manual");
  const [assessment, setAssessment] = useState("formatif");
  const [date, setDate] = useState("2025-03-18");
  const [kktpValue, setKktpValue] = useState(String(kktp));
  const assessmentRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      assessmentRef.current?.focus();
    }, 50);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast.success("Lembar nilai siap dibuka", {
      description:
        mode === "manual"
          ? "Form input nilai 35 siswa telah disiapkan pada asesmen terpilih."
          : "Template Excel berhasil dibuat. Unggah kembali setelah diisi.",
    });
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0F172A]/45 p-3 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grade-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-white/60 bg-white shadow-[0_28px_70px_-20px_rgba(15,23,42,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
              <ClipboardList className="size-5" />
            </span>
            <div>
              <h2
                id="grade-dialog-title"
                className="text-base font-bold tracking-[-0.02em] text-[#1E293B]"
              >
                Input Asesmen Baru
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-[#64748B]">
                Kelas VII - A • Fisika Terapan
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup dialog"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#334155]"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-4">
            <div>
              <label
                htmlFor="grade-assessment"
                className="mb-1.5 block text-[10px] font-bold text-[#334155]"
              >
                Jenis Asesmen
              </label>
              <select
                id="grade-assessment"
                ref={assessmentRef}
                value={assessment}
                onChange={(event) => setAssessment(event.target.value)}
                className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] px-3 text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
              >
                {assessmentOptions
                  .filter((option) => option.value !== "all")
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="grade-class"
                  className="mb-1.5 block text-[10px] font-bold text-[#334155]"
                >
                  Rombel
                </label>
                <select
                  id="grade-class"
                  defaultValue="VII-A"
                  className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] px-2.5 text-[11px] font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
                >
                  {classOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="grade-kktp"
                  className="mb-1.5 block text-[10px] font-bold text-[#334155]"
                >
                  KKTP
                </label>
                <input
                  id="grade-kktp"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={kktpValue}
                  onChange={(event) => setKktpValue(event.target.value)}
                  className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] px-3 font-mono text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="grade-date"
                className="mb-1.5 block text-[10px] font-bold text-[#334155]"
              >
                Tanggal Pelaksanaan
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="grade-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] pl-9 pr-3 text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
                />
              </div>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-[10px] font-bold text-[#334155]">
                Metode Input
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={mode === "manual"}
                  onClick={() => setMode("manual")}
                  className={cn(
                    "flex items-start gap-2 rounded-xl border p-3 text-left transition",
                    mode === "manual"
                      ? "border-[#b71422] bg-[#FFF8F8] ring-1 ring-[#b71422]/10"
                      : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]",
                  )}
                >
                  <ClipboardList
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      mode === "manual"
                        ? "text-[#b71422]"
                        : "text-[#94A3B8]",
                    )}
                  />
                  <span>
                    <span className="block text-[10px] font-bold text-[#334155]">
                      Input Langsung
                    </span>
                    <span className="mt-0.5 block text-[9px] leading-3.5 text-[#94A3B8]">
                      Isi nilai per siswa
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={mode === "excel"}
                  onClick={() => setMode("excel")}
                  className={cn(
                    "flex items-start gap-2 rounded-xl border p-3 text-left transition",
                    mode === "excel"
                      ? "border-[#b71422] bg-[#FFF8F8] ring-1 ring-[#b71422]/10"
                      : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]",
                  )}
                >
                  <FileSpreadsheet
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      mode === "excel"
                        ? "text-[#b71422]"
                        : "text-[#94A3B8]",
                    )}
                  />
                  <span>
                    <span className="block text-[10px] font-bold text-[#334155]">
                      Impor Excel
                    </span>
                    <span className="mt-0.5 block text-[9px] leading-3.5 text-[#94A3B8]">
                      Unggah template .xlsx
                    </span>
                  </span>
                </button>
              </div>
            </fieldset>

            <div className="flex items-start gap-2 rounded-xl border border-[#DCE9FF] bg-[#F7FAFF] p-3">
              <Info className="mt-0.5 size-3.5 shrink-0 text-[#006398]" />
              <p className="text-[9px] leading-4 text-[#64748B]">
                Nilai tersinkron ke e-Rapor setelah lembar disimpan. Pastikan
                KKTP dan tanggal asesmen sesuai agenda rombel.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-3.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 rounded-xl border-[#DCE5EE] px-4 text-[11px] font-semibold text-[#475569] shadow-none"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="h-9 rounded-xl bg-[#b71422] px-4 text-[11px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(183,20,34,0.7)] hover:bg-[#a1121f]"
            >
              {mode === "manual" ? "Buka Lembar Nilai" : "Unduh Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
