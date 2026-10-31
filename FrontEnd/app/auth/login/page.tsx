"use client";

import { AuthHero, AuthShell, type AuthHeroFeature } from "@/components/auth/auth-shell";
import { GraduationCapIcon, ShieldCheckIcon, ZapIcon } from "@/components/auth/auth-icons";
import { LoginForm } from "./login-form";

const HERO_FEATURES: AuthHeroFeature[] = [
  {
    icon: <GraduationCapIcon className="size-4" />,
    title: "Akses Kelas & Materi Rombel",
    description:
      "Kurikulum merdeka siap pakai untuk konsentrasi keahlian: Tata Boga, TKR, Perhotelan, dan Desain Komunikasi Visual (DKV).",
  },
  {
    icon: <ZapIcon className="size-4" />,
    title: "Integrasi Belajar.id & Dapodik",
    description:
      "Sinkronisasi data otomatis dengan ekosistem Pusdatin Kemendikbudristek tanpa registrasi manual.",
  },
  {
    icon: <ShieldCheckIcon className="size-4" />,
    title: "Keamanan Enterprise SSO & 2FA",
    description:
      "Enkripsi end-to-end SSL/TLS 256-bit, session lock otomatis, serta verifikasi autentikator cerdas.",
  },
];

export default function LoginPage() {
  return (
    <AuthShell logoIcon={<GraduationCapIcon className="text-lg" />} hero={<Hero />}>
      <LoginForm />
    </AuthShell>
  );
}

function Hero() {
  return (
    <AuthHero
      badge="SMK MATARAM • LMS PORTAL GATEWAY"
      title="Gerbang Masuk Sistem Manajemen Akademis SMK Mataram"
      description="Satu akun Single Sign-On (SSO) untuk seluruh ekosistem: Guru Mapel, Siswa, Guru BK, dan Manajemen Sekolah."
      features={HERO_FEATURES}
      stat={{
        title: "1,842 Siswa & 128 Pendidik",
        subtitle: "Aktif terhubung di gerbang hari ini",
        chip: "Live Sync",
        extra: "+1k",
      }}
    />
  );
}
