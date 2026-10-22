import {
  Activity,
  BadgeCheck,
  BriefcaseMedical,
  CheckCircle,
  Info,
  LineChart,
  TrendingUp,
  UserX,
} from "lucide-react";
import type {
  AttendancePhoto,
  AttendanceStatus,
  AttendanceSummaryMetric,
  AtRiskStudent,
  ClassFilter,
  SessionFilter,
  StudentAttendance,
  WeeklyTrendPoint,
} from "./types";

export const totalStudents = 35;
export const pageSize = 8;

export const classOptions: { value: ClassFilter; label: string }[] = [
  { value: "VII-A", label: "VII - A • Fisika Terapan (35 Siswa)" },
  { value: "VII-B", label: "VII - B • Algoritma & Pemrograman (36 Siswa)" },
  { value: "VIII-A", label: "VIII - A • Jaringan Komputer Dasar (34 Siswa)" },
  { value: "VIII-C", label: "VIII - C • IoT Terapan (32 Siswa)" },
];

export const sessionOptions: { value: SessionFilter; label: string }[] = [
  {
    value: "today",
    label: "Hari Ini: Rabu, 20 Mar 2025 (Jam 3-4 / 09:30-11:00 WITA)",
  },
  {
    value: "yesterday",
    label: "Selasa, 19 Mar 2025 (Jam 1-2 / 07:30-09:00 WITA)",
  },
  {
    value: "last-week",
    label: "Jumat, 14 Mar 2025 (Jam 5-6 / 13:30-15:00 WITA)",
  },
];

export const statusLabels: Record<AttendanceStatus, string> = {
  HADIR: "Hadir",
  SAKIT: "Sakit",
  IZIN: "Izin",
  ALPA: "Alpa",
};

export const statusButtonStyles: Record<
  AttendanceStatus,
  { active: string; hover: string }
> = {
  HADIR: {
    active: "bg-[#DCFCE7] text-[#16A34A] shadow-sm",
    hover: "hover:bg-[#DCFCE7] hover:text-[#16A34A]",
  },
  SAKIT: {
    active: "bg-[#FEF3C7] text-[#D97706] shadow-sm",
    hover: "hover:bg-[#FEF3C7] hover:text-[#D97706]",
  },
  IZIN: {
    active: "bg-[#E0F2FE] text-[#0284C7] shadow-sm",
    hover: "hover:bg-[#E0F2FE] hover:text-[#0284C7]",
  },
  ALPA: {
    active: "bg-[#FEE2E2] text-[#DC2626] shadow-sm",
    hover: "hover:bg-[#FEE2E2] hover:text-[#DC2626]",
  },
};

export const summaryMetrics: AttendanceSummaryMetric[] = [
  {
    id: "attendance",
    label: "Kehadiran Hari Ini",
    value: "96.4%",
    suffix: "(33/35 Siswa)",
    icon: CheckCircle,
    iconBgClassName: "bg-[#DCFCE7]",
    iconTextClassName: "text-[#16A34A]",
    badge: "Target Sangat Baik",
    badgeClassName: "bg-[#DCFCE7] text-[#16A34A]",
    footer: "+1.2% dari pertemuan kemarin",
    footerClassName: "text-[#16A34A]",
    footerIcon: TrendingUp,
    decorationClassName: "bg-[#DCFCE7]/40",
  },
  {
    id: "sick",
    label: "Sakit & Dispensasi",
    value: "2",
    suffix: "Siswa",
    icon: BriefcaseMedical,
    iconBgClassName: "bg-[#FEF3C7]",
    iconTextClassName: "text-[#D97706]",
    badge: "Terdokumentasi",
    badgeClassName: "bg-[#FEF3C7] text-[#D97706]",
    footer: "1 Sakit (Surat Dokter), 1 LKS Kota",
    footerClassName: "text-[#475569]",
    footerIcon: Info,
    decorationClassName: "bg-[#FEF3C7]/40",
  },
  {
    id: "absent",
    label: "Alpa / Tanpa Keterangan",
    value: "0",
    suffix: "Siswa",
    icon: UserX,
    iconBgClassName: "bg-[#FEE2E2]",
    iconTextClassName: "text-[#DC2626]",
    badge: "Nihil Pekan Ini",
    badgeClassName: "bg-[#DCFCE7] text-[#16A34A]",
    footer: "100% presensi terkonfirmasi wali",
    footerClassName: "text-[#16A34A]",
    footerIcon: BadgeCheck,
    decorationClassName: "bg-[#FEE2E2]/30",
  },
  {
    id: "semester",
    label: "Rata-rata Presensi Semester",
    value: "94.8%",
    suffix: "Status: Aman Terverifikasi",
    icon: LineChart,
    iconBgClassName: "bg-[#E0F2FE]",
    iconTextClassName: "text-[#0284C7]",
    badge: "Batas: 85.0%",
    badgeClassName: "bg-[#FFEBEB] text-[#b71422]",
    footer: "Di atas ambang batas minimal",
    footerClassName: "text-[#16A34A]",
    footerIcon: Activity,
    progress: 94.8,
    progressClassName: "bg-[#b71422]",
    decorationClassName: "bg-[#E0F2FE]/40",
  },
];

const avatarPalettes = [
  {
    bg: "bg-[#E0F2FE]",
    text: "text-[#0284C7]",
  },
  {
    bg: "bg-[#F3E8FF]",
    text: "text-[#9333EA]",
  },
  {
    bg: "bg-[#DCFCE7]",
    text: "text-[#16A34A]",
  },
  {
    bg: "bg-[#FEF3C7]",
    text: "text-[#D97706]",
  },
  {
    bg: "bg-[#FFEBEB]",
    text: "text-[#b71422]",
  },
];

const coreStudents: StudentAttendance[] = [
  {
    id: "sarah-azzahra",
    name: "Sarah Azzahra",
    initials: "SA",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    nisn: "NISN: 00792014",
    gender: "Pr",
    rollNo: "01",
    className: "VII-A",
    status: "HADIR",
    checkInTime: "07:10 WITA",
    method: "qr",
    methodLabel: "QR Code",
    note: "Aktif di lab praktikum",
    noteTone: "neutral",
  },
  {
    id: "jack-huntsman",
    name: "Jack Huntsman",
    initials: "JH",
    avatarClassName: "bg-[#F3E8FF] text-[#9333EA]",
    nisn: "NISN: 00748291",
    gender: "Lk",
    rollNo: "02",
    className: "VII-A",
    status: "HADIR",
    checkInTime: "07:14 WITA",
    method: "geo",
    methodLabel: "Geo Rad: 12m",
    note: "Tepat Waktu",
    noteTone: "neutral",
  },
  {
    id: "bagus-wicaksono",
    name: "Bagus Wicaksono",
    initials: "BW",
    avatarClassName: "bg-[#FEF3C7] text-[#D97706]",
    nisn: "NISN: 00684920",
    gender: "Lk",
    rollNo: "03",
    className: "VII-A",
    status: "SAKIT",
    method: "document",
    methodLabel: "Surat Dokter Valid",
    note: "RS Bhayangkara terlampir (PDF)",
    noteTone: "warning",
  },
  {
    id: "peter-quill",
    name: "Peter Quill",
    initials: "PQ",
    avatarClassName: "bg-[#DCE9FF] text-[#006398]",
    nisn: "NISN: 00681923",
    gender: "Lk",
    rollNo: "04",
    className: "VII-A",
    status: "HADIR",
    checkInTime: "07:18 WITA",
    method: "face",
    methodLabel: "Face ID Lab",
    note: "Tepat Waktu",
    noteTone: "neutral",
  },
  {
    id: "natasha-hughes",
    name: "Natasha Hughes",
    initials: "NH",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    nisn: "NISN: 00982341",
    gender: "Pr",
    rollNo: "05",
    className: "VII-A",
    status: "HADIR",
    checkInTime: "07:05 WITA",
    method: "qr",
    methodLabel: "Hadir Awal",
    note: "Petugas piket lab harian",
    noteTone: "success",
  },
  {
    id: "lisa-hilton",
    name: "Lisa Hilton",
    initials: "LH",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    nisn: "NISN: 00982342",
    gender: "Pr",
    rollNo: "06",
    className: "VII-A",
    status: "IZIN",
    method: "dispensation",
    methodLabel: "Dispensasi Sekolah",
    note: "Dispensasi Lomba LKS Tingkat Kota",
    noteTone: "info",
  },
  {
    id: "jim-anderson",
    name: "Jim Anderson",
    initials: "JA",
    avatarClassName: "bg-[#F1F5F9] text-[#334155]",
    nisn: "NISN: 00982343",
    gender: "Lk",
    rollNo: "07",
    className: "VII-A",
    status: "HADIR",
    checkInTime: "07:22 WITA",
    method: "manual",
    methodLabel: "Manual Guru",
    note: "Terlambat 5 mnt (ban motor bocor)",
    noteTone: "danger",
  },
  {
    id: "john-kurt",
    name: "John Kurt",
    initials: "JK",
    avatarClassName: "bg-[#DCFCE7] text-[#16A34A]",
    nisn: "NISN: 00982344",
    gender: "Lk",
    rollNo: "08",
    className: "VII-A",
    status: "HADIR",
    checkInTime: "07:11 WITA",
    method: "qr",
    methodLabel: "QR Code",
    note: "Tepat Waktu",
    noteTone: "neutral",
  },
];

const extraNames: [string, string, "Lk" | "Pr"][] = [
  ["Aisyah Nur Fadilah", "AF", "Pr"],
  ["Andi Pratama", "AP", "Lk"],
  ["Bella Safitri", "BS", "Pr"],
  ["Bima Aditya", "BA", "Lk"],
  ["Cahaya Putri", "CP", "Pr"],
  ["Daffa Ramadhan", "DR", "Lk"],
  ["Dewi Anggraini", "DA", "Pr"],
  ["Eko Prasetyo", "EP", "Lk"],
  ["Farah Nabila", "FN", "Pr"],
  ["Gilang Ramadhan", "GR", "Lk"],
  ["Hana Salsabila", "HS", "Pr"],
  ["Indra Wijaya", "IW", "Lk"],
  ["Jihan Aulia", "JA", "Pr"],
  ["Kevin Sanjaya", "KS", "Lk"],
  ["Laila Nur", "LN", "Pr"],
  ["Maura Putri", "MP", "Pr"],
  ["Naufal Hakim", "NH", "Lk"],
  ["Oktavia Sari", "OS", "Pr"],
  ["Putra Mahendra", "PM", "Lk"],
  ["Qanita Azzahra", "QA", "Pr"],
  ["Rizky Pratama", "RP", "Lk"],
  ["Salsabila Putri", "SP", "Pr"],
  ["Taufik Hidayat", "TH", "Lk"],
  ["Umi Kalsum", "UK", "Pr"],
  ["Vino Bastian", "VB", "Lk"],
  ["Wulan Sari", "WS", "Pr"],
  ["Yoga Pratama", "YP", "Lk"],
];

const checkInMethods = [
  {
    method: "qr" as const,
    methodLabel: "QR Code",
  },
  {
    method: "geo" as const,
    methodLabel: "Geo Rad: 8m",
  },
  {
    method: "face" as const,
    methodLabel: "Face ID Lab",
  },
  {
    method: "manual" as const,
    methodLabel: "Manual Guru",
  },
];

const extraStudents: StudentAttendance[] = extraNames.map(
  ([name, initials, gender], index) => {
    const palette = avatarPalettes[index % avatarPalettes.length];
    const method = checkInMethods[index % checkInMethods.length];
    const minute = 10 + ((index * 3) % 18);

    return {
      id: `student-${index + 9}`,
      name,
      initials,
      avatarClassName: `${palette.bg} ${palette.text}`,
      nisn: `NISN: 0098${String(2350 + index).padStart(4, "0")}`,
      gender,
      rollNo: String(index + 9).padStart(2, "0"),
      className: "VII-A",
      status: "HADIR",
      checkInTime: `07:${String(minute).padStart(2, "0")} WITA`,
      method: method.method,
      methodLabel: method.methodLabel,
      note: index % 5 === 0 ? "Aktif di lab praktikum" : "Tepat Waktu",
      noteTone: "neutral",
    };
  },
);

export const students: StudentAttendance[] = [
  ...coreStudents,
  ...extraStudents,
];

export const weeklyTrend: WeeklyTrendPoint[] = [
  { day: "Sen", value: 97, tone: "success" },
  { day: "Sel", value: 94, tone: "success" },
  { day: "Rab", value: 96.4, tone: "active" },
  { day: "Kam", value: 91, tone: "muted" },
  { day: "Jum", value: 95, tone: "muted" },
];

export const atRiskStudent: AtRiskStudent = {
  name: "Jim Anderson",
  initials: "JA",
  nisn: "NISN: 00982343",
  percentage: 82.1,
  note: "3x Alpa bln lalu",
};

export const initialPhotos: AttendancePhoto[] = [
  {
    id: "lab-physics",
    src: "/modules/thermo-wave.jpg",
    label: "Lab Fisika 09:40",
  },
  {
    id: "teacher-demo",
    src: "/modules/ai-ml.jpg",
    label: "Demonstrasi Guru",
  },
];

export const journalDefaults = {
  topic:
    "Praktikum 04: Pengukuran Hambatan Rangkaian Jembatan Wheatstone & Simulasi Proteus",
  location: "Lab Komputer & Fisika Gedung B (Lt. 2) - SMK Mataram",
  notes:
    "Seluruh kelompok berhasil menyusun prototipe rangkaian sebelum batas waktu 10:45 WITA. 1 siswa izin perlombaan LKS resmi sekolah.",
};
