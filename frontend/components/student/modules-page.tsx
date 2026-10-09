"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Atom,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  CloudDownload,
  Code,
  Download,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Layers,
  Library,
  List,
  Mic,
  Paperclip,
  Play,
  Presentation,
  Scale,
  ScrollText,
  Search,
  ShieldCheck,
  Sigma,
  Users,
  Video,
  Palette,
  LayoutGrid,
  SearchX,
} from "lucide-react";
import {
  FadeIn,
  SlideIn,
  StaggerChildren,
  StaggerItem,
  CountUp,
} from "@/components/ui/animations";

type SubjectKey = "cs" | "physics" | "math" | "vocational" | "language";
type StatusKey = "in_progress" | "completed" | "new";

type Module = {
  id: string;
  title: string;
  kicker: string;
  desc: string;
  subject: SubjectKey;
  subjectLabel: string;
  subjectChipClass: string;
  tag: string;
  tagClass: string;
  gradient: string;
  info: { icon: typeof BookOpen; text: string; iconClass: string }[];
  progress: number;
  status: StatusKey;
  action: string;
  actionIcon: typeof Play;
  downloadLabel: string;
  updatedDays: number;
};

const subjectTabs: { key: "all" | SubjectKey; label: string }[] = [
  { key: "all", label: "Semua Mata Pelajaran" },
  { key: "cs", label: "Informatika & Ilmu Komputer" },
  { key: "physics", label: "Fisika Terapan & Robotika" },
  { key: "math", label: "Matematika Tingkat Lanjut" },
  { key: "vocational", label: "Kejuruan (DKV / TKR)" },
  { key: "language", label: "Bahasa & Literasi" },
];

const classOptions = [
  "Kelas XII MIPA 1 / Kejuruan",
  "Kelas XII MIPA 2 / Kejuruan",
  "Kelas XI Industri & Rekayasa",
  "Materi Ekstrakurikuler Khusus",
];

const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "in_progress", label: "Sedang Berjalan" },
  { value: "completed", label: "Selesai Dipelajari" },
  { value: "new", label: "Modul Baru (New)" },
];

const modules: Module[] = [
  {
    id: "algo-big-o",
    title: "Algoritma Pemrograman & Optimasi Big-O",
    kicker: "FASE F • KELAS XII",
    desc: "Catatan kuliah struktural, analisis efisiensi memori, slide presentasi guru, dan 14 bank latihan soal interaktif.",
    subject: "cs",
    subjectLabel: "Informatika",
    subjectChipClass: "bg-[#0d5c52] text-white",
    tag: "Kurikulum Merdeka",
    tagClass: "bg-white/90 text-[#0d5c52] backdrop-blur-sm",
    gradient: "from-[#00433b] via-[#0d5c52] to-[#14b8a6]",
    info: [
      { icon: BookOpen, text: "6 Bab Lengkap", iconClass: "text-[#0d5c52]" },
      { icon: FolderOpen, text: "12 Bahan Ajar", iconClass: "text-[#0d5c52]" },
    ],
    progress: 70,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: Play,
    downloadLabel: "Download PDF (3.4 MB)",
    updatedDays: 2,
  },
  {
    id: "thermo-wave",
    title: "Termodinamika & Gelombang Mekanik",
    kicker: "FASE F • SAINS FISIKA",
    desc: "Panduan praktikum virtual PhET Interactive Simulations, bank soal latihan mandiri, dan rekaman demonstrasi termodinamika.",
    subject: "physics",
    subjectLabel: "Fisika Terapan",
    subjectChipClass: "bg-[#00796b] text-white",
    tag: "Ada Remedial",
    tagClass: "bg-[#ffdad6] text-[#93000a]",
    gradient: "from-[#0f766e] via-[#00796b] to-[#14b8a6]",
    info: [
      { icon: Atom, text: "5 Bab Inti", iconClass: "text-[#00796b]" },
      { icon: Presentation, text: "8 Lab Sheet", iconClass: "text-[#00796b]" },
    ],
    progress: 45,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: Play,
    downloadLabel: "Download PDF (5.1 MB)",
    updatedDays: 1,
  },
  {
    id: "calc-matrix",
    title: "Kalkulus Lanjut & Aljabar Linier Matriks",
    kicker: "FASE F • OLIMPIADE & UTBK",
    desc: "Diktat materi eksklusif SMK Mataram, bank soal seleksi PTN Mandiri ITB/UI, dan solusi penyelesaian matriks orde tinggi.",
    subject: "math",
    subjectLabel: "Matematika Lanjut",
    subjectChipClass: "bg-[#00433b] text-white",
    tag: "Persiapan UTBK",
    tagClass: "bg-[#a6f2cf] text-[#00513a]",
    gradient: "from-[#071f1c] via-[#00433b] to-[#0d5c52]",
    info: [
      { icon: Sigma, text: "8 Bab Silabus", iconClass: "text-[#0d5c52]" },
      { icon: FileText, text: "15 Dokumen PDF", iconClass: "text-[#0d5c52]" },
    ],
    progress: 100,
    status: "completed",
    action: "Ulas Kembali",
    actionIcon: Eye,
    downloadLabel: "Download PDF (4.8 MB)",
    updatedDays: 4,
  },
  {
    id: "ai-ml",
    title: "Kecerdasan Buatan & Machine Learning",
    kicker: "FASE F • TEKNOLOGI TERAPAN",
    desc: "Dataset latih CSV, Google Colab Jupyter notebooks terintegrasi, dan modul sintaksis PyTorch/TensorFlow dasar.",
    subject: "cs",
    subjectLabel: "Informatika Peminatan",
    subjectChipClass: "bg-[#14b8a6] text-white",
    tag: "Baru Diunggah",
    tagClass: "bg-[#71f8e4] text-[#00201c]",
    gradient: "from-[#0d5c52] via-[#14b8a6] to-[#8fd3c6]",
    info: [
      { icon: Code, text: "4 Bab Praktik", iconClass: "text-[#14b8a6]" },
      { icon: Layers, text: "Colab Notebooks", iconClass: "text-[#14b8a6]" },
    ],
    progress: 0,
    status: "new",
    action: "Mulai Belajar",
    actionIcon: Play,
    downloadLabel: "Download Colab / PDF (6.2 MB)",
    updatedDays: 0,
  },
  {
    id: "english-research",
    title: "English for Academic & Technical Research",
    kicker: "FASE F • KOMUNIKASI GLOBAL",
    desc: "Academic writing guidelines, panduan pembuatan esai beasiswa riset luar negeri, dan audio listening technical conference.",
    subject: "language",
    subjectLabel: "Bahasa & Literasi",
    subjectChipClass: "bg-[#00796b] text-white",
    tag: "Sains & Teknologi",
    tagClass: "bg-white/90 text-[#0d5c52] backdrop-blur-sm",
    gradient: "from-[#004430] via-[#00796b] to-[#8fd3c6]",
    info: [
      { icon: Mic, text: "4 Bab Audio Lab", iconClass: "text-[#00796b]" },
      { icon: FileText, text: "Format Esai Ilmiah", iconClass: "text-[#00796b]" },
    ],
    progress: 100,
    status: "completed",
    action: "Ulas Audio & Teks",
    actionIcon: Eye,
    downloadLabel: "Download PDF & Audio (2.9 MB)",
    updatedDays: 6,
  },
  {
    id: "uiux-dkv",
    title: "Desain Sistem & Antarmuka UI/UX Modern",
    kicker: "FASE F • DESAIN PRODUK",
    desc: "Design tokens, wireframing komponen atomik, Figma master design kit, dan panduan usability testing standar industri digital.",
    subject: "vocational",
    subjectLabel: "Kejuruan DKV",
    subjectChipClass: "bg-[#0d5c52] text-white",
    tag: "Proyek Kolaboratif",
    tagClass: "bg-[#a6f2cf] text-[#00513a]",
    gradient: "from-[#005047] via-[#0d5c52] to-[#4fdbc8]",
    info: [
      { icon: Layers, text: "6 Bab Proyek", iconClass: "text-[#0d5c52]" },
      { icon: Palette, text: "Figma UI Assets", iconClass: "text-[#0d5c52]" },
    ],
    progress: 82,
    status: "in_progress",
    action: "Buka Modul",
    actionIcon: Play,
    downloadLabel: "Download Guide (7.5 MB)",
    updatedDays: 3,
  },
];

const syllabusDocs = [
  {
    ext: "PDF",
    extClass: "bg-[#ffdad6] text-[#93000a]",
    name: "Silabus ATP & CP Informatika Tingkat Lanjut",
    file: "SMK-MATARAM-CP-INF-2024.pdf • 1.8 MB",
    level: "Fase F (Kelas XII)",
    author: "Tim Kurikulum Informatika",
    verification: "Disahkan Waka Kurikulum",
    verificationClass: "bg-[#a6f2cf] text-[#00513a]",
    verificationIcon: CheckCircle2,
    action: "Unduh (.PDF)",
  },
  {
    ext: "PDF",
    extClass: "bg-[#6df5e1] text-[#006f64]",
    name: "Panduan Praktik Laboratorium Sains & Robotika Terapan",
    file: "SMK-MATARAM-LAB-FIS-ROB.pdf • 3.2 MB",
    level: "Fase F (Kelas XI & XII)",
    author: "Laboratorium Fisika Modern",
    verification: "Disahkan Waka Kurikulum",
    verificationClass: "bg-[#a6f2cf] text-[#00513a]",
    verificationIcon: CheckCircle2,
    action: "Unduh (.PDF)",
  },
  {
    ext: "DOCX",
    extClass: "bg-[#d4eee7] text-[#0d5c52]",
    name: "Rubrik Penilaian Proyek Ujian Kompetensi Keahlian (UKK) DKV",
    file: "RUBRIK-UKK-DKV-FINAL.docx • 890 KB",
    level: "Fase F Kejuruan",
    author: "Asosiasi Industri DKV Mataram",
    verification: "Standar BNSP",
    verificationClass: "bg-[#d4eee7] text-[#0d5c52]",
    verificationIcon: ShieldCheck,
    action: "Unduh (.DOCX)",
  },
];

function progressText(m: Module) {
  if (m.status === "new") return { text: "0% Belum Dimulai", className: "text-[#6f7976]" };
  if (m.status === "completed")
    return { text: "100% Selesai", className: "text-[#0d5c52] flex items-center gap-1" };
  return { text: `${m.progress}% Selesai`, className: "text-[#0d5c52]" };
}

export function StudentModules() {
  const router = useRouter();
  const [subject, setSubject] = useState<"all" | SubjectKey>("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortNewest, setSortNewest] = useState(true);

  const visibleModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = modules.filter(
      (m) =>
        (subject === "all" || m.subject === subject) &&
        (status === "all" || m.status === status) &&
        (q === "" ||
          m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.subjectLabel.toLowerCase().includes(q))
    );
    return [...list].sort((a, b) =>
      sortNewest ? a.updatedDays - b.updatedDays : b.updatedDays - a.updatedDays
    );
  }, [subject, status, query, sortNewest]);

  return (
    <FadeIn className="w-full">
      <div className="flex flex-col gap-8 w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-3xl">
            <nav className="flex items-center gap-1.5 text-[13px] font-semibold text-[#536360]">
              <a
                href="/student/dashboard"
                className="hover:text-[#0d5c52] transition-colors flex items-center gap-1"
              >
                <Home className="size-4" />
                Dashboard
              </a>
              <span className="text-[#bec9c5] text-[12px]">/</span>
              <span className="text-[#0d5c52] font-bold">Modules &amp; Learning Materials</span>
            </nav>
            <h1 className="text-[26px] leading-[34px] font-bold text-[#071f1c] tracking-tight flex flex-wrap items-center gap-2">
              <span>Katalog Modul &amp; Materi Pembelajaran</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[11px] font-semibold uppercase tracking-wider">
                Semester Ganjil 2025/2026
              </span>
            </h1>
            <p className="text-[14px] leading-relaxed text-[#3f4946]">
              Akses seluruh modul ajar Kurikulum Merdeka, silabus terstruktur, rekaman video
              praktikum, dan materi pengayaan berbasis kejuruan &amp; sains SMK Mataram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="relative min-w-[210px]">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#3f4946]" />
              <select
                aria-label="Pilih kelas"
                defaultValue={classOptions[0]}
                className="w-full h-11 pl-10 pr-8 bg-white text-[#071f1c] text-[13px] font-semibold rounded-lg shadow-sm border border-[#cee8e1]/60 focus:outline-none focus:ring-2 focus:ring-[#0d5c52] appearance-none cursor-pointer hover:bg-[#edf7f4] transition-colors"
              >
                {classOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                alert("Arsip silabus (.zip) sedang disiapkan. Fitur unduh aktif setelah integrasi backend.")
              }
              className="h-11 px-4 rounded-lg bg-[#0d5c52] text-white text-[14px] font-semibold flex items-center gap-2 shadow-md hover:bg-[#00433b] transition-colors duration-200"
            >
              <Download className="size-[19px]" />
              Unduh Semua Silabus (.zip)
            </motion.button>
          </div>
        </div>

        {/* Metric Cards */}
        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow h-full"
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[#edf7f4]/60 group-hover:scale-125 transition-transform duration-300" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Total Modul Tersedia
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#d4eee7] text-[#0d5c52] flex items-center justify-center">
                  <BookOpen className="size-5" />
                </div>
              </div>
              <div className="mt-4 relative">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] leading-10 font-bold text-[#071f1c] tracking-tight">
                    <CountUp to={28} duration={1.2} />
                  </span>
                  <span className="text-[13px] text-[#0d5c52] font-semibold">Modul Aktif</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[12px] text-[#536360]">
                  <span className="w-2 h-2 rounded-full bg-[#0d5c52]" />
                  <span>18 Wajib</span>
                  <span className="text-[#bec9c5]">•</span>
                  <span className="w-2 h-2 rounded-full bg-[#14b8a6]" />
                  <span>10 Peminatan</span>
                </div>
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow h-full"
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[#edf7f4]/60 group-hover:scale-125 transition-transform duration-300" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Telah Dipelajari
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#6df5e1] text-[#006f64] flex items-center justify-center">
                  <BadgeCheck className="size-5" />
                </div>
              </div>
              <div className="mt-4 relative">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[32px] leading-10 font-bold text-[#071f1c] tracking-tight">
                    <CountUp to={19} duration={1.2} />{" "}
                    <span className="text-[15px] text-[#536360] font-normal">/ 28</span>
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#a6f2cf] text-[#00513a] font-bold">
                    68% Tuntas
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#cee8e1] rounded-full mt-2.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#0d5c52] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow h-full"
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[#edf7f4]/60 group-hover:scale-125 transition-transform duration-300" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Bahan Bacaan &amp; E-Book
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#d4eee7] text-[#0d5c52] flex items-center justify-center">
                  <Library className="size-5" />
                </div>
              </div>
              <div className="mt-4 relative">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] leading-10 font-bold text-[#071f1c] tracking-tight">
                    <CountUp to={42} duration={1.2} />
                  </span>
                  <span className="text-[13px] text-[#536360] font-semibold">Dokumen</span>
                </div>
                <p className="text-[12px] text-[#536360] mt-1 flex items-center gap-1">
                  <FileText className="size-[15px] text-[#0d5c52]" />
                  Format PDF, e-Pub &amp; Diktat Resmi
                </p>
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow h-full"
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[#edf7f4]/60 group-hover:scale-125 transition-transform duration-300" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Lab &amp; Praktikum
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#a6f2cf] text-[#00513a] flex items-center justify-center">
                  <Video className="size-5" />
                </div>
              </div>
              <div className="mt-4 relative">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] leading-10 font-bold text-[#071f1c] tracking-tight">
                    <CountUp to={14} duration={1.2} />
                  </span>
                  <span className="text-[13px] text-[#0d5c52] font-semibold">Sesi Rekaman</span>
                </div>
                <p className="text-[12px] text-[#536360] mt-1 flex items-center gap-1">
                  <Video className="size-[15px] text-[#0d5c52]" />
                  Video Eksperimen Kualitas 1080p
                </p>
              </div>
            </motion.div>
          </StaggerItem>
        </StaggerChildren>

        {/* Hero: Active Module */}
        <FadeIn>
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative bg-gradient-to-br from-[#00433b] via-[#0d5c52] to-[#14b8a6] text-white rounded-2xl p-6 shadow-lg overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#abf0e2]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-[#71f8e4]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/15 text-[#abf0e2] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#8fd3c6] animate-pulse" />
                    Sedang Dipelajari Minggu Ini
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold">
                    Informatika &amp; Sains Komputasi
                  </span>
                </div>
                <h2 className="text-[26px] leading-[34px] font-bold tracking-tight">
                  Advanced Graph Algorithms &amp; Applied Quantum Physics
                </h2>
                <p className="text-[14px] leading-relaxed text-[#abf0e2]">
                  Bab 4: Implementasi Algoritma Dijkstra, Shortest Path Optimization, &amp; Analisis
                  Komputasi Jaringan.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#abf0e2] text-[12px] mt-1">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="size-4" />
                    Dr. Pawell Bennett, S.Kom &amp; Mrs. Sarah V.
                  </span>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    Est. Waktu Membaca: ~35 Menit
                  </span>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-1.5">
                    <Paperclip className="size-4" />
                    4.2 MB PDF Lengkap
                  </span>
                </div>
                <div className="mt-2 max-w-md">
                  <div className="flex justify-between text-[11px] text-[#abf0e2] mb-1.5 font-semibold">
                    <span>Progres Sesi Bab 4</span>
                    <span className="text-white font-bold">75% Selesai (Sisa 1 Praktikum)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#00433b]/60 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#8fd3c6] to-[#abf0e2] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[220px]">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push("/student/modules/algoritma-pemrograman-optimasi-big-o")}
                  className="px-6 py-3 rounded-xl bg-white text-[#0d5c52] text-[15px] font-semibold hover:bg-[#abf0e2] transition-colors duration-200 shadow-md flex items-center justify-center gap-2 group"
                >
                  Lanjutkan Belajar
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => alert("PDF modul lengkap siap diunduh. Fitur unduh aktif setelah integrasi backend.")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[14px] font-semibold transition-colors duration-200 flex items-center justify-center gap-2 backdrop-blur-md"
                >
                  <Download className="size-[18px]" />
                  Unduh PDF Modul Lengkap
                </motion.button>
              </div>
            </div>
          </motion.div>
        </FadeIn>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 min-w-max">
              {subjectTabs.map((t) => (
                <motion.button
                  key={t.key}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSubject(t.key)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                    subject === t.key
                      ? "bg-[#0d5c52] text-white shadow-sm"
                      : "bg-white text-[#536360] hover:bg-[#d4eee7] hover:text-[#0d5c52] border border-[#cee8e1]/60"
                  }`}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center bg-white p-1 rounded-lg shadow-sm border border-[#cee8e1]/60 shrink-0">
              <motion.button
                type="button"
                title="Tampilan Kisi"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  view === "grid"
                    ? "bg-[#d4eee7] text-[#0d5c52]"
                    : "text-[#536360] hover:text-[#0d5c52]"
                }`}
              >
                <LayoutGrid className="size-5" />
              </motion.button>
              <motion.button
                type="button"
                title="Tampilan Daftar"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  view === "list"
                    ? "bg-[#d4eee7] text-[#0d5c52]"
                    : "text-[#536360] hover:text-[#0d5c52]"
                }`}
              >
                <List className="size-5" />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 px-4 rounded-xl shadow-sm border border-[#cee8e1]/60">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#536360]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul modul, bab materi, kode KD, atau keyword praktikum..."
                type="text"
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#edf7f4] text-[#071f1c] text-[14px] placeholder:text-[#6f7976] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14b8a6] transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-[11px] text-[#536360] font-semibold">Status:</span>
              <select
                aria-label="Filter status modul"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 px-3 bg-[#edf7f4] text-[#071f1c] text-[13px] font-semibold rounded-lg focus:outline-none cursor-pointer"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="h-6 w-px bg-[#cee8e1]" />
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSortNewest((v) => !v)}
                className="h-10 px-3 bg-[#edf7f4] text-[#071f1c] text-[13px] font-semibold rounded-lg hover:bg-[#d4eee7] flex items-center gap-1 transition-colors"
              >
                <Scale className="size-[18px] rotate-90" />
                {sortNewest ? "Terbaru" : "Terlama"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {visibleModules.length === 0 ? (
          <FadeIn>
            <div className="bg-white rounded-xl border border-[#cee8e1]/60 p-10 text-center text-[#536360] flex flex-col items-center gap-2">
              <SearchX className="size-8 text-[#bec9c5]" />
              <span className="text-[14px] font-semibold">
                Tidak ada modul yang cocok dengan filter Anda.
              </span>
              <span className="text-[12px]">Coba ubah kata kunci atau status pencarian.</span>
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren
            as="div"
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid grid-cols-1 gap-4"
            }
          >
            {visibleModules.map((m, i) => {
              const pText = progressText(m);
              const ActionIcon = m.actionIcon;
              return (
                <StaggerItem key={m.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="group bg-white rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] hover:shadow-[0_8px_20px_-4px_rgba(13,92,82,0.10)] hover:border-[#14b8a6]/25 transition-colors duration-200 flex flex-col justify-between overflow-hidden h-full"
                  >
                    <div>
                      {/* Visual header */}
                      <div
                        className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${m.gradient}`}
                      >
                        <Presentation className="absolute -right-6 -bottom-8 size-40 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${m.subjectChipClass}`}
                          >
                            {m.subjectLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${m.tagClass}`}
                          >
                            {m.tag}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[11px] font-semibold opacity-90 block">
                            {m.kicker}
                          </span>
                          <h3 className="text-[15px] leading-[22px] font-semibold line-clamp-1">
                            {m.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 flex flex-col gap-2">
                        <p className="text-[12px] leading-[18px] text-[#536360] line-clamp-2">
                          {m.desc}
                        </p>
                        <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-[#edf7f4] text-[11px] font-semibold text-[#536360]">
                          {m.info.map((info) => (
                            <div key={info.text} className="flex items-center gap-1.5">
                              <info.icon className={`size-4 ${info.iconClass}`} />
                              <span>{info.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex justify-between text-[11px] font-semibold text-[#536360]">
                            <span>Status Pemahaman</span>
                            <span className={pText.className}>
                              {m.status === "completed" && <CheckCircle2 className="size-3.5" />}
                              {pText.text}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#cee8e1] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                m.status === "new"
                                  ? "bg-[#bec9c5]"
                                  : m.status === "completed"
                                    ? "bg-[#0d5c52]"
                                    : i % 2 === 1
                                      ? "bg-[#14b8a6]"
                                      : "bg-[#0d5c52]"
                              }`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.max(m.progress, 5)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 + i * 0.05 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 pt-0 flex items-center justify-between gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (m.id === "algo-big-o") {
                            router.push("/student/modules/algoritma-pemrograman-optimasi-big-o");
                            return;
                          }
                          alert(
                            `Modul "${m.title}" dibuka. Fitur pembelajaran aktif setelah integrasi backend.`
                          );
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-[14px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                          m.status === "new"
                            ? "bg-[#0d5c52] text-white hover:bg-[#00433b]"
                            : "bg-[#d4eee7] hover:bg-[#cee8e1] text-[#0d5c52]"
                        }`}
                      >
                        <ActionIcon className="size-[18px]" />
                        {m.action}
                      </motion.button>
                      <motion.button
                        type="button"
                        title={m.downloadLabel}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() =>
                          alert(`${m.downloadLabel} siap diunduh. Fitur unduh aktif setelah integrasi backend.`)
                        }
                        className="p-2 rounded-lg bg-[#edf7f4] hover:bg-[#d9f3ed] text-[#536360] hover:text-[#0d5c52] transition-colors"
                      >
                        {m.status === "new" ? (
                          <CloudDownload className="size-5" />
                        ) : (
                          <Download className="size-5" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        )}

        {/* Syllabus Documentation */}
        <SlideIn direction="up">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#cee8e1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4eee7] text-[#0d5c52] flex items-center justify-center">
                  <ScrollText className="size-[22px]" />
                </div>
                <div>
                  <h2 className="text-[15px] leading-[22px] font-bold text-[#071f1c]">
                    Daftar Silabus &amp; Dokumen Kurikulum Resmi
                  </h2>
                  <p className="text-[12px] text-[#536360]">
                    Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan Panduan Standar
                    Kelulusan Kejuruan.
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-[#536360] font-semibold px-3 py-1 bg-[#edf7f4] rounded-full self-start sm:self-auto">
                Tahun Ajaran 2024 / 2025
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] min-w-[760px]">
                <thead>
                  <tr className="text-[#536360] text-[11px] font-semibold uppercase tracking-wider border-b border-[#d4eee7]">
                    <th className="py-3 px-4">Nama Dokumen &amp; Mata Pelajaran</th>
                    <th className="py-3 px-4">Tingkat / Fase</th>
                    <th className="py-3 px-4">Penyusun / Guru Pembina</th>
                    <th className="py-3 px-4">Status Verifikasi</th>
                    <th className="py-3 px-4 text-right">Aksi Unduh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf7f4]">
                  {syllabusDocs.map((d, i) => (
                    <motion.tr
                      key={d.name}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="hover:bg-[#edf7f4]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center ${d.extClass}`}
                          >
                            {d.ext}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[15px] leading-[22px] font-semibold text-[#071f1c]">
                              {d.name}
                            </span>
                            <span className="text-[11px] text-[#536360]">{d.file}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#071f1c]">{d.level}</td>
                      <td className="py-3.5 px-4 text-[#536360]">{d.author}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${d.verificationClass}`}
                        >
                          <d.verificationIcon className="size-[13px]" />
                          {d.verification}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() =>
                            alert(`${d.file} siap diunduh. Fitur unduh aktif setelah integrasi backend.`)
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#edf7f2] hover:bg-[#d4eee7] text-[#0d5c52] text-[13px] font-semibold transition-colors"
                        >
                          <Download className="size-4" />
                          {d.action}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SlideIn>
      </div>
    </FadeIn>
  );
}
