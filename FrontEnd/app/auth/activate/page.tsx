import { AuthHero, AuthShell, type AuthHeroFeature } from "@/components/auth/auth-shell";
import { GraduationCapIcon, MailIcon, PhoneLockIcon, ShieldCheckIcon } from "@/components/auth/auth-icons";
import { ActivateForm } from "./activate-form";

const HERO_FEATURES: AuthHeroFeature[] = [
  {
    icon: <MailIcon className="size-4" />,
    title: "Tautan Sekali Pakai",
    description:
      "Tautan aktivasi dikirim ke email terdaftar dan hanya berlaku 24 jam sejak registrasi.",
    footer: "Berlaku 24 Jam",
  },
  {
    icon: <ShieldCheckIcon className="size-4" />,
    title: "Kata Sandi Buatan Anda",
    description:
      "Password tidak dikirim lewat email. Anda sendiri yang menentukannya pada halaman ini.",
    footer: "NIST 800-63B",
  },
  {
    icon: <PhoneLockIcon className="size-4" />,
    title: "Kredensial Terlindungi",
    description:
      "Setiap perubahan kata sandi otomatis mengakhiri sesi lama pada seluruh perangkat.",
    footer: "Session Lock",
  },
];

export default async function ActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell logoIcon={<GraduationCapIcon className="text-lg" />} hero={<Hero />}>
      <ActivateForm token={token ?? ""} />
    </AuthShell>
  );
}

function Hero() {
  return (
    <AuthHero
      badge="SMK MATARAM • AKTIVASI"
      title={
        <>
          Aktivasi Akun
          <span className="block text-indigo-600">Siswa SiManis</span>
        </>
      }
      description="Buat kata sandi untuk akun yang baru Anda daftarkan. Setelah aktif, akun langsung dapat dipakai masuk ke seluruh layanan SiManis SMK Mataram."
      features={HERO_FEATURES}
      stat={{
        title: "1,842 Siswa & 128 Pendidik Terdaftar",
        subtitle: "Enkripsi End-to-End SHA-256 Aktif & Terverifikasi",
        chip: "Aktivasi Aman",
        extra: "+1.9k",
      }}
    />
  );
}
