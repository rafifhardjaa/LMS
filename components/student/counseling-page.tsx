"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Brain,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Copy,
  DoorOpen,
  Download,
  Gift,
  Headset,
  HeartHandshake,
  History,
  Infinity as InfinityIcon,
  LineChart,
  Lock,
  MessageCircle,
  Plus,
  PlusCircle,
  School,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
  Users,
  Video,
  X,
} from "lucide-react";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

export function StudentCounseling() {
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState("Mrs. Sarah Jenkins, M.Psi");

  function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    alert(`Permintaan janji temu dengan ${selectedCounselor} berhasil diajukan! Notifikasi dan link ruang konseling telah dikirim ke email siswa SiManis Pawell Bennett.`);
  }

  function copyMeetLink() {
    navigator.clipboard.writeText("https://meet.google.com/smk-bk-pawell");
    alert("Tautan Google Meet disalin!");
  }

  return (
    <FadeIn className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* Breadcrumb & Top Bar Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-1 text-[#536360]">
            <a
              href="/student/dashboard"
              className="text-[13px] font-semibold text-[#0d5c52] flex items-center gap-1.5 hover:underline"
            >
              <School className="size-4" />
              Dashboard
            </a>
            <ChevronRight className="size-3.5 text-[#bec9c5]" />
            <span className="text-[13px] font-semibold text-[#071f1c]">
              Counseling (BK) &amp; Student Wellness Hub
            </span>
          </nav>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]" />
              NISN: #0065849201 • Kelas XII MIPA 1
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0d5c52] text-[11px] font-semibold shadow-sm border border-[#cee8e1]/60">
              <ShieldCheck className="size-3.5 text-[#14b8a6]" />
              Privasi Terjamin 100%
            </div>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#d9f3ed] p-6 md:p-8 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#cee8e1]/50 blur-2xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-16 w-80 h-80 rounded-full bg-[#abf0e2]/25 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl flex flex-col gap-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#cee8e1] text-[#0d5c52] text-[11px] font-semibold w-fit mb-1 border border-[#bec9c5]/30">
                <HeartHandshake className="size-4" />
                <span>Bimbingan Konseling &amp; Kesejahteraan Mental Siswa</span>
              </div>
              <h2 className="text-[28px] leading-[36px] font-bold text-[#071f1c] tracking-tight">
                Pusat Konseling, Karir &amp; Kesejahteraan Siswa
              </h2>
              <p className="text-[14px] text-[#3f4946] leading-relaxed">
                Ruang aman dan suportif bagi Pawell untuk konsultasi studi lanjut, eksplorasi minat bakat, dan pemulihan kesehatan mental. Seluruh sesi dilindungi etika profesi Bimbingan &amp; Konseling (BK) dengan kerahasiaan penuh.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[#3f4946] text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Lock className="size-4 text-[#0d5c52]" />
                  Enkripsi Rekam Medis BK
                </span>
                <span className="text-[#bec9c5]">•</span>
                <span className="flex items-center gap-1.5">
                  <Brain className="size-4 text-[#0d5c52]" />
                  Konselor Psikologi Berlisensi
                </span>
                <span className="text-[#bec9c5]">•</span>
                <span className="flex items-center gap-1.5">
                  <Gift className="size-4 text-[#0d5c52]" />
                  Layanan Siswa Tanpa Biaya
                </span>
              </div>
            </div>
            
            {/* Hero Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0d5c52] text-white text-[14px] font-semibold rounded-xl shadow-[0_4px_14px_rgba(13,92,82,0.28)] hover:bg-[#00433b] transition-all"
              >
                <PlusCircle className="size-5" />
                Buat Janji Konseling Baru
              </button>
              <button
                type="button"
                onClick={() => setShowTicketsModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0d5c52] text-[14px] font-semibold rounded-xl shadow-sm border border-[#cee8e1]/60 hover:bg-[#dff9f2] transition-all"
              >
                <CalendarClock className="size-5" />
                Cek Status Tiket / Sesi Aktif
              </button>
            </div>
          </div>
        </div>

        {/* Key Stats Row */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <StaggerItem>
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col justify-between gap-3 relative overflow-hidden group hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#3f4946] uppercase tracking-wider">Sesi Terlaksana</span>
                <div className="w-9 h-9 rounded-xl bg-[#dff9f2] flex items-center justify-center text-[#0d5c52]">
                  <CheckCircle2 className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-bold text-[#071f1c] leading-none">4</span>
                <span className="text-[12px] text-[#3f4946]">Sesi Semester Ini</span>
              </div>
              <div className="w-full bg-[#cee8e1] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0d5c52] h-full rounded-full" style={{ width: "80%" }} />
              </div>
              <span className="text-[11px] font-semibold text-[#006b5f]">Target evaluasi triwulan terpenuhi</span>
            </div>
          </StaggerItem>

          {/* Stat 2 */}
          <StaggerItem>
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col justify-between gap-3 relative overflow-hidden group hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#3f4946] uppercase tracking-wider">Jadwal Terdekat</span>
                <div className="w-9 h-9 rounded-xl bg-[#6df5e1]/40 flex items-center justify-center text-[#006f64]">
                  <CalendarDays className="size-5" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-semibold text-[#071f1c] leading-tight">Besok, 09:30</span>
                <span className="text-[12px] text-[#3f4946] truncate">Mrs. Sarah Jenkins • Google Meet</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#006f64] mt-auto">
                <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" />
                Sesi Dikonfirmasi Guru BK
              </div>
            </div>
          </StaggerItem>

          {/* Stat 3 */}
          <StaggerItem>
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col justify-between gap-3 relative overflow-hidden group hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#3f4946] uppercase tracking-wider">Hak Bimbingan</span>
                <div className="w-9 h-9 rounded-xl bg-[#d9f3ed] flex items-center justify-center text-[#0d5c52]">
                  <InfinityIcon className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-bold text-[#071f1c] leading-none">Bebas</span>
                <span className="text-[12px] text-[#3f4946]">/ Tak Terbatas</span>
              </div>
              <div className="w-full bg-[#cee8e1] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#14b8a6] h-full rounded-full" style={{ width: "100%" }} />
              </div>
              <span className="text-[11px] font-semibold text-[#3f4946]">Layanan aktif bagi seluruh siswa SMK</span>
            </div>
          </StaggerItem>

          {/* Stat 4 */}
          <StaggerItem>
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col justify-between gap-3 relative overflow-hidden group hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#3f4946] uppercase tracking-wider">Kecocokan Karir</span>
                <div className="w-9 h-9 rounded-xl bg-[#d4eee7] flex items-center justify-center text-[#0d5c52]">
                  <Sparkles className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-bold text-[#0d5c52] leading-none">94%</span>
                <span className="text-[12px] text-[#3f4946]">Informatika &amp; AI</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#006b5f] mt-auto">
                <LineChart className="size-4" />
                Hasil Asesmen Pusdatin 2025
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>

        {/* Active Confirmed Next Session Card */}
        <SlideIn direction="up">
          <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#14b8a6]/30 p-6 relative overflow-hidden ring-1 ring-inset ring-[#14b8a6]/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#cee8e1]/40">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#14b8a6] ring-4 ring-[#6df5e1]/40" />
                <h3 className="text-[18px] font-semibold text-[#071f1c] tracking-tight">Jadwal Bimbingan Terkonfirmasi Terdekat</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#d9f3ed] text-[#0d5c52] text-[11px] font-semibold ml-2">
                  1-on-1 Session
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#3f4946]">ID Tiket: #BK-2025-089</span>
                <button
                  type="button"
                  onClick={() => alert("Permintaan ubah jadwal diteruskan ke guru BK bersangkutan.")}
                  className="text-[#3f4946] hover:text-[#0d5c52] transition-colors text-[11px] font-semibold underline"
                >
                  Reschedule / Batalkan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-5">
              {/* Counselor Info (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#0d5c52] flex items-center justify-center text-white shadow-sm">
                      <UserRound className="size-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#6df5e1] flex items-center justify-center text-[#006f64] shadow-sm border-2 border-white">
                      <BadgeCheck className="size-3.5" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-[#071f1c]">Mrs. Sarah Jenkins, M.Psi</span>
                    <span className="text-[12px] text-[#3f4946]">Koordinator Guru BK Bidang Peminatan Sains, Karir &amp; PTN</span>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#dff9f2] text-[#0d5c52]">
                        <Brain className="size-3.5" /> S2 Psikologi Pendidikan
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#d4eee7] text-[#0d5c52]">
                        <Sparkles className="size-3.5" /> 9 Tahun Pengalaman
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#dff9f2] p-4 rounded-xl flex flex-col gap-1 border border-[#cee8e1]/50">
                  <span className="text-[11px] font-bold text-[#0d5c52] uppercase tracking-wide">Fokus Diskusi:</span>
                  <p className="text-[15px] font-semibold text-[#071f1c] italic">
                    &quot;Konsultasi Pemilihan Jurusan &amp; Portofolio Seleksi Mandiri ITB / UI&quot;
                  </p>
                  <div className="flex items-start gap-2 text-[#3f4946] text-[12px] pt-1">
                    <CheckSquare className="size-4 text-[#14b8a6] shrink-0 mt-0.5" />
                    <span><strong>Catatan Persiapan Siswa:</strong> Membawa draf portofolio proyek AI, esai motivasi, dan rekap transkrip akademik semester 1 hingga 5.</span>
                  </div>
                </div>
              </div>

              {/* Session Time & Action (5 cols) */}
              <div className="lg:col-span-5 bg-[#d9f3ed] rounded-2xl p-5 flex flex-col justify-between gap-5 h-full border border-[#cee8e1]/80">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#3f4946] uppercase">Waktu &amp; Tanggal</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#6df5e1] text-[#006f64] text-[11px] font-bold">Tatap Maya</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#071f1c] pt-1">
                    <CalendarDays className="size-6 text-[#0d5c52]" />
                    <span className="text-[16px] font-semibold">Rabu, 20 Maret 2025</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#3f4946] text-[14px] pl-9">
                    <CalendarClock className="size-4.5" />
                    <span>09:30 - 10:15 WIB (Durasi 45 Menit)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#cee8e1]/40">
                  <div className="w-8 h-8 rounded-lg bg-[#d4eee7] flex items-center justify-center text-[#0d5c52] shrink-0">
                    <Video className="size-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-[#071f1c] truncate">Google Meet Edu Workspace</span>
                    <span className="text-[12px] text-[#3f4946] truncate">meet.google.com/smk-bk-pawell</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0d5c52] text-white text-[14px] font-semibold rounded-xl shadow-[0_4px_14px_rgba(13,92,82,0.28)] hover:bg-[#00433b] transition-all"
                  >
                    <DoorOpen className="size-4.5" />
                    Masuk Ruang Virtual
                  </a>
                  <button
                    type="button"
                    onClick={copyMeetLink}
                    title="Salin Tautan"
                    className="w-[42px] h-[42px] shrink-0 rounded-xl bg-white flex items-center justify-center text-[#071f1c] border border-[#cee8e1]/60 hover:border-[#0d5c52]/30 hover:text-[#0d5c52] transition-colors shadow-sm"
                  >
                    <Copy className="size-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>

        {/* Middle Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Counselors & Booking (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 min-w-0">
            {/* Counselors Directory */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h3 className="text-[18px] font-semibold text-[#071f1c] tracking-tight">Guru Bimbingan Konseling (BK)</h3>
                  <p className="text-[12px] text-[#3f4946]">Pilih konselor yang sesuai dengan kebutuhan pendampingan Anda</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#d9f3ed] text-[#0d5c52] text-[11px] font-semibold shrink-0">
                  3 Konselor Siaga
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {/* Counselor 1 */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedCounselor("Mrs. Sarah Jenkins, M.Psi");
                    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-4 rounded-xl bg-[#dff9f2] border border-[#cee8e1]/60 hover:bg-[#d9f3ed] hover:border-[#14b8a6]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[52px] h-[52px] rounded-xl bg-[#0d5c52] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <UserRound className="size-6" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-[#071f1c]">Mrs. Sarah Jenkins, M.Psi</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[10px] font-bold">Koordinator</span>
                      </div>
                      <span className="text-[12px] text-[#006b5f] font-medium">Bimbingan Karir &amp; Minat Studi Lanjut PTN</span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-[#3f4946]">
                        <span className="inline-flex items-center gap-1.5 text-[#0d5c52]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]" /> Tersedia Hari Ini (Sisa 2 Slot)
                        </span>
                        <span>• Ruang BK 201</span>
                      </div>
                    </div>
                  </div>
                  <button className="shrink-0 px-4 py-1.5 bg-[#0d5c52] text-white text-[12px] font-semibold rounded-lg hover:bg-[#00433b] transition-colors shadow-sm">
                    Pilih
                  </button>
                </div>

                {/* Counselor 2 */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedCounselor("Drs. H. Ahmad Fauzi, M.Pd");
                    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 hover:bg-[#dff9f2] hover:border-[#14b8a6]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[52px] h-[52px] rounded-xl bg-[#0d5c52]/10 flex items-center justify-center text-[#0d5c52] shrink-0 border border-[#0d5c52]/20">
                      <UserRound className="size-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-[#071f1c]">Drs. H. Ahmad Fauzi, M.Pd</span>
                      <span className="text-[12px] text-[#006b5f] font-medium">Penyesuaian Akademik &amp; Manajemen Stres</span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-[#3f4946]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#bec9c5]" /> Tersedia Besok (Mulai 10:00)
                        </span>
                        <span>• Ruang BK 202</span>
                      </div>
                    </div>
                  </div>
                  <button className="shrink-0 px-4 py-1.5 bg-[#cee8e1] text-[#0d5c52] text-[12px] font-semibold rounded-lg hover:bg-[#0d5c52] hover:text-white transition-colors">
                    Pilih
                  </button>
                </div>

                {/* Counselor 3 */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedCounselor("Ibu Rina Marlina, S.Psi");
                    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-4 rounded-xl bg-white border border-[#cee8e1]/60 hover:bg-[#dff9f2] hover:border-[#14b8a6]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[52px] h-[52px] rounded-xl bg-[#0d5c52]/10 flex items-center justify-center text-[#0d5c52] shrink-0 border border-[#0d5c52]/20">
                      <UserRound className="size-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-[#071f1c]">Ibu Rina Marlina, S.Psi</span>
                      <span className="text-[12px] text-[#006b5f] font-medium">Pengembangan Diri, Minat Seni &amp; Relasi Sosial</span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-[#3f4946]">
                        <span className="inline-flex items-center gap-1.5 text-[#ba1a1a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" /> Jadwal Padat (Antrean 3 Hari)
                        </span>
                        <span>• Ruang Mediasi BK</span>
                      </div>
                    </div>
                  </div>
                  <button className="shrink-0 px-4 py-1.5 bg-[#cee8e1] text-[#0d5c52] text-[12px] font-semibold rounded-lg hover:bg-[#0d5c52] hover:text-white transition-colors">
                    Pilih
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Booking Widget */}
            <div id="booking-section" className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col gap-4 scroll-mt-24">
              <div className="flex items-center justify-between pb-2 border-b border-[#cee8e1]/40">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0d5c52]" />
                    <h3 className="text-[18px] font-semibold text-[#071f1c] tracking-tight">Formulir Janji Temu Konseling</h3>
                  </div>
                  <p className="text-[12px] text-[#3f4946] pl-4.5">Isi detail kebutuhan bimbingan untuk reservasi sesi privat Anda</p>
                </div>
              </div>
              <form onSubmit={handleBooking} className="flex flex-col gap-5 pt-2">
                <div className="flex items-center justify-between p-3 bg-[#dff9f2] rounded-xl border border-[#cee8e1]/60">
                  <div className="flex items-center gap-3">
                    <UserRound className="size-5 text-[#0d5c52]" />
                    <span className="text-[13px] font-semibold text-[#071f1c]">Konselor Terpilih:</span>
                    <span className="text-[15px] font-bold text-[#0d5c52]">{selectedCounselor}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#3f4946]">Dapat diubah di atas</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#071f1c]">Pilih Layanan Konseling</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: "career", title: "Bimbingan Karir & Kuliah", desc: "SNBP, SNBT, Kedinasan & Beasiswa" },
                      { val: "academic", title: "Konsultasi Belajar & Nilai", desc: "Evaluasi rapor, strategi ujian" },
                      { val: "personal", title: "Konseling Pribadi & Emosional", desc: "Manajemen stres, kecemasan, curhat" },
                      { val: "social", title: "Mediasi Teman Sebaya & Rombel", desc: "Dinamika kelas, resolusi konflik" },
                    ].map((opt, i) => (
                      <label key={opt.val} className="flex items-center gap-3 p-3 rounded-xl bg-[#edf7f4] border border-transparent hover:border-[#14b8a6]/40 hover:bg-[#dff9f2] cursor-pointer transition-all">
                        <input type="radio" name="service_type" value={opt.val} defaultChecked={i === 0} className="w-4 h-4 accent-[#0d5c52]" />
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-[#071f1c]">{opt.title}</span>
                          <span className="text-[12px] text-[#3f4946]">{opt.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#071f1c]">Metode Konseling</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-[#edf7f4] border border-transparent hover:border-[#14b8a6]/40 hover:bg-[#dff9f2] cursor-pointer transition-all">
                      <input type="radio" name="mode" value="online" defaultChecked className="w-4 h-4 accent-[#0d5c52]" />
                      <Video className="size-5 text-[#0d5c52]" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#071f1c]">Virtual (Google Meet Edu)</span>
                        <span className="text-[12px] text-[#3f4946]">Akses link via dashboard</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-[#edf7f4] border border-transparent hover:border-[#14b8a6]/40 hover:bg-[#dff9f2] cursor-pointer transition-all">
                      <input type="radio" name="mode" value="offline" className="w-4 h-4 accent-[#0d5c52]" />
                      <Users className="size-5 text-[#0d5c52]" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#071f1c]">Tatap Muka Langsung</span>
                        <span className="text-[12px] text-[#3f4946]">Ruang BK Gedung A Lantai 2</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="text-[13px] font-semibold text-[#071f1c]">Pilih Tanggal</label>
                    <input
                      id="date"
                      type="date"
                      defaultValue="2025-03-24"
                      className="w-full h-11 px-4 rounded-xl bg-[#edf7f4] text-[#071f1c] text-[14px] outline-none border border-transparent focus:bg-white focus:border-[#14b8a6] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#071f1c]">Pilih Jam Konsultasi (WIB)</label>
                    <div className="flex flex-wrap gap-2">
                      {["08:30", "09:30", "11:00", "13:30", "15:00"].map((time, i) => (
                        <label key={time} className="cursor-pointer">
                          <input type="radio" name="time_slot" value={time} defaultChecked={i === 1} className="peer sr-only" />
                          <div className="px-3 py-1.5 rounded-lg bg-[#d9f3ed] text-[#0d5c52] text-[12px] font-semibold border border-transparent peer-checked:bg-[#0d5c52] peer-checked:text-white peer-checked:shadow-sm hover:bg-[#0d5c52] hover:text-white transition-all">
                            {time}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="topic" className="text-[13px] font-semibold text-[#071f1c]">Topik / Hal yang Ingin Didiskusikan (Opsional)</label>
                  <textarea
                    id="topic"
                    rows={3}
                    placeholder="Ceritakan secara singkat apa yang sedang Anda hadapi atau persiapkan..."
                    className="w-full p-4 rounded-xl bg-[#edf7f4] text-[#071f1c] text-[14px] placeholder:text-[#3f4946]/70 outline-none border border-transparent focus:bg-white focus:border-[#14b8a6] resize-none transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <span className="text-[12px] text-[#3f4946] flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-[#14b8a6]" />
                    Data tersimpan di server aman SiManis
                  </span>
                  <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-[#0d5c52] text-white text-[14px] font-semibold rounded-xl shadow-[0_4px_14px_rgba(13,92,82,0.28)] hover:bg-[#00433b] transition-all">
                    Konfirmasi Jadwal Temu
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Action Plan & History & Hotline (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 min-w-0">
            {/* Action Plan Checklist */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#d4eee7] flex items-center justify-center text-[#0d5c52]">
                    <CheckSquare className="size-4.5" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#071f1c] tracking-tight">Rencana Aksi Siswa</h3>
                </div>
                <span className="text-[11px] font-semibold text-[#006b5f]">1 dari 3 Selesai</span>
              </div>
              <p className="text-[12px] text-[#3f4946]">
                Rekomendasi langkah praktis yang disusun bersama guru BK pada sesi sebelumnya:
              </p>
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-[#edf7f4] hover:bg-[#e2f2ee] transition-colors cursor-pointer border border-transparent">
                  <input type="checkbox" defaultChecked className="mt-1 rounded w-4 h-4 accent-[#0d5c52]" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#071f1c] line-through opacity-70">
                      Selesaikan Asesmen Minat Bakat Pusdatin
                    </span>
                    <span className="text-[12px] text-[#3f4946]">Selesai pada 14 Feb 2025 • Hasil: 94% Informatika</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-xl bg-[#edf7f4] hover:bg-[#e2f2ee] transition-colors cursor-pointer border border-transparent hover:border-[#14b8a6]/30">
                  <input type="checkbox" className="mt-1 rounded w-4 h-4 accent-[#0d5c52]" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#071f1c]">
                      Finalisasi draf esai beasiswa prestasi
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] font-semibold text-[#ba1a1a]">Batas: 25 Maret 2025</span>
                      <span className="text-[#bec9c5]">•</span>
                      <span className="text-[12px] text-[#3f4946]">Draf esai 800 kata</span>
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-xl bg-[#edf7f4] hover:bg-[#e2f2ee] transition-colors cursor-pointer border border-transparent hover:border-[#14b8a6]/30">
                  <input type="checkbox" className="mt-1 rounded w-4 h-4 accent-[#0d5c52]" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#071f1c]">
                      Diskusi pemilihan 3 prodi prioritas dengan orang tua
                    </span>
                    <span className="text-[12px] text-[#3f4946] mt-1">Membawa lembar persetujuan peminatan SNMPTN/SNBP</span>
                  </div>
                </label>
              </div>
              <button
                type="button"
                onClick={() => alert("Item rencana aksi baru ditambahkan ke catatan bimbingan Anda.")}
                className="w-full py-2 bg-[#d9f3ed] text-[#0d5c52] text-[13px] font-semibold rounded-xl hover:bg-[#d4eee7] transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="size-4" /> Tambah Rencana Aksi Mandiri
              </button>
            </div>

            {/* Counseling History */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] border border-[#cee8e1]/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#dff9f2] flex items-center justify-center text-[#0d5c52]">
                    <History className="size-4.5" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#071f1c] tracking-tight">Riwayat Bimbingan Terakhir</h3>
                </div>
                <a href="#" className="text-[11px] font-semibold text-[#006b5f] hover:underline">Lihat Semua</a>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-[#edf7f4] flex flex-col gap-2 border border-[#cee8e1]/40">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[10px] font-bold">Sesi #04 Selesai</span>
                    <span className="text-[12px] text-[#3f4946]">12 Februari 2025</span>
                  </div>
                  <h4 className="text-[15px] font-semibold text-[#071f1c]">Eksplorasi Minat Jurusan STEM &amp; Teknik Informatika</h4>
                  <span className="text-[12px] text-[#3f4946]">Konselor: Mrs. Sarah Jenkins, M.Psi</span>
                  <div className="flex items-center justify-between pt-2 border-t border-[#cee8e1]/40 mt-1">
                    <span className="text-[11px] font-semibold text-[#006b5f] flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" /> Rekomendasi Terbit
                    </span>
                    <button
                      type="button"
                      onClick={() => alert("Mengunduh resume rekomendasi konseling BK Pawell Bennett (PDF)...")}
                      className="px-3 py-1.5 bg-white text-[#0d5c52] hover:bg-[#0d5c52] hover:text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm border border-[#cee8e1]/60"
                    >
                      <Download className="size-3.5" /> Resume PDF
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-[#edf7f4] flex flex-col gap-2 border border-[#cee8e1]/40">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[10px] font-bold">Sesi #03 Selesai</span>
                    <span className="text-[12px] text-[#3f4946]">28 Januari 2025</span>
                  </div>
                  <h4 className="text-[15px] font-semibold text-[#071f1c]">Time Management &amp; Persiapan Olimpiade Fisika</h4>
                  <span className="text-[12px] text-[#3f4946]">Konselor: Drs. H. Ahmad Fauzi, M.Pd</span>
                  <div className="flex items-center justify-between pt-2 border-t border-[#cee8e1]/40 mt-1">
                    <span className="text-[11px] font-semibold text-[#006b5f] flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" /> Target Tercapai
                    </span>
                    <button
                      type="button"
                      onClick={() => alert("Mengunduh evaluasi target belajar (PDF)...")}
                      className="px-3 py-1.5 bg-white text-[#0d5c52] hover:bg-[#0d5c52] hover:text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm border border-[#cee8e1]/60"
                    >
                      <Download className="size-3.5" /> Resume PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Hotline */}
            <div className="bg-[#d4eee7] rounded-2xl p-6 shadow-sm flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d5c52] flex items-center justify-center text-white shadow-sm">
                  <Headset className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-[#071f1c]">Layanan Siaga 24/7 Siswa</span>
                  <span className="text-[12px] text-[#3f4946]">Krisis Emosional, Bullying, atau Keadaan Mendesak</span>
                </div>
              </div>
              <p className="text-[12px] text-[#3f4946] leading-relaxed">
                Jika kamu merasa cemas berat, tertekan, atau membutuhkan bantuan mendesak di luar jam sekolah, tim BK SMK Mataram siap mendengarkan secara rahasia dan aman.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-2.5 px-4 bg-[#0d5c52] text-white text-[13px] font-semibold rounded-xl text-center shadow-[0_4px_14px_rgba(13,92,82,0.28)] hover:bg-[#00433b] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="size-4.5" /> WhatsApp BK Hotline
                </a>
                <button
                  type="button"
                  onClick={() => setShowFaqModal(true)}
                  className="w-full sm:w-auto py-2.5 px-4 bg-white text-[#0d5c52] text-[13px] font-semibold rounded-xl hover:bg-[#e2f2ee] transition-colors shadow-sm"
                >
                  FAQ Kerahasiaan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTicketsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e3530]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#cee8e1]/40">
              <div className="flex items-center gap-2">
                <Ticket className="size-5 text-[#0d5c52]" />
                <h4 className="text-[18px] font-semibold text-[#071f1c]">Daftar Tiket Konseling Pawell</h4>
              </div>
              <button type="button" onClick={() => setShowTicketsModal(false)} className="text-[#3f4946] hover:text-[#071f1c] bg-[#e2f2ee] hover:bg-[#cee8e1] rounded-lg p-1.5 transition-colors">
                <X className="size-4.5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-[#dff9f2] flex flex-col gap-1.5 border border-[#cee8e1]/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#006b5f] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" /> #BK-2025-089 • TERKONFIRMASI</span>
                  <span className="text-[12px] text-[#3f4946]">20 Mar 2025</span>
                </div>
                <p className="text-[13px] font-semibold text-[#071f1c]">Pemilihan Jurusan &amp; Portofolio ITB / UI (Mrs. Sarah Jenkins)</p>
              </div>
              <div className="p-4 rounded-xl bg-[#edf7f4] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#3f4946]">#BK-2025-042 • SELESAI</span>
                  <span className="text-[12px] text-[#3f4946]">12 Feb 2025</span>
                </div>
                <p className="text-[13px] font-semibold text-[#071f1c]">Eksplorasi Minat STEM &amp; Rekomendasi PTN</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTicketsModal(false)}
              className="w-full py-2.5 bg-[#0d5c52] text-white rounded-xl text-[13px] font-semibold shadow-sm hover:bg-[#00433b] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showFaqModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e3530]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#cee8e1]/40">
              <h4 className="text-[18px] font-semibold text-[#071f1c] flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#0d5c52]" /> FAQ Kerahasiaan &amp; Etika BK
              </h4>
              <button type="button" onClick={() => setShowFaqModal(false)} className="text-[#3f4946] hover:text-[#071f1c] bg-[#e2f2ee] hover:bg-[#cee8e1] rounded-lg p-1.5 transition-colors">
                <X className="size-4.5" />
              </button>
            </div>
            <div className="text-[13px] text-[#3f4946] flex flex-col gap-4">
              <p>
                <strong className="text-[#071f1c]">1. Apakah guru mapel atau wali kelas dapat melihat isi percakapan saya?</strong><br />
                Tidak. Segala isi konseling bersifat rahasia profesional antara Anda dan Konselor BK yang bersangkutan, sesuai Kode Etik Asosiasi Bimbingan Konseling Indonesia (ABKIN).
              </p>
              <p>
                <strong className="text-[#071f1c]">2. Kapan kerahasiaan dibatasi?</strong><br />
                Hanya jika terdapat situasi darurat medis, ancaman keselamatan jiwa, atau tindak bahaya nyata bagi diri sendiri maupun orang lain.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFaqModal(false)}
              className="w-full py-2.5 bg-[#0d5c52] text-white rounded-xl text-[13px] font-semibold shadow-sm hover:bg-[#00433b] transition-colors mt-2"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </FadeIn>
  );
}
