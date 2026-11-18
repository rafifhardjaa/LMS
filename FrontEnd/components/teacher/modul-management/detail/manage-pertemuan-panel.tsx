"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";
import { cn } from "@/lib/utils";
import { SearchableDropdown } from "@/components/admin/searchable-dropdown";
import { masterDataApi } from "@/lib/api/master-data";
import type { CourseMeeting } from "@/lib/api/master-data";

export type ManageMode = "add" | "edit" | "delete";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20";

const modeMeta: Record<ManageMode, { label: string; submit: string }> = {
  add: { label: "Tambah Baru", submit: "Simpan Pertemuan" },
  edit: { label: "Perbarui", submit: "Simpan Perubahan" },
  delete: { label: "Hapus", submit: "Hapus Pertemuan" },
};

type ManagePertemuanPanelProps = {
  mode: ManageMode;
  subjectId: string;
  classId: string;
  meetings: CourseMeeting[];
  onDone: () => void;
  onMeetingsChanged: () => void;
};

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-[#4e566c]">
      {children} {required && <span className="text-[#ba1a1a]">*</span>}
    </label>
  );
}

export function ManagePertemuanPanel({
  mode,
  subjectId,
  classId,
  meetings,
  onDone,
  onMeetingsChanged,
}: ManagePertemuanPanelProps) {
  const sortedMeetings = [...meetings].sort(
    (first, second) => first.meetingNumber - second.meetingNumber
  );
  const lastMeeting = sortedMeetings.at(-1);
  const initialMeeting = sortedMeetings.find(
    (meeting) => meeting.meetingNumber === (lastMeeting?.meetingNumber ?? 0)
  );
  const meetingOptions = sortedMeetings.map((meeting) => ({
    value: String(meeting.meetingNumber),
    label: `Pertemuan ${meeting.meetingNumber} — ${meeting.meetingDate}`,
  }));

  const [selectedNumber, setSelectedNumber] = useState(
    lastMeeting?.meetingNumber ?? 0
  );
  const [number, setNumber] = useState(
    lastMeeting ? lastMeeting.meetingNumber + 1 : 1
  );
  const [date, setDate] = useState(
    mode === "add"
      ? lastMeeting
        ? moment(lastMeeting.meetingDate, ["YYYY-MM-DD"])
            .add(7, "days")
            .format("YYYY-MM-DD")
        : moment().add(7, "days").format("YYYY-MM-DD")
      : (initialMeeting?.meetingDate ?? "")
  );
  const [title, setTitle] = useState(
    mode === "add" ? "" : (initialMeeting?.title ?? "")
  );
  const [objective, setObjective] = useState(
    mode === "add" ? "" : (initialMeeting?.objective ?? "")
  );
  const [loading, setLoading] = useState(false);

  function handleSelectMeeting(value: string) {
    const next = Number(value);
    setSelectedNumber(next);
    const found = sortedMeetings.find(
      (meeting) => meeting.meetingNumber === next
    );
    if (found) {
      setDate(found.meetingDate);
      setTitle(found.title);
      setObjective(found.objective);
    }
  }

  const selectedMeeting = sortedMeetings.find(
    (meeting) => meeting.meetingNumber === selectedNumber
  );

  async function handleSubmit() {
    if (!date || !title.trim() || !objective.trim()) {
      toast.error("Lengkapi semua field yang wajib diisi");
      return;
    }

    setLoading(true);
    const res =
      mode === "add"
        ? await masterDataApi.courseDetails.meetings.create(subjectId, {
            classId,
            meetingNumber: number,
            meetingDate: date,
            title: title.trim(),
            objective: objective.trim(),
          })
        : mode === "edit"
          ? await masterDataApi.courseDetails.meetings.update(subjectId, selectedNumber, {
              classId,
              meetingDate: date,
              title: title.trim(),
              objective: objective.trim(),
            })
          : await masterDataApi.courseDetails.meetings.remove(subjectId, selectedNumber, classId);
    setLoading(false);

    if (res.error) {
      toast.error("Gagal menyimpan pertemuan", {
        description: res.error.message ?? res.error.error,
      });
      return;
    }

    toast.success(
      mode === "add"
        ? "Pertemuan berhasil ditambahkan"
        : mode === "edit"
          ? "Pertemuan berhasil diperbarui"
          : "Pertemuan berhasil dihapus"
    );
    onMeetingsChanged();
    onDone();
  }

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-[#E2E8F0] pt-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(mode === "edit" || mode === "delete") && (
            <div className="sm:col-span-2">
              <FieldLabel required>Pertemuan</FieldLabel>
              <SearchableDropdown
                id="manage-pertemuan"
                value={String(selectedNumber)}
                onChange={handleSelectMeeting}
                options={meetingOptions}
                label="Pilih pertemuan"
                searchPlaceholder="Cari pertemuan..."
                emptyMessage="Pertemuan tidak ditemukan."
                variant="light"
              />
            </div>
          )}

          {mode === "delete" ? (
            <div className="sm:col-span-2 rounded-xl border border-[#F3C4C4] bg-[#FFEBEB] px-4 py-3">
              <p className="text-[12px] font-bold text-[#ba1a1a]">
                Pertemuan {selectedMeeting?.meetingNumber ?? selectedNumber} akan dihapus
              </p>
              <p className="mt-0.5 text-[11px] text-[#ba1a1a]/80">
                {selectedMeeting
                  ? `${selectedMeeting.title} · ${selectedMeeting.meetingDate} · ${selectedMeeting.day}`
                  : "Pastikan data pertemuan yang dipilih sudah benar sebelum menghapus."}
              </p>
            </div>
          ) : (
            <>
              <div>
                <FieldLabel required>Pertemuan Ke</FieldLabel>
                {mode === "add" ? (
                  <input
                    type="number"
                    min={1}
                    value={number}
                    onChange={(event) => setNumber(Number(event.target.value))}
                    className={inputClass}
                  />
                ) : (
                  <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 text-xs font-semibold text-slate-700">
                    Pertemuan {selectedNumber}
                  </div>
                )}
              </div>

              <div>
                <FieldLabel required>Tanggal</FieldLabel>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel required>Judul Materi</FieldLabel>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: Dasar-dasar jaringan komputer"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel required>Tujuan Singkat</FieldLabel>
                <textarea
                  value={objective}
                  onChange={(event) => setObjective(event.target.value)}
                  placeholder="Contoh: Peserta didik mampu …"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-row items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <BadgeCheck className="size-4 text-emerald-600" />
            <span>Data pertemuan mengikuti kurikulum</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDone}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Batal
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              disabled={loading}
              onClick={handleSubmit}
              className={cn(
                "flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-60",
                mode === "delete"
                  ? "bg-[#ba1a1a] shadow-[#ba1a1a]/30 hover:bg-[#8f1515]"
                  : "bg-[#b71422] shadow-[#b71422]/30 hover:bg-[#8f0f1a]",
              )}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {modeMeta[mode].submit}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
