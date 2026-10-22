import {
  BarChart3,
  Calculator,
  CheckCircle,
  FileText,
  Lock,
  RefreshCw,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import type {
  AssessmentFilter,
  ClassFilter,
  DiagnosticTopic,
  DistributionTier,
  GradeStatus,
  QuickAction,
  RemedialGroup,
  StudentGrade,
  SummaryMetric,
} from "./types";

export const kktp = 75;
export const totalStudents = 35;
export const pageSize = 6;

export const classOptions: { value: ClassFilter; label: string }[] = [
  { value: "VII-A", label: "VII - A • Fisika Terapan" },
  { value: "VII-B", label: "VII - B • Fisika Terapan" },
  { value: "VI-A", label: "VI - A • IPA Terpadu" },
  { value: "VI-B", label: "VI - B • IPA Terpadu" },
  { value: "VIII-A", label: "VIII - A • Sains Rekayasa" },
];

export const assessmentOptions: {
  value: AssessmentFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "Semua Asesmen (Formatif, STS, SAS)",
  },
  {
    value: "formatif",
    label: "Formatif: Rerata Tujuan Pembelajaran (TP)",
  },
  {
    value: "sts",
    label: "Sumatif Tengah Semester (STS)",
  },
  {
    value: "praktik",
    label: "Penilaian Unjuk Kerja / Praktikum Lab",
  },
];

export const summaryMetrics: SummaryMetric[] = [
  {
    id: "average",
    label: "Rata-Rata Nilai Rombel",
    value: "86.8",
    suffix: "/ 100",
    icon: BarChart3,
    iconBgClassName: "bg-[#FFEBEB]",
    iconTextClassName: "text-[#b71422]",
    footerLeft: "+4.2% vs STS lalu",
    footerLeftClassName: "text-[#16A34A]",
    footerRight: "Target Tercapai",
    footerRightClassName: "text-[#16A34A]",
    footerIcon: TrendingUp,
  },
  {
    id: "completion",
    label: "Ketuntasan KKTP (≥ 75)",
    value: "91.4%",
    suffix: "(32/35 Siswa)",
    icon: CheckCircle,
    iconBgClassName: "bg-[#DCFCE7]",
    iconTextClassName: "text-[#16A34A]",
    footerLeft: "32 dari 35 siswa tuntas",
    footerRight: "Aman",
    footerRightClassName: "text-[#16A34A]",
    progress: 91.4,
    progressClassName: "bg-[#22C55E]",
  },
  {
    id: "remedial",
    label: "Siswa Perlu Remedial",
    value: "3",
    suffix: "Siswa",
    icon: TriangleAlert,
    iconBgClassName: "bg-[#FEE2E2]",
    iconTextClassName: "text-[#b71422]",
    footerLeft: "Modul 04 Kalor",
    footerRight: "Jadwalkan",
    footerRightClassName: "text-[#b71422]",
    active: true,
  },
  {
    id: "sync",
    label: "Sinkronisasi e-Rapor",
    value: "100%",
    suffix: "Valid",
    icon: RefreshCw,
    iconBgClassName: "bg-[#E0F2FE]",
    iconTextClassName: "text-[#006398]",
    footerLeft: "Dapodik Ditjen Vokasi",
    footerRight: "Terverifikasi",
    footerRightClassName: "text-[#16A34A]",
    footerDotClassName: "bg-[#22C55E]",
  },
];

export const distributionTiers: DistributionTier[] = [
  {
    id: "very-high",
    label: "Sangat Mahir",
    students: 14,
    range: "Rentang: 90 - 100",
    share: "40.0%",
    height: 93,
    barClassName:
      "bg-gradient-to-t from-[#006398] to-[#5bb8fe]",
    labelClassName: "text-[#0284C7]",
    cardClassName: "bg-[#F8FAFC]",
    predicate: "Predikat A",
    status: "Tuntas Sempurna",
    statusClassName: "text-[#16A34A]",
  },
  {
    id: "high",
    label: "Mahir",
    students: 15,
    range: "Rentang: 80 - 89",
    share: "42.8%",
    height: 100,
    barClassName:
      "bg-gradient-to-t from-[#16A34A] to-[#62df7d]",
    labelClassName: "text-[#16A34A]",
    cardClassName: "bg-[#F8FAFC]",
    predicate: "Predikat B",
    status: "Tuntas Baik",
    statusClassName: "text-[#16A34A]",
  },
  {
    id: "threshold",
    label: "Ambang KKTP",
    students: 3,
    range: "Rentang: 75 - 79",
    share: "8.6%",
    height: 20,
    barClassName:
      "bg-gradient-to-t from-[#D97706] to-[#FEF3C7]",
    labelClassName: "text-[#D97706]",
    cardClassName: "bg-[#F8FAFC]",
    predicate: "Predikat C",
    status: "Waspada",
    statusClassName: "text-[#D97706]",
  },
  {
    id: "remedial",
    label: "Perlu Remedial",
    students: 3,
    range: "Rentang: < 75.0",
    share: "8.6%",
    height: 20,
    barClassName:
      "bg-gradient-to-t from-[#b71422] to-[#db3237]",
    labelClassName: "text-[#b71422]",
    cardClassName: "bg-[#FFEBEB]/30 border-[#FFB3B3]/60",
    predicate: "Predikat D",
    status: "Intervensi",
    statusClassName: "text-[#b71422] font-bold",
  },
];

export const students: StudentGrade[] = [
  {
    id: "sarah-azzahra",
    name: "Sarah Azzahra",
    initials: "SA",
    avatarClassName: "bg-[#006398] text-white",
    nisn: "NISN: 00792014",
    rollNo: "No. 24",
    className: "VII-A",
    formatif: 95,
    sts: 94,
    praktik: 96,
  },
  {
    id: "jack-huntsman",
    name: "Jack Huntsman",
    initials: "JH",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    nisn: "NISN: 00748291",
    rollNo: "No. 12",
    className: "VII-A",
    formatif: 92,
    sts: 90,
    praktik: 88,
  },
  {
    id: "peter-quill",
    name: "Peter Quill",
    initials: "PQ",
    avatarClassName: "bg-[#DCE9FF] text-[#006398]",
    nisn: "NISN: 00681923",
    rollNo: "No. 19",
    className: "VII-A",
    formatif: 84,
    sts: 82,
    praktik: 85,
  },
  {
    id: "natasha-hughes",
    name: "Natasha Hughes",
    initials: "NH",
    avatarClassName: "bg-[#F3E8FF] text-[#9333EA]",
    nisn: "NISN: 00982341",
    rollNo: "No. 17",
    className: "VII-A",
    formatif: 80,
    sts: 78,
    praktik: 82,
  },
  {
    id: "jim-anderson",
    name: "Jim Anderson",
    initials: "JA",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    nisn: "NISN: 00982342",
    rollNo: "No. 08",
    className: "VII-A",
    formatif: 70,
    sts: 74,
    praktik: 76,
    remedialReason: "Remedial STS (Kalor)",
  },
  {
    id: "john-kurt",
    name: "John Kurt",
    initials: "JK",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    nisn: "NISN: 00982341",
    rollNo: "No. 10",
    className: "VII-A",
    formatif: 72,
    sts: 68,
    praktik: 75,
    remedialReason: "Remedial TP 2 & STS",
  },
  {
    id: "lisa-hilton",
    name: "Lisa Hilton",
    initials: "LH",
    avatarClassName: "bg-[#DCFCE7] text-[#16A34A]",
    nisn: "NISN: 00982344",
    rollNo: "No. 22",
    className: "VII-A",
    formatif: 86,
    sts: 84,
    praktik: 88,
  },
  {
    id: "bagus-wicaksono",
    name: "Bagus Wicaksono",
    initials: "BW",
    avatarClassName: "bg-[#FEF3C7] text-[#D97706]",
    nisn: "NISN: 00982347",
    rollNo: "No. 05",
    className: "VII-A",
    formatif: 76,
    sts: 70,
    praktik: 72,
    remedialReason: "Remedial Kalor",
  },
  {
    id: "nadia-putri",
    name: "Nadia Putri",
    initials: "NP",
    avatarClassName: "bg-[#F3E8FF] text-[#9333EA]",
    nisn: "NISN: 00982351",
    rollNo: "No. 28",
    className: "VII-A",
    formatif: 88,
    sts: 86,
    praktik: 90,
  },
  {
    id: "raka-pratama",
    name: "Raka Pratama",
    initials: "RP",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    nisn: "NISN: 00982355",
    rollNo: "No. 30",
    className: "VII-A",
    formatif: 82,
    sts: 80,
    praktik: 84,
  },
  {
    id: "siti-rahma",
    name: "Siti Rahma",
    initials: "SR",
    avatarClassName: "bg-[#DCFCE7] text-[#16A34A]",
    nisn: "NISN: 00982358",
    rollNo: "No. 31",
    className: "VII-A",
    formatif: 91,
    sts: 89,
    praktik: 92,
  },
  {
    id: "dimas-saputra",
    name: "Dimas Saputra",
    initials: "DS",
    avatarClassName: "bg-[#FFEDD5] text-[#C2410C]",
    nisn: "NISN: 00982361",
    rollNo: "No. 32",
    className: "VII-A",
    formatif: 78,
    sts: 76,
    praktik: 80,
  },
  {
    id: "ayu-lestari",
    name: "Ayu Lestari",
    initials: "AL",
    avatarClassName: "bg-[#FCE7F3] text-[#BE185D]",
    nisn: "NISN: 00982364",
    rollNo: "No. 33",
    className: "VII-A",
    formatif: 87,
    sts: 85,
    praktik: 89,
  },
  {
    id: "fajar-nugroho",
    name: "Fajar Nugroho",
    initials: "FN",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    nisn: "NISN: 00982367",
    rollNo: "No. 34",
    className: "VII-A",
    formatif: 74,
    sts: 72,
    praktik: 73,
    remedialReason: "Remedial Kalor",
  },
  {
    id: "citra-dewi",
    name: "Citra Dewi",
    initials: "CD",
    avatarClassName: "bg-[#EDE9FE] text-[#7C3AED]",
    nisn: "NISN: 00982370",
    rollNo: "No. 35",
    className: "VII-A",
    formatif: 90,
    sts: 88,
    praktik: 91,
  },
];

export function getFinalScore(student: StudentGrade) {
  return Number(
    (student.formatif * 0.3 + student.sts * 0.3 + student.praktik * 0.4).toFixed(
      1,
    ),
  );
}

export function getStudentStatus(student: StudentGrade): GradeStatus {
  const finalScore = getFinalScore(student);

  if (finalScore < kktp) {
    return {
      label: student.remedialReason ?? "Remedial",
      className: "bg-[#FEE2E2] text-[#b71422]",
      tone: "danger",
    };
  }

  if (finalScore >= 90) {
    return {
      label: "Tuntas (Unggulan)",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      tone: "success",
    };
  }

  if (finalScore >= 85) {
    return {
      label: "Tuntas (Sangat Mahir)",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      tone: "success",
    };
  }

  if (finalScore >= 80) {
    return {
      label: "Tuntas (Mahir)",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      tone: "success",
    };
  }

  return {
    label: "Tuntas (Cukup)",
    className: "bg-[#DCFCE7] text-[#16A34A]",
    tone: "success",
  };
}

export const diagnosticTopics: DiagnosticTopic[] = [
  {
    id: "tp-01",
    title: "TP 01: Pengukuran & Besaran",
    percent: 94,
    percentLabel: "94% Dikuasai",
    textClassName: "text-[#16A34A]",
    barClassName: "bg-[#22C55E]",
    note: "33 dari 35 siswa melampaui kriteria capaian dasar jangka sorong & mikrometer.",
  },
  {
    id: "tp-02",
    title: "TP 02: Kinematika & Vektor",
    percent: 88,
    percentLabel: "88% Dikuasai",
    textClassName: "text-[#006398]",
    barClassName: "bg-[#006398]",
    note: "Pemahaman GLB dan GLBB stabil, grafik percepatan perlu drill kalkulasi.",
  },
  {
    id: "tp-04",
    title: "TP 04: Termodinamika & Kalor",
    percent: 68,
    percentLabel: "68% (Rendah)",
    textClassName: "text-[#b71422]",
    barClassName: "bg-[#b71422]",
    note: "Daya serap di bawah KKTP 75.0! Memerlukan siklus pengulangan konsep dasar.",
    noteClassName: "text-[#b71422] font-medium",
    isLow: true,
  },
];

export const remedialGroups: RemedialGroup[] = [
  {
    id: "john-jim",
    students: "John Kurt & Jim Anderson",
    status: "Terjadwal",
    statusClassName: "bg-[#FFEBEB] text-[#b71422]",
    schedule: "Kamis, 20 Maret 2025 • 14:30 WITA",
    room: "Laboratorium Fisika Dasar 1",
  },
  {
    id: "bagus",
    students: "Bagus Wicaksono (Menunggu)",
    status: "Izin Sakit",
    statusClassName: "bg-[#FEF3C7] text-[#D97706]",
    schedule: "Menunggu Konfirmasi Wali Kelas",
    waiting: true,
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "print",
    title: "Cetak Leger Nilai Resmi",
    description: "Format PDF tanda tangan digital & QR Dapodik",
    icon: FileText,
    iconBgClassName: "bg-[#EFF4FF]",
    iconTextClassName: "text-[#006398]",
    hoverGroupClassName:
      "group-hover:bg-[#006398] group-hover:text-white",
  },
  {
    id: "predicate",
    title: "Hitung Predikat Otomatis",
    description: "Konversi interval predikat A, B, C, D skala 100",
    icon: Calculator,
    iconBgClassName: "bg-[#EFF4FF]",
    iconTextClassName: "text-[#006B2C]",
    hoverGroupClassName:
      "group-hover:bg-[#006B2C] group-hover:text-white",
  },
  {
    id: "lock",
    title: "Kunci Nilai Semester",
    description: "Cegah perubahan nilai sebelum rapat pleno",
    icon: Lock,
    iconBgClassName: "bg-[#FFEBEB]",
    iconTextClassName: "text-[#b71422]",
    hoverGroupClassName:
      "group-hover:bg-[#b71422] group-hover:text-white",
    danger: true,
  },
];
