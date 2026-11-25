"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  ChevronRight,
  Search,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { CountUp, FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";
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

const tabs: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "Semua Mata Pelajaran" },
  { key: "wajib", label: "Mata Pelajaran Wajib" },
  { key: "pilihan", label: "Konsentrasi Kejuruan & Pilihan" },
  { key: "lokal", label: "Muatan Lokal & Ekstrakurikuler" },
];

const sortOptions = [
  "Nilai Tertinggi",
  "Nilai Terendah",
  "Nama Mata Pelajaran (A-Z)",
  "Beban JP Terbanyak",
];

const statusClassName: Record<Subject["status"], string> = {
  "Tuntas Paripurna": "bg-[#6df5e1] text-[#006f64]",
  Tuntas: "bg-[#edf7f4] text-[#0d5c52]",
  "Karya Unggulan": "bg-[#055e44] text-[#8ad5b3]",
};

export function StudentTranscripts() {
  const [tab, setTab] = useState<"all" | Category>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(sortOptions[0]);
  const [showAll, setShowAll] = useState(false);

  const counts = useMemo(
    () => ({
      all: subjects.length,
      wajib: subjects.filter((s) => s.category === "wajib").length,
      pilihan: subjects.filter((s) => s.category === "pilihan").length,
      lokal: subjects.filter((s) => s.category === "lokal").length,
    }),
    []
  );

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

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = subjects.filter(
      (s) =>
        (tab === "all" || s.category === tab) &&
        (q === "" ||
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.teacher.toLowerCase().includes(q))
    );
    list = [...list].sort((a, b) => {
      if (sort === "Nilai Terendah") return a.final - b.final;
      if (sort === "Nama Mata Pelajaran (A-Z)") return a.name.localeCompare(b.name);
      if (sort === "Beban JP Terbanyak") return b.jp - a.jp;
      return b.final - a.final;
    });
    if (tab === "all" && !q && !showAll) list = list.slice(0, 7);
    return list;
  }, [tab, query, sort, showAll]);

  const visibleTotal = tab === "all" && !query ? counts.all : subjects.filter((s) => tab === "all" || s.category === tab).length;

  return (
    <FadeIn className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* 1. Breadcrumb & Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[28px] leading-9 font-bold text-[#0d5c52] tracking-tight">
                  Transkrip Nilai &amp; Capaian Akademik Siswa
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[11px] font-semibold">
                  Fase F • Kelas XII MIPA 1 / Peminatan Sains &amp; Komputasi
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#6df5e1] text-[#006f64] text-[11px] font-semibold">
                  NISN: 0065849201
                </span>
              </div>
              <p className="text-[14px] leading-6 text-[#3f4946]">
                Rekapitulasi nilai kumulatif, indeks prestasi semester, portofolio kompetensi
                kurikulum merdeka, serta berkas transkrip resmi SMK Mataram.
              </p>
            </div>

          </div>
        </div>

        {/* 2. KPI Summary Cards */}
        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* IPK Kumulatif */}
          <StaggerItem>
            <motion.div
              className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2 h-full"
              whileHover={{ y: -4, boxShadow: "0 8px 24px -4px rgba(13,92,82,0.14)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  IPK Kumulatif (Fase E &amp; F)
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52] tracking-tight">
                    <CountUp to={3.88} decimals={2} duration={1.4} />
                  </span>
                  <span className="text-[12px] text-[#6f7976]">/ 4.00</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#edf7f4] flex items-center justify-center text-[#0d5c52]">
                <Trophy className="size-6" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="px-1.5 py-0.5 rounded bg-[#d4eee7] text-[#0d5c52] text-[11px] font-medium">
                Predikat: Sangat Memuaskan (A)
              </span>
              <div className="flex items-center gap-1 text-[#14b8a6] text-[11px] font-semibold">
                <TrendingUp className="size-4" />
                +0.06 pts Sem 4
              </div>
            </div>
            </motion.div>
          </StaggerItem>

          {/* Ketercapaian CP */}
          <StaggerItem>
            <motion.div
              className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2 h-full"
              whileHover={{ y: -4, boxShadow: "0 8px 24px -4px rgba(13,92,82,0.14)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Ketercapaian Target CP
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52] tracking-tight">
                    <CountUp to={98.2} decimals={1} suffix="%" duration={1.4} />
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#edf7f4] flex items-center justify-center text-[#0d5c52]">
                <Sparkles className="size-6" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-[#6df5e1] text-[#006f64]">
                Tuntas Paripurna
              </span>
              <span className="text-[#536360] font-normal">0 Modul Remedial</span>
            </div>
            </motion.div>
          </StaggerItem>
        </StaggerChildren>

        <FadeIn delay={0.14}>
          <TranscriptGradeChart data={categoryAverages} />
        </FadeIn>

        {/* Grade Table */}
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] overflow-hidden flex flex-col">
              <div className="p-4 bg-[#dff9f2] flex flex-col gap-4">
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

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        setTab(t.key);
                        setShowAll(false);
                      }}
                      className={`px-4 py-1.5 rounded-lg font-semibold transition-colors ${
                        tab === t.key
                          ? "bg-[#0d5c52] text-white shadow-sm"
                          : "bg-[#d9f3ed] text-[#536360] hover:text-[#0d5c52] hover:bg-[#d4eee7]"
                      }`}
                    >
                      {t.label} ({counts[t.key]})
                    </button>
                  ))}
                </div>

                {/* Search & Sort */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[#6f7976]" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari mata pelajaran, guru pengampu..."
                      type="text"
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white text-[#071f1c] placeholder:text-[#6f7976] text-[12px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <span className="text-[11px] text-[#536360] font-semibold">Urutkan:</span>
                    <select
                      aria-label="Urutkan nilai"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="appearance-none bg-white text-[#071f1c] text-[11px] font-semibold pl-2 pr-7 py-1.5 rounded-lg shadow-sm border border-[#cee8e1]/60 focus:outline-none focus:ring-2 focus:ring-[#0d5c52] cursor-pointer"
                    >
                      {sortOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronRight className="pointer-events-none -ml-6 rotate-90 size-4 text-[#6f7976]" />
                  </div>
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
                    {rows.map((s, i) => (
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
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              s.featured
                                ? "bg-[#a6f2cf] text-[#00513a]"
                                : "bg-[#d4eee7] text-[#0d5c52]"
                            }`}
                          >
                            {s.predicate} ({s.predicateNote})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                              statusClassName[s.status]
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#536360]">
                          Tidak ada mata pelajaran yang cocok dengan pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-[#dff9f2] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#536360] font-semibold">
                <div className="flex items-center gap-2">
                  <span>
                    Menampilkan <strong>{rows.length}</strong> dari{" "}
                    <strong>{visibleTotal}</strong> Mata Pelajaran Fase F
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6f7976]" />
                  <span>
                    Kriteria Ketuntasan Minimal (KKM): <strong>78.00</strong>
                  </span>
                </div>
                {tab === "all" && !query && (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="text-[#0d5c52] hover:text-[#00433b] font-bold flex items-center gap-1"
                  >
                    <span>{showAll ? "Tampilkan Ringkasan Saja" : "Lihat Semua Detail Penilaian"}</span>
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>

      </div>
    </FadeIn>
  );
}
