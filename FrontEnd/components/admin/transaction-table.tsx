"use client";

import { type ReactNode, useMemo, useState } from "react";
import { ArrowLeftRight, ChevronLeft, ChevronRight, Link2, Search, SlidersHorizontal } from "lucide-react";

type Group = "SPP" | "LSP" | "DSP" | "Lab";
type Tx = {
  invoice: string; ref: string; name: string; nisn: string; kelas: string;
  initials: string; tone: string; kategori: string; group: Group;
  nominal: string; overdue?: boolean; metode: string; channel: "VA" | "QRIS" | "Transfer" | "Kasir"; pending?: boolean; waktu: string;
};

const transaksi: Tx[] = [
  { invoice: "INV-2026-0891", ref: "VA: 9898 1040 2219", name: "Pawell Bennett", nisn: "NISN: 007291920", kelas: "XII TKJ 1", initials: "PB", tone: "bg-[#6c5dd3] text-white", kategori: "SPP Okt 2026", group: "SPP", nominal: "Rp 350.000", metode: "BSI VA Auto", channel: "VA", waktu: "Hari ini, 09:42 WITA" },
  { invoice: "INV-2026-0890", ref: "VA: 9898 1040 2235", name: "Sarah Azzahra", nisn: "NISN: 00794018", kelas: "XII DKV 1", initials: "SA", tone: "bg-[#a39afd] text-[#181c20]", kategori: "Uji LSP Desain", group: "LSP", nominal: "Rp 450.000", metode: "QRIS Dinamis", channel: "QRIS", waktu: "Hari ini, 09:28 WITA" },
  { invoice: "INV-2026-0889", ref: "TRF: MNL-4821", name: "Danu Ramadhan", nisn: "NISN: 006839210", kelas: "XII TKJ 2", initials: "DR", tone: "bg-[#eceef3] text-[#4e566c]", kategori: "SPP & Modul", group: "SPP", nominal: "Rp 420.000", metode: "NTB Syariah Trf", channel: "Transfer", waktu: "Hari ini, 08:50 WITA" },
  { invoice: "INV-2026-0888", ref: "VA: 9892 1040 2199", name: "Lisa Hilton", nisn: "NISN: 007310944", kelas: "XII TBG 2", initials: "LH", tone: "bg-[#10b981] text-white", kategori: "Bahan Boga/DSP", group: "DSP", nominal: "Rp 600.000", metode: "BSI VA Auto", channel: "VA", waktu: "Hari ini, 08:15 WITA" },
  { invoice: "INV-2026-0887", ref: "TUNAI-KSR-102", name: "Jim Anderson", nisn: "NISN: 006492110", kelas: "X TO 1", initials: "JA", tone: "bg-[#f97316] text-white", kategori: "SPP & Seragam", group: "SPP", nominal: "Rp 750.000", metode: "Kasir Loket TU", channel: "Kasir", waktu: "Kemarin, 14:20 WITA" },
  { invoice: "INV-2026-0886", ref: "VA: 9892 1040 2105", name: "Rian Mahendra", nisn: "NISN: 007204912", kelas: "XII TKJ 2", initials: "RM", tone: "bg-[#fde2e2] text-[#dc2626]", kategori: "Uji LSP Jaringan", group: "LSP", nominal: "Rp 450.000", overdue: true, metode: "BSI VA (Pending)", channel: "VA", pending: true, waktu: "Jatuh tempo: Hari Ini" },
];

const PAGE_COUNT = 238;
const tabs = ["Semua Transaksi", "SPP Bulanan", "Uji LSP–P1", "DSP / Gedung", "Praktik & Lab"];
const groupByTab: Record<string, Group> = { "SPP Bulanan": "SPP", "Uji LSP–P1": "LSP", "DSP / Gedung": "DSP", "Praktik & Lab": "Lab" };
const dotColor: Record<Tx["channel"], string> = { VA: "bg-[#6c5dd3]", QRIS: "bg-[#10b981]", Transfer: "bg-[#f59e0b]", Kasir: "bg-[#4e566c]" };

export function TransactionTable({ aside }: { aside: ReactNode }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(tabs[0]);
  const [status, setStatus] = useState("Status: Semua");
  const [kanal, setKanal] = useState("Kanal: Semua Metode");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => transaksi.filter((t) => {
    const q = query.trim().toLowerCase();
    return (!q || [t.invoice, t.ref, t.name, t.nisn].some((v) => v.toLowerCase().includes(q)))
      && (tab === tabs[0] || t.group === groupByTab[tab])
      && (status === "Status: Semua" || (status === "Status: Lunas" ? !t.pending : t.pending))
      && (kanal === "Kanal: Semua Metode" || (kanal === "Kanal: Virtual Account" ? t.channel === "VA" : kanal === "Kanal: QRIS" ? t.channel === "QRIS" : kanal === "Kanal: Transfer Bank" ? t.channel === "Transfer" : t.channel === "Kasir"));
  }), [query, tab, status, kanal]);

  return (
    <>
      <div className="rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex flex-col justify-between gap-3 px-5 py-4 lg:flex-row lg:items-center">
          <div role="tablist" aria-label="Filter jenis transaksi" className="flex flex-wrap gap-1.5">
            {tabs.map((item) => (
              <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`rounded-full px-3 py-2 text-[10px] font-semibold ${tab === item ? "bg-[#5343b9] text-white shadow-sm" : "bg-[#f1f4f9] text-[#4e566c] hover:bg-[#eceef3]"}`}>{item}</button>
            ))}
          </div>
          <button type="button" onClick={() => window.alert("Filter Lanjutan Transaksi")} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-xs font-semibold text-[#4e566c] hover:bg-[#e5deff]"><SlidersHorizontal className="size-3.5" /> Filter Lanjutan</button>
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-[#eef0f5] p-3 sm:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr]">
          <label className="relative"><span className="sr-only">Cari transaksi</span><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari invoice INV-2026-..., nama siswa, atau..." className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" /></label>
          <label className="sr-only" htmlFor="tx-status">Filter status</label><select id="tx-status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Status: Semua</option><option>Status: Lunas</option><option>Status: Pending</option></select>
          <label className="sr-only" htmlFor="tx-kanal">Filter kanal</label><select id="tx-kanal" value={kanal} onChange={(e) => setKanal(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Kanal: Semua Metode</option><option>Kanal: Virtual Account</option><option>Kanal: QRIS</option><option>Kanal: Transfer Bank</option><option>Kanal: Kasir Loket TU</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_294px]">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-[#f1f4f9] text-[11px] font-semibold text-[#4e566c]"><tr><th className="py-3 pl-5 pr-3">NO. INVOICE &amp; VA</th><th className="px-3 py-3">SISWA &amp; IDENTITAS</th><th className="px-3 py-3">KATEGORI</th><th className="px-3 py-3">NOMINAL TAGIHAN</th><th className="px-3 py-3">METODE KANAL</th><th className="px-3 py-3 pr-5">WAKTU / TGL</th></tr></thead>
                <tbody className="divide-y divide-[#eceef3]">
                  {rows.map((t) => (
                    <tr key={t.invoice} className="hover:bg-[#fbfcfd]">
                      <td className="py-6 pl-5 pr-3"><p className="text-xs font-bold text-[#181c20]">{t.invoice}</p><p className="mt-0.5 text-[10px] text-[#787584]">{t.ref}</p></td>
                      <td className="px-3 py-6"><div className="flex items-center gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${t.tone}`}>{t.initials}</span><div className="min-w-0"><p className="text-xs font-semibold text-[#181c20]">{t.name}</p><p className="mt-0.5 text-[10px] text-[#787584]">{t.nisn} • {t.kelas}</p></div></div></td>
                      <td className="px-3 py-6"><span className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${t.group === "LSP" ? "bg-[#e5deff] text-[#4331a8]" : "bg-[#eceef3] text-[#4e566c]"}`}>{t.kategori}</span></td>
                      <td className={`px-3 py-6 text-xs font-bold ${t.overdue ? "text-[#dc2626]" : "text-[#181c20]"}`}>{t.nominal}</td>
                      <td className="px-3 py-6"><span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#181c20]"><span className={`size-2 shrink-0 rounded-full ${t.pending ? "bg-[#dc2626]" : dotColor[t.channel]}`} /> {t.metode}</span></td>
                      <td className={`px-3 py-6 pr-5 text-[11px] font-medium ${t.overdue ? "text-[#dc2626]" : "text-[#4e566c]"}`}>{t.waktu}</td>
                    </tr>
                  ))}
                  {!rows.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-[#787584]">Tidak ada transaksi yang cocok dengan filter.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 bg-[#f8f9fc] px-5 py-3 text-[11px] text-[#4e566c] sm:flex-row sm:items-center sm:justify-between">
              <span>Menampilkan <b className="text-[#181c20]">1 – {rows.length} dari 1.428</b><br />transaksi</span>
              <span className="flex items-center gap-1.5 font-semibold text-[#047857]"><span className="size-1.5 rounded-full bg-[#10b981]" /> Sinkronisasi Real-Time</span>
              <nav aria-label="Paginasi transaksi" className="flex items-center gap-1"><button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] disabled:opacity-40"><ChevronLeft className="size-4" /></button>{[1, 2, 3].map((n) => <button key={n} type="button" aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#5343b9] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{n}</button>)}<span className="px-1">…</span><button type="button" onClick={() => setPage(PAGE_COUNT)} className="size-8 rounded-full text-[#181c20]">{PAGE_COUNT}</button><button type="button" aria-label="Halaman berikutnya" disabled={page >= PAGE_COUNT} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] disabled:opacity-40"><ChevronRight className="size-4" /></button></nav>
            </div>
          </section>

          <section className="flex flex-col items-start gap-4 rounded-2xl bg-[#5343b9] px-6 py-5 text-white sm:flex-row sm:items-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15"><Link2 className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold leading-5">Integrasi Host-to-Host Virtual Account Aktif</h2>
              <p className="mt-1 text-[11px] leading-4 text-white/80">Seluruh pembayaran via ATM, Mobile Banking (BSI / Bank NTB / Semua Bank) langsung terverifikasi otomatis dalam 3 detik tanpa upload bukti manual.</p>
            </div>
            <button type="button" onClick={() => window.alert("Cek Audit Log Host-to-Host")} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#4331a8] hover:bg-[#e5deff]"><ArrowLeftRight className="size-3.5" /> Cek Audit Log</button>
          </section>
        </div>
        {aside}
      </div>
    </>
  );
}
