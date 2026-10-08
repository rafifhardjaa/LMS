"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  ChevronRight,
  Download,
  Headset,
  LifeBuoy,
  Lock,
  Printer,
  School,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

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

const semesterOptions = [
  "Semester 5 (Ganjil 2024/2025)",
  "Semester 4 (Genap 2023/2024)",
  "Semester 3 (Ganjil 2023/2024)",
  "Semester 2 (Genap 2022/2023)",
  "Semester 1 (Ganjil 2022/2023)",
  "Transkrip Kumulatif Lengkap (Sem 1 - 5)",
];

const sortOptions = [
  "Nilai Tertinggi",
  "Nilai Terendah",
  "Nama Mata Pelajaran (A-Z)",
  "Beban JP Terbanyak",
];

const ipsHistory = [
  { sem: "Sem 1", fase: "Fase E1", ipk: "3.72", height: "72%" },
  { sem: "Sem 2", fase: "Fase E2", ipk: "3.78", height: "76%" },
  { sem: "Sem 3", fase: "Fase F1", ipk: "3.82", height: "82%" },
  { sem: "Sem 4", fase: "Fase F2", ipk: "3.85", height: "86%" },
  { sem: "Sem 5", fase: "Terkini", ipk: "3.88", height: "92%", current: true },
];

const pancasila = [
  { label: "Beriman & Bertakwa", rating: 4, note: "Sangat Berkembang", high: false },
  { label: "Bernalar Kritis", rating: 5, note: "Sangat Berkembang (Paripurna)", high: true },
  { label: "Kreatif & Inovatif", rating: 5, note: "Sangat Berkembang (Paripurna)", high: true },
  { label: "Gotong Royong / Kolaborasi", rating: 4, note: "Berkembang Sesuai Harapan", high: false },
  { label: "Kemandirian Riset", rating: 5, note: "Sangat Berkembang (Paripurna)", high: true },
  { label: "Kebinekaan Global", rating: 4, note: "Berkembang Sesuai Harapan", high: false },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#0d5c52]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-current" : "text-[#bec9c5]"}`}
        />
      ))}
    </div>
  );
}

function QrPattern() {
  return (
    <svg className="w-full h-full text-[#00433b]" fill="currentColor" viewBox="0 0 100 100" aria-hidden>
      <rect fill="#00433b" height="28" rx="3" width="28" x="5" y="5" />
      <rect fill="#ffffff" height="20" rx="2" width="20" x="9" y="9" />
      <rect fill="#00433b" height="12" rx="1" width="12" x="13" y="13" />
      <rect fill="#00433b" height="28" rx="3" width="28" x="67" y="5" />
      <rect fill="#ffffff" height="20" rx="2" width="20" x="71" y="9" />
      <rect fill="#00433b" height="12" rx="1" width="12" x="75" y="13" />
      <rect fill="#00433b" height="28" rx="3" width="28" x="5" y="67" />
      <rect fill="#ffffff" height="20" rx="2" width="20" x="9" y="71" />
      <rect fill="#00433b" height="12" rx="1" width="12" x="13" y="75" />
      <rect fill="#00433b" height="6" width="6" x="38" y="8" />
      <rect fill="#00433b" height="6" width="8" x="48" y="15" />
      <rect fill="#00433b" height="6" width="14" x="38" y="26" />
      <rect fill="#00433b" height="16" width="6" x="8" y="38" />
      <rect fill="#00433b" height="6" width="8" x="20" y="44" />
      <rect fill="#0d5c52" height="24" rx="4" width="24" x="38" y="38" />
      <circle cx="50" cy="50" fill="#ffffff" r="6" />
      <rect fill="#00433b" height="8" width="8" x="68" y="40" />
      <rect fill="#00433b" height="6" width="10" x="82" y="46" />
      <rect fill="#00433b" height="6" width="12" x="40" y="68" />
      <rect fill="#00433b" height="16" width="6" x="58" y="72" />
      <rect fill="#00433b" height="6" width="22" x="70" y="68" />
      <rect fill="#00433b" height="8" width="20" x="40" y="84" />
      <rect fill="#00433b" height="12" width="16" x="76" y="80" />
    </svg>
  );
}

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
          <nav className="flex items-center gap-1.5 text-[13px] font-semibold text-[#536360]">
            <a href="/student/dashboard" className="hover:text-[#0d5c52] transition-colors uppercase tracking-wide">
              Dashboard
            </a>
            <ChevronRight className="size-4 text-[#bec9c5]" />
            <span className="text-[#0d5c52] font-bold uppercase tracking-wide">
              Transkrip &amp; Evaluasi Akademik
            </span>
          </nav>

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

            {/* Action Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="relative">
                <select
                  aria-label="Pilih semester"
                  className="appearance-none bg-white text-[#071f1c] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-lg shadow-sm border border-[#cee8e1]/60 focus:outline-none focus:ring-2 focus:ring-[#0d5c52] cursor-pointer"
                  defaultValue={semesterOptions[0]}
                >
                  {semesterOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 size-4 text-[#6f7976]" />
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d4eee7] text-[#0d5c52] hover:bg-[#cee8e1] text-[12px] font-semibold transition-colors shadow-sm"
              >
                <Printer className="size-4" />
                Cetak Rapor Digital
              </button>
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Transkrip Resmi SMK Mataram (TR-SMK-MTR-2025-00892) siap diunduh. Fitur ekspor PDF akan aktif setelah integrasi backend."
                  )
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0d5c52] text-white hover:bg-[#00433b] text-[12px] font-semibold transition-colors shadow-sm"
              >
                <Download className="size-4" />
                Unduh Transkrip Resmi (.PDF)
              </button>
            </div>
          </div>
        </div>

        {/* 2. KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* IPK Kumulatif */}
          <div className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  IPK Kumulatif (Fase E &amp; F)
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52] tracking-tight">
                    3.88
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
          </div>

          {/* Beban Belajar */}
          <div className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Beban Belajar Diselesaikan
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52] tracking-tight">
                    142
                  </span>
                  <span className="text-[14px] text-[#6f7976]">JP / Semester</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#edf7f4] flex items-center justify-center text-[#0d5c52]">
                <School className="size-6" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <span className="text-[#536360]">100% Target Kurikulum Merdeka</span>
                <span className="text-[#0d5c52]">44 SKS Terakui</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#d9f3ed]">
                <div className="h-1.5 rounded-full bg-[#0d5c52] w-full" />
              </div>
            </div>
          </div>

          {/* Rata-rata Ujian */}
          <div className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Rata-Rata Ujian &amp; Proyek
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52] tracking-tight">
                    91.4
                  </span>
                  <span className="text-[12px] text-[#6f7976]">/ 100</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#edf7f4] flex items-center justify-center text-[#0d5c52]">
                <BarChart3 className="size-6" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-[#a6f2cf] text-[#00513a]">
                Peringkat 3 Kelas
              </span>
              <span className="text-[#536360] font-normal">Top 2% Angkatan 2025</span>
            </div>
          </div>

          {/* Ketercapaian CP */}
          <div className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Ketercapaian Target CP
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[40px] leading-12 font-extrabold text-[#0d5c52] tracking-tight">
                    98.2%
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
          </div>
        </div>

        {/* 3. Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT */}
          <SlideIn direction="left" className="lg:col-span-8 flex flex-col gap-6">
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

            {/* IPS Trend & Notes */}
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] p-6 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                    Tren Progresi Akademik
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#0d5c52]">
                    Histori Indeks Prestasi Semester (IPS) &amp; Evaluasi Berkala
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[#0d5c52] text-[11px] bg-[#d4eee7] px-2 py-1 rounded-lg font-semibold">
                  <TrendingUp className="size-4" />
                  Konsisten Mengalami Peningkatan (+0.16 Kumulatif)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#dff9f2] flex flex-col gap-4">
                <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-4 px-2">
                  {ipsHistory.map((h) => (
                    <div
                      key={h.sem}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      {h.current ? (
                        <div className="px-1.5 py-0.5 rounded bg-[#0d5c52] text-white text-[11px] font-bold shadow-sm">
                          {h.ipk}
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#536360] group-hover:text-[#0d5c52] transition-colors">
                          {h.ipk}
                        </span>
                      )}
                      <div
                        className={`w-full max-w-[56px] rounded-t-lg transition-all duration-300 ${
                          h.current
                            ? "bg-[#0d5c52] shadow-sm"
                            : "bg-[#cee8e1] group-hover:bg-[#0d5c52]"
                        }`}
                        style={{ height: h.height }}
                      />
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-[#0d5c52]">{h.sem}</span>
                        <span
                          className={`text-[10px] ${
                            h.current ? "text-[#14b8a6] font-semibold" : "text-[#6f7976]"
                          }`}
                        >
                          {h.fase}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[#6f7976] text-[11px] pt-2 border-t border-[#bec9c5]/30">
                  <span>Standar Kelulusan Cumlaude: 3.75+</span>
                  <span>Rerata Paralel Angkatan: 3.42</span>
                </div>
              </div>

              {/* Honor Notes */}
              <div className="flex flex-col gap-2">
                <span className="text-[13px] text-[#0d5c52] font-semibold">
                  Catatan Kehormatan &amp; Catatan Wali Kelas:
                </span>
                <div className="p-4 rounded-xl bg-[#dff9f2] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0d5c52] shrink-0 flex items-center justify-center text-white">
                    <Trophy className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[#0d5c52] font-semibold">
                        Catatan Evaluasi Semester 5 • Wali Kelas (Dr. Pawell Bennett, M.Pd)
                      </span>
                      <span className="text-[11px] text-[#536360] shrink-0">18 Mar 2025</span>
                    </div>
                    <p className="text-[14px] leading-6 text-[#536360]">
                      &quot;Pawell memperlihatkan dedikasi riset dan kecakapan komputasi luar
                      biasa pada semester ganjil ini. Nilai praktikum algoritma serta UI/UX
                      mencapai performa optimal dan melampaui ekspektasi standar kurikulum
                      nasional. Sangat direkomendasikan melaju ke seleksi SNBP klaster saintek
                      nasional.&quot;
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#dff9f2] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#d4eee7] shrink-0 flex items-center justify-center text-[#0d5c52]">
                    <Award className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[#0d5c52] font-semibold">
                        Piagam Penghargaan Prestasi Akademik
                      </span>
                      <span className="text-[11px] text-[#536360] shrink-0">Semester 4</span>
                    </div>
                    <p className="text-[12px] leading-5 text-[#536360]">
                      Peringkat 1 Proyek Inovasi Sains &amp; Komputasi SMK se-Provinsi NTB
                      (Aplikasi Smart School SiManis).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SlideIn>

          {/* RIGHT */}
          <SlideIn direction="right" delay={0.1} className="lg:col-span-4 flex flex-col gap-6">
            {/* Legalization */}
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Lock className="size-[22px] text-[#0d5c52]" />
                <h3 className="text-[16px] font-semibold text-[#0d5c52]">
                  Legalisasi &amp; Validasi Digital
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-[#dff9f2] flex flex-col gap-2 items-center text-center">
                <div className="w-32 h-32 p-2 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <QrPattern />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#0d5c52] font-bold">
                    KEMENDIKBUDRISTEK DIKTI &amp; DAPODIK
                  </span>
                  <span className="text-[10px] text-[#536360]">
                    Tervalidasi Resmi &amp; Terdaftar di Pangkalan Data Sekolah
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#6df5e1] text-[#006f64] text-[11px] font-semibold flex items-center gap-1">
                  <Lock className="size-3.5" />
                  Terenkripsi SHA-256
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[12px] text-[#536360]">
                <div className="flex justify-between py-1">
                  <span>Nomor Dokumen:</span>
                  <span className="text-[11px] text-[#071f1c] font-semibold">
                    TR-SMK-MTR-2025-00892
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Tanggal Pengesahan:</span>
                  <span className="text-[#071f1c] font-medium">20 Maret 2025</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Pejabat Pengesah:</span>
                  <span className="text-[#071f1c] font-medium text-right">
                    Dr. H. M. Zulkifli, M.Pd
                    <br />
                    <span className="text-[#6f7976] text-[11px] font-normal">
                      Kepala SMK Mataram
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Salinan terlegalisir (TR-SMK-MTR-2025-00892) siap diunduh. Fitur ekspor PDF akan aktif setelah integrasi backend."
                  )
                }
                className="w-full py-2.5 px-4 rounded-lg bg-[#d4eee7] hover:bg-[#cee8e1] text-[#0d5c52] text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Lock className="size-4" />
                Unduh Salinan Terlegalisir (.pdf)
              </button>
            </div>

            {/* Pancasila Profile */}
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-[22px] text-[#0d5c52]" />
                  <h3 className="text-[16px] font-semibold text-[#0d5c52]">
                    Profil Pelajar Pancasila
                  </h3>
                </div>
                <span className="text-[11px] text-[#14b8a6] font-bold">Fase F Terpenuhi</span>
              </div>

              <StaggerChildren className="flex flex-col gap-2">
                {pancasila.map((p, i) => (
                  <StaggerItem key={p.label}>
                    <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#dff9f2]">
                      <div className="flex items-center justify-between text-[13px] gap-2">
                        <span className="text-[#071f1c] font-semibold">
                          {i + 1}. {p.label}
                        </span>
                        <span
                          className={`text-[11px] font-bold text-right ${
                            p.high ? "text-[#0d5c52]" : "text-[#14b8a6]"
                          }`}
                        >
                          {p.note}
                        </span>
                      </div>
                      <Stars rating={p.rating} />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>

            {/* SNBP Recommendation */}
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 border-t-4 border-t-[#0d5c52] shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#d4eee7] flex items-center justify-center text-[#0d5c52]">
                  <Headset className="size-4" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-semibold text-[#0d5c52]">
                    Rekomendasi Seleksi PTN &amp; SNBP
                  </h3>
                  <span className="text-[11px] text-[#536360] font-semibold">
                    Sinkronisasi Unit BK: Ibu Sarah Jenkins
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#d4eee7]/60 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#0d5c52] font-bold uppercase tracking-wider">
                    Target Rekomendasi #1
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#a6f2cf] text-[#00513a] text-[11px] font-bold">
                    Peluang: 94%
                  </span>
                </div>
                <span className="text-[16px] font-semibold text-[#0d5c52]">
                  Teknik Informatika ITB / Ilmu Komputer UI
                </span>
                <p className="text-[12px] leading-5 text-[#536360]">
                  Berdasarkan clustering nilai kuantitatif Matematika Lanjut (90.8), Informatika
                  (95.2), dan prestasi provinsi, indeks eligibilitas Anda masuk dalam kuota
                  utama sekolah.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#dff9f2] flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#536360] font-semibold">
                    Status Eligibilitas Sekolah
                  </span>
                  <span className="text-[13px] text-[#0d5c52] font-bold">
                    Siswa Eligible SNBP (Kategori 40% Teratas)
                  </span>
                </div>
                <LifeBuoy className="size-6 text-[#14b8a6] shrink-0" />
              </div>

              <a
                href="/student/counseling"
                className="w-full py-2.5 px-4 rounded-lg bg-[#0d5c52] hover:bg-[#00433b] text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Konsultasi Nilai dengan Guru BK
                <ArrowRight className="size-4" />
              </a>
            </div>
          </SlideIn>
        </div>
      </div>
    </FadeIn>
  );
}
