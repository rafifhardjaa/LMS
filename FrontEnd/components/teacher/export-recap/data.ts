import type {
  CustomExportComponent,
  CustomExportFormat,
  ExportDocument,
  ExportFilters,
  ExportHistoryItem,
  ExportLevel,
  ExportSemester,
  ExportSubject,
  ExportTab,
} from "./types";

export const exportPageSize = 5;

export const semesterOptions: { value: ExportSemester; label: string }[] = [
  { value: "genap", label: "Semester Genap 2024/2025" },
  { value: "ganjil", label: "Semester Ganjil 2024/2025" },
  { value: "arsip", label: "Arsip TA 2023/2024" },
];

export const subjectOptions: {
  value: ExportSubject | "all";
  label: string;
}[] = [
  { value: "all", label: "Semua Mapel (3 Mapel)" },
  { value: "fisika", label: "Fisika Terapan" },
  { value: "informatika", label: "Informatika Kejuruan" },
  { value: "ipas", label: "Projek IPAS Terpadu" },
];

export const levelOptions: {
  value: ExportLevel | "all";
  label: string;
}[] = [
  { value: "all", label: "Semua Kelas (10 Rombel)" },
  { value: "VII", label: "Kelas VII (VII-A, VII-B, VII-C)" },
  { value: "VIII", label: "Kelas VIII (VIII-A, VIII-B, VIII-C)" },
  { value: "IX", label: "Kelas IX (IX-A s/d IX-D)" },
];

export const formatFilterOptions: {
  value: ExportFilters["format"];
  label: string;
}[] = [
  { value: "all", label: "Semua Format (.xlsx, .pdf)" },
  { value: "xlsx", label: "Microsoft Excel (.xlsx)" },
  { value: "pdf", label: "Dokumen Cetak (.pdf)" },
  { value: "csv", label: "Arsip Dapodik (.csv / .zip)" },
];

export const exportTabs: { value: ExportTab; label: string }[] = [
  { value: "all", label: "Semua Berkas" },
  { value: "nilai", label: "Rekap Nilai & Leger" },
  { value: "presensi", label: "Presensi & Kehadiran" },
  { value: "dapodik", label: "Dapodik & e-Rapor" },
];

export const defaultExportFilters: ExportFilters = {
  semester: "genap",
  subject: "all",
  level: "all",
  format: "all",
};

export const exportDocuments: ExportDocument[] = [
  {
    id: "leger-fase-f",
    title: "Leger Nilai Lengkap Fase F (Kurikulum Merdeka)",
    description:
      "Fisika Terapan & Informatika Kejuruan (Fase E & F) - Disertai deskripsi capaian otomatis.",
    category: "nilai",
    semester: "genap",
    subjects: ["fisika", "informatika"],
    levels: ["VII", "VIII", "IX"],
    audience: "10 Rombel Aktif",
    audienceNote: "348 Total Siswa",
    sizeMb: 4.8,
    updatedLabel: "Hari ini",
    updatedTime: "08:30 WITA",
    iconTone: "red",
    chips: [
      { label: ".XLSX Lengkap", tone: "green" },
      { label: ".PDF Bertanda Tangan", tone: "red" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
  {
    id: "presensi-jurnal-genap",
    title: "Rekap Presensi & Jurnal Tatap Muka Semester Genap",
    description:
      "Rekapitulasi 16 pertemuan reguler, praktikum lab fisika, catatan sakit/izin & alfa.",
    category: "presensi",
    semester: "genap",
    subjects: ["fisika", "ipas"],
    levels: ["VII", "VIII"],
    audience: "VII-A s/d VIII-B",
    audienceNote: "6 Kelas Praktikum",
    sizeMb: 2.1,
    updatedLabel: "Hari ini",
    updatedTime: "07:45 WITA",
    iconTone: "green",
    chips: [{ label: ".XLSX Matriks Presensi", tone: "green" }],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
  {
    id: "impor-erapor-f01",
    title: "Berkas Impor Nilai e-Rapor Kemendikbudristek (Skema F.01)",
    description:
      "Format skema resmi integrasi aplikasi e-Rapor SMK Ditjen Pendidikan Vokasi TA 2024.",
    category: "dapodik",
    semester: "genap",
    subjects: ["fisika", "informatika", "ipas"],
    levels: ["VII", "VIII", "IX"],
    audience: "Seluruh Kelas Pengampu",
    audienceNote: "348 Siswa",
    sizeMb: 1.4,
    updatedLabel: "Kemarin",
    updatedTime: "14:10 WITA",
    iconTone: "blue",
    chips: [
      { label: ".CSV Valid", tone: "blue" },
      { label: "Siap Unggah Dapodik", tone: "slate" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "import", label: "Impor e-Rapor", kind: "import", format: "csv" },
    ],
  },
  {
    id: "remedial-kktp",
    title: "Rekap Remedial & Ketuntasan KKTP Per Tujuan Pembelajaran",
    description:
      "Daya serap kriteria ketuntasan modul ajar Modul 01 - 04 Fisika Terapan.",
    category: "nilai",
    semester: "genap",
    subjects: ["fisika"],
    levels: ["VII"],
    audience: "Kelas VII (A, B, C)",
    audienceNote: "108 Siswa",
    sizeMb: 3.2,
    updatedLabel: "18 Mei 2024",
    updatedTime: "11:20 WITA",
    iconTone: "amber",
    chips: [{ label: ".XLSX Laporan", tone: "green" }],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
  {
    id: "nilai-sts",
    title: "Daftar Nilai Asesmen Sumatif Tengah Semester (STS)",
    description:
      "Gabungan skor CBT online & nilai portofolio praktik mandiri lab komputer.",
    category: "nilai",
    semester: "genap",
    subjects: ["fisika", "informatika"],
    levels: ["VII", "VIII"],
    audience: "Kelas VII & VIII",
    audienceNote: "216 Siswa",
    sizeMb: 0.89,
    updatedLabel: "15 Mei 2024",
    updatedTime: "09:00 WITA",
    iconTone: "purple",
    chips: [
      { label: ".XLSX", tone: "green" },
      { label: ".PDF Cetak Leger", tone: "red" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
  {
    id: "leger-fase-e",
    title: "Leger Nilai Fase E & Capaian Pembelajaran Informatika",
    description:
      "Rekap nilai formatif, sumatif, dan deskripsi capaian fase E semester genap.",
    category: "nilai",
    semester: "genap",
    subjects: ["informatika"],
    levels: ["VII"],
    audience: "Kelas VII (A, B, C)",
    audienceNote: "108 Siswa",
    sizeMb: 1.2,
    updatedLabel: "Hari ini",
    updatedTime: "09:05 WITA",
    iconTone: "red",
    chips: [
      { label: ".XLSX", tone: "green" },
      { label: ".PDF", tone: "blue" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
  {
    id: "presensi-praktikum",
    title: "Matriks Kehadiran Praktikum & Piket Laboratorium",
    description:
      "Rekap presensi laboratorium komputer dan fisika per pertemuan praktikum.",
    category: "presensi",
    semester: "genap",
    subjects: ["fisika", "informatika"],
    levels: ["VII", "VIII"],
    audience: "6 Kelas Praktikum",
    audienceNote: "204 Siswa",
    sizeMb: 0.8,
    updatedLabel: "Hari ini",
    updatedTime: "08:10 WITA",
    iconTone: "green",
    chips: [{ label: ".XLSX Matriks", tone: "green" }],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
    ],
  },
  {
    id: "presensi-pekan-10-16",
    title: "Rekap Presensi & Jurnal Praktikum Pekan 10-16",
    description:
      "Rekap kehadiran pertemuan akhir semester beserta catatan izin dan dispensasi.",
    category: "presensi",
    semester: "genap",
    subjects: ["fisika", "informatika"],
    levels: ["VII", "VIII"],
    audience: "Kelas VII & VIII",
    audienceNote: "216 Siswa",
    sizeMb: 1.5,
    updatedLabel: "Hari ini",
    updatedTime: "10:20 WITA",
    iconTone: "green",
    chips: [
      { label: ".XLSX Presensi", tone: "green" },
      { label: ".PDF Rekap", tone: "red" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
  {
    id: "impor-erapor-susulan",
    title: "Berkas Impor Nilai e-Rapor Susulan (Skema F.01)",
    description:
      "Paket impor nilai susulan untuk siswa yang mengikuti asesmen perbaikan.",
    category: "dapodik",
    semester: "genap",
    subjects: ["fisika", "informatika", "ipas"],
    levels: ["VII", "VIII", "IX"],
    audience: "Seluruh Kelas Pengampu",
    audienceNote: "42 Siswa",
    sizeMb: 0.9,
    updatedLabel: "Hari ini",
    updatedTime: "09:40 WITA",
    iconTone: "blue",
    chips: [
      { label: ".CSV Valid", tone: "blue" },
      { label: "Siap Unggah", tone: "slate" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "import", label: "Impor e-Rapor", kind: "import", format: "csv" },
    ],
  },
  {
    id: "dapodik-cadangan",
    title: "Paket Sinkronisasi Dapodik & Cadangan Rapor Digital",
    description:
      "Arsip paket sinkronisasi data Dapodik dan cadangan rapor kurikulum merdeka.",
    category: "dapodik",
    semester: "genap",
    subjects: ["ipas"],
    levels: ["VII", "VIII", "IX"],
    audience: "Arsip Sekolah",
    audienceNote: "348 Siswa",
    sizeMb: 1.61,
    updatedLabel: "Hari ini",
    updatedTime: "09:15 WITA",
    iconTone: "blue",
    chips: [
      { label: ".ZIP Arsip", tone: "blue" },
      { label: ".CSV Data", tone: "slate" },
    ],
    actions: [
      { id: "zip", label: "ZIP", kind: "download", format: "zip" },
      { id: "csv", label: "CSV", kind: "download", format: "csv" },
    ],
  },
  {
    id: "arsip-presensi-ganjil",
    title: "Arsip Rekap Presensi Semester Ganjil",
    description:
      "Arsip kehadiran semester ganjil dengan rekap izin, sakit, dan dispensasi.",
    category: "presensi",
    semester: "ganjil",
    subjects: ["fisika", "informatika"],
    levels: ["VII", "VIII"],
    audience: "Kelas VII & VIII",
    audienceNote: "216 Siswa",
    sizeMb: 2.7,
    updatedLabel: "15 Jan 2025",
    updatedTime: "09:20 WITA",
    iconTone: "green",
    chips: [
      { label: ".XLSX Arsip", tone: "green" },
      { label: ".PDF", tone: "red" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
  {
    id: "arsip-erapor-ganjil",
    title: "Berkas Impor Nilai e-Rapor Semester Ganjil (Skema F.01)",
    description:
      "Paket impor nilai rapor semester ganjil untuk sinkronisasi e-Rapor.",
    category: "dapodik",
    semester: "ganjil",
    subjects: ["fisika", "informatika", "ipas"],
    levels: ["VII", "VIII", "IX"],
    audience: "Seluruh Kelas Pengampu",
    audienceNote: "348 Siswa",
    sizeMb: 1.3,
    updatedLabel: "12 Jan 2025",
    updatedTime: "14:05 WITA",
    iconTone: "blue",
    chips: [
      { label: ".CSV Valid", tone: "blue" },
      { label: "Siap Unggah", tone: "slate" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "import", label: "Impor e-Rapor", kind: "import", format: "csv" },
    ],
  },
  {
    id: "arsip-leger-2023",
    title: "Arsip Leger Nilai TA 2023/2024",
    description:
      "Leger nilai lengkap tahun ajaran sebelumnya untuk kebutuhan audit akademik.",
    category: "nilai",
    semester: "arsip",
    subjects: ["fisika"],
    levels: ["VII", "VIII", "IX"],
    audience: "Arsip Sekolah",
    audienceNote: "330 Siswa",
    sizeMb: 5.2,
    updatedLabel: "30 Jun 2024",
    updatedTime: "10:00 WITA",
    iconTone: "red",
    chips: [
      { label: ".PDF Arsip", tone: "red" },
      { label: ".XLSX", tone: "green" },
    ],
    actions: [
      { id: "excel", label: "Excel", kind: "download", format: "xlsx" },
      { id: "pdf", label: "PDF", kind: "download", format: "pdf" },
    ],
  },
];

export const initialExportHistory: ExportHistoryItem[] = [
  {
    id: "history-leger",
    fileName: "Leger_Fisika_VII_A_Genap.xlsx",
    meta: "Dr. Pawell • 12 menit lalu",
    status: "Sukses",
    detail: "2.4 MB",
    tone: "green",
    icon: "sheet",
  },
  {
    id: "history-erapor",
    fileName: "Sinkron_eRapor_Mataram.zip",
    meta: "Kirim ke Server Dapodik",
    status: "Tersinkron",
    detail: "09:15 WITA",
    tone: "blue",
    icon: "zip",
  },
  {
    id: "history-presensi",
    fileName: "Rekap_Presensi_Pekan12_VII_B.pdf",
    meta: "Cetak Arsip Kurikulum",
    status: "Dicetak",
    detail: "Kemarin",
    tone: "slate",
    icon: "pdf",
  },
];

export const customExportComponents: CustomExportComponent[] = [
  {
    id: "formatif",
    label: "Nilai Formatif & Tugas Mandiri",
    description: "Termasuk portofolio dan asesmen harian",
    defaultChecked: true,
  },
  {
    id: "sumatif",
    label: "Nilai Sumatif (STS & SAS)",
    description: "Skor murni ujian tengah & akhir semester",
    defaultChecked: true,
  },
  {
    id: "capaian",
    label: "Catatan Capaian Kompetensi",
    description: "Deskripsi naratif rapor Kurikulum Merdeka",
    defaultChecked: true,
  },
  {
    id: "absensi",
    label: "Detail Jam Absensi & Keterlambatan",
    description: "Log presensi per pertemuan tatap muka",
    defaultChecked: true,
  },
  {
    id: "cbt",
    label: "Rekap Log Pengerjaan CBT Google Form",
    description: "Waktu submisi dan rincian salah/benar butir soal",
    defaultChecked: false,
  },
];

export const customFormatOptions: {
  value: CustomExportFormat;
  label: string;
}[] = [
  { value: "xlsx", label: "Spreadsheet (.xlsx)" },
  { value: "pdf", label: "PDF Cetak (A4)" },
  { value: "csv", label: "Data Mentah (.csv)" },
];

export function formatFileSize(sizeMb: number) {
  return sizeMb < 1
    ? `${Math.round(sizeMb * 1000)} KB`
    : `${sizeMb.toFixed(1)} MB`;
}
