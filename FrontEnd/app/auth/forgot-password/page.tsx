import { AuthHero, AuthShell, type AuthHeroFeature } from "@/components/auth/auth-shell";
import { GraduationCapIcon, MailIcon, ShieldCheckIcon, SyncIcon } from "@/components/auth/auth-icons";
import { ForgotPasswordForm } from "./forgot-password-form";

const HERO_FEATURES: AuthHeroFeature[] = [
  {
    icon: <MailIcon className="size-4" />,
    title: "Tautan Dikirim ke Email",
    description:
      "Kami mengirim tautan pembuatan kata sandi ke email terdaftar, bukan mengirim kata sandi itu sendiri.",
    footer: "Token 1 Jam",
  },
  {
    icon: <ShieldCheckIcon className="size-4" />,
    title: "Tidak Membocorkan Data",
    description:
      "Halaman ini selalu memberi jawaban yang sama, sehingga status pendaftaran sebuah akun tetap rahasia.",
    footer: "Anti Enumerasi",
  },
  {
    icon: <SyncIcon className="size-4" />,
    title: "Sesi Lama Diakhiri",
    description:
      "Setelah kata sandi direset, seluruh sesi lama otomatis berakhir di semua perangkat.",
    footer: "Session Lock",
  },
];

export default function ForgotPasswordPage() {
  return (
    <AuthShell logoIcon={<GraduationCapIcon className="text-lg" />} hero={<Hero />}>
      <ForgotPasswordForm />
    </AuthShell>
  );
}

function Hero() {
  return (
    <AuthHero
      badge="SMK MATARAM • PEMULIHAN AKUN"
      title={
        <>
          Lupa Kata Sandi?
          <span className="block text-indigo-600">Pulihkan Akun SiManis</span>
        </>
      }
      description="Masukkan email atau nomor induk Anda. Bila identitas tersebut terdaftar, kami akan mengirim tautan untuk membuat kata sandi baru."
      features={HERO_FEATURES}
      stat={{
        title: "1,842 Siswa & 128 Pendidik Terdaftar",
        subtitle: "Enkripsi End-to-End SHA-256 Aktif & Terverifikasi",
        chip: "Pemulihan Aman",
        extra: "+1.9k",
      }}
    />
  );
}
