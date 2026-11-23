"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import moment from "moment";
import { FadeIn } from "@/components/ui/animations";
import {
  masterDataApi,
  type JadwalPelajaran,
} from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

type SessionSlot =
  | { type: "session"; sesi: number; fallback: string }
  | { type: "break"; label: string; time: string };

const SESSION_TEMPLATE: SessionSlot[] = [
  { type: "session", sesi: 1, fallback: "07.00-08.00" },
  { type: "session", sesi: 2, fallback: "08.00-09.00" },
  { type: "break", label: "Istirahat", time: "09.00-09.15" },
  { type: "session", sesi: 3, fallback: "09.15-10.45" },
  { type: "session", sesi: 4, fallback: "10.45-12.00" },
  { type: "break", label: "Istirahat", time: "12.00-12.15" },
  { type: "session", sesi: 5, fallback: "12.15-13.45" },
  { type: "session", sesi: 6, fallback: "13.45-15.00" },
];

function formatTime(value: string) {
  return moment(value, ["HH:mm:ss", "HH:mm"]).format("HH:mm");
}

function normalizeDay(day: string) {
  const trimmed = day.trim();
  return (
    DAY_ORDER.find((item) => item.toLowerCase() === trimmed.toLowerCase()) ??
    trimmed
  );
}

function sessionLabel(rows: JadwalPelajaran[], sesi: number, fallback: string) {
  const sample = rows.find((row) => row.sesi === sesi);
  if (!sample) return fallback;
  return `${formatTime(sample.waktuMulai)}-${formatTime(sample.waktuSelesai)}`;
}

export function Schedule() {
  const user = useAuthStore((state) => state.user);
  const [rows, setRows] = useState<JadwalPelajaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user.kelas) {
          setRows([]);
          setError("Kelas siswa belum diatur. Hubungi admin sekolah.");
          return;
        }

        const classRes = await masterDataApi.classes.list();
        if (!active) return;
        if (classRes.error) {
          throw new Error(classRes.error.message ?? "Gagal memuat data kelas.");
        }

        const found = (classRes.data?.data ?? []).find(
          (item) => item.name === user.kelas,
        );
        if (!found) {
          setRows([]);
          setError("Kelas siswa tidak ditemukan.");
          return;
        }

        const jadwalRes = await masterDataApi.jadwalPelajaran.list({
          classId: found.id,
          activeOnly: true,
        });
        if (!active) return;

        if (jadwalRes.error) {
          throw new Error(jadwalRes.error.message ?? "Gagal memuat jadwal kelas.");
        }

        setRows(jadwalRes.data?.data ?? []);
      } catch (err) {
        if (active) {
          setRows([]);
          setError(
            err instanceof Error ? err.message : "Gagal memuat jadwal kelas.",
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
  }, [user]);

  const days = useMemo(() => {
    const present = rows.map((row) => normalizeDay(row.hari));
    const ordered = DAY_ORDER.filter((day) => present.includes(day));
    const extra = [...new Set(present)]
      .filter((day) => !ordered.includes(day))
      .sort();
    return rows.length > 0 ? [...ordered, ...extra] : DAY_ORDER;
  }, [rows]);

  const cells = useMemo(() => {
    const map = new Map<string, JadwalPelajaran[]>();
    for (const row of rows) {
      const key = `${normalizeDay(row.hari)}|${row.sesi}`;
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return map;
  }, [rows]);

  const classNameLabel =
    rows.find((row) => row.className)?.className ||
    user?.kelas?.trim() ||
    "-";

  if (loading) {
    return (
      <FadeIn>
        <div className="overflow-hidden rounded-[20px] border border-black bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="animate-pulse space-y-3 border-b border-black px-5 py-4">
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
    );
  }

  if (error) {
    return (
      <FadeIn>
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#b91c1c]">
          {error}
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <section className="overflow-hidden rounded-[20px] border border-black bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-2 border-b border-black bg-gradient-to-r from-[#0d5c52] to-[#071f1c] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold tracking-tight text-white">
              Jadwal Mingguan
            </h2>
            <p className="mt-0.5 text-[13px] font-medium text-white/80">
              Kelas {classNameLabel} • {rows.length} sesi aktif
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-center">
            <thead>
              <tr>
                <th className="w-24 border-b border-black bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-black">
                  Sesi
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="border-b border-l border-black bg-white px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-black"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {SESSION_TEMPLATE.map((slot, index) => {
                if (slot.type === "break") {
                  return (
                    <tr key={`break-${index}`} className="bg-[#FFF4D6]">
                      <td className="border-t border-black px-4 py-2 align-middle text-[11px] font-bold uppercase tracking-wide text-black">
                        {slot.label}
                      </td>
                      <td
                        colSpan={days.length}
                        className="border-t border-black px-3 py-2 text-center text-[11px] font-semibold italic text-black"
                      >
                        {slot.time}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={slot.sesi}>
                    <td className="border-t border-black px-4 py-3 align-middle">
                      <p className="text-[13px] font-extrabold text-black">
                        {slot.sesi}
                      </p>
                      <p className="mt-0.5 break-words whitespace-normal font-mono text-[11px] font-medium tabular-nums text-black">
                        {sessionLabel(rows, slot.sesi, slot.fallback)}
                      </p>
                    </td>

                    {days.map((day) => {
                      const items = cells.get(`${day}|${slot.sesi}`) ?? [];

                      return (
                        <td
                          key={`${day}-${slot.sesi}`}
                          className="border-l border-t border-black bg-white px-2 py-2 align-middle"
                        >
                          {items.length === 0 ? (
                            <span className="block px-1 text-center text-[12px] text-black">
                              —
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              {items.map((item) => (
                                <p
                                  key={item.id}
                                  className="break-words whitespace-normal text-[13px] font-bold leading-5 text-black"
                                >
                                  {item.subjectName}
                                </p>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F9] text-black">
              <Search className="size-4" />
            </span>
            <p className="mt-2 text-xs font-semibold text-black">
              Belum ada jadwal untuk kelas Anda
            </p>
            <p className="mt-0.5 max-w-sm text-[11px] leading-4 text-black">
              Jadwal akan muncul setelah guru mengatur rombel Anda.
            </p>
          </div>
        ) : (
          <p className="border-t border-black px-5 py-2 text-right text-[11px] font-medium text-black sm:hidden">
            Geser untuk melihat hari lain
          </p>
        )}
      </section>
    </FadeIn>
  );
}
