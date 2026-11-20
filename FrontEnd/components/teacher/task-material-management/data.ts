import {
  Bell,
  ClipboardList,
  Code,
  Download,
  FileCheck2,
  FileText,
  ListChecks,
  Pencil,
  Printer,
  RefreshCw,
} from "lucide-react";
import type {
  Assignment,
  CompletionTrendPoint,
  GradingItem,
  GradingStatusSlice,
  QuickAction,
} from "./types";

export const assignments: Assignment[] = [
  {
    id: "dijkstra-viii-a",
    subject: "Informatika Terapan",
    subjectKey: "informatika",
    classes: ["VIII - A"],
    status: "dueSoon",
    title:
      "Praktikum 04: Implementasi Algoritma Dijkstra pada Topologi Jaringan Komputer",
    description:
      "Siswa menyimulasikan rute pengiriman paket tercepat menggunakan matriks ketetanggaan (adjacency matrix) serta melampirkan berkas source code dan dokumen hasil traceroute.",
    startLabel: "Mulai: 18 Mar 2025, 08:00 WITA",
    dueLabel: "Tenggat: Besok, 14:00 WITA",
    submitted: 34,
    total: 35,
    percentage: 97,
    percentageClassName: "text-[#16A34A]",
    secondaryLabel: "Ubah",
    secondaryIcon: Pencil,
    primaryLabel: "Periksa Jawaban (34)",
    primaryIcon: FileCheck2,
    primaryTone: "primary",
    showArchive: true,
  },
  {
    id: "kalorimeter-vii",
    subject: "Fisika Terapan",
    subjectKey: "fisika",
    classes: ["VII - A", "VII - B"],
    status: "active",
    title:
      "Laporan Praktikum: Asas Black, Hukum Termodinamika & Kalorimeter Sederhana",
    description:
      "Pengukuran kapasitas kalor jenis logam kuningan dan aluminium menggunakan bejana kalorimeter isolator. Laporan disusun dalam template standar PDF LKPD Lab Fisika.",
    startLabel: "Mulai: 20 Mar 2025, 08:00 WITA",
    dueLabel: "Tenggat: 22 Maret 2025",
    submitted: 68,
    total: 81,
    percentage: 84,
    percentageClassName: "text-[#006398]",
    secondaryLabel: "Detail LKPD",
    secondaryIcon: ListChecks,
    primaryLabel: "Periksa Berkas (68)",
    primaryIcon: FileCheck2,
    primaryTone: "blue",
  },
  {
    id: "fiber-optic-vii-b",
    subject: "Jaringan Komputer",
    subjectKey: "jaringan",
    classes: ["VII - B"],
    status: "active",
    title:
      "Desain Arsitektur Jaringan Fiber Optic & Skema IP Subnetting Gedung SMK",
    description:
      "Tugas perancangan bagan topologi menggunakan software Cisco Packet Tracer mencakup VLAN, DHCP Server, serta alokasi bandwidth tiap lab kejuruan.",
    startLabel: "Mulai: 21 Mar 2025, 08:00 WITA",
    dueLabel: "Tenggat: 25 Maret 2025",
    submitted: 28,
    total: 40,
    percentage: 70,
    percentageClassName: "text-[#475569]",
    secondaryLabel: "Unduh Rubrik",
    secondaryIcon: Download,
    primaryLabel: "Kelola Asesmen",
    primaryIcon: ClipboardList,
    primaryTone: "neutral",
  },
];

export const gradingQueue: GradingItem[] = [
  {
    id: "jack-huntsman",
    name: "Jack Huntsman",
    initials: "JH",
    avatarClassName: "bg-[#FDE68A] text-[#B45309]",
    nisn: "NISN: 00748291",
    className: "VII-A",
    fileName: "Laporan_Kalor_Jack.pdf",
    fileIcon: FileText,
    fileIconClassName: "text-[#16A34A]",
    submittedAt: "10 menit lalu",
    submittedAtTone: "urgent",
  },
  {
    id: "sarah-azzahra",
    name: "Sarah Azzahra",
    initials: "SA",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    nisn: "NISN: 00792014",
    className: "VIII-A",
    fileName: "dijkstra_sarah_v1.py",
    fileIcon: Code,
    fileIconClassName: "text-[#9333EA]",
    submittedAt: "25 menit lalu",
    submittedAtTone: "neutral",
  },
  {
    id: "peter-quill",
    name: "Peter Quill",
    initials: "PQ",
    avatarClassName: "bg-[#FEE2E2] text-[#DC2626]",
    nisn: "NISN: 00681923",
    className: "VII-B",
    fileName: "remedial_termo_peter.pdf",
    fileIcon: FileText,
    fileIconClassName: "text-[#16A34A]",
    submittedAt: "1 jam lalu",
    submittedAtTone: "neutral",
  },
];

export const completionTrend: CompletionTrendPoint[] = [
  { day: "Sen", onTime: 24, late: 3 },
  { day: "Sel", onTime: 29, late: 5 },
  { day: "Rab", onTime: 21, late: 2 },
  { day: "Kam", onTime: 33, late: 6 },
  { day: "Jum", onTime: 18, late: 1 },
  { day: "Sab", onTime: 12, late: 4 },
  { day: "Min", onTime: 8, late: 2 },
];

export const gradingStatus: GradingStatusSlice[] = [
  { id: "graded", label: "Sudah dinilai", value: 24, color: "#16A34A" },
  { id: "pending", label: "Menunggu penilaian", value: 38, color: "#b71422" },
  { id: "revision", label: "Perlu revisi", value: 6, color: "#94A3B8" },
];

export const quickActions: QuickAction[] = [
  {
    id: "reminder",
    label: "Kirim Pengingat Tugas via WA Grup",
    icon: Bell,
    iconClassName: "text-[#b71422]",
    hoverClassName: "hover:bg-[#FFEBEB] hover:text-[#b71422]",
  },
  {
    id: "sync",
    label: "Sinkron Nilai ke Dapodik Pusat",
    icon: RefreshCw,
    iconClassName: "text-[#006398]",
    hoverClassName: "hover:bg-[#F1F5F9] hover:text-[#006398]",
  },
  {
    id: "print",
    label: "Cetak Berita Acara & Lembar Presensi",
    icon: Printer,
    iconClassName: "text-[#16A34A]",
    hoverClassName: "hover:bg-[#F1F5F9] hover:text-[#16A34A]",
  },
];
