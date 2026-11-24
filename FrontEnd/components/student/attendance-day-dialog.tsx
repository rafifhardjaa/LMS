"use client";

import { useState } from "react";
import { ClipboardCheck, Info, Loader2 } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import { toast } from "sonner";
import type {
  AttendanceRecapDay,
  AttendanceStatus,
} from "@/lib/api/master-data";
import { masterDataApi } from "@/lib/api/master-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  alpa: "Alpa",
};

const SELF_STATUS_OPTIONS: Array<"hadir" | "sakit" | "izin"> = [
  "hadir",
  "sakit",
  "izin",
];

export function AttendanceDayDialog({
  day,
  onSaved,
}: {
  day: AttendanceRecapDay;
  onSaved?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"hadir" | "sakit" | "izin" | "">("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const formattedDate = moment(day.date, "YYYY-MM-DD")
    .locale("id")
    .format("dddd, D MMMM YYYY");
  const recorded = Boolean(day.status);

  async function handleSave() {
    if (!status) return;
    setSaving(true);

    try {
      const res = await masterDataApi.attendance.mySave({
        date: day.date,
        status,
        note,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal menyimpan presensi");
      }
      toast.success("Presensi berhasil dicatat");
      setOpen(false);
      onSaved?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan presensi",
      );
    } finally {
      setSaving(false);
    }
  }

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

          {recorded ? (
            <div className="flex items-start gap-3 rounded-xl bg-[#edf7f4] p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0d5c52]">
                <Info className="size-4" />
              </span>
              <p className="text-[12px] leading-5 text-[#536360]">
                Presensi untuk tanggal ini sudah tercatat dan tidak dapat
                diubah kembali. Hubungi wali kelas jika ada kesalahan.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-bold text-[#1E293B]">
                Pilih status kehadiran Anda
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SELF_STATUS_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-bold transition ${
                      status === option
                        ? "border-[#0d5c52] bg-[#edf7f4] text-[#0d5c52]"
                        : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#0d5c52]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`attendance-${day.date}`}
                      value={option}
                      checked={status === option}
                      onChange={() => setStatus(option)}
                      className="sr-only"
                    />
                    {STATUS_LABELS[option]}
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Catatan opsional (mis. alasan sakit/izin)"
                className="h-9 w-full rounded-xl border border-[#DCE5EE] bg-white px-3 text-[12px] text-[#1E293B] outline-none transition focus:border-[#0d5c52] focus:ring-2 focus:ring-[#0d5c52]/15"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#F1F5F9] px-5 py-3">
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
          {!recorded && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={!status || saving}
              className="h-9 gap-2 px-4 text-[12px] font-bold disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ClipboardCheck className="size-4" />
              )}
              {saving ? "Menyimpan…" : "Simpan presensi"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
