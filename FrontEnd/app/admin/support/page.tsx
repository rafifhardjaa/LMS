"use client";

import { useState } from "react";
import {
  Activity,
  BookOpen,
  Check,
  CircleCheck,
  CircleUserRound,
  Cloud,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Headset,
  Network,
  RefreshCcw,
  Search,
  Send,
  Server,
  ServerCog,
  ShieldCheck,
  ShieldHalf,
  Ticket,
  TicketPlus,
  Wallet,
  Workflow,
  Eraser,
  DatabaseZap,
  History,
} from "lucide-react";

type Status = "Semua" | "Menunggu" | "Proses" | "Selesai";
type Level = "ALL" | "INFO" | "WARN" | "AUDIT" | "ERROR";

const card = "bg-white shadow-[0_4px_18px_rgba(45,61,95,0.035)]";
const softButton =
  "inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[12px] font-bold text-[#2b2d3a] transition-colors hover:bg-[#e6e9ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5dd3]/40";

const tickets = [
  {
    id: "#TK-2026-089",
    priority: "Prioritas Tinggi",
    priorityClass: "bg-[#ffe9e9] text-[#d72d3c]",
    priorityDot: true,
    status: "Sedang Dikerjakan IT",
    statusClass: "bg-[#fff4d6] text-[#b7791f]",
    group: "Proses" as Status,
    time: "15 menit lalu",
    title: "Gagal Sinkronisasi Nilai Rapor Siswa Kelas XII TKJ 1",
    icon: CircleUserRound,
    reporter: "Dr. Pawell S.Kom",
    role: "(Guru Produktif TKJ)",
    meta: "Rombel ID: RPL-XII-01",
    level: "Tinggi",
  },
  {
    id: "#TK-2026-088",
    priority: "Prioritas Sedang",
    priorityClass: "bg-[#eeebff] text-[#5e4dd1]",
    status: "Menunggu Konfirmasi TU",
    statusClass: "bg-[#e9ebef] text-[#4c5060]",
    group: "Menunggu" as Status,
    time: "42 menit lalu",
    title: "Reset Kredensial 2FA Siswa Baru Pindahan",
    icon: GraduationCap,
    reporter: "Sarah Azzahra",
    role: "(Siswa X Desain Komunikasi Visual 2)",
    meta: "NISN: 0089218821",
    level: "Sedang",
  },
  {
    id: "#TK-2026-085",
    priority: "Prioritas Rendah",
    priorityClass: "text-[#4c5060]",
    status: "Selesai",
    statusClass: "bg-[#e8faf2] text-[#00a56a]",
    group: "Selesai" as Status,
    time: "2 jam lalu",
    title: "Permintaan Penambahan Kuota Berkas Bahan Ajar (Max 200MB)",
    icon: CircleUserRound,
    reporter: "Siti Nurhaliza, M.Pd",
    role: "(Guru Bahasa Inggris)",
    meta: "Modul Ajar Multimedia",
    level: "Rendah",
  },
  {
    id: "#TK-2026-082",
    priority: "Prioritas Tinggi",
    priorityClass: "bg-[#ffe9e9] text-[#d72d3c]",
    status: "Selesai",
    statusClass: "bg-[#e8faf2] text-[#00a56a]",
    group: "Selesai" as Status,
    time: "4 jam lalu",
    title: "Verifikasi Gagal Mutasi Pembayaran BSI Virtual Account",
    icon: Wallet,
    reporter: "Bendahara Sekolah",
    role: "(Keuangan)",
    meta: "Kuitansi SPP #9011",
    level: "Tinggi",
  },
];

const logs = [
  { time: "[10:42:15 WITA]", level: "INFO" as Level, source: "[Dapodik-Sync]", text: "Sinkronisasi otomatis rombel Kelas XII TKR 2 berhasil (42 data siswa terverifikasi)." },
  { time: "[10:38:02 WITA]", level: "AUDIT" as Level, source: "[Auth-SSO]", text: "Super Admin Pawell Bennett memperbarui token konfigurasi Pusdatin SAML 2.0." },
  { time: "[10:25:44 WITA]", level: "WARN" as Level, source: "[Storage-S3]", text: "Penggunaan kuota storage mencapai 52.2% (78.4 GB / 150 GB). Rekomendasi arsipkan modul lawas." },
  { time: "[10:14:10 WITA]", level: "INFO" as Level, source: "[Payment-GW]", text: "Callback verifikasi instan Bank NTB Syariah Rp 420.000 (INV-2026-0889) sukses." },
  { time: "[09:58:33 WITA]", level: "INFO" as Level, source: "[BK-Wellness]", text: "Sesi konseling daring terjadwal untuk NISN 0072819284 terkonfirmasi." },
];

const levelStyle: Record<Level, string> = {
  ALL: "bg-[#3a4255] text-white",
  INFO: "bg-[#12345a] text-[#38bdf8]",
  WARN: "bg-[#3b2f12] text-[#facc15]",
  AUDIT: "bg-[#2f2559] text-[#a78bfa]",
  ERROR: "bg-[#3f1c22] text-[#f87171]",
};

function StatCard({
  label,
  icon: Icon,
  children,
  footer,
}: {
  label: string;
  icon: typeof Ticket;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className={`${card} flex flex-col p-6`}>
      <div className="flex items-start justify-between gap-3">
        <p className="max-w-[130px] text-[12px] font-medium leading-4 text-[#3a3c48]">{label}</p>
        <span className="flex size-10 shrink-0 items-center justify-center bg-[#eeebff] text-[#5e4dd1]">
          <Icon className="size-5" />
        </span>
      </div>
      <div className="mt-3 flex-1">{children}</div>
      <div className="mt-4 bg-[#f0f3f8] px-3 py-2.5 text-[11px] leading-[14px] text-[#3a3c48]">{footer}</div>
    </section>
  );
}

export default function SupportPage() {
  const [status, setStatus] = useState<Status>("Semua");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("Semua Level");
  const [level, setLevel] = useState<Level>("ALL");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const tabs: { id: Status; count: number }[] = [
    { id: "Semua", count: 14 },
    { id: "Menunggu", count: 3 },
    { id: "Proses", count: 5 },
    { id: "Selesai", count: 11 },
  ];

  const q = query.trim().toLowerCase();
  const visibleTickets = tickets.filter(
    (t) =>
      (status === "Semua" || t.group === status) &&
      (priority === "Semua Level" || t.level === priority) &&
      (!q || `${t.id} ${t.title} ${t.reporter}`.toLowerCase().includes(q)),
  );
  const visibleLogs = logs.filter((l) => level === "ALL" || l.level === level);

  const copyLog = async () => {
    const text = visibleLogs.map((l) => `${l.time} ${l.level} ${l.source} ${l.text}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      window.alert("Log berhasil disalin ke clipboard.");
    } catch {
      window.alert("Gagal menyalin log. Izinkan akses clipboard.");
    }
  };

  return (
    <div className="w-full pt-7 text-[#1d1f2b]">
      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wide">
          <span className="rounded-full bg-[#e9e5ff] px-3 py-1 text-[#4f3eb7]">
            ● PUSAT DUKUNGAN TEKNIS &amp; LOG AUDIT • T.A. 2026/2027 GANJIL • STATUS SERVER NORMAL
          </span>
          <span className="size-1 rounded-full bg-[#727789]" />
          <span className="font-medium text-[#3a3c48]">Node ID: srv-mtr-01.primary</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => window.alert("Berkas log sedang diunduh.")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#eef1f5] px-4 text-[13px] font-semibold text-[#2b2d3a] hover:bg-[#e5e9ef]">
            <Download className="size-4" /> Unduh Berkas Log
          </button>
          <button type="button" onClick={() => window.alert("Laporan diekspor sebagai .xlsx.")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#eef1f5] px-4 text-[13px] font-semibold text-[#2b2d3a] hover:bg-[#e5e9ef]">
            <FileSpreadsheet className="size-4" /> Ekspor Laporan (.xlsx)
          </button>
          <button type="button" onClick={() => window.alert("Form tiket bantuan baru dibuka.")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#6552d4] px-5 text-[14px] font-bold text-white shadow-[0_6px_12px_rgba(93,74,204,0.25)] hover:bg-[#5442c0]">
            <TicketPlus className="size-4" /> + Buat Tiket Bantuan
          </button>
        </div>

        <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-[-1px] text-[#1c1e28] lg:text-[30px]">
          Pusat Bantuan IT &amp; Jejak Log Sistem SiManis
        </h1>
        <div className="mt-1.5 flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <p className="max-w-[800px] text-[13px] leading-[1.55] text-[#57596a]">
            Monitoring tiket gangguan teknis, status konektivitas infrastruktur Dapodik/Cloud, riwayat audit aktivitas administrator &amp; integrasi pelaporan kendala sekolah.
          </p>
          <span className="flex shrink-0 items-center gap-2 text-[10px] font-medium leading-3 text-[#3a3c48]">
            <ShieldCheck className="size-4 text-[#5e4dd1]" />
            Log Audit Terenkripsi
            <br />
            SHA-256
          </span>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Status Tiket Bantuan"
          icon={Ticket}
          footer={
            <div className="flex gap-4">
              <span className="flex items-start gap-1.5"><i className="mt-1 size-1.5 rounded-full bg-[#5e4dd1]" />11<br />Selesai</span>
              <span className="flex items-start gap-1.5 text-[#d72d3c]"><i className="mt-1 size-1.5 rounded-full bg-[#d72d3c]" />3<br />Penanganan</span>
            </div>
          }
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[28px] font-bold leading-none text-[#1c1e28]">14 <span className="text-[13px] font-medium text-[#3a3c48]">Tiket</span></p>
            <span className="rounded-full bg-[#e9e5ff] px-3 py-1 text-[11px] font-bold leading-3 text-[#5e4dd1]">Respon &lt;<br />12m</span>
          </div>
          <p className="mt-2 text-[13px] text-[#3a3c48]">Aktif</p>
        </StatCard>

        <StatCard
          label="Uptime Server & Sistem"
          icon={Server}
          footer={
            <div className="flex justify-between gap-2">
              <span>Latensi<br />Jaringan: <b>24ms</b></span>
              <span className="font-bold text-[#00a56a]">0 Kejadian<br />Fatal</span>
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <p className="text-[28px] font-bold leading-none text-[#1c1e28]">99.98%</p>
            <span className="rounded-full bg-[#e8faf2] px-3 py-1 text-[11px] font-bold leading-3 text-[#00a56a]">30 Hari<br />Stabil</span>
          </div>
        </StatCard>

        <StatCard
          label="Audit Log Hari Ini"
          icon={ShieldHalf}
          footer={
            <div className="flex justify-between gap-2">
              <span>Keamanan:<br /><b className="text-[#00a56a]">Terenkripsi AES</b></span>
              <span>Buffer:<br /><b>0.4 MB/s</b></span>
            </div>
          }
        >
          <div className="flex items-center gap-4">
            <p className="text-[28px] font-bold leading-none text-[#1c1e28]">2,840</p>
            <span className="rounded-full bg-[#e9e5ff] px-2 py-0.5 text-[11px] font-bold text-[#5e4dd1]">+14.2% Vol</span>
          </div>
        </StatCard>

        <StatCard
          label="Konektivitas Integrasi API"
          icon={Network}
          footer={
            <div className="flex items-center justify-between gap-2">
              <span>Dapodik, SSO, S3, WA<br />Gateway</span>
              <CircleCheck className="size-4 shrink-0 text-[#00a56a]" />
            </div>
          }
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[28px] font-bold leading-none text-[#1c1e28]">4 / 4</p>
            <span className="rounded-full bg-[#e8faf2] px-3 py-1 text-[11px] font-bold leading-3 text-[#00a56a]">100%<br />Online</span>
          </div>
          <p className="mt-2 text-[13px] text-[#3a3c48]">Layanan</p>
        </StatCard>
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.27fr_1fr]">
        {/* Left column */}
        <div className="min-w-0 space-y-6">
          <section className={`${card} p-6`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h2 className="max-w-[220px] text-[18px] font-bold leading-[1.4] tracking-[-0.4px] text-[#1d1f2b]">Tiket Gangguan &amp; Permintaan Bantuan</h2>
                <p className="mt-1 max-w-[240px] text-[11px] leading-[14px] text-[#3a3c48]">Permintaan dari Guru, Siswa, dan Tenaga Kependidikan SMK Mataram</p>
              </div>
              <div role="tablist" aria-label="Filter status tiket" className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-[#f0f3f8] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:max-w-[245px]">
                {tabs.map(({ id, count }) => {
                  const active = status === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setStatus(id)}
                      className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold leading-4 transition-colors ${active ? "bg-[#6552d4] text-white" : "text-[#3a3c48] hover:bg-white"}`}
                    >
                      {id}
                      <br />({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 rounded-[28px] bg-[#f0f3f8] p-1.5 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#787584]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Cari tiket"
                  placeholder="Cari ID tiket, pelapor, atau masalah..."
                  className="h-9 w-full rounded-full bg-white pl-9 pr-3 text-[13px] text-[#252738] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/40"
                />
              </label>
              <label className="flex items-center gap-2 pl-2 text-[12px] text-[#3a3c48]">
                Prioritas:
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  aria-label="Filter prioritas"
                  className="h-9 w-[148px] rounded-full bg-white px-4 text-[13px] font-medium text-[#252738] outline-none focus:ring-2 focus:ring-[#6c5dd3]/40"
                >
                  <option>Semua Level</option>
                  <option>Tinggi</option>
                  <option>Sedang</option>
                  <option>Rendah</option>
                </select>
              </label>
            </div>

            <div className="mt-5 space-y-4">
              {visibleTickets.length === 0 && (
                <p className="bg-[#f0f3f8] p-6 text-center text-[13px] text-[#57596a]">Tidak ada tiket yang cocok dengan filter.</p>
              )}
              {visibleTickets.map((t, i) => {
                const Icon = t.icon;
                return (
                  <article key={t.id} className="bg-[#f0f3f8] p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#e9e5ff] px-2.5 py-0.5 text-[11px] font-bold text-[#3c2c9e]">{t.id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.priorityClass}`}>
                        {t.priorityDot && "● "}
                        {t.priority}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.statusClass}`}>{t.status}</span>
                      <span className="ml-auto text-[11px] text-[#3a3c48]">{t.time}</span>
                    </div>
                    <h3 className="mt-3 text-[14px] font-bold text-[#1d1f2b]">{t.title}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#3a3c48]">
                      <Icon className="size-3.5 text-[#57596a]" />
                      Pelapor: <b className="text-[#1d1f2b]">{t.reporter}</b> {t.role}
                      <span className="mx-1 size-1 rounded-full bg-[#57596a]" />
                      {t.meta}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      {i === 0 && (
                        <>
                          <span className="flex items-center gap-2 text-[11px] text-[#3a3c48]">
                            <span className="flex size-6 items-center justify-center rounded-full bg-[#6552d4] text-[10px] font-bold text-white">IT</span>
                            Ditugaskan: Dimas Prasetya (NOC L2)
                          </span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => window.alert(`Balas tiket ${t.id}.`)} className={softButton}>Balas Tiket</button>
                            <button type="button" onClick={() => window.alert(`Tugaskan teknisi untuk ${t.id}.`)} className="inline-flex h-9 items-center rounded-full bg-[#6552d4] px-3 text-[12px] font-bold text-white hover:bg-[#5442c0]">Tugaskan Teknisi</button>
                          </div>
                        </>
                      )}
                      {i === 1 && (
                        <>
                          <span className="flex items-center gap-1.5 text-[11px] text-[#3a3c48]">
                            <History className="size-3.5" /> Verifikasi data wali diperlukan
                          </span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => window.alert(`Balas tiket ${t.id}.`)} className={softButton}>Balas Tiket</button>
                            <button type="button" onClick={() => window.alert("OTP baru dikirim ke siswa.")} className={softButton}>Kirim OTP Baru</button>
                          </div>
                        </>
                      )}
                      {i >= 2 && (
                        <>
                          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#00a56a]">
                            <Check className="size-3.5" />
                            {t.id === "#TK-2026-085" ? "Kuota ditingkatkan menjadi 250MB via Cloud S3" : "Webhook perbankan tersinkron ulang otomatis"}
                          </span>
                          <button
                            type="button"
                            onClick={() => window.alert(t.id === "#TK-2026-085" ? `Tiket ${t.id} ditutup.` : `Detail audit ${t.id} dibuka.`)}
                            className="inline-flex h-8 items-center rounded-full bg-[#e6e9ef] px-3 text-[12px] font-semibold text-[#2b2d3a] hover:bg-[#dde1e8]"
                          >
                            {t.id === "#TK-2026-085" ? "Tutup Tiket" : "Detail Audit"}
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Syslog terminal */}
          <section className="bg-[#111827] p-6 font-mono text-[#e5e7eb] shadow-[0_8px_24px_rgba(17,24,39,0.18)]">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5" aria-hidden>
                <i className="size-3 rounded-full bg-[#ef4444]" />
                <i className="size-3 rounded-full bg-[#f59e0b]" />
                <i className="size-3 rounded-full bg-[#22c55e]" />
              </span>
              <span className="text-[12px] font-bold text-[#cbd5e1]">syslog://simanis-pro.audit.stream</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 font-sans">
              <button
                type="button"
                aria-pressed={autoRefresh}
                onClick={() => setAutoRefresh((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${autoRefresh ? "bg-[#0f3b2e] text-[#34d399]" : "bg-[#1f2937] text-[#94a3b8]"}`}
              >
                <i className={`size-1.5 rounded-full ${autoRefresh ? "bg-[#34d399]" : "bg-[#94a3b8]"}`} />
                Auto-Refresh {autoRefresh ? "ON" : "OFF"}
              </button>
              <button type="button" onClick={copyLog} className="inline-flex items-center gap-1.5 rounded-full bg-[#1f2937] px-2.5 py-1 text-[11px] font-semibold text-[#e5e7eb] hover:bg-[#283447]">
                <Copy className="size-3" /> Salin Log
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] tracking-wider">
              <span className="text-[#64748b]">LEVEL FILTER:</span>
              {(["ALL", "INFO", "WARN", "AUDIT", "ERROR"] as Level[]).map((l) => {
                const count = l === "ALL" ? null : logs.filter((x) => x.level === l).length;
                const active = level === l;
                return (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLevel(l)}
                    className={`rounded-full px-2 py-0.5 font-bold ${levelStyle[l]} ${active ? "ring-1 ring-white/60" : "opacity-90 hover:opacity-100"}`}
                  >
                    {l}
                    {count !== null && ` (${count})`}
                  </button>
                );
              })}
            </div>

            <ul className="mt-5 space-y-5" aria-live={autoRefresh ? "polite" : "off"}>
              {visibleLogs.length === 0 && <li className="text-[12px] text-[#64748b]">Tidak ada entri log untuk level ini.</li>}
              {visibleLogs.map((l) => (
                <li key={l.time} className="flex gap-2 text-[13px] leading-[1.6]">
                  <span className="shrink-0 pt-0.5 font-sans text-[10px] text-[#64748b]">{l.time}</span>
                  <span className={`h-fit shrink-0 rounded px-1.5 font-sans text-[10px] font-bold ${levelStyle[l.level]}`}>{l.level}</span>
                  <span className="shrink-0 text-[#94a3b8]">{l.source}</span>
                  <span className={l.level === "WARN" ? "text-[#facc15]" : "text-[#e5e7eb]"}>{l.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 font-sans text-[10px] text-[#94a3b8]">
              <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-[#34d399]" /> Daemon Logging Aktif (Port: 514 UDP/Syslog)</span>
              <span>Memori Buffer: 1.2 MB / 64 MB</span>
            </div>
          </section>
        </div>

        {/* Right column */}
        <aside className="min-w-0 space-y-6">
          <section className={`${card} p-6`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-bold tracking-[-0.4px] text-[#1d1f2b]">Status Infrastruktur &amp; Node</h2>
                <p className="text-[11px] leading-[14px] text-[#3a3c48]">Pemeriksaan kesehatan sistem SiManis real-time</p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e8faf2] px-3 py-1 text-[11px] font-bold leading-4 text-[#00a56a]">
                <i className="size-1.5 rounded-full bg-[#00a56a]" />
                ALL
                <br />
                HEALTHY
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { icon: Server, name: "Server Web & App Cluster", tag: "100% Normal", left: "Nginx Reverse Proxy • CPU 18%", right: "RAM: 4.2 GB / 16 GB", bar: 26, tagClass: "bg-[#e8faf2] text-[#00a56a]" },
                { icon: Database, name: "Basis Data PostgreSQL 16", tag: "8ms Latensi", left: "Read/Write Replica Aktif", right: "Pool: 48 / 120 Koneksi", bar: 40, tagClass: "bg-[#e8faf2] text-[#00a56a]" },
                { icon: Workflow, name: "Gateway Dapodik Kemendikbud", tag: "200 OK", left: "Sinkronisasi otomatis per 15 menit", right: "Pusdatin SSO Ready", tagClass: "bg-[#e8faf2] text-[#00a56a]" },
                { icon: Send, name: "WA Gateway & Mail Relay", tag: "99.8% Sent", left: "Antrean Notifikasi: 0 pesan", right: "Quota: 18,200 msg/mo", tagClass: "bg-[#e8faf2] text-[#00a56a]" },
                { icon: Cloud, name: "Cadangan Otomatis Harian", tag: "02:00 WITA", left: "Snapshot: 1.4 GB aman di S3 Cold Storage", right: "Terverifikasi", rightClass: "font-bold text-[#00a56a]", tagClass: "bg-[#e9e5ff] text-[#5e4dd1]" },
              ].map(({ icon: Icon, name, tag, left, right, bar, tagClass, rightClass }) => (
                <div key={name} className="bg-[#f0f3f8] px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-2 text-[14px] font-semibold text-[#1d1f2b]">
                      <Icon className="size-4 shrink-0 text-[#5e4dd1]" />
                      <span className="truncate">{name}</span>
                    </p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${tagClass}`}>{tag}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-[11px] text-[#3a3c48]">
                    <span>{left}</span>
                    <span className={rightClass ?? "font-semibold text-[#1d1f2b]"}>{right}</span>
                  </div>
                  {bar !== undefined && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#d9deea]" role="progressbar" aria-label={`${name} usage`} aria-valuenow={bar} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-[#5e4dd1]" style={{ width: `${bar}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className={`${card} p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold tracking-[-0.4px] text-[#1d1f2b]">Matriks Eskalasi &amp; Darurat</h2>
              <Headset className="size-5 text-[#5e4dd1]" />
            </div>
            <div className="mt-4 flex items-center gap-3 bg-[#f4f2ff] p-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6552d4] text-[12px] font-bold text-white">NOC</span>
              <div className="min-w-0 text-[11px] leading-[14px] text-[#3a3c48]">
                <p className="text-[12px] font-bold text-[#1d1f2b]">Network Operations Center (NOC)</p>
                <p>Email: noc@smkmataram.sch.id • Hot-line: 0812-3456-7890</p>
                <p className="font-semibold text-[#5e4dd1]">Siaga Operasional 24 Jam / 7 Hari</p>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-[#57596a]">Aksi Cepat Administrator</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { icon: RefreshCcw, label: "Restart Daemon" },
                { icon: Eraser, label: "Flush Redis" },
                { icon: DatabaseZap, label: "Cek DB" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => window.alert(`${label} dijalankan.`)}
                  className="flex min-h-10 items-center justify-center gap-1.5 bg-[#eef1f5] px-2 py-1.5 text-[11px] font-semibold text-[#2b2d3a] hover:bg-[#e2e6ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5dd3]/40"
                >
                  <Icon className="size-3.5 shrink-0 text-[#5e4dd1]" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className={`${card} p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold tracking-[-0.4px] text-[#1d1f2b]">Dokumentasi &amp; Panduan Teknis</h2>
              <BookOpen className="size-5 text-[#57596a]" />
            </div>
            <div className="mt-4 space-y-3">
              {[
                { icon: FileText, iconClass: "bg-[#ffe9e9] text-[#d72d3c]", title: "SOP Penanganan Insiden Server", sub: "Revisi 2.4 • Format PDF (1.8 MB)", action: Download, msg: "SOP diunduh." },
                { icon: ServerCog, iconClass: "bg-[#e9e5ff] text-[#5e4dd1]", title: "Panduan API Integrasi Dapodik v3.2", sub: "Dokumentasi REST & Webhook", action: ExternalLink, msg: "Dokumentasi API dibuka." },
                { icon: Activity, iconClass: "bg-[#e9ebef] text-[#3a3c48]", title: "Prosedur Disaster Recovery (DRP)", sub: "Langkah pemulihan data < 30 Menit", action: Download, msg: "Prosedur DRP diunduh." },
              ].map(({ icon: Icon, iconClass, title, sub, action: Action, msg }) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => window.alert(msg)}
                  className="flex w-full items-center gap-3 bg-[#f0f3f8] p-3 text-left hover:bg-[#e8ebf1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5dd3]/40"
                >
                  <span className={`flex size-8 shrink-0 items-center justify-center ${iconClass}`}>
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold text-[#1d1f2b]">{title}</span>
                    <span className="block text-[11px] text-[#3a3c48]">{sub}</span>
                  </span>
                  <Action className="size-4 shrink-0 text-[#57596a]" />
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
