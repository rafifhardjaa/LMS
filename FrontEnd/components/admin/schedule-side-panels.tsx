"use client";

import { useEffect, useMemo, useState } from "react";
import { Coffee, Clock, Loader2, PieChart, TriangleAlert, UtensilsCrossed } from "lucide-react";
import { CountUp } from "@/components/ui/animations";
import { masterDataApi, type JadwalPelajaran } from "@/lib/api/master-data";

const DONUT_COLORS = ["#5343b9", "#a39afd", "#059669", "#d97706", "#6c5dd3", "#0ea5e9"];

const jamHarian = [
  { kode: "S1", label: "Sesi 1 • 07:00 - 08:00", durasi: "Durasi: 60 Menit", tone: "bg-[#e5deff] text-[#4331a8]" },
  { kode: "S2", label: "Sesi 2 • 08:00 - 09:00", durasi: "Durasi: 60 Menit", tone: "bg-[#e5deff] text-[#4331a8]" },
  { break: true, label: "Istirahat 1 (15 Mnt)", jam: "09:00 - 09:15", icon: "coffee" as const },
  { kode: "S3", label: "Sesi 3 • 09:15 - 10:45", durasi: "Durasi: 90 Menit", tone: "bg-[#e5deff] text-[#4331a8]" },
  { kode: "S4", label: "Sesi 4 • 10:45 - 12:00", durasi: "Durasi: 75 Menit", tone: "bg-[#e5deff] text-[#4331a8]" },
  { break: true, label: "Istirahat 2 / Ishoma (15 Mnt)", jam: "12:00 - 12:15", icon: "utensils" as const },
  { kode: "S5", label: "Sesi 5 • 12:15 - 13:45", durasi: "Durasi: 90 Menit", tone: "bg-[#dae2fd] text-[#131b2e]" },
  { kode: "S6", label: "Sesi 6 • 13:45 - 15:00", durasi: "Durasi: 75 Menit", tone: "bg-[#dae2fd] text-[#131b2e]" },
];

const card = "rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function ScheduleSidePanels() {
  const [data, setData] = useState<JadwalPelajaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await masterDataApi.jadwalPelajaran.list();
        if (cancelled) return;
        if (res.error) {
          throw new Error(
            (res.error as { message?: string }).message ?? "Gagal memuat distribusi sesi"
          );
        }
        setData(res.data?.data ?? []);
      } catch (e) {
        if (!cancelled) {
          setData([]);
          setError(e instanceof Error ? e.message : "Gagal memuat distribusi sesi");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const jurusanSeries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of data) {
      counts.set(row.majorCode, (counts.get(row.majorCode) ?? 0) + 1);
    }
    const total = data.length || 1;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([code, count], index) => ({
        label: code,
        count,
        percent: (count / total) * 100,
        color: DONUT_COLORS[index % DONUT_COLORS.length]!,
      }));
  }, [data]);

  const circumference = 2 * Math.PI * 48;
  const segments = jurusanSeries.reduce<{ label: string; len: number; offset: number; color: string }[]>(
    (acc, { percent, color, label }) => {
      const len = Math.max((percent / 100) * circumference - 2, 0);
      const offset = acc.reduce((sum, s) => sum + s.len + 2, 0);
      return [...acc, { label, len, offset, color }];
    },
    []
  );

  return (
    <aside className="flex w-full flex-col gap-6">
      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <h2 className="text-base font-bold leading-5 text-[#181c20]">Distribusi Sesi per Jurusan</h2>
            <p className="mt-1 text-[11px] leading-4 text-[#787584]">Total {data.length} Sesi Belajar Terjadwal</p>
          </div>
          <PieChart className="size-5 shrink-0 text-[#6c5dd3]" />
        </div>
        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-2 py-8 text-sm text-[#787584]">
            <Loader2 className="size-4 animate-spin" /> Memuat distribusi sesi…
          </div>
        ) : error ? (
          <div className="mt-8 flex items-center justify-center gap-2 py-8 text-center text-sm text-[#b91c1c]">
            <TriangleAlert className="size-4" /> {error}
          </div>
        ) : (
        <div className="mt-4 flex items-center gap-4">
          <div className="relative size-32 shrink-0">
            <svg viewBox="0 0 136 136" className="size-full -rotate-90" role="img" aria-label={`Distribusi ${data.length} sesi per jurusan`}>
              <circle cx="68" cy="68" r="48" fill="none" stroke="#eceef3" strokeWidth="18" />
              {segments.map(({ len, offset, color, label }) => (
                <circle
                  key={label}
                  cx="68"
                  cy="68"
                  r="48"
                  fill="none"
                  stroke={color}
                  strokeWidth="18"
                  strokeDasharray={`${len} ${circumference - len}`}
                  strokeDashoffset={-offset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-[#181c20]"><CountUp to={data.length} /></span>
              <span className="text-[9px] font-semibold uppercase text-[#4e566c]">Sesi</span>
            </div>
          </div>
          <ul className="flex min-w-0 flex-1 flex-col gap-2">
            {jurusanSeries.map(({ label, count, percent, color }) => (
              <li key={label} className="flex items-center justify-between gap-2 text-[10px]">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  <span className="truncate text-[#181c20]">{label} ({count})</span>
                </span>
                <span className="shrink-0 font-bold text-[#181c20]">{percent.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
        )}
      </section>

      <section className={card}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <h2 className="text-base font-bold leading-5 text-[#181c20]">Alokasi Jam &amp; Sesi Harian</h2>
            <p className="mt-1 text-[11px] leading-4 text-[#787584]">Standar Waktu Belajar SMK Mataram</p>
          </div>
          <Clock className="size-5 shrink-0 text-[#6c5dd3]" />
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          {jamHarian.map((item, index) =>
            "break" in item ? (
              <div key={index} className="flex items-center justify-between rounded-2xl bg-[#fffbeb] px-3 py-2 text-[10px] font-bold text-[#d97706]">
                <span className="flex items-center gap-2">
                  {item.icon === "coffee" ? <Coffee className="size-4" /> : <UtensilsCrossed className="size-4" />}
                  {item.label}
                </span>
                <span>{item.jam}</span>
              </div>
            ) : (
              <div key={index} className="flex items-center justify-between rounded-2xl bg-[#f8f9fc] p-2.5">
                <div className="flex items-center gap-2.5">
                  <span className={`flex size-8 items-center justify-center rounded-full text-[10px] font-bold ${item.tone}`}>{item.kode}</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#181c20]">{item.label}</span>
                    <span className="text-[10px] text-[#787584]">{item.durasi}</span>
                  </div>
                </div>
                <span className="rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] font-bold text-[#059669]">Aktif</span>
              </div>
            )
          )}
        </div>
      </section>
    </aside>
  );
}
