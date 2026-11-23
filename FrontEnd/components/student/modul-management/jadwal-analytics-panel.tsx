"use client";

import { BookOpen, CalendarDays, GraduationCap, Users } from "lucide-react";
import type { JadwalPelajaran } from "@/lib/api/master-data";

const HARI_LIST = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

export function JadwalAnalyticsPanel({ rows }: { rows: JadwalPelajaran[] }) {
  const totalSesi = rows.length;
  const totalMapel = new Set(rows.map((row) => row.subjectId)).size;
  const totalKelas = new Set(rows.map((row) => row.classId)).size;
  const totalJurusan = new Set(rows.map((row) => row.majorCode).filter(Boolean)).size;

  const perHari = HARI_LIST.map((hari) => ({
    hari,
    total: rows.filter((row) => row.hari === hari).length,
  }));
  const maxHari = Math.max(1, ...perHari.map((item) => item.total));

  const topMapel = [...rows.reduce((map, row) => {
    map.set(row.subjectName, (map.get(row.subjectName) ?? 0) + 1);
    return map;
  }, new Map<string, number>()).entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((first, second) => second.total - first.total)
    .slice(0, 5);
  const maxMapel = Math.max(1, ...topMapel.map((item) => item.total));

  const summary = [
    { label: "Total Sesi", value: totalSesi, icon: CalendarDays, tone: "bg-[#d4eee7] text-[#0d5c52]" },
    { label: "Mata Pelajaran", value: totalMapel, icon: BookOpen, tone: "bg-[#E0F2FE] text-[#006398]" },
    { label: "Rombel Kelas", value: totalKelas, icon: Users, tone: "bg-[#DCFCE7] text-[#16A34A]" },
    { label: "Jurusan", value: totalJurusan, icon: GraduationCap, tone: "bg-[#FEF3C7] text-[#D97706]" },
  ];

  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold tracking-tight text-[#1E293B]">
            Jadwal Belajar Saya
          </h2>
          <p className="mt-0.5 text-[11px] text-[#94A3B8]">
            Ringkasan distribusi sesi belajar dari jadwal kelas Anda.
          </p>
        </div>
        <span className="rounded-full bg-[#d4eee7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0d5c52]">
          Data Jadwal
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <span className={`flex size-8 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="size-4" />
            </span>
            <p className="mt-2 text-[20px] font-bold leading-none text-[#1E293B]">{value}</p>
            <p className="mt-1 text-[10px] font-medium text-[#94A3B8]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <h3 className="text-[12px] font-bold text-[#1E293B]">Distribusi Sesi per Hari</h3>
          <div className="mt-3 flex flex-col gap-2.5">
            {perHari.map(({ hari, total }) => (
              <div key={hari} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-[11px] font-medium text-[#64748B]">{hari}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F1F5F9]">
                  <div
                    className="h-full rounded-full bg-[#0d5c52]"
                    style={{ width: `${(total / maxHari) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-[11px] font-bold text-[#1E293B]">{total}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[12px] font-bold text-[#1E293B]">Mapel dengan Sesi Terbanyak</h3>
          <div className="mt-3 flex flex-col gap-2.5">
            {topMapel.length ? (
              topMapel.map(({ name, total }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-[#64748B]">{name}</span>
                  <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      className="h-full rounded-full bg-[#006398]"
                      style={{ width: `${(total / maxMapel) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-[11px] font-bold text-[#1E293B]">{total}</span>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-[#94A3B8]">Belum ada data jadwal.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
