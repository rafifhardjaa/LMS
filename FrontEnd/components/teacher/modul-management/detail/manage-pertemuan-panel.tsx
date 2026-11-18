"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { meetings } from "./data";

export type ManageMode = "add" | "edit" | "delete";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20";

const modeMeta: Record<ManageMode, { label: string; submit: string }> = {
  add: { label: "Tambah Baru", submit: "Simpan Pertemuan" },
  edit: { label: "Perbarui", submit: "Simpan Perubahan" },
  delete: { label: "Hapus", submit: "Hapus Pertemuan" },
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

function PlaceholderField({
  label,
  placeholder,
  required,
  type = "text",
  span = false,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  span?: boolean;
}) {
  return (
    <div className={cn(span && "sm:col-span-2")}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        disabled
        placeholder={placeholder}
        className={cn(inputClass, "cursor-not-allowed opacity-70")}
      />
    </div>
  );
}

type ManagePertemuanPanelProps = {
  mode: ManageMode;
  onDone: () => void;
};

export function ManagePertemuanPanel({
  mode,
  onDone,
}: ManagePertemuanPanelProps) {
  const [selectedPertemuan, setSelectedPertemuan] = useState(meetings[0].label);

  function handleSubmit() {
    toast.info("Fitur CRUD pertemuan menyusul");
    onDone();
  }

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-[#E2E8F0] pt-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(mode === "edit" || mode === "delete") && (
            <div className="sm:col-span-2">
              <FieldLabel required>Pertemuan</FieldLabel>
              <select
                value={selectedPertemuan}
                onChange={(event) => setSelectedPertemuan(event.target.value)}
                className={inputClass}
              >
                {meetings.map((meeting) => (
                  <option key={meeting.label} value={meeting.label}>
                    {meeting.label} — {meeting.date}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "delete" ? (
            <div className="sm:col-span-2 rounded-xl border border-[#F3C4C4] bg-[#FFEBEB] px-4 py-3">
              <p className="text-[12px] font-bold text-[#ba1a1a]">
                {selectedPertemuan} akan dihapus
              </p>
              <p className="mt-0.5 text-[11px] text-[#ba1a1a]/80">
                Pastikan data pertemuan yang dipilih sudah benar sebelum menghapus.
              </p>
            </div>
          ) : (
            <>
              <PlaceholderField
                label="Pertemuan Ke"
                placeholder="Contoh: 1"
                type="number"
                required
              />
              <PlaceholderField
                label="Tanggal"
                placeholder="Contoh: 19-07-2026"
                required
              />
              <PlaceholderField label="Jam Mulai" placeholder="Contoh: 07:30" />
              <PlaceholderField label="Jam Selesai" placeholder="Contoh: 09:10" />
              <PlaceholderField
                label="Judul Materi"
                placeholder="Contoh: Dasar-dasar jaringan komputer"
                required
                span
              />
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className={cn(
                "rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-md transition",
                mode === "delete"
                  ? "bg-[#ba1a1a] shadow-[#ba1a1a]/30 hover:bg-[#8f1515]"
                  : "bg-[#b71422] shadow-[#b71422]/30 hover:bg-[#8f0f1a]",
              )}
            >
              {modeMeta[mode].submit}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
