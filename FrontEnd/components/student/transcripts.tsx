"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, ClipboardCheck, User } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { masterDataApi, type AttendanceRecap } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { TranscriptGradeChart } from "./transcript-grade-chart";

type Category = "wajib" | "pilihan" | "lokal";

type Subject = {
  code: string;
  name: string;
  teacher: string;
  jp: number;
  daily: number;
  exam: number;
  final: number;
  predicate: string;
  predicateNote: string;
  status: "Tuntas Paripurna" | "Tuntas" | "Karya Unggulan";
  category: Category;
  featured?: boolean;
};

const subjects: Subject[] = [
  {
    code: "INF-301",
    name: "Informatika & Sains Komputasi",
    teacher: "Bpk. Arya Wiguna, M.Cs",
    jp: 4,
    daily: 94,
    exam: 96,
    final: 95.2,
    predicate: "A",
    predicateNote: "Istimewa",
    status: "Tuntas Paripurna",
    category: "wajib",
  },
  {
    code: "MAT-302",
    name: "Matematika Tingkat Lanjut (Kalkulus & Matriks)",
    teacher: "Dr. Pawell Bennett, M.Pd",
    jp: 4,
    daily: 89.5,
    exam: 92,
    final: 90.8,
    predicate: "A",
    predicateNote: "Sangat Baik",
    status: "Tuntas Paripurna",
    category: "wajib",
  },
  {
    code: "FIS-301",
    name: "Fisika Terapan & Robotika Modern",
    teacher: "Drs. H. Ahmad Fauzi, M.Pd",
    jp: 4,
    daily: 88,
    exam: 87,
    final: 87.5,
    predicate: "A-",
    predicateNote: "Baik Sekali",
    status: "Tuntas",
    category: "wajib",
  },
  {
    code: "DKV-304",
    name: "Desain Komunikasi Visual & UI/UX",
    teacher: "Ibu Sarah Jenkins, S.Ds",
    jp: 3,
    daily: 95,
    exam: 98,
    final: 96.5,
    predicate: "A+",
    predicateNote: "Terbaik",
    status: "Karya Unggulan",
    category: "pilihan",
    featured: true,
  },
  {
    code: "BIO-203",
    name: "Bioteknologi Terapan",
    teacher: "Dra. Sri Rahayu",
    jp: 2,
    daily: 86,
    exam: 88,
    final: 87,
    predicate: "A-",
    predicateNote: "Baik Sekali",
    status: "Tuntas",
    category: "pilihan",
  },
  {
    code: "ING-301",
    name: "English for Academic & Tech",
    teacher: "Mrs. Evelyn Vance, M.A",
    jp: 2,
    daily: 93,
    exam: 95,
    final: 94,
    predicate: "A",
    predicateNote: "Istimewa",
    status: "Tuntas Paripurna",
    category: "wajib",
  },
  {
    code: "KJD-305",
    name: "Jaringan Komputer & Cloud Infrastructure",
    teacher: "Bpk. Hendra S., S.Kom",
    jp: 3,
    daily: 90,
    exam: 91,
    final: 90.5,
    predicate: "A",
    predicateNote: "Sangat Baik",
    status: "Tuntas",
    category: "pilihan",
  },
  {
    code: "RPL-306",
    name: "Pemrograman Web & Perangkat Bergerak",
    teacher: "Ibu Lina Kartika, S.Kom",
    jp: 3,
    daily: 92,
    exam: 94,
    final: 92.8,
    predicate: "A",
    predicateNote: "Sangat Baik",
    status: "Tuntas Paripurna",
    category: "pilihan",
  },
  {
    code: "AIS-307",
    name: "Kecerdasan Artifisial & Data Sains",
    teacher: "Bpk. Rizky Ramadhan, M.T",
    jp: 3,
    daily: 91,
    exam: 93,
    final: 92,
    predicate: "A",
    predicateNote: "Istimewa",
    status: "Tuntas Paripurna",
    category: "pilihan",
  },
  {
    code: "PKN-301",
    name: "Pendidikan Kewarganegaraan",
    teacher: "Ibu Ni Luh Sari, S.Pd",
    jp: 2,
    daily: 88,
    exam: 86,
    final: 87.2,
    predicate: "A-",
    predicateNote: "Baik Sekali",
    status: "Tuntas",
    category: "wajib",
  },
  {
    code: "MLK-301",
    name: "Bahasa Sasak & Budaya Lokal NTB",
    teacher: "Bpk. Made Wirawan, S.Pd",
    jp: 2,
    daily: 89,
    exam: 90,
    final: 89.4,
    predicate: "A",
    predicateNote: "Sangat Baik",
    status: "Tuntas",
    category: "lokal",
  },
  {
    code: "EKS-302",
    name: "Ekstrakurikuler Riset & Robotika",
    teacher: "Bpk. Hendra S., S.Kom",
    jp: 2,
    daily: 96,
    exam: 95,
    final: 95.5,
    predicate: "A",
    predicateNote: "Istimewa",
    status: "Tuntas Paripurna",
    category: "lokal",
  },
];

const statusTextClassName: Record<Subject["status"], string> = {
  "Tuntas Paripurna": "text-[#006f64]",
  Tuntas: "text-[#0d5c52]",
  "Karya Unggulan": "text-[#055e44]",
};

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

  const categoryAverages = useMemo(() => {
    const average = (category: Category) => {
      const list = subjects.filter((subject) => subject.category === category);
      if (!list.length) return 0;
      return (
        Math.round(
          (list.reduce((total, subject) => total + subject.final, 0) /
            list.length) *
            10,
        ) / 10
      );
    };

    return [
      { name: "Wajib", value: average("wajib") },
      { name: "Pilihan", value: average("pilihan") },
      { name: "Lokal", value: average("lokal") },
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
          <TranscriptGradeChart data={categoryAverages} />
        </FadeIn>

        {/* Grade Table */}
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] overflow-hidden flex flex-col">
              <div className="p-4 bg-[#dff9f2]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="size-[22px] text-[#0d5c52]" />
                    <h2 className="text-[16px] font-semibold text-[#0d5c52]">
                      Tabel Transkrip Capaian Akademik (Semester 5)
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#536360] font-semibold">
                    Update Sinkronisasi Terakhir: 19 Mar 2025
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] min-w-[760px]">
                  <thead className="bg-[#d9f3ed] text-[#3f4946] text-[11px] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2 px-4" scope="col">Kode &amp; Mata Pelajaran</th>
                      <th className="py-2 px-2 text-center" scope="col">SKS / JP</th>
                      <th className="py-2 px-2 text-right" scope="col">Harian &amp; Tugas</th>
                      <th className="py-2 px-2 text-right" scope="col">ASAT (Ujian)</th>
                      <th className="py-2 px-2 text-right" scope="col">Nilai Akhir</th>
                      <th className="py-2 px-2 text-center" scope="col">Predikat</th>
                      <th className="py-2 px-4 text-center" scope="col">Status Capaian</th>
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
                        <td className="py-3 px-2 text-right font-medium">{s.daily.toFixed(1)}</td>
                        <td className="py-3 px-2 text-right font-medium">{s.exam.toFixed(1)}</td>
                        <td className="py-3 px-2 text-right text-[16px] font-bold text-[#0d5c52]">
                          {s.final.toFixed(1)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`text-[11px] font-bold ${
                              s.featured ? "text-[#006f64]" : "text-[#0d5c52]"
                            }`}
                          >
                            {s.predicate} ({s.predicateNote})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[11px] font-semibold ${statusTextClassName[s.status]}`}
                          >
                            {s.status}
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
