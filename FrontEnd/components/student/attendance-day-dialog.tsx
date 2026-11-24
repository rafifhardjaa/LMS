"use client";

import { useState } from "react";
import { ClipboardCheck, Info } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import type {
  AttendanceRecapDay,
  AttendanceStatus,
} from "@/lib/api/master-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  hadir: "bg-[#edf7f4] text-[#0d5c52]",
  sakit: "bg-[#FEF3C7] text-[#B45309]",
  izin: "bg-[#EFF6FF] text-[#006398]",
  alpa: "bg-[#FFEBEB] text-[#b91c1c]",
};

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  alpa: "Alpa",
};

export function AttendanceDayDialog({ day }: { day: AttendanceRecapDay }) {
  const [open, setOpen] = useState(false);
  const formattedDate = moment(day.date, "YYYY-MM-DD")
    .locale("id")
    .format("dddd, D MMMM YYYY");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Presensi ${formattedDate}`}
        className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#CEE8E1] bg-[#F8FAFC] px-2 text-[10px] font-bold text-[#0d5c52] transition hover:border-[#0d5c52]/40 hover:bg-[#edf7f4]"
      >
        <ClipboardCheck className="size-3" />
        Presensi
      </button>

      <DialogContent
        showCloseButton={false}
        className="max-w-md overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.35)]"
      >
        <div className="flex flex-col gap-1 bg-gradient-to-r from-[#0d5c52] to-[#071f1c] px-5 py-4">
          <DialogTitle className="text-[15px] font-extrabold tracking-tight text-white">
            Presensi Harian
          </DialogTitle>
          <DialogDescription className="text-[12px] font-medium text-white/80">
            {formattedDate}
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Hari
              </p>
              <p className="mt-0.5 text-[12px] font-bold text-[#1E293B]">
                {day.day}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Status
              </p>
              <p className="mt-0.5 text-[12px] font-bold text-[#1E293B]">
                {day.status ? STATUS_LABELS[day.status] : "—"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Keterangan
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-[#475569]">
                {day.note || "—"}
              </p>
            </div>
          </div>

          {day.status && (
            <div className="flex justify-start">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLES[day.status]}`}
              >
                {STATUS_LABELS[day.status]}
              </span>
            </div>
          )}

          {!day.status && (
            <div className="flex items-start gap-3 rounded-xl bg-[#edf7f4] p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0d5c52]">
                <Info className="size-4" />
              </span>
              <p className="text-[12px] leading-5 text-[#536360]">
                Kehadiran tanggal ini belum dicatat oleh guru atau wali kelas.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-[#F1F5F9] px-5 py-3">
          <DialogClose
            render={
              <Button
                variant="outline"
                className="h-9 px-4 text-[12px] font-bold"
              />
            }
          >
            Tutup
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
