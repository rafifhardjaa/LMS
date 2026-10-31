"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  CalendarPlus,
  Clock3,
  Info,
  MapPin,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { classOptions, sessionOptions } from "./data";

type NewSessionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function NewSessionDialog({ open, onClose }: NewSessionDialogProps) {
  const [session, setSession] = useState("today");
  const [date, setDate] = useState("2025-03-20");
  const [room, setRoom] = useState("Lab Komputer & Fisika Gedung B (Lt. 2)");
  const classRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      classRef.current?.focus();
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
    toast.success("Sesi presensi baru dibuka", {
      description:
        "Token QR aktif selama 5 menit dan siap diproyeksikan di kelas.",
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
        aria-labelledby="new-session-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-white/60 bg-white shadow-[0_28px_70px_-20px_rgba(15,23,42,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
              <CalendarPlus className="size-5" />
            </span>
            <div>
              <h2
                id="new-session-title"
                className="text-base font-bold tracking-[-0.02em] text-[#1E293B]"
              >
                Buka Sesi Presensi Baru
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-[#64748B]">
                VII-A • Fisika Terapan &amp; Informatika
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
                htmlFor="new-session-class"
                className="mb-1.5 block text-[10px] font-bold text-[#334155]"
              >
                Rombel
              </label>
              <select
                id="new-session-class"
                ref={classRef}
                defaultValue="VII-A"
                className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] px-3 text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
              >
                {classOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="new-session-date"
                  className="mb-1.5 block text-[10px] font-bold text-[#334155]"
                >
                  Tanggal
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    id="new-session-date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] pl-9 pr-3 text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-session-slot"
                  className="mb-1.5 block text-[10px] font-bold text-[#334155]"
                >
                  Sesi / Jam
                </label>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                  <select
                    id="new-session-slot"
                    value={session}
                    onChange={(event) => setSession(event.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] pl-9 pr-3 text-[10px] font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
                  >
                    {sessionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="new-session-room"
                className="mb-1.5 block text-[10px] font-bold text-[#334155]"
              >
                Tempat Pelaksanaan
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="new-session-room"
                  type="text"
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                  className="h-10 w-full rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] pl-9 pr-3 text-xs font-semibold text-[#334155] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/10"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-[#DCE9FF] bg-[#F7FAFF] p-3">
              <Info className="mt-0.5 size-3.5 shrink-0 text-[#006398]" />
              <p className="text-[9px] leading-4 text-[#64748B]">
                Sesi baru akan membuka presensi QR dinamis. Pastikan rombel,
                tanggal, dan ruang praktikum sudah sesuai jadwal.
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
              Buka Sesi Presensi
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
