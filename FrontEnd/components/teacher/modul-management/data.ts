import type { AdminItem, CurriculumModule } from "./types";

export const curriculumModules: CurriculumModule[] = [
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

export const adminItems: AdminItem[] = [
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
