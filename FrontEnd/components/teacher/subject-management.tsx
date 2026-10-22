"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Clock3,
  Cloud,
  Cpu,
  DoorOpen,
  Download,
  Eye,
  FileText,
  FlaskConical,
  Leaf,
  LockOpen,
  MoreVertical,
  PencilLine,
  Play,
  Plus,
  RefreshCw,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";

type Category = "fisika" | "sains" | "informatika";
type CourseStatus = "lengkap" | "remedial";
type CourseLevel = "VI" | "VII" | "VIII";
type CategoryTab = "all" | Category | "arsip";
type LevelFilter = "all" | CourseLevel;
type StatusFilter = "all" | CourseStatus;

type Course = {
  id: string;
  level: CourseLevel;
  className: string;
  subject: string;
  category: Category;
  status: CourseStatus;
  badge: string;
  badgeClassName: string;
  room: string;
  weeklyHours: string;
  students: number;
  chapter: string;
  progress: number;
  progressBarClassName: string;
  progressTextClassName: string;
  average: string;
  attendance: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconTextClassName: string;
};

type Kpi = {
  label: string;
  value: string;
  unit: string;
  unitClassName: string;
  icon: LucideIcon;
  tone: "primary" | "blue" | "green" | "amber";
  footerLeft: string;
  footerRight?: string;
  footerRightClassName?: string;
  dotClassName?: string;
};

type ModuleState = "done" | "active" | "scheduled";
type CurriculumModule = {
  number: string;
  title: string;
  meta: string;
  status: string;
  state: ModuleState;
};

const courses: Course[] = [
  {
    id: "vii-a-fisika",
    level: "VII",
    className: "VII - A",
    subject: "Fisika Terapan",
    category: "fisika",
    status: "lengkap",
    badge: "Kurikulum Merdeka",
    badgeClassName: "bg-[#FFEBEB] text-[#b71422]",
    room: "Lab Fisika 1",
    weeklyHours: "4 JP / Mgg",
    students: 38,
    chapter: "Bab 4: Termodinamika & Kalor",
    progress: 78,
    progressBarClassName: "bg-[#b71422]",
    progressTextClassName: "text-[#b71422]",
    average: "88.2%",
    attendance: "96.4%",
    icon: FlaskConical,
    iconBgClassName: "bg-[#FEE2E2]",
    iconTextClassName: "text-[#DC2626]",
  },
  {
    id: "vii-b-fisika",
    level: "VII",
    className: "VII - B",
    subject: "Fisika Terapan",
    category: "fisika",
    status: "remedial",
    badge: "Remedial Buka",
    badgeClassName: "bg-[#FEF3C7] text-[#D97706]",
    room: "Ruang VII-B",
    weeklyHours: "4 JP / Mgg",
    students: 43,
    chapter: "Bab 4: Termodinamika",
    progress: 75,
    progressBarClassName: "bg-[#b71422]",
    progressTextClassName: "text-[#b71422]",
    average: "84.7%",
    attendance: "94.1%",
    icon: FlaskConical,
    iconBgClassName: "bg-[#FEE2E2]",
    iconTextClassName: "text-[#DC2626]",
  },
  {
    id: "vi-b-sains",
    level: "VI",
    className: "VI - B",
    subject: "Sains Terpadu",
    category: "sains",
    status: "lengkap",
    badge: "Kurikulum Merdeka",
    badgeClassName: "bg-[#FFEBEB] text-[#b71422]",
    room: "Lab Lingkungan",
    weeklyHours: "3 JP / Mgg",
    students: 40,
    chapter: "Bab 5: Energi Terbarukan & Ekosistem",
    progress: 85,
    progressBarClassName: "bg-[#006B2C]",
    progressTextClassName: "text-[#16A34A]",
    average: "88.3%",
    attendance: "98.0%",
    icon: Leaf,
    iconBgClassName: "bg-[#DCFCE7]",
    iconTextClassName: "text-[#16A34A]",
  },
  {
    id: "vi-a-sains",
    level: "VI",
    className: "VI - A",
    subject: "Sains Terpadu",
    category: "sains",
    status: "lengkap",
    badge: "Kurikulum Merdeka",
    badgeClassName: "bg-[#FFEBEB] text-[#b71422]",
    room: "Ruang VI-A",
    weeklyHours: "3 JP / Mgg",
    students: 38,
    chapter: "Bab 5: Pengukuran & Kalibrasi",
    progress: 82,
    progressBarClassName: "bg-[#006B2C]",
    progressTextClassName: "text-[#16A34A]",
    average: "91.5%",
    attendance: "95.5%",
    icon: Leaf,
    iconBgClassName: "bg-[#DCFCE7]",
    iconTextClassName: "text-[#16A34A]",
  },
  {
    id: "vii-a-informatika",
    level: "VII",
    className: "VII - A",
    subject: "Informatika & Komputasi",
    category: "informatika",
    status: "lengkap",
    badge: "Kurikulum Merdeka",
    badgeClassName: "bg-[#FFEBEB] text-[#b71422]",
    room: "Lab Komputer 2",
    weeklyHours: "4 JP / Mgg",
    students: 35,
    chapter: "Bab 6: Logika Algoritma & Jaringan",
    progress: 90,
    progressBarClassName: "bg-[#006398]",
    progressTextClassName: "text-[#9333EA]",
    average: "93.2%",
    attendance: "99.1%",
    icon: Cpu,
    iconBgClassName: "bg-[#F3E8FF]",
    iconTextClassName: "text-[#9333EA]",
  },
  {
    id: "viii-a-informatika",
    level: "VIII",
    className: "VIII - A",
    subject: "Informatika Kejuruan",
    category: "informatika",
    status: "lengkap",
    badge: "Kurikulum Merdeka",
    badgeClassName: "bg-[#FFEBEB] text-[#b71422]",
    room: "Studio Komputer",
    weeklyHours: "4 JP / Mgg",
    students: 36,
    chapter: "Bab 3: Pemrograman Dasar IoT",
    progress: 68,
    progressBarClassName: "bg-[#F59E0B]",
    progressTextClassName: "text-[#D97706]",
    average: "85.8%",
    attendance: "93.8%",
    icon: Cpu,
    iconBgClassName: "bg-[#F3E8FF]",
    iconTextClassName: "text-[#9333EA]",
  },
];

const categoryTabs: { id: CategoryTab; label: string }[] = [
  { id: "all", label: "Semua Rombel" },
  { id: "fisika", label: "Fisika Terapan" },
  { id: "sains", label: "Sains Terpadu" },
  { id: "informatika", label: "Informatika Kejuruan" },
  { id: "arsip", label: "Arsip Silabus" },
];

const curriculumModules: CurriculumModule[] = [
  {
    number: "01",
    title: "Besaran, Satuan, dan Pengukuran Presisi",
    meta: "4 Kelas Aktif • Selesai Minggu ke-2 • 4 LKPD Praktikum",
    status: "Tuntas 100%",
    state: "done",
  },
  {
    number: "02",
    title: "Kinematika Gerak Lurus & Analisis Vektor",
    meta: "4 Kelas Aktif • Selesai Minggu ke-4 • Kuis Analitik Terverifikasi",
    status: "Tuntas 100%",
    state: "done",
  },
  {
    number: "03",
    title: "Dinamika Gerak & Hukum Newton Kejuruan",
    meta: "4 Kelas Aktif • Selesai Minggu ke-6 • Asesmen Sumatif 1",
    status: "Tuntas 100%",
    state: "done",
  },
  {
    number: "04",
    title: "Termodinamika & Mesin Kalor Sederhana",
    meta: "Sedang Berjalan (Minggu ke-8) • 38/40 Praktikum Lab Masuk",
    status: "78% Aktif",
    state: "active",
  },
  {
    number: "05",
    title: "Gelombang Elektromagnetik & Optika Terapan",
    meta: "Terjadwal Mulai Minggu ke-10 • Perangkat Ajar Siap",
    status: "Terjadwal",
    state: "scheduled",
  },
];

const adminItems = [
  {
    label: "Alur Tujuan Pembelajaran (ATP) 2024/2025",
    status: "Disahkan",
    done: true,
  },
  {
    label: "Modul Ajar / RPP Berdiferensiasi",
    status: "Lengkap",
    done: true,
  },
  {
    label: "Lembar Kerja Peserta Didik (LKPD) Praktikum",
    status: "8 Berkas",
    done: true,
  },
  {
    label: "Bank Soal Sumatif Tengah Semester (STS)",
    status: "Review Pengawas",
    done: false,
  },
  {
    label: "Matriks Program Remedial & Pengayaan",
    status: "Tersinkron",
    done: true,
  },
];

const kpiToneClasses = {
  primary: "bg-[#FFEBEB] text-[#b71422]",
  blue: "bg-[#E0F2FE] text-[#0284C7]",
  green: "bg-[#DCFCE7] text-[#16A34A]",
  amber: "bg-[#FEF3C7] text-[#D97706]",
} as const;

export function SubjectManagement() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const totalStudents = courses.reduce((total, course) => total + course.students, 0);
  const subjectCount = new Set(courses.map((course) => course.subject)).size;

  const getCategoryCount = (id: CategoryTab) => {
    if (id === "all") return courses.length;
    if (id === "arsip") return 0;
    return courses.filter((course) => course.category === id).length;
  };

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      if (activeTab === "arsip") return false;
      if (activeTab !== "all" && course.category !== activeTab) return false;
      if (levelFilter !== "all" && course.level !== levelFilter) return false;
      if (statusFilter !== "all" && course.status !== statusFilter) return false;
      if (!query) return true;

      return [
        course.className,
        course.subject,
        course.chapter,
        course.room,
        course.badge,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [activeTab, levelFilter, statusFilter, search]);

  const resetFilters = () => {
    setActiveTab("all");
    setLevelFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  const kpis: Kpi[] = [
    {
      label: "Total Mata Pelajaran",
      value: String(subjectCount),
      unit: "Mapel Inti",
      unitClassName: "text-[#b71422]",
      icon: BookOpen,
      tone: "primary",
      footerLeft: "Fisika, Sains, Informatika",
      dotClassName: "bg-[#22C55E]",
    },
    {
      label: "Rombel Kelas Diajar",
      value: String(courses.length),
      unit: "Kelas Aktif",
      unitClassName: "text-[#006398]",
      icon: Users,
      tone: "blue",
      footerLeft: "Fase E & F",
      footerRight: `${totalStudents} Total Siswa`,
      footerRightClassName: "text-[#1E293B]",
    },
    {
      label: "Modul Ajar & RPP",
      value: "28/32",
      unit: "Rilis",
      unitClassName: "text-[#16A34A]",
      icon: FileText,
      tone: "green",
      footerLeft: "Verifikasi Waka",
      footerRight: "90% Lengkap",
      footerRightClassName: "text-[#16A34A]",
    },
    {
      label: "Status CP / KKTP",
      value: "86.4%",
      unit: "Tuntas",
      unitClassName: "text-[#16A34A]",
      icon: Award,
      tone: "amber",
      footerLeft: "KKM Target 75.0",
      footerRight: "Tercapai (+11.4)",
      footerRightClassName: "text-[#1E293B]",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <FadeIn>
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#94A3B8]">
              <span>Dashboard</span>
              <ChevronRight className="size-3.5" />
              <span className="text-[#b71422]">Mata Pelajaran &amp; Kurikulum</span>
            </div>
            <h1 className="mt-1 text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
              Manajemen Mata Pelajaran &amp; Kurikulum Pengampu
            </h1>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[#475569]">
              Kelola rombel kelas aktif, distribusi alur tujuan pembelajaran (ATP),
              materi ajar, serta sinkronisasi e-KTSP &amp; Kurikulum Merdeka SMK
              Mataram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info("Jadwal sesi mengikuti kalender akademik.")}
              className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#1E293B] shadow-sm transition-colors hover:bg-[#F8FAFC]"
            >
              <CalendarDays className="size-[18px] text-[#006398]" />
              Jadwal Sesi ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => toast.info("Impor Dapodik akan dihubungkan pada tahap integrasi.")}
              className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#1E293B] shadow-sm transition-colors hover:bg-[#F8FAFC]"
            >
              <RefreshCw className="size-[18px] text-[#475569]" />
              Impor Dapodik
            </button>
            <button
              type="button"
              onClick={() => toast.info("Form tambah modul ajar segera dihubungkan ke backend.")}
              className="flex items-center gap-1.5 rounded-lg bg-[#b71422] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#db3237] active:scale-[0.98]"
            >
              <Plus className="size-5" />
              Tambah Modul Ajar
            </button>
          </div>
        </div>
      </FadeIn>

      <StaggerChildren
        staggerDelay={0.06}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {kpis.map((kpi) => (
          <StaggerItem key={kpi.label} className="h-full">
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 8px 20px -8px rgba(0,0,0,0.16)" }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="h-full rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
                    {kpi.label}
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[26px] font-bold leading-8 tracking-tight text-[#1E293B]">
                      {kpi.value}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.06em] ${kpi.unitClassName}`}>
                      {kpi.unit}
                    </span>
                  </div>
                </div>
                <div className={`flex size-10 flex-shrink-0 items-center justify-center rounded-xl ${kpiToneClasses[kpi.tone]}`}>
                  <kpi.icon className="size-[22px]" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-2 text-[12px] text-[#475569]">
                <span className="flex min-w-0 items-center gap-1.5">
                  {kpi.dotClassName && (
                    <span className={`size-2 flex-shrink-0 rounded-full ${kpi.dotClassName}`} />
                  )}
                  <span className="truncate">{kpi.footerLeft}</span>
                </span>
                {kpi.footerRight && (
                  <span className={`flex-shrink-0 font-semibold ${kpi.footerRightClassName ?? ""}`}>
                    {kpi.footerRight}
                  </span>
                )}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.08}>
        <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex w-full items-center gap-1 overflow-x-auto pb-1 lg:w-auto lg:pb-0">
              {categoryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                      isActive
                        ? "bg-[#FFEBEB] text-[#b71422] shadow-sm"
                        : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                    }`}
                  >
                    {tab.label}
                    {tab.id !== "arsip" && ` (${getCategoryCount(tab.id)})`}
                  </button>
                );
              })}
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:flex-nowrap lg:w-auto">
              <label className="relative flex items-center gap-1 rounded-lg bg-[#F8FAFC] py-1.5 pl-2.5 pr-7 text-[12px] text-[#475569]">
                <span className="text-[#94A3B8]">Tingkat:</span>
                <select
                  value={levelFilter}
                  onChange={(event) => setLevelFilter(event.target.value as LevelFilter)}
                  className="max-w-[86px] cursor-pointer appearance-none bg-transparent font-semibold text-[#1E293B] outline-none"
                  aria-label="Filter tingkat kelas"
                >
                  <option value="all">Semua</option>
                  <option value="VI">Kelas VI</option>
                  <option value="VII">Kelas VII</option>
                  <option value="VIII">Kelas VIII</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 size-4 text-[#94A3B8]" />
              </label>

              <label className="relative flex items-center gap-1 rounded-lg bg-[#F8FAFC] py-1.5 pl-2.5 pr-7 text-[12px] text-[#475569]">
                <span className="text-[#94A3B8]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="max-w-[92px] cursor-pointer appearance-none bg-transparent font-semibold text-[#1E293B] outline-none"
                  aria-label="Filter status rombel"
                >
                  <option value="all">Semua</option>
                  <option value="lengkap">Lengkap</option>
                  <option value="remedial">Remedial</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 size-4 text-[#94A3B8]" />
              </label>

              <div className="relative min-w-[180px] flex-1 sm:w-60">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari modul atau topik..."
                  aria-label="Cari modul atau topik"
                  className="w-full rounded-lg bg-[#F8FAFC] py-1.5 pl-8 pr-3 text-[12px] text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:bg-white focus:ring-2 focus:ring-[#FFB3B3]"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {filteredCourses.length > 0 ? (
        <StaggerChildren
          key={`${activeTab}-${levelFilter}-${statusFilter}-${search}`}
          staggerDelay={0.05}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </StaggerChildren>
      ) : (
        <FadeIn>
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#FFEBEB] text-[#b71422]">
              <Search className="size-6" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-[#1E293B]">
                Tidak ada rombel yang cocok
              </h3>
              <p className="mt-1 text-[13px] text-[#64748B]">
                Ubah filter tingkat, status, atau kata kunci pencarian.
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 rounded-lg bg-[#FFEBEB] px-4 py-2 text-[13px] font-semibold text-[#b71422] transition-colors hover:bg-[#FFDADA]"
            >
              Reset Filter
            </button>
          </div>
        </FadeIn>
      )}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <FadeIn delay={0.1} className="lg:col-span-7">
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#FFEBEB] text-[#b71422]">
                  <TrendingUpIcon />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-[#1E293B]">
                    Capaian Pembelajaran (CP) &amp; Alur Tujuan (ATP)
                  </h2>
                  <p className="text-[12px] text-[#94A3B8]">
                    Distribusi materi ajar semester genap pada program keahlian
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-[#F8FAFC] px-2.5 py-1 text-[12px] font-semibold text-[#006398]">
                Fase E • Semester Genap
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {curriculumModules.map((module) => (
                <CurriculumModuleRow key={module.number} module={module} />
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.16} className="flex flex-col gap-4 lg:col-span-5">
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#E0F2FE] text-[#0284C7]">
                  <ClipboardCheck className="size-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#1E293B]">
                  Administrasi Guru Pengampu
                </h3>
              </div>
              <span className="rounded bg-[#DCFCE7] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#16A34A]">
                4 / 5 Lengkap
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-[12px]">
              {adminItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 ${
                    item.done
                      ? "hover:bg-[#F8FAFC]"
                      : "bg-[#FEF3C7]/30"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="size-[18px] flex-shrink-0 text-[#22C55E]" />
                    ) : (
                      <Clock3 className="size-[18px] flex-shrink-0 text-[#F59E0B]" />
                    )}
                    <span className="truncate font-semibold text-[#1E293B]">
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide ${
                      item.done ? "text-[#94A3B8]" : "text-[#D97706]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706]">
                  <Cloud className="size-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#1E293B]">
                  Integrasi Dapodik &amp; E-Rapor
                </h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#16A34A]">
                <span className="size-2 animate-pulse rounded-full bg-[#22C55E]" />
                Live Sinkron
              </span>
            </div>

            <p className="text-[12px] leading-5 text-[#475569]">
              Sinkronisasi otomatis nilai harian, portofolio tugas, dan presensi{" "}
              {courses.length} rombel ke database E-Rapor Kurikulum Merdeka SMK
              Mataram.
            </p>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2 text-[12px]">
              <span className="text-[#94A3B8]">Sinkronisasi Terakhir:</span>
              <span className="font-semibold text-[#1E293B]">Hari Ini, 07:15 WITA</span>
            </div>

            <button
              type="button"
              onClick={() => toast.info("Sinkronisasi Dapodik sedang disiapkan.")}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#006398] py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#004B73]"
            >
              <RefreshCw className="size-[18px]" />
              Sinkronkan Nilai &amp; Modul ke Dapodik
            </button>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;

  return (
    <StaggerItem className="h-full">
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 12px 24px -12px rgba(0,0,0,0.18)" }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="flex h-full flex-col justify-between rounded-2xl bg-white p-4 shadow-sm"
      >
        <div>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`flex size-11 flex-shrink-0 items-center justify-center rounded-xl ${course.iconBgClassName} ${course.iconTextClassName}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[16px] font-semibold text-[#1E293B]">
                    {course.className}
                  </span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${course.badgeClassName}`}
                  >
                    {course.badge}
                  </span>
                </div>
                <span className="block truncate text-[13px] text-[#475569]">
                  {course.subject}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Opsi ${course.subject} ${course.className}`}
              onClick={() => toast.info("Menu aksi modul akan tersedia di tahap berikutnya.")}
              className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#1E293B]"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <DoorOpen className="size-[14px]" />
              {course.room}
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-[14px]" />
              {course.weeklyHours}
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="flex items-center gap-1">
              <Users className="size-[14px]" />
              {course.students} Siswa
            </span>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
              <span className="truncate font-semibold text-[#475569]">
                {course.chapter}
              </span>
              <span className={`flex-shrink-0 font-bold ${course.progressTextClassName}`}>
                {course.progress}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F8FAFC]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${course.progressBarClassName}`}
              />
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl bg-[#F8FAFC] p-2 text-center">
            <div className="py-0.5">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Rata-Rata Nilai
              </span>
              <span className="text-[13px] font-semibold text-[#1E293B]">
                {course.average}
              </span>
            </div>
            <div className="py-0.5">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Kehadiran
              </span>
              <span className="text-[13px] font-semibold text-[#22C55E]">
                {course.attendance}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => toast.info("Silabus dan modul ajar akan ditautkan ke halaman detail.")}
            className="flex items-center gap-1 text-[13px] font-semibold text-[#b71422] transition-colors hover:text-[#db3237] hover:underline"
          >
            Buka Silabus &amp; Modul
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => toast.info("Input nilai akan dihubungkan ke modul penilaian.")}
            className="flex items-center gap-1 rounded-lg bg-[#F8FAFC] px-2.5 py-1.5 text-[12px] text-[#1E293B] transition-colors hover:bg-[#F1F5F9]"
          >
            <PencilLine className="size-4 text-[#006398]" />
            Input Nilai
          </button>
        </div>
      </motion.div>
    </StaggerItem>
  );
}

function CurriculumModuleRow({ module }: { module: CurriculumModule }) {
  const isActive = module.state === "active";
  const isScheduled = module.state === "scheduled";

  const rowClassName = isActive
    ? "bg-[#FFEBEB]/60"
    : isScheduled
      ? "bg-[#F8FAFC] opacity-75 hover:opacity-100"
      : "bg-[#F8FAFC] hover:bg-[#F1F5F9]";

  return (
    <div className={`flex items-center justify-between gap-2 rounded-xl p-2 transition-colors ${rowClassName}`}>
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full ${
            module.state === "done"
              ? "bg-[#22C55E] text-white"
              : isActive
                ? "bg-[#b71422] text-white"
                : "bg-[#E2E8F0] text-[#94A3B8]"
          }`}
        >
          {module.state === "done" ? (
            <Check className="size-4" />
          ) : isActive ? (
            <Play className="size-3.5 fill-current" />
          ) : (
            <Clock3 className="size-3.5" />
          )}
        </div>
        <div className="min-w-0">
          <span className="block truncate text-[13px] font-semibold text-[#1E293B]">
            Modul {module.number}: {module.title}
          </span>
          <span className={`block truncate text-[11px] ${isActive ? "text-[#b71422]" : "text-[#94A3B8]"}`}>
            {module.meta}
          </span>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <span
          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            module.state === "done"
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : isActive
                ? "bg-white text-[#b71422]"
                : "bg-white text-[#94A3B8]"
          }`}
        >
          {module.status}
        </span>
        <button
          type="button"
          aria-label={`Aksi modul ${module.number}`}
          onClick={() => toast.info("Aksi modul akan dihubungkan ke halaman pengelolaan.")}
          className={`flex size-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-white hover:text-[#1E293B] ${
            isActive ? "bg-white text-[#b71422] shadow-xs" : ""
          }`}
        >
          {module.state === "done" ? (
            <Download className="size-[18px]" />
          ) : isActive ? (
            <Eye className="size-[18px]" />
          ) : (
            <LockOpen className="size-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}
