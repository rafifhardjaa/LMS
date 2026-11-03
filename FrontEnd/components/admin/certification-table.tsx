"use client";

import { type ReactNode, useMemo, useState } from "react";
import { BellRing, CheckCircle2, ChevronLeft, ChevronRight, ChevronRight as ArrowRight, Clock3, Download, FileBadge2, Filter, LayoutGrid, Printer, RefreshCw, Rows3, Search, ShieldCheck, TimerReset } from "lucide-react";

type Status = "Kompeten" | "Sertifikat Terbit" | "Proses Asesmen" | "Belum Kompeten";
type Asesi = { id: string; name: string; nisn: string; kelas: string; skema: string; kode: string; asesor: string; tgl: string; status: Status; initials: string; tone: string; keahlian: "TKJ" | "DKV" | "TKR" | "Boga" };

const statusStyle: Record<Status, { pill: string; icon: typeof CheckCircle2 }> = {
  "Kompeten": { pill: "bg-[#d1fae5] text-[#047857]", icon: CheckCircle2 },
  "Sertifikat Terbit": { pill: "bg-[#f0edff] text-[#6c5dd3]", icon: FileBadge2 },
  "Proses Asesmen": { pill: "bg-[#dbeafe] text-[#2563eb]", icon: RefreshCw },
  "Belum Kompeten": { pill: "bg-[#fef3c7] text-[#b45309]", icon: TimerReset },
};

const asesi: Asesi[] = [
  { id: "0072918821", name: "Pawell Bennett", nisn: "NISN 0072918821", kelas: "XII TKJ 1", skema: "Junior Network Admin", kode: "SKM/TKJ/2026/012", asesor: "Dr. Pawell S.Kom", tgl: "14 Okt 2026", status: "Kompeten", initials: "PB", tone: "bg-[#6c5dd3] text-white", keahlian: "TKJ" },
  { id: "0081293341", name: "Sarah Azzahra", nisn: "NISN 0081293341", kelas: "XII DKV 1", skema: "Junior Graphic Designer", kode: "SKM/DKV/2026/045", asesor: "Arya Wiguna M.Cs", tgl: "15 Okt 2026", status: "Sertifikat Terbit", initials: "SA", tone: "bg-[#a39afd] text-[#181c20]", keahlian: "DKV" },
  { id: "0079942103", name: "Danu Ramadhan", nisn: "NISN 0079942103", kelas: "XII TKR 2", skema: "Pemeliharaan Kendaraan Ringan", kode: "SKM/TKR/2026/089", asesor: "Drs. Bambang Sutrisno", tgl: "17 Okt 2026", status: "Proses Asesmen", initials: "DR", tone: "bg-[#eceef3] text-[#4e566c]", keahlian: "TKR" },
  { id: "0084511209", name: "Lisa Hilton", nisn: "NISN 0084511209", kelas: "X Tata Boga 1", skema: "Commercial Cookery Basic", kode: "SKM/BGA/2026/021", asesor: "Dewa Ayu Citra S.Pd", tgl: "18 Okt 2026", status: "Kompeten", initials: "LH", tone: "bg-[#10b981] text-white", keahlian: "Boga" },
  { id: "0076721099", name: "Jim Anderson", nisn: "NISN 0076721099", kelas: "XI TKR 1", skema: "Sistem Kelistrikan Otomotif", kode: "SKM/TKR/2026/092", asesor: "Drs. Bambang Sutrisno", tgl: "12 Okt 2026", status: "Belum Kompeten", initials: "JA", tone: "bg-[#f97316] text-white", keahlian: "TKR" },
  { id: "0081293941", name: "M. Syafi' Firdaus", nisn: "NISN 0081293941", kelas: "XII TKJ 2", skema: "Junior Network Admin", kode: "SKM/TKJ/2026/014", asesor: "Dr. Pawell S.Kom", tgl: "14 Okt 2026", status: "Kompeten", initials: "MS", tone: "bg-[#7c6fe4] text-white", keahlian: "TKJ" },
];
const PAGE_COUNT = 69;
const tabs = ["Semua Asesi (412)", "Skema Kejuruan (8)", "Jadwal Asesmen (14)", "Asesor Penguji (22)", "Verifikasi e-Sertifikat"];

export function CertificationTable({ aside }: { aside: ReactNode }) {
  const [query, setQuery] = useState("");
  const [keahlian, setKeahlian] = useState("Semua Keahlian (TKJ, TKR, Boga, DKV)");
  const [status, setStatus] = useState("Semua Status Kelulusan");
  const [year, setYear] = useState("Tahun Rilis 2026/2027");
  const [tab, setTab] = useState(tabs[0]);
  const [view, setView] = useState<"Tabel" | "Grid">("Tabel");
  const [selected, setSelected] = useState<string[]>([asesi[0].id]);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => asesi.filter((a) => {
    const q = query.trim().toLowerCase();
    return (!q || [a.name, a.nisn, a.skema, a.kode, a.asesor].some((v) => v.toLowerCase().includes(q)))
      && (keahlian.startsWith("Semua") || a.keahlian === keahlian)
      && (status.startsWith("Semua") || a.status === status)
      && (tab === tabs[0] || tab === tabs[1] || tab === tabs[3] || (tab === tabs[2] && a.status === "Proses Asesmen") || (tab === tabs[4] && a.status === "Sertifikat Terbit"));
  }), [query, keahlian, status, tab]);

  const allSelected = rows.length > 0 && rows.every((a) => selected.includes(a.id));
  const reset = () => { setQuery(""); setKeahlian("Semua Keahlian (TKJ, TKR, Boga, DKV)"); setStatus("Semua Status Kelulusan"); setSelected([]); };

  return (
    <>
      <div className="rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex flex-col justify-between gap-4 px-5 py-4 lg:flex-row lg:items-center">
          <div role="tablist" aria-label="Filter asesi LSP" className="flex flex-wrap gap-1.5">
            {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`rounded-full px-3 py-2 text-[10px] font-semibold ${tab === item ? "bg-[#5343b9] text-white shadow-sm" : "bg-[#f1f4f9] text-[#4e566c] hover:bg-[#eceef3]"}`}>{item}</button>)}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex rounded-full bg-[#f1f4f9] p-1">
              {(["Tabel", "Grid"] as const).map((mode) => <button key={mode} type="button" aria-label={`Tampilan ${mode}`} aria-pressed={view === mode} onClick={() => setView(mode)} className={`flex size-8 items-center justify-center rounded-full ${view === mode ? "bg-white text-[#181c20] shadow-sm" : "text-[#4e566c]"}`}>{mode === "Tabel" ? <Rows3 className="size-3.5" /> : <LayoutGrid className="size-3.5" />}</button>)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-[#eef0f5] p-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_1.3fr_1.1fr_1.1fr_auto]">
          <label className="relative"><span className="sr-only">Cari asesi</span><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama siswa, NISN" className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" /></label>
          <label className="sr-only" htmlFor="cert-keahlian">Filter keahlian</label><select id="cert-keahlian" value={keahlian} onChange={(e) => setKeahlian(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Semua Keahlian (TKJ, TKR, Boga, DKV)</option><option>TKJ</option><option>TKR</option><option>Boga</option><option>DKV</option></select>
          <label className="sr-only" htmlFor="cert-status">Filter status kelulusan</label><select id="cert-status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Semua Status Kelulusan</option><option>Kompeten</option><option>Sertifikat Terbit</option><option>Proses Asesmen</option><option>Belum Kompeten</option></select>
          <label className="sr-only" htmlFor="cert-year">Filter tahun</label><select id="cert-year" value={year} onChange={(e) => setYear(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Tahun Rilis 2026/2027</option><option>Tahun Rilis 2025/2026</option></select>
          <button type="button" aria-label="Reset filter" onClick={reset} className="flex size-11 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><Filter className="size-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_294px]">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
            <div className="flex flex-col justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3"><h2 className="max-w-[190px] text-base font-bold leading-5 text-[#181c20]">Daftar Asesi &amp; Rekap<br />Status Uji LSP</h2><span className="rounded-full bg-[#e5deff] px-2 py-1 text-[10px] font-semibold text-[#4331a8]">6<br />Dipilih</span></div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Muat ulang rekap" onClick={() => window.alert("Muat Ulang Rekap Asesi")} className="flex size-9 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><RefreshCw className="size-4" /></button>
                <button type="button" aria-label="Cetak rekap" onClick={() => window.alert("Cetak Rekap Asesi")} className="flex size-9 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><Printer className="size-4" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#f1f4f9] text-[11px] font-semibold text-[#4e566c]"><tr><th className="w-12 py-3 pl-5"><input type="checkbox" aria-label="Pilih semua asesi" checked={allSelected} onChange={() => setSelected(allSelected ? [] : rows.map((a) => a.id))} className="size-4 accent-[#6c5dd3]" /></th><th className="px-3 py-3">SISWA &amp; IDENTITAS</th><th className="px-3 py-3">SKEMA SERTIFIKASI BNSP</th><th className="w-[110px] px-3 py-3">ASESOR<br />PENGUJI</th><th className="px-3 py-3">TGL UJI</th><th className="px-3 py-3">STATUS KELULUSAN</th></tr></thead>
                <tbody className="divide-y divide-[#eceef3]">
                  {rows.map((a) => {
                    const Icon = statusStyle[a.status].icon;
                    return (
                      <tr key={a.id} className={selected.includes(a.id) ? "bg-[#f8f6ff]" : "hover:bg-[#fbfcfd]"}>
                        <td className="py-6 pl-5"><input type="checkbox" aria-label={`Pilih ${a.name}`} checked={selected.includes(a.id)} onChange={() => setSelected((prev) => prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id])} className="size-4 accent-[#6c5dd3]" /></td>
                        <td className="px-3 py-6"><div className="flex items-center gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${a.tone}`}>{a.initials}</span><div className="min-w-0"><p className="text-xs font-semibold text-[#181c20]">{a.name}</p><p className="mt-0.5 text-[10px] text-[#787584]">{a.nisn} • {a.kelas}</p></div></div></td>
                        <td className="px-3 py-6"><p className="text-[11px] font-semibold text-[#4331a8]">{a.skema}</p><p className="mt-0.5 text-[10px] text-[#787584]">{a.kode}</p></td>
                        <td className="px-3 py-6"><div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#6c5dd3]" /><p className="text-[11px] font-semibold leading-4 text-[#181c20]">{a.asesor}</p></div></td>
                        <td className="px-3 py-6 text-[11px] font-medium text-[#4e566c]">{a.tgl}</td>
                        <td className="px-3 py-6"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusStyle[a.status].pill}`}><Icon className="size-3.5" /> {a.status}</span></td>
                      </tr>
                    );
                  })}
                  {!rows.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-[#787584]">Tidak ada asesi yang cocok dengan filter.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 bg-[#f8f9fc] px-5 py-3 text-[11px] text-[#4e566c] sm:flex-row sm:items-center sm:justify-between">
              <span>Menampilkan <b className="text-[#181c20]">1 – {rows.length} dari 412</b><br />Asesi Terdaftar</span>
              <nav aria-label="Paginasi asesi" className="flex items-center gap-1"><button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] disabled:opacity-40"><ChevronLeft className="size-4" /></button>{[1, 2, 3].map((n) => <button key={n} type="button" aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#5343b9] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{n}</button>)}<span className="px-1">…</span><button type="button" onClick={() => setPage(PAGE_COUNT)} className="size-8 rounded-full text-[#181c20]">{PAGE_COUNT}</button><button type="button" aria-label="Halaman berikutnya" disabled={page >= PAGE_COUNT} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] disabled:opacity-40"><ChevronRight className="size-4" /></button></nav>
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-2xl bg-[#5343b9] px-6 py-5 text-white lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold"><Clock3 className="size-3" /> PENGUMUMAN ASESMEN TAHAP 2</span>
              <h2 className="mt-2 text-base font-bold leading-5">Pemberkasan Portofolio &amp;<br className="hidden sm:block" /> Uji Praktik Gelombang 2</h2>
              <p className="mt-1.5 max-w-[560px] text-[11px] leading-4 text-white/80">Siswa yang dinyatakan lolos seleksi awal wajib mengunggah portofolio karya, fotokopi ijazah, dan formulir APL-01 paling lambat 3 hari sebelum jadwal uji praktik di laboratorium komputer jaringan.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => window.alert("Unduh Skema Persyaratan (.pdf)")} className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#4331a8] hover:bg-[#e5deff]"><Download className="size-3.5" /> Unduh Skema Persyaratan (.pdf)</button>
                <button type="button" onClick={() => window.alert("Kirim Notifikasi Reminder")} className="inline-flex h-9 items-center gap-2 rounded-full border border-white/40 px-4 text-xs font-semibold text-white hover:bg-white/10"><BellRing className="size-3.5" /> Kirim Notifikasi Reminder</button>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white/15 px-5 py-4">
              <Clock3 className="size-8 text-white/80" />
              <div><p className="text-2xl font-bold leading-6">14 Hari</p><p className="text-[10px] text-white/80">Menuju Pelaksanaan</p></div>
            </div>
          </section>
        </div>
        {aside}
      </div>
    </>
  );
}

export { ArrowRight };
