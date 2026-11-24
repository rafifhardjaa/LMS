"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import { FadeIn } from "@/components/ui/animations";
import {
  masterDataApi,
  type AttendanceRecap,
  type AttendanceStatus,
} from "@/lib/api/master-data";
import { StudentPageHeader } from "./page-header";
import { AttendanceDayDialog } from "./attendance-day-dialog";

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

function formatDate(date: string) {
  return moment(date, "YYYY-MM-DD").locale("id").format("D MMMM YYYY");
}

function monthOf(date: string) {
  return moment(date, "YYYY-MM-DD").locale("id").format("MMMM YYYY");
}

function groupByMonth(days: AttendanceRecap["days"]) {
  const groups = new Map<string, AttendanceRecap["days"]>();
  for (const day of days) {
    const label = monthOf(day.date);
    const list = groups.get(label) ?? [];
    list.push(day);
    groups.set(label, list);
  }
  return [...groups.entries()];
}

export function AttendancePage() {
  const [recap, setRecap] = useState<AttendanceRecap | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await masterDataApi.attendance.myRecap();
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat rekap presensi.");
        }
        const data = res.data?.data ?? null;
        setRecap(data);

        const monthLabels = groupByMonth(data?.days ?? []).map(
          ([month]) => month,
        );
        const currentMonth = moment().locale("id").format("MMMM YYYY");
        setSelectedMonth(
          monthLabels.includes(currentMonth)
            ? currentMonth
            : (monthLabels[0] ?? "ALL"),
        );
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat rekap presensi.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const months = recap
    ? groupByMonth(recap.days).map(([month]) => month)
    : [];
  const filteredDays = recap
    ? selectedMonth === "ALL"
      ? recap.days
      : recap.days.filter((day) => monthOf(day.date) === selectedMonth)
    : [];

  async function refreshRecap() {
    const res = await masterDataApi.attendance.myRecap();
    if (!res.error) {
      setRecap(res.data?.data ?? null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 text-[#1E293B]">
      <StudentPageHeader
        title={"Presensi"}
        description="Rekap kehadiran harian Anda untuk semester berjalan."
      />

      {loading ? (
        <FadeIn>
          <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="animate-pulse space-y-3 border-b border-[#E2E8F0] px-5 py-4">
              <div className="h-4 w-1/3 rounded bg-[#E2E8F0]" />
              <div className="h-3 w-1/4 rounded bg-[#E2E8F0]" />
            </div>
            <div className="animate-pulse space-y-2 p-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-8 w-full rounded bg-[#F1F5F9]"
                />
              ))}
            </div>
          </div>
        </FadeIn>
      ) : error ? (
        <FadeIn>
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#b91c1c]">
            {error}
          </div>
        </FadeIn>
      ) : !recap ? (
        <FadeIn>
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 py-10 text-center text-[13px] font-semibold text-[#475569]">
            Rekap presensi belum tersedia.
          </div>
        </FadeIn>
      ) : (
        <FadeIn>
          <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-2 border-b border-[#E2E8F0] bg-gradient-to-r from-[#0d5c52] to-[#071f1c] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[16px] font-extrabold tracking-tight text-white">
                  Rekap Presensi Anda
                </h2>
                <p className="mt-0.5 text-[12px] font-medium text-white/80">
                  {recap.period.name} • Senin–Jumat
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <select
                  aria-label="Filter bulan presensi"
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="h-7 rounded-lg border border-white/25 bg-white/15 px-2 text-[11px] font-semibold text-white outline-none [&>option]:text-[#1E293B]"
                >
                  <option value="ALL">Semua bulan</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <span className="inline-flex h-7 items-center rounded-lg bg-white/15 px-2.5 text-[11px] font-semibold text-white">
                  {filteredDays.length} hari
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-wide text-[#475569]">
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-3 py-3">Hari</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-5 py-3">Keterangan</th>
                    <th className="px-5 py-3">Aksi</th>
                  </tr>
                </thead>

                {groupByMonth(filteredDays).map(([month, days]) => (
                  <tbody key={month}>
                    <tr className="bg-[#edf7f4]">
                      <td
                        colSpan={5}
                        className="px-5 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#0d5c52]"
                      >
                        {month}
                      </td>
                    </tr>
                    {days.map((day) => (
                      <tr
                        key={day.date}
                        className="border-t border-[#E2E8F0] transition hover:bg-[#F8FAFC]"
                      >
                        <td className="px-5 py-2.5 text-[12px] font-semibold text-[#1E293B]">
                          {formatDate(day.date)}
                        </td>
                        <td className="px-3 py-2.5 text-[12px] font-medium text-[#475569]">
                          {day.day}
                        </td>
                        <td className="px-3 py-2.5">
                          {day.status ? (
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLES[day.status]}`}
                            >
                              {STATUS_LABELS[day.status]}
                            </span>
                          ) : (
                            <span className="text-[12px] font-semibold text-[#94A3B8]">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-2.5 text-[12px] font-medium text-[#475569]">
                          {day.note || "—"}
                        </td>
                        <td className="px-5 py-2.5">
                          <AttendanceDayDialog day={day} onSaved={refreshRecap} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>

            <div className="flex items-start gap-2 border-t border-[#F1F5F9] px-5 py-3 text-[11px] leading-5 text-[#536360]">
              <Info className="mt-0.5 size-4 shrink-0 text-[#0d5c52]" />
              <span>
                Status akan terisi setelah guru atau wali kelas mencatat
                kehadiran harian.
              </span>
            </div>
          </section>
        </FadeIn>
      )}
    </div>
  );
}
