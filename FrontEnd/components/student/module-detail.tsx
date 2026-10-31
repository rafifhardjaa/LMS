"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlarmClock,
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Code,
  ExternalLink,
  FileText,
  FolderArchive,
  GraduationCap,
  Home,
  Hourglass,
  Info,
  Lock,
  MapPin,
  Play,
  Presentation,
  QrCode,
  Send,
  ShieldCheck,
  Terminal,
  CloudUpload,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FadeIn,
  SlideIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";
import { ModuleForum } from "@/components/student/module-forum";
import { modulesApi } from "@/lib/api/client";

type TabKey = "presensi" | "materi" | "tugas" | "kuis";

const tabs: { key: TabKey; label: string; icon: typeof BookOpen; alert?: boolean }[] = [
  { key: "presensi", label: "1. Absensi Sesi", icon: ShieldCheck },
  { key: "materi", label: "2. Materi & Video", icon: BookOpen },
  { key: "tugas", label: "3. Tugas Praktikum", icon: Terminal, alert: true },
  { key: "kuis", label: "4. Kuis & Evaluasi", icon: FileText },
];

const sessions = [
  {
    no: "01",
    title: "Sesi 1: Teori Graf & Matriks Ketetanggaan",
    meta: "Rabu, 12 Maret 2025 • 07:12 WITA (Tepat Waktu)",
    today: false,
  },
  {
    no: "02",
    title: "Sesi 2: Simulasi Pseudocode Dijkstra & Priority Queue",
    meta: "Jumat, 14 Maret 2025 • 07:18 WITA (Tepat Waktu)",
    today: false,
  },
  {
    no: "03",
    title: "Sesi 3: Implementasi Python & Library NetworkX",
    meta: "Senin, 17 Maret 2025 • 07:15 WITA (Tepat Waktu)",
    today: false,
  },
  {
    no: "04",
    title: "Sesi 4: Uji Beban & Evaluasi Rute Router Fisik",
    meta: "Rabu, 19 Maret 2025 • Presensi Terkunci 07:10 WITA",
    today: true,
  },
];

function CompletionGauge() {
  const ref = useRef<SVGPathElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#cee8e1"
          strokeWidth="3.5"
        />
        <motion.path
          ref={ref}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#0d5c52"
          strokeDasharray="100, 100"
          strokeLinecap="round"
          strokeWidth="3.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[20px] leading-7 font-bold text-[#071f1c]">100%</span>
        <span className="text-[10px] font-semibold text-[#536360]">Kesiapan</span>
      </div>
    </div>
  );
}

export function StudentModuleDetail({ moduleId }: { moduleId: string }) {
  const [tab, setTab] = useState<TabKey>("kuis");
  const router = useRouter();

  const moduleQuery = useQuery({
    queryKey: ["module", moduleId],
    queryFn: async () => {
      const result = await modulesApi.get(moduleId);
      if (result.error) {
        const error = new Error(
          result.error.message || result.error.error || "Gagal memuat modul"
        ) as Error & { status?: number };
        error.status = result.status;
        throw error;
      }
      return result.data?.data ?? null;
    },
  });

  const moduleStatus = (
    moduleQuery.error as (Error & { status?: number }) | null
  )?.status;

  useEffect(() => {
    if (moduleStatus !== 401) return;
    toast.error("Sesi berakhir. Silakan login kembali.");
    router.push("/auth/login");
  }, [moduleStatus, router]);

  if (moduleQuery.isError && moduleStatus !== 401) {
    return (
      <FadeIn className="w-full">
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-[#cee8e1]/60 bg-white p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]">
          <h1 className="text-[22px] font-bold text-[#071f1c]">
            {moduleStatus === 404
              ? "Modul tidak ditemukan"
              : "Gagal memuat modul"}
          </h1>
          <p className="text-[13px] text-[#536360]">
            {moduleStatus === 404
              ? "Modul yang Anda cari tidak tersedia atau sudah dihapus."
              : "Terjadi kesalahan saat mengambil data modul."}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moduleQuery.refetch()}
              className="rounded-lg bg-[#d4eee7] px-3 py-2 text-[12px] font-semibold text-[#0d5c52] hover:bg-[#cee8e1]"
            >
              Coba lagi
            </button>
            <Link
              href="/student/modules"
              className="rounded-lg bg-[#0d5c52] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#004d40]"
            >
              Kembali ke daftar modul
            </Link>
          </div>
        </div>
      </FadeIn>
    );
  }

  const moduleData = moduleQuery.data;
  const teacherName = moduleData?.teacher_name ?? "Bpk. Arya Wiguna, M.Cs";
  const teacherInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <FadeIn className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* Breadcrumb & Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <nav className="flex items-center gap-1.5 text-[13px] font-semibold text-[#536360] overflow-x-auto whitespace-nowrap py-1">
            <Link href="/student/dashboard" className="hover:text-[#0d5c52] transition-colors flex items-center gap-1">
              <Home className="size-4" />
              Dashboard
            </Link>
            <ChevronRight className="size-3.5 text-[#bec9c5]" />
            <Link href="/student/modules" className="hover:text-[#0d5c52] transition-colors">
              Modules
            </Link>
            <ChevronRight className="size-3.5 text-[#bec9c5]" />
            <span className="text-[#0d5c52]">
              {moduleData?.subject_name ?? "Informatika & Sains Komputasi"}
            </span>
          </nav>
        </div>

        {/* Hero Module Header */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#abf0e2]/30 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[11px] font-semibold">
                  Fase F • Kelas XII MIPA 1
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#071f1c] text-[11px] font-semibold">
                  Kurikulum Merdeka SMK Mataram
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#a6f2cf] text-[#00513a] text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004d40]" />
                  Status: Sedang Berjalan (75% Selesai)
                </span>
              </div>
              <h2 className="text-[30px] leading-[38px] font-bold text-[#071f1c] tracking-tight mt-1">
                {moduleData?.title ?? "Informatika & Sains Komputasi"}
              </h2>
              <p className="text-[14px] leading-relaxed text-[#3f4946] max-w-2xl">
                {moduleData?.description ??
                  "Eksplorasi representasi adjacency matrix, relaksasi simpul berbasis antrean prioritas (Priority Queue), serta pemetaan rute latensi minimum pada topologi backbone jaringan kampus SMK Mataram."}
              </p>
              <div className="flex items-center gap-4 pt-1 mt-1">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-[#0d5c52] text-white flex items-center justify-center text-[15px] font-semibold shadow-sm">
                    {teacherInitials || "AW"}
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 bg-[#14b8a6] rounded-full ring-2 ring-white"
                    title="Guru Online"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-[#071f1c]">
                      {teacherName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#abf0e2] text-[#0d5c52] text-[10px] font-semibold">
                      Guru Pengampu
                    </span>
                  </div>
                  <span className="text-[12px] text-[#536360]">
                    NIP: 19870512 201201 1 004 • Ruang Lab Komputasi A
                  </span>
                </div>
              </div>
            </div>

            {/* Gauge Widget */}
            <div className="flex lg:flex-col items-center justify-center bg-[#edf7f4] p-4 rounded-xl min-w-[210px] gap-4">
              <CompletionGauge />
              <div className="text-center">
                <span className="text-[13px] font-semibold text-[#071f1c] block">
                  4 dari 4 Bab Tuntas
                </span>
                <span className="text-[12px] text-[#536360]">Estimasi sisa: Selesai</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Status Presensi
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#a6f2cf] text-[#00513a] flex items-center justify-center">
                  <ShieldCheck className="size-[18px]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#071f1c]">
                  <span className="w-2 h-2 rounded-full bg-[#004d40]" />
                  Hadir Terverifikasi
                </div>
                <p className="text-[12px] text-[#536360] mt-0.5">07:15 WITA • Face &amp; Geolocation</p>
              </div>
              <div className="text-[11px] font-semibold text-[#004d40] bg-[#edf7f4] px-2 py-1 rounded-md flex items-center gap-1">
                <MapPin className="size-[13px]" />
                Radius Presensi: 12m (Valid)
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Progres Belajar
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#abf0e2] text-[#0d5c52] flex items-center justify-center">
                  <BookOpen className="size-[18px]" />
                </div>
              </div>
              <div>
                <span className="text-[15px] leading-[22px] font-bold text-[#071f1c]">
                  3 dari 3 Bab
                </span>
                <p className="text-[12px] text-[#536360] mt-0.5">100% Materi Terserap</p>
              </div>
              <div className="w-full bg-[#d4eee7] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#0d5c52] h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Status Tugas Lab
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#d4eee7] text-[#071f1c] flex items-center justify-center">
                  <Terminal className="size-[18px]" />
                </div>
              </div>
              <div>
                <span className="text-[14px] font-semibold text-[#071f1c] block truncate">
                  1 Tugas Praktikum
                </span>
                <p className="text-[12px] text-[#ba1a1a] font-medium mt-0.5 flex items-center gap-1">
                  <AlarmClock className="size-[14px]" />
                  Tenggat: Besok, 14:00 WITA
                </p>
              </div>
              <div className="text-[11px] font-semibold text-[#536360] bg-[#edf7f4] px-2 py-1 rounded-md">
                Status: Draft Berkas Tersimpan
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white p-4 rounded-xl border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col justify-between gap-2 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#536360] uppercase tracking-wider font-semibold">
                  Nilai Kuis Modul
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#a6f2cf] text-[#00513a] flex items-center justify-center">
                  <GraduationCap className="size-[18px]" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] leading-7 font-bold text-[#0d5c52]">95</span>
                  <span className="text-[12px] text-[#536360]">/ 100</span>
                </div>
                <p className="text-[12px] text-[#536360] mt-0.5">Predikat: A+ Sempurna</p>
              </div>
              <div className="text-[11px] font-semibold text-[#004d40] bg-[#edf7f4] px-2 py-1 rounded-md">
                Selesai pada Percobaan ke-2
              </div>
            </motion.div>
          </StaggerItem>
        </StaggerChildren>

        {/* Split Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left */}
          <SlideIn direction="left" className="lg:col-span-8 flex flex-col gap-6">
            {/* Tabs */}
            <div className="bg-white p-1.5 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex items-center overflow-x-auto whitespace-nowrap gap-1">
              {tabs.map((t) => (
                <motion.button
                  key={t.key}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${
                    tab === t.key
                      ? "bg-[#d4eee7] text-[#0d5c52]"
                      : "text-[#536360] hover:bg-[#edf7f4]"
                  }`}
                >
                  <t.icon className="size-[18px]" />
                  {t.label}
                  {t.alert && <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">

            {/* Section: Presensi */}
            {tab === "presensi" && (
              <motion.div
                key="presensi"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-[20px] leading-7 text-[#071f1c] font-semibold">
                      Presensi Pertemuan Modul 04
                    </h3>
                    <p className="text-[12px] text-[#536360]">
                      Log kehadiran kelas tatap muka &amp; laboratorium komputer Fase F
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-[#a6f2cf] text-[#00513a] text-[11px] font-semibold self-start sm:self-auto flex items-center gap-1">
                    <CheckCircle2 className="size-[14px]" />
                    Kehadiran 100% (4 dari 4 Sesi)
                  </span>
                </div>

                <StaggerChildren staggerDelay={0.08} className="flex flex-col gap-2 mt-1">
                  {sessions.map((s) => (
                    <StaggerItem key={s.no}>
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl gap-2 ${
                        s.today ? "bg-[#d4eee7]" : "bg-[#edf7f4]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[15px] ${
                            s.today ? "bg-[#0d5c52] text-white" : "bg-[#cee8e1] text-[#0d5c52]"
                          }`}
                        >
                          {s.no}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-[#071f1c]">
                              {s.title}
                            </span>
                            {s.today && (
                              <span className="px-1.5 py-0.5 bg-[#0d5c52] text-white rounded text-[10px] font-semibold">
                                Hari Ini
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-[#536360]">{s.meta}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {s.today ? (
                          <>
                            <span className="px-2 py-0.5 rounded-md bg-white text-[#0d5c52] text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                              <QrCode className="size-[14px] text-[#14b8a6]" />
                              QR Validated
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#0d5c52] text-white text-[11px] font-semibold">
                              Terkunci
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="px-2 py-0.5 rounded-md bg-[#cee8e1] text-[#0d5c52] text-[11px] font-semibold flex items-center gap-1">
                              <CheckCheck className="size-[14px]" />
                              Disetujui Guru
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#a6f2cf] text-[#00513a] text-[11px] font-semibold">
                              Hadir
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-[#edf7f4] text-[#536360] text-[12px] mt-1">
                  <Info className="size-[18px] text-[#0d5c52] mt-0.5 shrink-0" />
                  <span>
                    Rekap kehadiran modul ini telah disinkronkan ke Buku Induk Rapor Kurikulum
                    Merdeka. Presensi siswa memenuhi syarat kelulusan modul tanpa catatan alpa
                    atau dispensasi.
                  </span>
                </div>
              </motion.div>
            )}

            {/* Section: Materi */}
            {tab === "materi" && (
              <motion.div
                key="materi"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[20px] leading-7 text-[#071f1c] font-semibold">
                      Materi &amp; Bahan Ajar Interaktif
                    </h3>
                    <p className="text-[12px] text-[#536360]">
                      E-Book, Slide Presentasi Guru, dan Video Demonstrasi Algoritma
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#536360]">
                    4 Berkas Terlampir
                  </span>
                </div>

                <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  <StaggerItem>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex flex-col justify-between p-4 rounded-xl bg-[#edf7f4] hover:bg-[#dff9f2] transition-colors h-full"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="p-2 rounded-lg bg-[#d4eee7] text-[#0d5c52] flex items-center justify-center">
                          <FileText className="size-5" />
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#a6f2cf] text-[#00513a] text-[11px] font-semibold flex items-center gap-1">
                          <Check className="size-3" /> Selesai Dibaca
                        </span>
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#071f1c] mt-1">
                        Bab 1: Konsep Dasar Teori Graf, Node, &amp; Weighted Edges
                      </h4>
                      <p className="text-[12px] text-[#536360]">
                        Definisi graf berarah, penentuan matriks ketetanggaan dan adjacency list.
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-3">
                      <span className="text-[11px] font-semibold text-[#536360]">
                        PDF • 2.4 MB (15 Hlm)
                      </span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          alert("Bab 1 dibuka. Fitur dokumen aktif setelah integrasi backend.")
                        }
                        className="px-2 py-1 bg-white text-[#0d5c52] rounded-lg text-[11px] font-semibold hover:bg-[#0d5c52] hover:text-white transition-colors shadow-sm"
                      >
                        Buka Dokumen
                      </motion.button>
                    </div>
                  </motion.div>
                  </StaggerItem>

                  <StaggerItem>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex flex-col justify-between p-4 rounded-xl bg-[#edf7f4] hover:bg-[#dff9f2] transition-colors h-full"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="p-2 rounded-lg bg-[#d4eee7] text-[#0d5c52] flex items-center justify-center">
                          <Presentation className="size-5" />
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#a6f2cf] text-[#00513a] text-[11px] font-semibold flex items-center gap-1">
                          <Check className="size-3" /> Selesai
                        </span>
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#071f1c] mt-1">
                        Bab 2: Algoritma Shortest Path: Dijkstra vs Bellman-Ford
                      </h4>
                      <p className="text-[12px] text-[#536360]">
                        Perbandingan kompleksitas waktu, kelemahan bobot negatif, &amp; visualisasi
                        step-by-step.
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-3">
                      <span className="text-[11px] font-semibold text-[#536360]">
                        Slide Interaktif • 32 Slide
                      </span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          alert("Slide Bab 2 diputar. Fitur slide aktif setelah integrasi backend.")
                        }
                        className="px-2 py-1 bg-white text-[#0d5c52] rounded-lg text-[11px] font-semibold hover:bg-[#0d5c52] hover:text-white transition-colors shadow-sm"
                      >
                        Putar Slide
                      </motion.button>
                    </div>
                  </motion.div>
                  </StaggerItem>

                  <StaggerItem className="md:col-span-2">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-[#edf7f4]"
                  >
                    <div className="relative w-full md:w-56 h-36 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#071f1c] via-[#00433b] to-[#0d5c52] flex items-center justify-center group cursor-pointer">
                      <div className="absolute inset-0 bg-[#0d5c52]/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#0d5c52] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="size-7 ml-0.5 fill-current" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                        24:15
                      </span>
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#a6f2cf] text-[#00513a] text-[10px] font-semibold">
                            Ditonton 100%
                          </span>
                          <span className="text-[11px] font-semibold text-[#536360]">
                            Resolusi 1080p HD
                          </span>
                        </div>
                        <h4 className="text-[14px] font-semibold text-[#071f1c]">
                          Bab 3: Video Tutorial Live Coding Dijkstra dengan Python &amp; Google
                          Colab
                        </h4>
                        <p className="text-[12px] text-[#536360] line-clamp-2">
                          Panduan praktis membangun modul routing jaringan dari scratch menggunakan
                          modul heapq standar Python dan visualisasi grafik NetworkX.
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[12px] text-[#536360]">
                          Pemateri: Bpk. Arya Wiguna
                        </span>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            alert("Video Bab 3 diputar ulang. Fitur video aktif setelah integrasi backend.")
                          }
                          className="px-4 py-1 bg-white text-[#0d5c52] rounded-lg text-[11px] font-semibold hover:bg-[#0d5c52] hover:text-white transition-colors shadow-sm"
                        >
                          Tonton Ulang
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                  </StaggerItem>
                </StaggerChildren>
              </motion.div>
            )}

            {/* Section: Tugas */}
            {tab === "tugas" && (
              <motion.div
                key="tugas"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] text-[11px] font-semibold">
                      Tenggat Waktu Kritis
                    </span>
                    <h3 className="text-[20px] leading-7 text-[#071f1c] font-semibold mt-1">
                      Tugas Praktikum 04: Implementasi Algoritma Dijkstra pada Topologi Jaringan
                      SMK Mataram
                    </h3>
                  </div>
                  <div className="bg-[#edf7f4] px-4 py-1.5 rounded-xl flex items-center gap-2 self-start md:self-auto">
                    <Hourglass className="size-5 text-[#ba1a1a]" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#536360] leading-tight">Sisa Waktu:</span>
                      <span className="text-[13px] font-bold text-[#ba1a1a] leading-tight">
                        04 Jam 25 Menit
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[14px] leading-relaxed text-[#3f4946]">
                  Buatlah program simulasi pencarian jalur terpendek (least cost / shortest latency
                  path) yang menghubungkan 8 node router switch di laboratorium, ruang guru, dan
                  server pusat SMK Mataram. Sertakan analisis Big-O dan penanganan edge failure.
                </p>

                <div className="p-4 rounded-xl bg-[#edf7f4] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#071f1c] font-semibold flex items-center gap-2">
                      <FolderArchive className="size-5 text-[#0d5c52]" />
                      Berkas Pengumpulan Siswa (Pawell)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#abf0e2] text-[#00513a] text-[11px] font-semibold">
                      Draft Tersimpan
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center gap-1.5 truncate">
                      <Code className="size-5 text-[#0d5c52] shrink-0" />
                      <div className="flex flex-col truncate">
                        <span className="text-[11px] font-semibold text-[#071f1c] truncate">
                          algoritma_dijkstra_pawell_v2.zip
                        </span>
                        <span className="text-[10px] text-[#536360]">
                          1.8 MB • Diunggah 18 Maret
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="size-[18px] text-[#14b8a6] shrink-0" />
                  </div>

                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-[11px] font-semibold text-[#536360] uppercase tracking-wider">
                      Komponen Rubrik Penilaian Guru
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-1 bg-white rounded-lg">
                        <span className="block text-[15px] font-bold text-[#0d5c52]">30%</span>
                        <span className="text-[11px] font-semibold text-[#536360]">
                          Kerapihan Kode
                        </span>
                      </div>
                      <div className="p-1 bg-white rounded-lg">
                        <span className="block text-[15px] font-bold text-[#0d5c52]">30%</span>
                        <span className="text-[11px] font-semibold text-[#536360]">
                          Analisis Big-O
                        </span>
                      </div>
                      <div className="p-1 bg-white rounded-lg">
                        <span className="block text-[15px] font-bold text-[#0d5c52]">40%</span>
                        <span className="text-[11px] font-semibold text-[#536360]">
                          Uji Topologi
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        alert("Formulir unggah berkas dibuka. Fitur unggah aktif setelah integrasi backend.")
                      }
                      className="w-full sm:flex-1 py-2 px-4 bg-white text-[#0d5c52] text-[14px] font-semibold rounded-xl hover:bg-[#edf7f4] transition-colors flex items-center justify-center gap-2 shadow-sm border border-[#cee8e1]/60"
                    >
                      <CloudUpload className="size-5" />
                      Unggah Berkas
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        alert("Tugas Praktikum 04 berhasil dikirim (finalisasi). Fitur pengumpulan aktif setelah integrasi backend.")
                      }
                      className="w-full sm:flex-[2] py-2 px-4 bg-[#0d5c52] hover:bg-[#00433b] text-white text-[14px] font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="size-5" />
                      Kirim Tugas Sekarang (Finalisasi)
                    </motion.button>
                  </div>
                  <span className="text-[11px] text-[#536360] flex items-center gap-1">
                    <Info className="size-[14px] shrink-0" />
                    Format berkas: .pdf, .zip, .rar (Maks. 25 MB)
                  </span>
                </div>
              </motion.div>
            )}

            {/* Section: Kuis */}
            {tab === "kuis" && (
              <motion.div
                key="kuis"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-[#d4eee7] text-[#0d5c52] flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-[20px] leading-7 text-[#071f1c] font-semibold">
                        Kuis Formatif Modul 04: Logika Algoritma &amp; Kompleksitas
                      </h3>
                      <p className="text-[12px] text-[#536360]">
                        Evaluasi formatif terintegrasi Google Workspace for Education (SSO SMK
                        Mataram)
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-1 rounded-full bg-[#a6f2cf] text-[#00513a] text-[11px] font-bold self-start whitespace-nowrap">
                    TUNTAS (KKM: 78.00)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#edf7f4] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-12 h-12 rounded-xl bg-white text-[#0d5c52] flex items-center justify-center shrink-0 shadow-sm">
                      <FileText className="size-6" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[15px] font-semibold text-[#071f1c]">
                        Kuis Formatif Dikerjakan via Google Forms
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-[#a6f2cf] text-[#00513a] text-[10px] font-semibold self-start">
                        Tautan Aktif &amp; Terbuka
                      </span>
                      <p className="text-[12px] text-[#536360]">
                        Pengerjaan kuis menggunakan formulir resmi. Respons hanya dapat dikirim 1
                        kali per akun.
                      </p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      alert("Membuka Google Form kuis. Fitur integrasi aktif setelah integrasi backend.")
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0d5c52] text-white rounded-xl text-[13px] font-semibold hover:bg-[#00433b] transition-colors shadow-sm whitespace-nowrap shrink-0"
                  >
                    <ExternalLink className="size-[18px]" />
                    Buka Kuis di Google Form
                  </motion.button>
                </div>

                <div className="p-4 rounded-xl bg-[#d4eee7] flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#0d5c52] text-white flex flex-col items-center justify-center shadow-md shrink-0">
                      <span className="text-[24px] leading-7 font-bold">95</span>
                      <span className="text-[10px] font-semibold">/ 100</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-semibold text-[#071f1c]">
                          Nilai Kuis Modul: 95.00
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#a6f2cf] text-[#00513a] text-[10px] font-semibold">
                          Predikat: A+ Sempurna
                        </span>
                      </div>
                      <p className="text-[12px] text-[#536360]">
                        Dinilai &amp; Diverifikasi oleh Bpk. Arya Wiguna, M.Cs (Guru Pengampu)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-white flex items-start gap-2">
                      <CheckCircle2 className="size-[18px] text-[#0d5c52] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[12px] font-semibold text-[#071f1c]">
                          Status Sinkronisasi Respons
                        </span>
                        <p className="text-[11px] text-[#536360]">
                          Diimpor otomatis dari Google Spreadsheet Form Respons pada 18 Oktober
                          2026, 10:45 WITA
                        </p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white flex items-start gap-2">
                      <CheckCircle2 className="size-[18px] text-[#0d5c52] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[12px] font-semibold text-[#071f1c]">
                          Hasil Butir Soal Terdapat
                        </span>
                        <p className="text-[11px] text-[#536360]">
                          19 dari 20 butir soal dijawab tepat (Akurasi 95% • Kriteria Lulus Modul
                          Terpenuhi)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-[#536360]">
                    <Info className="size-[15px] text-[#0d5c52] shrink-0 mt-0.5" />
                    <span>
                      Catatan Guru: &quot;Hasil pengerjaan Google Form sangat memuaskan. Nilai sudah
                      tervalidasi dan tercatat pada Rapor Kurikulum Merdeka.&quot;
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </SlideIn>

          {/* Right */}
          <SlideIn direction="right" delay={0.1} className="lg:col-span-4 flex flex-col gap-6">
            {/* Forum */}
            <ModuleForum moduleId={moduleId} />

            {/* Next Module (Locked) */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#536360] uppercase tracking-wider">
                  Modul Berikutnya
                </span>
                <Lock className="size-5 text-[#bec9c5]" />
              </div>
              <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#d4eee7] text-[#536360] flex items-center justify-center font-bold text-[15px]">
                  05
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[14px] font-semibold text-[#071f1c] leading-tight">
                    Modul 05: Dynamic Programming &amp; Knapsack Problem
                  </h4>
                  <span className="text-[12px] text-[#536360] mt-1">
                    Terbuka otomatis: Senin, 24 Maret 2025
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#edf7f4] text-[11px] font-semibold text-[#536360] flex items-center gap-1.5 mt-1">
                <Lock className="size-[15px] text-[#0d5c52]" />
                Selesaikan pengumpulan Tugas Lab 04 untuk membuka akses lebih awal.
              </div>
            </motion.div>
          </SlideIn>
        </div>
      </div>
    </FadeIn>
  );
}
