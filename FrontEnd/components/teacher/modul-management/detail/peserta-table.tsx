"use client";

import { Search, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/animations";
import type { StudentSummary } from "@/lib/api/master-data";

const ROW_BG = ["#FFEDED", "#EDFFF6", "#EDF6FF"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type Accent = "teacher" | "student";

const ACCENT_STYLES: Record<Accent, { avatarBg: string; avatarText: string }> = {
  teacher: { avatarBg: "bg-[#FFEBEB]", avatarText: "text-[#b71422]" },
  student: { avatarBg: "bg-[#d4eee7]", avatarText: "text-[#0d5c52]" },
};

type PesertaTableProps = {
  students: StudentSummary[];
  teacherName?: string | null;
  classLabel: string;
  majorName?: string | null;
  loading: boolean;
  error: string | null;
  accent?: Accent;
};

export function PesertaTable({
  students,
  teacherName,
  classLabel,
  majorName,
  loading,
  error,
  accent = "teacher",
}: PesertaTableProps) {
  const styles = ACCENT_STYLES[accent];
  return (
    <section className="flex min-h-64 flex-1 flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${styles.avatarBg} ${styles.avatarText} text-[13px] font-bold`}>
            {initials(teacherName ?? "")}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-[#1E293B]">
              {teacherName ?? "-"}
            </h2>
            <p className="mt-0.5 truncate text-[11px] leading-4 text-[#64748B]">
              {[classLabel, majorName].filter(Boolean).join(" - ") || "-"}
            </p>
          </div>
        </div>
        <span className="inline-flex h-7 shrink-0 items-center self-start rounded-lg bg-[#F8FAFC] px-2.5 text-[11px] font-semibold text-[#64748B] sm:self-auto">
          {students.length} Siswa
        </span>
      </div>

      {error ? (
        <FadeIn className="m-5 rounded-2xl bg-[#FEE2E2] px-4 py-3 text-[13px] text-[#b91c1c]">
          {error}
        </FadeIn>
      ) : loading ? (
        <div className="flex flex-col gap-2 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-9 w-full animate-pulse rounded-lg bg-[#F1F5F9]"
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] text-[9px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                <th className="px-5 py-2.5">No</th>
                <th className="px-3 py-2.5">Nama Siswa</th>
                <th className="px-3 py-2.5">NIS/NISN</th>
                <th className="px-3 py-2.5">Jenis Kelamin</th>
                <th className="px-5 py-2.5 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9]">
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.03, 0.45),
                  }}
                  style={{ backgroundColor: ROW_BG[index % 3] }}
                  className="transition-colors hover:brightness-[0.97]"
                >
                  <td className="px-5 py-2.5 text-[11px] font-bold tabular-nums text-[#1E293B]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E2E8F0] text-[#64748B]">
                        <UserRound className="size-3" />
                      </span>
                      <span className="text-[11px] font-bold text-[#1E293B]">
                        {student.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-medium tabular-nums text-[#475569]">
                    {student.nomorInduk ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-medium text-[#475569]">
                    {student.jenisKelamin ?? "—"}
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center justify-end">
                      <span
                        className={`inline-flex h-6 items-center rounded-full px-2.5 text-[9px] font-bold ${
                          student.isActive
                            ? "bg-[#EDFFF6] text-[#1E7A45]"
                            : "bg-[#F1F5F9] text-[#94A3B8]"
                        }`}
                      >
                        {student.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <FadeIn className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
            <Search className="size-4" />
          </span>
          <p className="mt-2 text-xs font-semibold text-[#334155]">
            Belum ada siswa di rombel ini
          </p>
          <p className="mt-0.5 max-w-sm text-[10px] leading-4 text-[#94A3B8]">
            Data siswa akan tampil setelah siswa terdaftar pada kelas tersebut.
          </p>
        </FadeIn>
      )}
    </section>
  );
}
