import { AuthHero, AuthShell, type AuthHeroFeature } from "@/components/auth/auth-shell";
import { GraduationCapIcon, PhoneLockIcon, ShieldCheckIcon, SyncIcon } from "@/components/auth/auth-icons";
import { ResetPasswordForm } from "./reset-password-form";

const HERO_FEATURES: AuthHeroFeature[] = [
  {
    icon: <ShieldCheckIcon className="size-4" />,
    title: "Standar Kompleksitas",
    description:
      "Minimal 8 karakter kombinasi huruf besar, kecil, angka, dan simbol khusus untuk resistensi brute-force.",
    footer: "NIST 800-63B",
  },
  {
    icon: <SyncIcon className="size-4" />,
    title: "Sinkronisasi SSO",
    description:
      "Satu kredensial tunggal untuk CBT, e-Rapor, Classroom, Lab Cloud, dan Wifi Kampus tanpa login berulang.",
    footer: "OAuth2 & SAML 2.0",
  },
  {
    icon: <PhoneLockIcon className="size-4" />,
    title: "Sesi Lama Berakhir",
    description:
      "Seluruh sesi pada perangkat lain otomatis diakhiri begitu kata sandi baru tersimpan.",
    footer: "Session Lock",
  },
];

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell logoIcon={<GraduationCapIcon className="text-lg" />} hero={<Hero />}>
      <ResetPasswordForm token={token ?? ""} />
    </AuthShell>
  );
}

function Hero() {
  return (
    <AuthHero
      badge="SMK MATARAM • RESET SANDI"
      title={
        <>
          Buat Kata Sandi Baru
          <span className="block text-indigo-600">Akun Terpadu SiManis</span>
        </>
      }
      description="Halaman ini hanya dapat dibuka dari tautan resmi yang dikirim ke email Anda. Setelah tersimpan, seluruh sesi lama berakhir dan Anda dapat masuk kembali."
      features={HERO_FEATURES}
      stat={{
        title: "1,842 Siswa & 128 Pendidik Terdaftar",
        subtitle: "Enkripsi End-to-End SHA-256 Aktif & Terverifikasi",
        chip: "Sync Real-Time",
        extra: "+1.9k",
      }}
    />
  );
}
