"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Banknote,
  Building2,
  CalendarDays,
  Cloud,
  DatabaseZap,
  Download,
  Fingerprint,
  History,
  KeyRound,
  Landmark,
  LockKeyhole,
  RefreshCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UsersRound,
} from "lucide-react";

const iconBox = "flex size-10 shrink-0 items-center justify-center rounded-none bg-[#eeebff] text-[#5e4dd1]";
const fieldClass = "h-11 w-full rounded-full border-0 bg-[#f1f4f8] px-4 text-[13px] font-medium text-[#252738] outline-none transition focus:ring-2 focus:ring-[#6c5dd3]/40";

function SettingField({
  label,
  value,
  className = "",
  inputClassName = "",
}: {
  label: string;
  value: string;
  className?: string;
  inputClassName?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium text-[#57596a]">{label}</span>
      <input aria-label={label} className={`${fieldClass} ${inputClassName}`} defaultValue={value} />
    </label>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
  badge,
  tone = "purple",
}: {
  icon: typeof Building2;
  title: string;
  description: string;
  badge?: string;
  tone?: "purple" | "green" | "red" | "slate";
}) {
  const tones = {
    purple: "bg-[#eeebff] text-[#5e4dd1]",
    green: "bg-[#e8faf2] text-[#00a56a]",
    red: "bg-[#fff0ee] text-[#dc3545]",
    slate: "bg-[#eef2f7] text-[#536075]",
  };

  return (
    <div className="flex items-center justify-between gap-3 max-lg:flex-wrap">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`${iconBox} ${tones[tone]}`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[18px] font-bold leading-tight tracking-[-0.4px] text-[#1d1f2b]">{title}</h2>
          <p className="mt-0.5 text-[11px] leading-4 text-[#737588]">{description}</p>
        </div>
      </div>
      {badge && <span className="shrink-0 rounded-full bg-[#e9e5ff] px-3 py-1 text-[10px] font-bold text-[#5e4dd1]">{badge}</span>}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 max-lg:shrink-0 rounded-full p-1 transition-colors ${checked ? "bg-[#6250d2]" : "bg-[#c9cfda]"}`}
    >
      <span className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("identity");
  const [biFast, setBiFast] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "identity", label: "Umum & Identitas Sekolah", icon: Landmark },
    { id: "integration", label: "Integrasi Dapodik & API", icon: DatabaseZap },
    { id: "payment", label: "Payment Gateway & Rekening", icon: Banknote },
    { id: "security", label: "Keamanan & SSO", icon: LockKeyhole },
    { id: "access", label: "Hak Akses & RBAC", icon: UsersRound },
  ];

  const saveAll = () => {
    setSaved(true);
    window.alert("Semua perubahan berhasil disimpan.");
  };

  return (
    <div className="w-full pt-5 text-[#1d1f2b]">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="max-w-[570px]">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wide">
            <span className="rounded-full bg-[#e9e5ff] px-3 py-1 text-[#4f3eb7]">PUSAT PENGATURAN SISTEM</span>
            <span className="size-1 rounded-full bg-[#727789]" />
            <span className="text-[#555968]">T.A. 2026/2027 GANJIL</span>
            <span className="size-1 rounded-full bg-[#727789]" />
            <span className="text-[#00a56a]">● HAK AKSES SUPER ADMIN</span>
          </div>
          <h1 className="mt-3 text-[30px] font-bold leading-[1.16] tracking-[-1px] text-[#1c1e28] sm:text-[32px]">
            Pengaturan &amp; Konfigurasi Sistem
            <br />
            SiManis
          </h1>
          <p className="mt-2 max-w-[535px] text-[13px] leading-[1.55] text-[#57596a]">
            Manajemen identitas sekolah, sinkronisasi API Dapodik &amp; Pusdatin, gateway pembayaran host-to-host,
            konfigurasi SSO SAML 2.0, serta manajemen hak akses &amp; backup basis data SMK Negeri Mataram.
          </p>
        </div>
        <div className="flex max-w-[420px] flex-wrap justify-start gap-2 lg:justify-end">
          <button type="button" onClick={() => window.alert("Cadangan konfigurasi dipulihkan.")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#eef1f5] px-4 text-[13px] font-semibold text-[#555968] hover:bg-[#e5e9ef]">
            <RefreshCcw className="size-4" /> Pulihkan Cadangan
          </button>
          <button type="button" onClick={() => window.alert("Audit konfigurasi diekspor sebagai JSON.")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#eef1f5] px-4 text-[13px] font-semibold text-[#555968] hover:bg-[#e5e9ef]">
            <Download className="size-4" /> Ekspor Audit (.json)
          </button>
          <button type="button" onClick={saveAll} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5d4acc] px-5 text-[13px] font-bold text-white shadow-[0_6px_12px_rgba(93,74,204,0.25)] hover:bg-[#4e3db9]">
            <Save className="size-4" /> Simpan Semua Perubahan
          </button>
        </div>
      </header>

      <nav aria-label="Kategori pengaturan" className="mt-7 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[12px] font-semibold transition-colors ${
                isActive ? "bg-[#6552d4] text-white shadow-[0_5px_10px_rgba(101,82,212,0.22)]" : "bg-white text-[#505364] hover:bg-[#eef1f5]"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </nav>

      {saved && <p role="status" className="mt-1 text-[11px] font-semibold text-[#00a56a]">Perubahan lokal tersimpan.</p>}

      <main className="mt-4 grid max-lg:grid-cols-1 items-start gap-6 xl:grid-cols-[1.14fr_0.78fr]">
        <div className="space-y-6">
          <section className="bg-white p-6 shadow-[0_4px_18px_rgba(45,61,95,0.035)]">
            <SectionTitle icon={Building2} title="Profil & Identitas Lembaga" description="Master data legalitas institusi pendidikan resmi" badge="◉ Terakreditasi BAN-SM" />

            <div className="mt-5 flex flex-col gap-4 bg-[#f0f3f8] p-4">
              <div className="flex items-center gap-4 max-lg:flex-wrap">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-4 border-[#d3b86c] bg-[#162d69] text-[8px] font-black tracking-wide text-[#e3ce90]">SMK<br />MATARAM</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-[#282a37]">Logo Instansi Resmi <span className="ml-1 rounded-full bg-[#e9e5ff] px-2 py-0.5 text-[10px] text-[#5744c5]">PNG / SVG</span></p>
                  <p className="mt-0.5 text-[11px] leading-4 text-[#5d6070]">Format 512×512px disarankan, latar transparan (Maks. 2MB).</p>
                </div>
                <button type="button" onClick={() => window.alert("Pilih file logo institusi.")} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-4 max-lg:w-full max-lg:justify-center text-[12px] font-bold text-[#2b2d3a] hover:bg-[#e8ebf0]">
                  <Upload className="size-4" /> Ganti Logo
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <SettingField label="Nama Resmi Sekolah" value="SMK Negeri Mataram" />
              <div className="relative">
                <SettingField label="NPSN (Nomor Pokok Sekolah Nasional)" value="50201234" />
                <span className="absolute bottom-3 right-4 rounded-full bg-[#e8faf2] px-2 py-0.5 text-[10px] font-bold text-[#00a56a]">Terverifikasi</span>
              </div>
              <SettingField label="Status Akreditasi" value="A (Unggul) • Nilai 96.8" />
              <div className="relative">
                <SettingField label="Predikat Lembaga" value="SMK PK – Skema Pusat Keunggulan" inputClassName="pl-9" />
                <BadgeCheck className="pointer-events-none absolute bottom-3.5 left-3.5 size-4 text-[#6756ce]" />
              </div>
              <SettingField label="Alamat Kampus Utama" value="Jl. Pendidikan No. 44, Dasan Agung, Kec. Selaparang, Kota Mataram, NTB 83125" className="sm:col-span-2" />
              <SettingField label="Surel Resmi Instansi" value="admin@smkmataram.sch.id" />
              <SettingField label="No. Telepon Sekretariat TU" value="(0370) 632198 • Ext. 102" />
              <SettingField label="Kepala Sekolah Penandatangan" value="Dr. H. M. Zulkifli, M.Pd" />
              <SettingField label="NIP Kepala Sekolah" value="19740512 199903 1 004" />
              <div className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-medium text-[#57596a]">Domain LMS &amp; Gerbang Sub-Domain SSO</span>
                <div className="flex gap-2">
                  <input aria-label="Domain LMS dan gerbang SSO" className={`${fieldClass} min-w-0 flex-1 font-mono text-[12px] text-[#5744c5]`} defaultValue="https://lms.smkmataram.sch.id" />
                  <button type="button" onClick={() => window.alert("DNS domain berhasil diperiksa.")} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#eef1f5] px-4 text-[12px] font-bold text-[#30323e] hover:bg-[#e4e8ee]">
                    <SlidersHorizontal className="size-4" /> Cek DNS
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 shadow-[0_4px_18px_rgba(45,61,95,0.035)]">
            <SectionTitle icon={CalendarDays} title="Kalender & Kebijakan Akademik" description="Penentuan semester, parameter KKM, dan kurikulum aktif" badge="AKTIF BERJALAN" />
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <SettingField label="Tahun Ajaran Aktif" value="2026/2027 Ganjil" />
              <SettingField label="Batas Waktu Pengisian Nilai" value="20 Des 2026" />
              <SettingField label="Batas Minimum KKM / KKTP" value="75.00                 SKOR" />
            </div>
            <div className="mt-5 flex items-center gap-3 bg-[#f0f3f8] p-4 max-lg:flex-wrap">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6552d4] text-white"><ShieldCheck className="size-5" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold leading-4 text-[#2a2c38]">Kurikulum Merdeka 2026/2027 (Terverifikasi BSKAP)</p>
                <p className="text-[11px] text-[#5f6271]">Modul ajar berbasis P5 &amp; Capaian Pembelajaran V4.2</p>
              </div>
              <span className="rounded-xl bg-[#e8faf2] px-3 py-2 text-[10px] font-bold text-[#00a56a]">Terkunci &amp; Sesuai<br />Regulasi</span>
            </div>
          </section>

          <section className="bg-white p-6 shadow-[0_4px_18px_rgba(45,61,95,0.035)]">
            <SectionTitle icon={Banknote} title="Parameter Pembayaran & Gateway" description="Sinkronisasi Virtual Account & mutasi bank host-to-host" badge="2 Gateway Aktif" tone="slate" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["BSI", "BSI Virtual Account", "Prefix: 90021-SMK", "Latensi: 142ms"],
                ["NTB", "Bank NTB Syariah", "Host-to-Host Korporat", "Latensi: 98ms"],
              ].map(([initial, title, sub, latency]) => (
                <div key={title} className="bg-[#f0f3f8] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#5e4dd1]">{initial}</span>
                    <div className="min-w-0 flex-1"><p className="text-[12px] font-bold text-[#2a2c38]">{title}</p><p className="text-[10px] text-[#626575]">{sub}</p></div>
                    <span className="mt-1 size-2 rounded-full bg-[#00a56a]" />
                  </div>
                  <div className="mt-4 flex justify-between text-[10px]"><span className="text-[#555968]">{latency}</span><span className="font-bold text-[#5e4dd1]">Tersambung (Prod)</span></div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-full bg-[#f0f3f8] px-4 py-3 max-lg:rounded-2xl">
                <DatabaseZap className="size-5 text-[#5e4dd1]" />
                <div className="min-w-0 flex-1"><p className="text-[12px] font-bold text-[#2a2c38]">Auto-verifikasi Mutasi BI-FAST (Interval 3 Detik)</p><p className="text-[10px] text-[#626575]">Tandai otomatis lunas SPP &amp; DPP seketika tanpa rekap manual</p></div>
                <Toggle checked={biFast} onChange={() => setBiFast((v) => !v)} label="Auto-verifikasi mutasi BI-FAST" />
              </div>
              <div className="flex items-center gap-3 rounded-full bg-[#f0f3f8] px-4 py-3 max-lg:rounded-2xl">
                <History className="size-5 text-[#5e4dd1]" />
                <div className="min-w-0 flex-1"><p className="text-[12px] font-bold text-[#2a2c38]">Notifikasi WhatsApp Tagihan Otomatis</p><p className="text-[10px] text-[#626575]">Kirim pengingat tagihan ke wali murid H-3 tanggal jatuh tempo</p></div>
                <Toggle checked={whatsapp} onChange={() => setWhatsapp((v) => !v)} label="Notifikasi WhatsApp tagihan otomatis" />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-white p-6 shadow-[0_4px_18px_rgba(45,61,95,0.035)]">
            <SectionTitle icon={DatabaseZap} title="Koneksi Eksternal & API" description="Layanan data Kemendikbudristek & Cloud Storage" tone="green" />
            <div className="mt-5 bg-[#f0f3f8] p-4">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-[#30323e]"><span className="size-2 rounded-full bg-[#00a56a]" /> Dapodik Kemendikbudristek <span className="text-[10px] text-[#00a56a]">API v3.2 Terkoneksi</span></div>
              <p className="mt-3 text-[11px] leading-4 text-[#565968]">Sinkronisasi data PTK, Rombel, &amp; Biodata Siswa terjadwal otomatis setiap 15 menit. Sinkronisasi terakhir: 4 menit yang lalu.</p>
              <div className="mt-4 flex items-center gap-3 max-lg:flex-wrap"><button type="button" onClick={() => window.alert("Sinkronisasi Dapodik dijalankan.")} className="inline-flex h-9 items-center gap-2 rounded-full bg-[#5d4acc] px-4 text-[11px] font-bold text-white"><RefreshCcw className="size-3.5" /> Sinkron Paksa Sekarang</button><span className="text-[10px] text-[#676a78]">HTTP 200 OK • 1,248 Siswa</span></div>
            </div>
            <div className="mt-4 flex items-center gap-3 bg-[#f0f3f8] p-4"><KeyRound className="size-5 text-[#5e4dd1]" /><div className="flex-1"><p className="text-[12px] font-bold text-[#30323e]">Pusdatin SSO Service</p><p className="text-[10px] text-[#626575]">SAML 2.0 • Sertifikat SHA-256 Valid</p></div><span className="text-[10px] font-bold text-[#00a56a]">Aktif &amp;<br />Terlindungi</span></div>
            <div className="mt-4 bg-[#f0f3f8] p-4"><div className="flex items-center gap-3"><Cloud className="size-5 text-[#5e4dd1]" /><div className="flex-1"><p className="text-[12px] font-bold text-[#30323e]">Penyimpanan Cadangan AWS S3</p><p className="text-[10px] text-[#626575]">78.4 GB / 150 GB</p></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d9deea]"><div className="h-full w-[52%] rounded-full bg-[#5e4dd1]" /></div><p className="mt-3 text-[10px] text-[#626575]">Auto-backup berkala: Setiap 02:00 WITA <span className="float-right font-bold text-[#5e4dd1]">Tersisa 71.6 GB</span></p></div>
          </section>

          <section className="bg-white p-6 shadow-[0_4px_18px_rgba(45,61,95,0.035)]">
            <SectionTitle icon={ShieldCheck} title="Keamanan & Autentikasi" description="Protokol proteksi akses administrator konsol" badge="Tier 1 Hardened" tone="red" />
            <div className="mt-5 space-y-3">
              {[
                [Fingerprint, "Wajib 2FA (Google Authenticator)", "Terkunci Aktif", "green"],
                [History, "Auto-Logout Tidak Aktif", "30 Menit", "slate"],
                [UsersRound, "IP Whitelist Console", "192.168.10.0/24", "purple"],
              ].map(([Icon, label, value, color]) => (
                <div key={label as string} className="flex items-center gap-3 rounded-full bg-[#f0f3f8] px-4 py-3 max-lg:rounded-2xl">
                  <Icon className="size-5 text-[#5c6171]" />
                  <span className="min-w-0 flex-1 text-[12px] font-semibold text-[#343641]">{label as string}</span>
                  <span className={`text-right text-[10px] font-bold ${color === "green" ? "text-[#00a56a]" : color === "purple" ? "rounded-full bg-[#e9e5ff] px-2 py-1 text-[#5e4dd1]" : "text-[#30323e]"}`}>{value as string}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 shadow-[0_4px_18px_rgba(45,61,95,0.035)]">
            <SectionTitle icon={UsersRound} title="Matriks Hak Akses (RBAC)" description="Distribusi peran pengelola sistem sekolah" tone="purple" />
            <button type="button" onClick={() => window.alert("Detail matriks hak akses dibuka.")} className="float-right -mt-8 max-lg:float-none max-lg:mt-3 max-lg:block text-[11px] font-bold text-[#5e4dd1]">Detail ›</button>
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-[1.4fr_0.55fr_0.8fr] gap-2 text-[10px] font-bold text-[#767988]"><span>PERAN / HAK AKSES</span><span>AKUN AKTIF</span><span>TINGKAT IZIN</span></div>
              {[
                ["Super Admin", "2 Akun", "Akses Penuh", "bg-[#ffe5e6] text-[#bd1d2e]", "bg-[#5e4dd1]"],
                ["Tim Kurikulum & Waka", "4 Akun", "Kelola Mapel/Nilai", "bg-[#eeebff] text-[#5744c5]", "bg-[#5e4dd1]"],
                ["Bendahara & Staf TU", "3 Akun", "Modul Keuangan", "bg-[#e8faf2] text-[#009d65]", "bg-[#00a56a]"],
                ["Guru Pengampu / Wali Kelas", "35 Akun", "Input Nilai & RPP", "bg-[#eceef2] text-[#545866]", "bg-[#6b7280]"],
              ].map(([role, accounts, permission, badge, dot]) => (
                <div key={role} className="grid grid-cols-[1.4fr_0.55fr_0.8fr] items-center gap-2 text-[12px]"><span className="flex items-center gap-2 font-semibold text-[#31333f]"><i className={`size-2 rounded-full ${dot}`} />{role}</span><span className="text-[#6f7280]">{accounts}</span><span className={`justify-self-start rounded-full px-2 py-1 text-[10px] font-bold ${badge}`}>{permission}</span></div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 shadow-[0_4px_18px_rgba(45,61,95,0.035)]">
            <SectionTitle icon={History} title="Jejak Audit Konfigurasi" description="Catatan log aktivitas & parameter terkini" tone="slate" />
            <div className="mt-5 space-y-2">
              {[
                ["PW", "Pawell Bennett (Super Admin)", "Memperbarui parameter interval auto-sync Dapodik dari 30 menit menjadi 15 menit.", "10 menit lalu", "bg-[#5e4dd1]"],
                ["SYS", "Automated Security Daemon", "Pembaruan otomatis sertifikat SSL wildcard *.smkmataram.sch.id via Let’s Encrypt.", "Kemarin, 23:40 WITA", "bg-[#6659c9]"],
                ["ZK", "Dr. Zulkifli (Kepsek)", "Persetujuan regulasi KKTP Standar Konsentrasi Keahlian Rekayasa Perangkat Lunak ke 75.00.", "3 hari lalu", "bg-[#4e566c]"],
              ].map(([initials, name, action, time, color]) => (
                <div key={name} className="flex gap-3 bg-[#f0f3f8] p-3"><span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${color}`}>{initials}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-[11px] font-bold text-[#343641]">{name}</p><span className="shrink-0 text-[10px] text-[#777a89]">{time}</span></div><p className="mt-0.5 text-[10px] leading-[1.35] text-[#666978]">{action}</p></div></div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
