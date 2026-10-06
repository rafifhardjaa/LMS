"use client";

import { useRef, useState } from "react";
import {
  Accessibility,
  BadgeCheck,
  Bell,
  Bot,
  Camera,
  CheckCheck,
  ChevronRight,
  CircleCheck,
  Globe,
  Home,
  IdCard,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  RefreshCw,
  School,
  ShieldCheck,
  Smartphone,
  User,
  X,
} from "lucide-react";
import { FadeIn } from "@/components/ui/animations";

const tabs = [
  { id: "profil", label: "Profil Siswa", icon: User },
  { id: "notifikasi", label: "Notifikasi & Reminder", icon: Bell },
  { id: "keamanan", label: "Keamanan & SSO", icon: ShieldCheck },
  { id: "aitutor", label: "AI Tutor & Aksesibilitas", icon: Bot },
  { id: "perangkat", label: "Perangkat Terhubung", icon: Laptop },
];

const notificationRows = [
  {
    title: "Peringatan Batas Tugas (Deadline)",
    desc: "Kirim alarm peringatan 2 jam sebelum batas akhir pengumpulan portal.",
    defaultChecked: true,
  },
  {
    title: "Sesi Kelas Virtual & Laboratorium",
    desc: "Pengingat 15 menit sebelum link Google Meet aktif.",
    defaultChecked: true,
  },
  {
    title: "Hasil Nilai & Catatan Guru BK",
    desc: "Notifikasi instan saat transkrip nilai atau jadwal konseling diterbitkan.",
    defaultChecked: true,
  },
  {
    title: "Rekomendasi Modul Harian AI",
    desc: "Saran materi latihan berdasarkan performa kuis kemarin malam.",
    defaultChecked: false,
  },
];

const deliveryChannels = [
  { icon: Mail, label: "Email Siswa (pawell.bennett@smkmataram.sch.id)" },
  { icon: Bell, label: "Browser Push Notifications" },
  { icon: MessageCircle, label: "WhatsApp Gateway Wali Siswa (+62 812-****-4491)" },
];

const initialInterests = [
  "Artificial Intelligence • AI",
  "Data Structures & Algorithms",
  "Quantum Mechanics (Physics)",
  "Calculus III",
];

const aiToneOptions = [
  {
    title: "Socratic & Pendalaman Konsep",
    desc: "Membimbing dengan pertanyaan reflektif dan pembuktian langkah matematis.",
  },
  {
    title: "Ringkasan Cepat & Kunci Rumus",
    desc: "Solusi instan to-the-point untuk persiapan kilat ujian akhir.",
  },
];

const aiLangOptions = [
  {
    title: "Bilingual (Indonesia • English Academic)",
    desc: "Terminologi sains dalam Bahasa Inggris dengan penjabaran Bahasa Indonesia.",
  },
  {
    title: "Bahasa Indonesia Standar KBBI",
    desc: "Seluruh analogi dan penjelasan dialihbahasakan secara menyeluruh.",
  },
];

const ssoRows = [
  {
    icon: School,
    title: "Akun Belajar.id",
    badge: "TERVALIDASI DAPODIK",
    desc: "pawell.bennett.31@sma.belajar.id",
  },
  {
    icon: Globe,
    title: "Google Workspace for Education",
    badge: "TERKONEKSI",
    desc: "Sinkron Google Drive & Classroom",
  },
];

const devices = [
  {
    icon: Laptop,
    title: "Laptop Chrome OS • Lab Sains Mataram",
    meta: "IP: 180.252.88.12 • Mataram, Nusa Tenggara Barat",
    current: true,
  },
  {
    icon: Smartphone,
    title: "Samsung Galaxy Tab S8 • Mobile App",
    meta: "Terakhir aktif 2 jam yang lalu • Mataram",
    current: false,
  },
];

const inputCls =
  "w-full h-11 px-4 rounded-lg bg-[#edf7f4] text-[14px] text-[#071f1c] outline-none border border-transparent focus:bg-white focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.18)] transition-all";

function SectionCard({
  id,
  icon: Icon,
  title,
  desc,
  badge,
  flash,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  badge?: React.ReactNode;
  flash?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`section-${id}`}
      className={`bg-white rounded-xl p-6 border shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] flex flex-col gap-4 transition-all duration-300 ${
        flash
          ? "border-[#14b8a6]/40 shadow-[0_0_0_3px_rgba(20,184,166,0.2)]"
          : "border-[#cee8e1]/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-[#e2f2ee] flex items-center justify-center text-[#0d5c52] flex-shrink-0">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold text-[#071f1c] tracking-tight truncate">
              {title}
            </h2>
            <p className="text-[12px] text-[#536360] truncate">{desc}</p>
          </div>
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

export function StudentSettings() {
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState("profil");
  const [flashId, setFlashId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [interests, setInterests] = useState(initialInterests);
  const [addingInterest, setAddingInterest] = useState(false);

  function goTo(id: string) {
    setActiveTab(id);
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1200);
  }

  function handleSave() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1800);
    }, 600);
  }

  function handleCancel() {
    formRef.current?.reset();
    setInterests(initialInterests);
    setAddingInterest(false);
  }

  return (
    <FadeIn className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* Breadcrumb & actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex items-center gap-1 text-[#536360]">
            <a
              href="/student/dashboard"
              className="text-[13px] font-semibold text-[#0d5c52] flex items-center gap-1.5 hover:underline"
            >
              <Home className="size-4" />
              Dashboard
            </a>
            <ChevronRight className="size-3.5 text-[#bec9c5]" />
            <span className="text-[13px] font-semibold text-[#536360]">
              Settings &amp; Account Preferences
            </span>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-[#e2f2ee] text-[#0d5c52] text-[14px] font-semibold hover:bg-[#d4eee7] transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState !== "idle"}
              className="px-5 py-2 rounded-lg bg-[#0d5c52] text-white text-[14px] font-semibold flex items-center gap-2 shadow-[0_4px_14px_rgba(13,92,82,0.28)] hover:bg-[#00433b] transition-all disabled:opacity-70"
            >
              {saveState === "saving" ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : saveState === "saved" ? (
                <>
                  <CircleCheck className="size-4" />
                  Tersimpan!
                </>
              ) : (
                <>
                  <CheckCheck className="size-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#cee8e1] via-[#e2f2ee] to-[#edf7f4] border border-[#cee8e1]/60 p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#0d5c52]/10 text-[#0d5c52] text-[11px] font-semibold">
                  PORTAL SISWA TERPADU
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d5c52]" />
                <span className="text-[11px] font-semibold text-[#0d5c52]">
                  SMK Mataram / St. Edmund&apos;s College
                </span>
              </div>
              <h1 className="text-[26px] leading-[34px] font-bold text-[#071f1c] tracking-tight">
                Account &amp; Learning Preferences
              </h1>
              <p className="text-[14px] text-[#536360] mt-1">
                Kelola identitas akademik, sinkronisasi kredensial SSO Belajar.id,
                preferensi modul AI Tutor, serta kanal notifikasi batas pengumpulan tugas.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 rounded-xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-white/60">
              <div className="w-12 h-12 rounded-xl bg-[#0d5c52] flex items-center justify-center text-white">
                <IdCard className="size-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#071f1c]">
                  NISN #0065849201
                </span>
                <span className="text-[11px] font-semibold text-[#0d5c52]">
                  XII MIPA 1 • Natural Sciences
                </span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-15 pointer-events-none flex items-center justify-end pr-4">
            <svg className="w-64 h-64 text-[#0d5c52]" fill="currentColor" viewBox="0 0 200 200">
              <path
                d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,42C64.8,54.8,53.8,65.9,40.7,73.2C27.5,80.4,12.2,83.7,-3.3,89.5C-18.9,95.2,-34.7,103.3,-47.3,98.1C-59.9,93,-69.4,74.5,-76.8,58.3C-84.3,42.1,-89.8,28.2,-91.1,13.9C-92.4,-0.4,-89.4,-15.1,-82.9,-28C-76.4,-40.8,-66.4,-52,-54.2,-59.6C-42.1,-67.2,-27.8,-71.2,-13.7,-73.4C0.4,-75.7,14.6,-76.2,30.6,-83.6L44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              className={`px-4 py-2 rounded-lg text-[14px] font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === id
                  ? "bg-[#0d5c52] text-white shadow-[0_4px_14px_rgba(13,92,82,0.28)]"
                  : "bg-white text-[#536360] border border-[#cee8e1]/60 hover:bg-[#edf7f4] hover:text-[#0d5c52]"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
        >
          {/* LEFT COLUMN */}
          <div className="xl:col-span-7 flex flex-col gap-6 min-w-0">
            <SectionCard
              id="profil"
              icon={IdCard}
              title="Profil Siswa & Identitas Akademik"
              desc="Informasi terverifikasi oleh Dapodik SMK Mataram & Biro Akademik"
              badge={
                <span className="px-2 py-1 rounded-full bg-[#edf7f4] text-[#0d5c52] text-[11px] font-semibold flex items-center gap-1 flex-shrink-0">
                  <BadgeCheck className="size-3.5" />
                  Akun Terverifikasi
                </span>
              }
              flash={flashId === "profil"}
            >
              {/* Avatar row */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#edf7f4]">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-[#0d5c52] flex items-center justify-center text-white shadow-md">
                    <User className="size-12" />
                  </div>
                  <button
                    type="button"
                    title="Ganti Foto Profil"
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-[#0d5c52] text-white shadow-sm hover:scale-105 transition-transform"
                  >
                    <Camera className="size-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 text-center sm:text-left flex-1 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="text-[15px] font-bold text-[#071f1c]">Pawell Bennett</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#0d5c52] text-white text-[11px] font-semibold">
                      ID #ST-2024-8891
                    </span>
                  </div>
                  <p className="text-[12px] text-[#536360]">
                    SMK Mataram • Jurusan Ilmu Pengetahuan Alam (MIPA) Terakreditasi A
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <button
                      type="button"
                      className="px-2 py-1 rounded-lg bg-white text-[#0d5c52] text-[11px] font-semibold hover:bg-[#e2f2ee] transition-colors"
                    >
                      Unggah Foto Baru
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 rounded-lg text-[#ba1a1a] text-[11px] font-semibold hover:bg-[#ffdad6]/40 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="full-name" className="text-[13px] font-semibold text-[#071f1c]">
                    Nama Lengkap Siswa
                  </label>
                  <input id="full-name" type="text" defaultValue="Pawell Bennett" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="nisn" className="text-[13px] font-semibold text-[#071f1c]">
                    NISN / Nomor Induk Siswa
                  </label>
                  <div className="relative">
                    <input
                      id="nisn"
                      type="text"
                      defaultValue="0065849201"
                      readOnly
                      className={inputCls + " bg-[#cee8e1]/50 text-[#536360] cursor-not-allowed pr-10"}
                    />
                    <Lock className="size-4 text-[#536360] absolute right-3 top-3.5" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="school-email" className="text-[13px] font-semibold text-[#071f1c]">
                    Email Institusi Sekolah
                  </label>
                  <div className="relative">
                    <input
                      id="school-email"
                      type="email"
                      defaultValue="pawell.bennett@smkmataram.sch.id"
                      readOnly
                      className={inputCls + " bg-[#cee8e1]/50 text-[#536360] cursor-not-allowed pr-10"}
                    />
                    <Lock className="size-4 text-[#536360] absolute right-3 top-3.5" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="class" className="text-[13px] font-semibold text-[#071f1c]">
                    Konsentrasi Kelas
                  </label>
                  <select id="class" className={inputCls + " cursor-pointer"}>
                    <option>XII MIPA 1 (Natural Sciences &amp; Math)</option>
                    <option>XII MIPA 2 (Natural Sciences &amp; Computing)</option>
                    <option>XII IPS 1 (Social Sciences)</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label htmlFor="bio" className="text-[13px] font-semibold text-[#071f1c]">
                    Bio Singkat Siswa
                  </label>
                  <textarea
                    id="bio"
                    rows={2}
                    defaultValue="Siswa tingkat akhir fokus pada peminatan olimpiade Fisika Kuantum & Machine Learning dasar. Target melanjutkan ke Institut Teknologi Bandung jurusan Teknik Informatika."
                    className="w-full p-4 rounded-lg bg-[#edf7f4] text-[14px] text-[#071f1c] outline-none border border-transparent focus:bg-white focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.18)] resize-none transition-all"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#071f1c]">
                    Topik Riset &amp; Minat Akademik Utama
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 rounded-full bg-[#e2f2ee] text-[#0d5c52] text-[13px] font-semibold flex items-center gap-1"
                      >
                        {interest}
                        <button
                          type="button"
                          aria-label={`Hapus ${interest}`}
                          onClick={() => setInterests((prev) => prev.filter((i) => i !== interest))}
                          className="hover:text-[#ba1a1a] transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </span>
                    ))}
                    {addingInterest ? (
                      <input
                        autoFocus
                        placeholder="Tulis minat, Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value) setInterests((prev) => [...prev, value]);
                            setAddingInterest(false);
                          }
                          if (e.key === "Escape") setAddingInterest(false);
                        }}
                        onBlur={() => setAddingInterest(false)}
                        className="px-2 py-1 rounded-full bg-white border border-[#0d5c52]/30 text-[13px] text-[#071f1c] outline-none focus:border-[#14b8a6] w-44"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingInterest(true)}
                        className="px-2 py-1 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[13px] font-semibold hover:bg-[#0d5c52] hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Plus className="size-4" /> Tambah Minat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id="aitutor"
              icon={Bot}
              title="AI Tutor & Preferensi Pembelajaran"
              desc="Konfigurasi gaya asistensi materi sains dan adaptasi kognitif Anda"
              badge={
                <span className="px-2 py-1 rounded-full bg-[#0d5c52]/10 text-[#0d5c52] text-[11px] font-semibold flex-shrink-0">
                  SiManis LLM v4.2 Edu
                </span>
              }
              flash={flashId === "aitutor"}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold text-[#071f1c]">
                    Model Karakter Respons AI
                  </span>
                  {aiToneOptions.map((opt, i) => (
                    <label
                      key={opt.title}
                      className="flex items-start gap-2 p-3 rounded-lg bg-[#edf7f4] cursor-pointer hover:bg-[#e2f2ee] transition-colors"
                    >
                      <input
                        type="radio"
                        name="ai_tone"
                        defaultChecked={i === 0}
                        className="mt-1 w-4 h-4 accent-[#0d5c52]"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#071f1c]">{opt.title}</span>
                        <span className="text-[12px] text-[#536360]">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold text-[#071f1c]">
                    Bahasa Utama Penjelasan
                  </span>
                  {aiLangOptions.map((opt, i) => (
                    <label
                      key={opt.title}
                      className="flex items-start gap-2 p-3 rounded-lg bg-[#edf7f4] cursor-pointer hover:bg-[#e2f2ee] transition-colors"
                    >
                      <input
                        type="radio"
                        name="ai_lang"
                        defaultChecked={i === 0}
                        className="mt-1 w-4 h-4 accent-[#0d5c52]"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#071f1c]">{opt.title}</span>
                        <span className="text-[12px] text-[#536360]">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div className="p-4 rounded-xl bg-[#edf7f4] flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Accessibility className="size-5 text-[#0d5c52]" />
                    <span className="text-[14px] font-semibold text-[#071f1c]">
                      Aksesibilitas &amp; Tipografi Belajar
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#536360]">
                    Ramah Disleksia &amp; Kelelahan Visual
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-[#071f1c]">
                        Font Ramah Disleksia (OpenDyslexic)
                      </span>
                      <span className="text-[12px] text-[#536360]">
                        Terapkan pada teks soal kalkulus &amp; ringkasan
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      aria-label="Font ramah disleksia"
                      className="w-5 h-5 accent-[#0d5c52] cursor-pointer flex-shrink-0"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-[#071f1c]">
                        Ukuran Konten Modul
                      </span>
                      <span className="text-[12px] text-[#536360]">
                        Skala teks tampilan lembar kerja
                      </span>
                    </div>
                    <select
                      aria-label="Ukuran konten modul"
                      className="px-2 py-1 rounded bg-[#e2f2ee] text-[#071f1c] text-[12px] font-semibold outline-none cursor-pointer"
                    >
                      <option>Normal (100%)</option>
                      <option selected>Nyaman (115%)</option>
                      <option>Besar (125%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-5 flex flex-col gap-6 min-w-0">
            <SectionCard
              id="notifikasi"
              icon={Bell}
              title="Notifikasi & Reminder"
              desc="Pengingat berkala tugas dan janji temu bimbingan"
              flash={flashId === "notifikasi"}
            >
              <div className="flex flex-col gap-2">
                {notificationRows.map((row) => (
                  <div
                    key={row.title}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#edf7f4] hover:bg-[#e2f2ee] transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-[#071f1c]">{row.title}</span>
                      <span className="text-[12px] text-[#536360]">{row.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={row.defaultChecked}
                      aria-label={row.title}
                      className="w-5 h-5 accent-[#0d5c52] cursor-pointer flex-shrink-0"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[11px] font-semibold text-[#536360]">
                  KANAL PENGIRIMAN AKTIF
                </span>
                {deliveryChannels.map(({ icon: Icon, label }) => (
                  <label
                    key={label}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white border border-[#cee8e1]/60 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="size-4 text-[#0d5c52] flex-shrink-0" />
                      <span className="text-[13px] font-semibold text-[#071f1c] truncate">{label}</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      aria-label={label}
                      className="w-4 h-4 accent-[#0d5c52] cursor-pointer flex-shrink-0"
                    />
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              id="keamanan"
              icon={ShieldCheck}
              title="Keamanan & SSO Edu"
              desc="Integrasi akun nasional Dapodik & otentikasi login"
              flash={flashId === "keamanan"}
            >
              <div className="flex flex-col gap-2">
                {ssoRows.map(({ icon: Icon, title, badge, desc }) => (
                  <div
                    key={title}
                    className="p-3 rounded-lg bg-[#edf7f4] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-[#e2f2ee] flex items-center justify-center text-[#0d5c52] flex-shrink-0">
                        <Icon className="size-5" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-[#071f1c]">{title}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#e2f2ee] text-[#0d5c52] text-[10px] font-bold">
                            {badge}
                          </span>
                        </div>
                        <span className="text-[12px] text-[#536360] truncate">{desc}</span>
                      </div>
                    </div>
                    <CircleCheck className="size-5 text-[#0d5c52] flex-shrink-0" />
                  </div>
                ))}
                <div className="p-3 rounded-lg bg-[#edf7f4] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-[#e2f2ee] flex items-center justify-center text-[#0d5c52] flex-shrink-0">
                      <KeyRound className="size-5" />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-[#071f1c]">
                        Otentikasi Dua Faktor (2FA)
                      </span>
                      <span className="text-[12px] text-[#536360]">
                        Aktif via Google Authenticator App
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2 py-1 rounded bg-[#e2f2ee] text-[#0d5c52] text-[12px] font-semibold hover:bg-[#d4eee7] transition-colors flex-shrink-0"
                  >
                    Kelola
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              id="perangkat"
              icon={Laptop}
              title="Sesi & Perangkat Aktif"
              desc="Riwayat login portal SiManis pada perangkat Anda"
              flash={flashId === "perangkat"}
            >
              <div className="flex flex-col gap-2">
                {devices.map(({ icon: Icon, title, meta, current }) => (
                  <div
                    key={title}
                    className="p-3 rounded-lg bg-[#edf7f4] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`size-6 flex-shrink-0 ${current ? "text-[#0d5c52]" : "text-[#536360]"}`}
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-semibold text-[#071f1c]">{title}</span>
                          {current && (
                            <span className="px-1.5 py-0.5 rounded bg-[#0d5c52] text-white text-[10px] font-semibold">
                              Sesi Ini
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-[#536360] truncate">{meta}</span>
                      </div>
                    </div>
                    {!current && (
                      <button
                        type="button"
                        title="Putus Sesi"
                        className="text-[#ba1a1a] text-[12px] font-semibold hover:underline flex-shrink-0"
                      >
                        Keluar
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full py-2.5 rounded-lg bg-[#ffdad6]/40 text-[#ba1a1a] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#ffdad6]/70 transition-colors"
              >
                <LogOut className="size-4" />
                Logout dari Semua Perangkat Lain
              </button>
            </SectionCard>
          </div>
        </form>
      </div>
    </FadeIn>
  );
}
