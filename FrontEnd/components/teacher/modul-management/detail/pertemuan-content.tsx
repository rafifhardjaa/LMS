"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ClipboardCheck,
  Clock,
  FileText,
  Settings2,
  Upload,
} from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import type { Meeting } from "./data";

function formatDateLabel(date: string): string {
  return moment(date, "DD-MM-YYYY").locale("id").format("dddd, D MMMM YYYY");
}

type PertemuanStatus = "selesai" | "berlangsung" | "akan-datang";

function statusOf(date: string): PertemuanStatus {
  const meeting = moment(date, "DD-MM-YYYY").startOf("day");
  const today = moment().startOf("day");
  if (meeting.isBefore(today)) return "selesai";
  if (meeting.isSame(today)) return "berlangsung";
  return "akan-datang";
}

const statusStyle: Record<PertemuanStatus, { label: string; className: string }> = {
  selesai: { label: "Selesai", className: "bg-[#F1F5F9] text-[#64748B]" },
  berlangsung: { label: "Berlangsung", className: "bg-[#EDFFF6] text-[#7A941F]" },
  "akan-datang": { label: "Akan Datang", className: "bg-[#EDF6FF] text-[#006398]" },
};

function PlaceholderBox({
  icon: Icon,
  text,
}: {
  icon: typeof FileText;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3">
      <Icon className="size-4 shrink-0 text-[#94A3B8]" />
      <p className="text-[12px] font-medium text-[#94A3B8]">{text}</p>
    </div>
  );
}

type PertemuanContentProps = {
  meeting: Meeting;
  waktuMulai?: string;
  waktuSelesai?: string;
};

export function PertemuanContent({
  meeting,
  waktuMulai,
  waktuSelesai,
}: PertemuanContentProps) {
  const [manageOpen, setManageOpen] = useState(false);
  const status = statusStyle[statusOf(meeting.date)];

  return (
    <div className="flex min-h-64 flex-1 flex-col gap-4">
      <section className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-[#b71422] to-[#8f0f1a] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-white">{meeting.label}</h2>
            <p className="mt-0.5 text-[12px] font-medium text-white/80">
              {formatDateLabel(meeting.date)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {waktuMulai && waktuSelesai && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">
                <Clock className="size-3" />
                {`${waktuMulai} - ${waktuSelesai}`}
              </span>
            )}
            <span
              className={`inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-bold ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Materi
            </p>
            <p className="mt-1.5 text-[14px] font-semibold text-[#1E293B]">
              Judul materi menyusul
            </p>
            <p className="mt-1 text-[13px] leading-6 text-[#475569]">
              Tujuan pembelajaran singkat pertemuan ini akan ditampilkan di sini.
            </p>
            <div className="mt-3">
              <PlaceholderBox
                icon={FileText}
                text="Lampiran materi (integrasi menyusul)"
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Tugas
            </p>
            <div className="mt-2.5 flex flex-col gap-2.5">
              <PlaceholderBox icon={FileText} text="File tugas (integrasi menyusul)" />
              <PlaceholderBox
                icon={Upload}
                text="Pengumpulan tugas (integrasi menyusul)"
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Kuis
            </p>
            <div className="mt-2.5 flex flex-col gap-2.5">
              <PlaceholderBox icon={FileText} text="File kuis (integrasi menyusul)" />
              <PlaceholderBox
                icon={Upload}
                text="Pengumpulan kuis (integrasi menyusul)"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-start justify-between gap-3 border-t border-[#F1F5F9] px-5 py-3.5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setManageOpen((current) => !current)}
            aria-expanded={manageOpen}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] px-4 text-[12px] font-bold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422]"
          >
            <Settings2 className="size-4" />
            Manage pertemuan
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                manageOpen && "rotate-180",
              )}
            />
          </button>
          <Link
            href="/teacher/presensi-siswa"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#b71422] px-4 text-[12px] font-bold text-white transition hover:bg-[#8f0f1a]"
          >
            <ClipboardCheck className="size-4" />
            Buka presensi
          </Link>
        </div>
      </section>

      {manageOpen && (
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <p className="text-[14px] font-bold text-[#1E293B]">Manage Pertemuan</p>
          <div className="mt-3 flex flex-col gap-2.5">
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3">
              <p className="text-[12px] font-semibold text-[#94A3B8]">
                Judul materi
              </p>
              <p className="mt-1 text-[12px] text-[#CBD5E1]">
                Fitur CRUD pertemuan menyusul
              </p>
            </div>
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3">
              <p className="text-[12px] font-semibold text-[#94A3B8]">
                Tanggal &amp; jam
              </p>
              <p className="mt-1 text-[12px] text-[#CBD5E1]">
                Fitur CRUD pertemuan menyusul
              </p>
            </div>
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3">
              <p className="text-[12px] font-semibold text-[#94A3B8]">
                Berkas / lampiran
              </p>
              <p className="mt-1 text-[12px] text-[#CBD5E1]">
                Fitur CRUD pertemuan menyusul
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
