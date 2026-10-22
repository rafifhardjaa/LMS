"use client";

import { useState } from "react";
import { LockKeyhole, LockOpen, NotebookPen, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { journalDefaults } from "./data";

type AttendanceJournalProps = {
  isLocked: boolean;
  onLock: () => void;
  onUnlock: () => void;
};

export function AttendanceJournal({
  isLocked,
  onLock,
  onUnlock,
}: AttendanceJournalProps) {
  const [topic, setTopic] = useState(journalDefaults.topic);
  const [location, setLocation] = useState(journalDefaults.location);
  const [notes, setNotes] = useState(journalDefaults.notes);

  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#FFEBEB] text-[#b71422]">
            <NotebookPen className="size-4" />
          </span>
          <h2 className="text-[13px] font-bold text-[#1E293B]">
            Jurnal Pembelajaran &amp; Berita Acara Tatap Muka
          </h2>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
          Kurikulum Merdeka 2024/2025
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label
            htmlFor="journal-topic"
            className="mb-1.5 block text-[10px] font-bold text-[#334155]"
          >
            Topik Materi / Modul Ajar
          </label>
          <input
            id="journal-topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            disabled={isLocked}
            className="h-9 w-full rounded-lg border border-transparent bg-[#F1F5F9] px-3 text-[10px] font-medium text-[#334155] outline-none transition focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <div>
          <label
            htmlFor="journal-location"
            className="mb-1.5 block text-[10px] font-bold text-[#334155]"
          >
            Tempat Pelaksanaan / Laboratorium
          </label>
          <input
            id="journal-location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            disabled={isLocked}
            className="h-9 w-full rounded-lg border border-transparent bg-[#F1F5F9] px-3 text-[10px] font-medium text-[#334155] outline-none transition focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>

      <div className="mt-3">
        <label
          htmlFor="journal-notes"
          className="mb-1.5 block text-[10px] font-bold text-[#334155]"
        >
          Catatan Observasi Aktivitas &amp; Kedisiplinan
        </label>
        <textarea
          id="journal-notes"
          rows={2}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={isLocked}
          placeholder="Tuliskan catatan kelas..."
          className="w-full resize-none rounded-lg border border-transparent bg-[#F1F5F9] px-3 py-2 text-[10px] font-medium leading-5 text-[#334155] outline-none transition placeholder:text-[#94A3B8] focus:border-[#FFB3B3] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]/40 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-[#F1F5F9] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 text-[9px] font-medium text-[#94A3B8]">
          <LockKeyhole className="size-3.5 text-[#16A34A]" />
          <span>
            {isLocked
              ? "Sesi telah diverifikasi dan dikunci."
              : "Sesi terkunci otomatis setelah diverifikasi oleh guru pengampu."}
          </span>
          {isLocked && (
            <button
              type="button"
              onClick={onUnlock}
              className="inline-flex items-center gap-1 font-bold text-[#b71422] hover:underline"
            >
              <LockOpen className="size-3" />
              Buka kunci
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onLock}
          disabled={isLocked}
          className={cn(
            "flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-[10px] font-bold transition",
            isLocked
              ? "cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]"
              : "bg-[#b71422] text-white shadow-[0_8px_18px_-8px_rgba(183,20,34,0.7)] hover:bg-[#a1121f]",
          )}
        >
          {isLocked ? (
            <LockKeyhole className="size-4" />
          ) : (
            <ShieldCheck className="size-4" />
          )}
          {isLocked
            ? "Presensi Terkunci & Terverifikasi"
            : "Kunci & Finalisasi Presensi Sesi Ini"}
        </button>
      </div>
    </section>
  );
}
