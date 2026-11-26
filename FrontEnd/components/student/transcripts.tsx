"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, ClipboardCheck, User } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { masterDataApi, type AttendanceRecap } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { TranscriptGradeChart } from "./transcript-grade-chart";

type TranscriptRow = {
  code: string;
  name: string;
  teacher: string;
  jp: number;
  tugas: number | null;
  kuis: number | null;
  uts: number | null;
  uas: number | null;
  final: number | null;
  predicate: string;
  predicateNote: string;
};

function formatScore(value: number | null) {
  return value === null ? "-" : value.toFixed(1);
}

function predicateFor(final: number) {
  if (final >= 95) return { predicate: "A+", predicateNote: "Terbaik" };
  if (final >= 90) return { predicate: "A", predicateNote: "Istimewa" };
  if (final >= 85) return { predicate: "A-", predicateNote: "Sangat Baik" };
  if (final >= 80) return { predicate: "B+", predicateNote: "Baik" };
  if (final >= 75) return { predicate: "B", predicateNote: "Cukup" };
  return { predicate: "C", predicateNote: "Perlu Remedial" };
}

function calculateFinal(
  tugas: number | null,
  kuis: number | null,
  uts: number | null,
  uas: number | null,
  weights: {
    tugasWeight: number;
    kuisWeight: number;
    utsWeight: number;
    uasWeight: number;
  },
) {
  if (tugas === null || kuis === null || uts === null || uas === null) {
    return null;
  }
  return Math.round(
    ((tugas * weights.tugasWeight +
      kuis * weights.kuisWeight +
      uts * weights.utsWeight +
      uas * weights.uasWeight) /
      100) *
      10,
  ) / 10;
}

export function StudentTranscripts() {
  const user = useAuthStore((state) => state.user);
  const [majorName, setMajorName] = useState("-");
  const [recap, setRecap] = useState<AttendanceRecap | null>(null);
  const [recapLoading, setRecapLoading] = useState(true);
  const [recapError, setRecapError] = useState<string | null>(null);
  const [rows, setRows] = useState<TranscriptRow[]>([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [gradesError, setGradesError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.kelas) return;

    let active = true;
    void (async () => {
      try {
        const res = await masterDataApi.classes.list();
        if (!active) return;
        if (res.error) throw new Error(res.error.message ?? "Gagal memuat kelas.");
        const found = (res.data?.data ?? []).find(
          (item) => item.name === user.kelas,
        );
        setMajorName(found?.majorName ?? "-");
      } catch {
        if (active) setMajorName("-");
      }
    })();

    return () => {
      active = false;
    };
  }, [user?.kelas]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        setRecapError(null);
        const res = await masterDataApi.attendance.myRecap();
        if (!active) return;
        if (res.error) throw new Error(res.error.message ?? "Gagal memuat presensi.");
        setRecap(res.data?.data ?? null);
      } catch (error) {
        if (active) {
          setRecap(null);
          setRecapError(
            error instanceof Error
              ? error.message
              : "Gagal memuat presensi.",
          );
        }
      } finally {
        if (active) setRecapLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        setGradesLoading(true);
        setGradesError(null);
        const res = await masterDataApi.grades.me.list();
        if (!active) return;
        if (res.error) throw new Error(res.error.message ?? "Gagal memuat nilai.");
        const mapped: TranscriptRow[] = (res.data?.data ?? []).map((row) => {
          const calculated = calculateFinal(
            row.tugasScore,
            row.kuisScore,
            row.utsScore,
            row.uasScore,
            row.weights,
          );
          const final = row.finalScore ?? calculated;
          const predicate = final === null ? "-" : predicateFor(final);
          return {
            code: row.subjectCode ?? "-",
            name: row.subjectName,
            teacher: row.teacherName ?? "-",
            jp: row.jp,
            tugas: row.tugasScore,
            kuis: row.kuisScore,
            uts: row.utsScore,
            uas: row.uasScore,
            final,
            predicate: predicate === "-" ? "-" : predicate.predicate,
            predicateNote:
              predicate === "-" ? "-" : predicate.predicateNote,
          };
        });
        setRows(mapped);
      } catch (error) {
        if (active) {
          setRows([]);
          setGradesError(
            error instanceof Error
              ? error.message
              : "Gagal memuat transkrip.",
          );
        }
      } finally {
        if (active) setGradesLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const componentAverages = useMemo(() => {
    const round1 = (value: number) => Math.round(value * 10) / 10;
    const averageOf = (
      selector: (row: TranscriptRow) => number | null,
    ) => {
      const values = rows
        .map(selector)
        .filter((value): value is number => value !== null);
      if (!values.length) return 0;
      return round1(
        values.reduce((total, value) => total + value, 0) / values.length,
      );
    };

    const maxJp = Math.max(...rows.map((row) => row.jp), 1);

    return [
      { name: "JP", value: round1((averageOf((row) => row.jp) / maxJp) * 100) },
      { name: "Tugas", value: averageOf((row) => row.tugas) },
      { name: "Kuis", value: averageOf((row) => row.kuis) },
      { name: "UTS", value: averageOf((row) => row.uts) },
      { name: "UAS", value: averageOf((row) => row.uas) },
    ];
  }, [rows]);

  const recapCounts = useMemo(() => {
    const initial = { hadir: 0, sakit: 0, izin: 0, alpa: 0, total: 0 };
    if (!recap) return initial;

    for (const day of recap.days) {
      if (day.status) initial[day.status] += 1;
    }
    return {
      ...initial,
      total: recap.days.filter((day) => Boolean(day.status)).length,
    };
  }, [recap]);

  return (
    <FadeIn className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* 1. Breadcrumb & Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-3xl">
              <h1 className="text-[28px] leading-9 font-bold text-[#0d5c52] tracking-tight">
                Transkrip Nilai &amp; Capaian Akademik Siswa
              </h1>
              <p className="text-[14px] leading-6 text-[#3f4946]">
                Rekapitulasi nilai kumulatif, indeks prestasi semester, portofolio kompetensi
                kurikulum merdeka, serta berkas transkrip resmi SMK Mataram.
              </p>
            </div>

          </div>
        </div>

        {/* 2. Profile & Attendance Cards */}
        <FadeIn delay={0.06}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]">
              <div className="flex items-center gap-2.5">
                <User className="size-5 text-[#0d5c52]" />
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Profil Siswa
                </span>
              </div>
              <dl className="mt-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[11px] font-semibold text-[#536360]">Nama</dt>
                  <dd className="text-right text-[13px] font-bold text-black">
                    {user?.full_name ?? "-"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[11px] font-semibold text-[#536360]">NISN</dt>
                  <dd className="text-right text-[13px] font-bold text-black">
                    {user?.nomor_induk ?? "-"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[11px] font-semibold text-[#536360]">Kelas</dt>
                  <dd className="text-right text-[13px] font-bold text-black">
                    {user?.kelas ?? "-"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[11px] font-semibold text-[#536360]">Jurusan</dt>
                  <dd className="text-right text-[13px] font-bold text-black">
                    {majorName}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[11px] font-semibold text-[#536360]">Email</dt>
                  <dd className="break-all text-right text-[13px] font-bold text-black">
                    {user?.email ?? "-"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]">
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="size-5 text-[#0d5c52]" />
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Rekapan Presensi
                </span>
              </div>

              {recapLoading ? (
                <p className="mt-4 text-[12px] font-semibold text-[#536360]">
                  Memuat presensi…
                </p>
              ) : recapError ? (
                <p className="mt-4 text-[12px] font-semibold text-[#b91c1c]">
                  {recapError}
                </p>
              ) : (
                <>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52]">
                      {recapCounts.total}
                    </span>
                    <span className="text-[12px] font-semibold text-[#6f7976]">
                      Hari Tercatat
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#536360]">Hadir</span>
                      <span className="text-[#0d5c52]">{recapCounts.hadir}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#536360]">Sakit</span>
                      <span className="text-[#B45309]">{recapCounts.sakit}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#536360]">Izin</span>
                      <span className="text-[#006398]">{recapCounts.izin}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#536360]">Alpa</span>
                      <span className="text-[#b91c1c]">{recapCounts.alpa}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </FadeIn>

        {!gradesLoading && !gradesError && rows.length > 0 ? (
          <FadeIn delay={0.14}>
            <TranscriptGradeChart data={componentAverages} />
          </FadeIn>
        ) : null}

        {/* Grade Table */}
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] overflow-hidden flex flex-col">
              <div className="p-4 bg-[#dff9f2]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="size-[22px] text-[#0d5c52]" />
                    <h2 className="text-[16px] font-semibold text-[#0d5c52]">
                      Tabel Transkrip Capaian Akademik Siswa
                    </h2>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] min-w-[900px]">
                  <thead className="bg-[#d9f3ed] text-[#3f4946] text-[11px] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2 px-4" scope="col">Mata Pelajaran</th>
                      <th className="py-2 px-2 text-center" scope="col">JP</th>
                      <th className="py-2 px-2 text-right" scope="col">Tugas</th>
                      <th className="py-2 px-2 text-right" scope="col">Kuis</th>
                      <th className="py-2 px-2 text-right" scope="col">UTS</th>
                      <th className="py-2 px-2 text-right" scope="col">UAS</th>
                      <th className="py-2 px-2 text-right" scope="col">Nilai Akhir</th>
                      <th className="py-2 px-4 text-center" scope="col">Predikat</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#071f1c]">
                    {gradesLoading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-[#536360]">
                          Memuat transkrip…
                        </td>
                      </tr>
                    ) : gradesError ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-[#b91c1c]">
                          {gradesError}
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-[#536360]">
                          Belum ada nilai mapel untuk siswa ini.
                        </td>
                      </tr>
                    ) : (
                      rows.map((s, i) => (
                        <tr
                          key={`${s.name}-${i}`}
                          className={`transition-colors hover:bg-[#dff9f2] ${
                            i % 2 === 1 ? "bg-[#dff9f2]/40" : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="text-[12px] text-[#0d5c52] font-semibold">
                                {s.name}
                              </span>
                              <span className="text-[12px] text-[#536360]">{s.teacher}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center font-medium">{s.jp} JP</td>
                          <td className="py-3 px-2 text-right font-medium">{formatScore(s.tugas)}</td>
                          <td className="py-3 px-2 text-right font-medium">{formatScore(s.kuis)}</td>
                          <td className="py-3 px-2 text-right font-medium">{formatScore(s.uts)}</td>
                          <td className="py-3 px-2 text-right font-medium">{formatScore(s.uas)}</td>
                          <td className="py-3 px-2 text-right text-[16px] font-bold text-[#0d5c52]">
                            {formatScore(s.final)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[11px] font-bold text-[#0d5c52]">
                              {s.predicate === "-" ? "-" : `${s.predicate} (${s.predicateNote})`}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-[#dff9f2] flex items-center gap-2 text-[11px] text-[#536360] font-semibold">
                <span>
                  Total <strong>{rows.length}</strong> Mata Pelajaran Fase F
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6f7976]" />
                <span>
                  Kriteria Ketuntasan Minimal (KKM): <strong>75.00</strong>
                </span>
              </div>
            </div>

      </div>
    </FadeIn>
  );
}
