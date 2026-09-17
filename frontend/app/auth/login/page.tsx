"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { motion } from "framer-motion";
import { LoginForm } from "./login-form";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export default function LoginPage() {
  return (
    <div
      style={{ fontFamily: plusJakartaSans.style.fontFamily }}
      className="min-h-screen flex flex-col justify-between bg-[#f7f9fd] text-slate-800 antialiased"
    >
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <LeftHeroSection />
          <SlideIn direction="right" delay={0.15} className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-7 sm:p-8">
              <LoginForm />
            </div>
          </SlideIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <motion.header
      className="w-full px-6 lg:px-12 py-5 flex items-center justify-between"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200"
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <GraduationCapIcon className="text-lg" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">
            SMK
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-800 leading-tight">
            Mataram
          </span>
        </div>
      </div>
      <motion.div
        className="inline-flex items-center gap-2 bg-slate-100/80 border border-slate-200/70 px-3.5 py-1.5 rounded-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-slate-600">
          Identity Provider v2.4
        </span>
      </motion.div>
    </motion.header>
  );
}

function LeftHeroSection() {
  return (
    <section className="lg:col-span-6 flex flex-col justify-center gap-6">
      <FadeIn delay={0.05}>
        <span className="inline-flex items-center gap-2 bg-indigo-50/80 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
          <ShieldCheckIcon className="size-3.5" />
          SMK MATARAM • LMS PORTAL GATEWAY
        </span>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 leading-tight tracking-tight">
            Gerbang Masuk Terpadu
            <br />
            Pembelajaran Digital SMK Mataram
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
            Satu akun Single Sign-On (SSO) untuk seluruh ekosistem: Guru Mapel,
            Siswa, Guru BK, dan Manajemen Sekolah.
          </p>
        </div>
      </FadeIn>

      <StaggerChildren staggerDelay={0.1} delayChildren={0.15} className="space-y-3.5 pt-1">
        <StaggerItem>
          <FeatureCard
            icon={<GraduationCapIcon className="size-4" />}
            title="Akses Kelas & Materi Rombel"
            description="Kurikulum merdeka siap pakai untuk konsentrasi keahlian: Tata Boga, TKR, Perhotelan, dan Desain Komunikasi Visual (DKV)."
          />
        </StaggerItem>
        <StaggerItem>
          <FeatureCard
            icon={<ZapIcon className="size-4" />}
            title="Integrasi Belajar.id & Dapodik"
            description="Sinkronisasi data otomatis dengan ekosistem Pusdatin Kemendikbudristek tanpa registrasi manual."
          />
        </StaggerItem>
        <StaggerItem>
          <FeatureCard
            icon={<ShieldCheckIcon className="size-4" />}
            title="Keamanan Enterprise SSO & 2FA"
            description="Enkripsi end-to-end SSL/TLS 256-bit, session lock otomatis, serta verifikasi autentikator cerdas."
          />
        </StaggerItem>
      </StaggerChildren>

      <FadeIn delay={0.4}>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              {["GN", "RA", "SL"].map((initials, i) => (
                <motion.span
                  key={initials}
                  className={`inline-flex h-7 w-7 rounded-full ring-2 ring-white items-center justify-center text-[9px] font-bold text-white ${
                    i === 0
                      ? "bg-indigo-500"
                      : i === 1
                        ? "bg-rose-400"
                        : "bg-teal-500"
                  }`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {initials}
                </motion.span>
              ))}
              <motion.span
                className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-indigo-700 text-white text-[10px] font-bold items-center justify-center"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.66, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                +1k
              </motion.span>
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-800">
                1,842 Siswa &amp; 128 Pendidik
              </span>
              <span className="block text-slate-500 text-[11px]">
                Aktif terhubung di gerbang hari ini
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync</span>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-4 flex items-start gap-4 transition hover:border-indigo-200 hover:shadow-sm"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 leading-snug">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <motion.footer
      className="w-full px-6 lg:px-12 py-5 border-t border-slate-200/70 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <div>
        © 2024 SMK Mataram. All Rights Reserved. Education Management Platform.
      </div>
      <div className="flex items-center gap-4 text-xs font-medium">
        {["Privacy Policy", "Terms of Service", "IT Helpdesk"].map((link) => (
          <a key={link} href="#" className="hover:text-slate-800 transition">
            {link}
          </a>
        ))}
      </div>
    </motion.footer>
  );
}

// ─── Icon imports (local, to keep the server component tidy) ──────────────

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
