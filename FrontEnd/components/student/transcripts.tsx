"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, ClipboardCheck, User } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { masterDataApi, type AttendanceRecap } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { TranscriptGradeChart } from "./transcript-grade-chart";

type Subject = {
  code: string;
  name: string;
  teacher: string;
  jp: number;
  tugas: number;
  kuis: number;
  uts: number;
  uas: number;
  final: number;
  predicate: string;
  predicateNote: string;
  featured?: boolean;
};

const subjects: Subject[] = [
  {
    code: "INF-301",
    name: "Informatika & Sains Komputasi",
    teacher: "Bpk. Arya Wiguna, M.Cs",
    jp: 4,
    tugas: 94,
    kuis: 96,
    uts: 95,
    uas: 96,
    final: 95.2,
    predicate: "A",
    predicateNote: "Istimewa",
  },
  {
    code: "MAT-302",
    name: "Matematika Tingkat Lanjut (Kalkulus & Matriks)",
    teacher: "Dr. Pawell Bennett, M.Pd",
    jp: 4,
    tugas: 89,
    kuis: 90,
    uts: 92,
    uas: 92,
    final: 90.8,
    predicate: "A",
    predicateNote: "Sangat Baik",
  },
  {
    code: "FIS-301",
    name: "Fisika Terapan & Robotika Modern",
    teacher: "Drs. H. Ahmad Fauzi, M.Pd",
    jp: 4,
    tugas: 88,
    kuis: 89,
    uts: 86,
    uas: 87,
    final: 87.5,
    predicate: "A-",
    predicateNote: "Baik Sekali",
  },
  {
    code: "DKV-304",
    name: "Desain Komunikasi Visual & UI/UX",
    teacher: "Ibu Sarah Jenkins, S.Ds",
    jp: 3,
    tugas: 95,
    kuis: 96,
    uts: 98,
    uas: 97,
    final: 96.5,
    predicate: "A+",
    predicateNote: "Terbaik",
    featured: true,
  },
  {
    code: "BIO-203",
    name: "Bioteknologi Terapan",
    teacher: "Dra. Sri Rahayu",
    jp: 2,
    tugas: 86,
    kuis: 87,
    uts: 88,
    uas: 87,
    final: 87,
    predicate: "A-",
    predicateNote: "Baik Sekali",
  },
  {
    code: "ING-301",
    name: "English for Academic & Tech",
    teacher: "Mrs. Evelyn Vance, M.A",
    jp: 2,
    tugas: 93,
    kuis: 94,
    uts: 95,
    uas: 94,
    final: 94,
    predicate: "A",
    predicateNote: "Istimewa",
  },
  {
    code: "KJD-305",
    name: "Jaringan Komputer & Cloud Infrastructure",
    teacher: "Bpk. Hendra S., S.Kom",
    jp: 3,
    tugas: 90,
    kuis: 91,
    uts: 91,
    uas: 91,
    final: 90.5,
    predicate: "A",
    predicateNote: "Sangat Baik",
  },
  {
    code: "RPL-306",
    name: "Pemrograman Web & Perangkat Bergerak",
    teacher: "Ibu Lina Kartika, S.Kom",
    jp: 3,
    tugas: 92,
    kuis: 93,
    uts: 94,
    uas: 93,
    final: 92.8,
    predicate: "A",
    predicateNote: "Sangat Baik",
  },
  {
    code: "AIS-307",
    name: "Kecerdasan Artifisial & Data Sains",
    teacher: "Bpk. Rizky Ramadhan, M.T",
    jp: 3,
    tugas: 91,
    kuis: 92,
    uts: 93,
    uas: 92,
    final: 92,
    predicate: "A",
    predicateNote: "Istimewa",
  },
  {
    code: "PKN-301",
    name: "Pendidikan Kewarganegaraan",
    teacher: "Ibu Ni Luh Sari, S.Pd",
    jp: 2,
    tugas: 88,
    kuis: 87,
    uts: 86,
    uas: 86,
    final: 87.2,
    predicate: "A-",
    predicateNote: "Baik Sekali",
  },
  {
    code: "MLK-301",
    name: "Bahasa Sasak & Budaya Lokal NTB",
    teacher: "Bpk. Made Wirawan, S.Pd",
    jp: 2,
    tugas: 89,
    kuis: 89,
    uts: 90,
    uas: 90,
    final: 89.4,
    predicate: "A",
    predicateNote: "Sangat Baik",
  },
  {
    code: "EKS-302",
    name: "Ekstrakurikuler Riset & Robotika",
    teacher: "Bpk. Hendra S., S.Kom",
    jp: 2,
    tugas: 96,
    kuis: 97,
    uts: 95,
    uas: 94,
    final: 95.5,
    predicate: "A",
    predicateNote: "Istimewa",
  },
];

export function StudentTranscripts() {
  const user = useAuthStore((state) => state.user);
  const [majorName, setMajorName] = useState("-");
  const [recap, setRecap] = useState<AttendanceRecap | null>(null);
  const [recapLoading, setRecapLoading] = useState(true);

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
        const res = await masterDataApi.attendance.myRecap();
        if (!active) return;
        if (res.error) throw new Error(res.error.message ?? "Gagal memuat presensi.");
        setRecap(res.data?.data ?? null);
      } catch {
        if (active) setRecap(null);
      } finally {
        if (active) setRecapLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const componentAverages = useMemo(() => {
    const round1 = (value: number) => Math.round(value * 10) / 10;

    const averageOf = (selector: (subject: Subject) => number) =>
      round1(subjects.reduce((total, subject) => total + selector(subject), 0) /
        subjects.length);

    const maxJp = Math.max(...subjects.map((subject) => subject.jp), 1);

    return [
      { name: "JP", value: round1((averageOf((subject) => subject.jp) / maxJp) * 100) },
      { name: "Tugas", value: averageOf((subject) => subject.tugas) },
      { name: "Kuis", value: averageOf((subject) => subject.kuis) },
      { name: "UTS", value: averageOf((subject) => subject.uts) },
      { name: "UAS", value: averageOf((subject) => subject.uas) },
    ];
  }, []);

  const recapCounts = useMemo(() => {
    const initial = { hadir: 0, sakit: 0, izin: 0, alpa: 0, total: 0 };
    if (!recap) return initial;

    for (const day of recap.days) {
      if (day.status) initial[day.status] += 1;
    }
    return {
      ...initial,
      total: recap.days.length,
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
              ) : (
                <>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52]">
                      {recapCounts.total}
                    </span>
                    <span className="text-[12px] font-semibold text-[#6f7976]">
                      Hari Belajar
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

        <FadeIn delay={0.14}>
          <TranscriptGradeChart data={componentAverages} />
        </FadeIn>

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
                    {subjects.map((s, i) => (
                      <tr
                        key={s.code}
                        className={`transition-colors hover:bg-[#dff9f2] ${
                          i % 2 === 1 ? "bg-[#dff9f2]/40" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-[12px] text-[#0d5c52] font-semibold">
                              {s.code} • {s.name}
                            </span>
                            <span className="text-[12px] text-[#536360]">{s.teacher}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center font-medium">{s.jp} JP</td>
                        <td className="py-3 px-2 text-right font-medium">{s.tugas.toFixed(1)}</td>
                        <td className="py-3 px-2 text-right font-medium">{s.kuis.toFixed(1)}</td>
                        <td className="py-3 px-2 text-right font-medium">{s.uts.toFixed(1)}</td>
                        <td className="py-3 px-2 text-right font-medium">{s.uas.toFixed(1)}</td>
                        <td className="py-3 px-2 text-right text-[16px] font-bold text-[#0d5c52]">
                          {s.final.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[11px] font-bold ${
                              s.featured ? "text-[#006f64]" : "text-[#0d5c52]"
                            }`}
                          >
                            {s.predicate} ({s.predicateNote})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-[#dff9f2] flex items-center gap-2 text-[11px] text-[#536360] font-semibold">
                <span>
                  Total <strong>{subjects.length}</strong> Mata Pelajaran Fase F
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6f7976]" />
                <span>
                  Kriteria Ketuntasan Minimal (KKM): <strong>78.00</strong>
                </span>
              </div>
            </div>

      </div>
    </FadeIn>
  );
}
