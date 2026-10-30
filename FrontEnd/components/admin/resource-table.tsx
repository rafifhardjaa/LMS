"use client";

import { type ReactNode, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, Download, FileText, FilterX, Image as ImageIcon, LayoutGrid, Rows3, Search, Video } from "lucide-react";

type Resource = { code: string; version: string; draft?: boolean; name: string; detail: string; mapel: string; phase: string; teacher: string; initials: string; nip: string; group: "Kejuruan" | "Umum"; type: "file" | "video" | "image" };

const resources: Resource[] = [
  { code: "MOD-INF-04", version: "v2.4", name: "Algoritma Dijkstra & Relaksasi Graf pada Jaringan", detail: "16 Pertemuan • Jobsheet Lab 03", mapel: "Informatika / TKJ", phase: "Fase F • Kelas XI", teacher: "Dr. Pawell, S.Kom., M.T.", initials: "PW", nip: "NIP. 19880412 201002 1 008", group: "Kejuruan", type: "file" },
  { code: "MOD-TKR-02", version: "v1.9", name: "Pemeliharaan Engine Management System", detail: "Video HD Lab Otomotif • 45 Menit", mapel: "Teknik Otomotif", phase: "Fase F • Kelas XII", teacher: "Drs. Bambang Sutrisno", initials: "BS", nip: "NIP. 19740921 200112 1 002", group: "Kejuruan", type: "video" },
  { code: "MOD-BOG-05", version: "v3.0", name: "Artisan Sourdough & Laminated Dough Viennoiserie", detail: "Resep Formula + Standar HACCP", mapel: "Pastry & Bakery", phase: "Fase F • Kelas XI", teacher: "Dewa Ayu Citra, S.Pd.", initials: "DA", nip: "NIP. 19851104 201012 009", group: "Kejuruan", type: "file" },
  { code: "MOD-DKV-03", version: "v1.2", name: "Prinsip UI/UX Design System & Micro-Interaction", detail: "Asset UI Kit + Figma Community", mapel: "Desain Interaktif DKV", phase: "Fase F • Kelas XI", teacher: "Arya Wiguna, M.Cs.", initials: "AW", nip: "NIP. 19890117 201504 001", group: "Kejuruan", type: "image" },
  { code: "MOD-MAT-01", version: "Draft", draft: true, name: "Kalkulus Terapan & Analisis Vektor Mekanika", detail: "Latihan Soal Uji Mandiri • 8 Bab", mapel: "Matematika Terapan", phase: "Fase E • Kelas X", teacher: "Siti Nurhaliza, M.Pd.", initials: "SN", nip: "NIP. 19820719 200801 2 015", group: "Umum", type: "file" },
  { code: "MOD-FIS-03", version: "v2.1", name: "Termodinamika, Kalorimeter & Hukum Termodinamika", detail: "Panduan Eksperimen Virtual Lab", mapel: "Proyek IPAS", phase: "Fase E • Kelas X", teacher: "Hendro Danuarta, S.Si.", initials: "HD", nip: "NIP. 19870314 201101 008", group: "Umum", type: "file" },
];
const PAGE_COUNT = 24;
const typeIcons = { file: FileText, video: Video, image: ImageIcon };

export function ResourceTable({ aside }: { aside: ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua Kategori (Teori, Lab, Jobsheet, Video)");
  const [concentration, setConcentration] = useState("Semua Konsentrasi Keahlian");
  const [status, setStatus] = useState("Status: Semua");
  const [view, setView] = useState<"Tabel" | "Grid">("Tabel");
  const [tab, setTab] = useState("Semua Modul (142)");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => resources.filter((r) => {
    const q = query.trim().toLowerCase();
    return (!q || [r.name, r.code, r.detail, r.teacher].some((v) => v.toLowerCase().includes(q)))
      && (tab === "Semua Modul (142)" || (tab === "Modul Kejuruan (88)" && r.group === "Kejuruan") || (tab === "Modul Umum (54)" && r.group === "Umum") || (tab.startsWith("Perlu Revisi") && r.draft));
  }), [query, tab]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.code));
  const reset = () => { setQuery(""); setCategory("Semua Kategori (Teori, Lab, Jobsheet, Video)"); setConcentration("Semua Konsentrasi Keahlian"); setStatus("Status: Semua"); setSelected([]); };
  const tabs = ["Semua Modul (142)", "Modul Kejuruan (88)", "Modul Umum (54)", "Perlu Revisi"];

  return (
    <>
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#eef0f5] bg-white p-3 shadow-[0_8px_24px_rgba(32,44,90,0.04)] sm:grid-cols-2 xl:grid-cols-[1.4fr_1.3fr_1.1fr_0.9fr_auto]">
        <label className="relative"><span className="sr-only">Cari modul ajar</span><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul modul, kode bahan ajar, gu..." className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" /></label>
        <label className="sr-only" htmlFor="resource-category">Filter kategori</label><select id="resource-category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Semua Kategori (Teori, Lab, Jobsheet, Video)</option><option>Teori</option><option>Lab</option><option>Jobsheet</option><option>Video</option></select>
        <label className="sr-only" htmlFor="resource-concentration">Filter konsentrasi</label><select id="resource-concentration" value={concentration} onChange={(e) => setConcentration(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Semua Konsentrasi Keahlian</option><option>TKJ</option><option>Boga</option><option>DKV</option><option>TKR</option><option>Umum</option></select>
        <label className="sr-only" htmlFor="resource-status">Filter status</label><select id="resource-status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Status: Semua</option><option>Status: Terverifikasi</option><option>Status: Draft</option></select>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-[#f1f4f9] p-1">
            {(["Tabel", "Grid"] as const).map((mode) => <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)} className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${view === mode ? "bg-white text-[#181c20] shadow-sm" : "text-[#4e566c]"}`}>{mode === "Tabel" ? <Rows3 className="size-3.5" /> : <LayoutGrid className="size-3.5" />}{mode}</button>)}
          </div>
          <button type="button" aria-label="Reset filter" onClick={reset} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><FilterX className="size-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_294px]">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
            <div className="flex flex-col justify-between gap-4 px-5 py-4 lg:flex-row lg:items-center">
              <div role="tablist" aria-label="Filter jenis modul" className="flex flex-wrap gap-1.5">
                {tabs.map((item) => (
                  <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-semibold ${tab === item ? "bg-[#5343b9] text-white shadow-sm" : "bg-[#f1f4f9] text-[#4e566c] hover:bg-[#eceef3]"}`}>{item}{item.startsWith("Perlu Revisi") && <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${tab === item ? "bg-white/20 text-white" : "bg-[#fee2e2] text-[#dc2626]"}`}>4</span>}</button>
                ))}
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-[#047857]"><CheckCircle2 className="size-3.5" /> Sinkron Dapodik • 10m lalu</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-[#f1f4f9] text-[11px] font-semibold text-[#4e566c]"><tr><th className="w-12 py-3 pl-5"><input type="checkbox" aria-label="Pilih semua modul" checked={allSelected} onChange={() => setSelected(allSelected ? [] : rows.map((r) => r.code))} className="size-4 accent-[#6c5dd3]" /></th><th className="px-3 py-3">KODE &amp; JUDUL MODUL</th><th className="w-[110px] px-3 py-3">MAPEL<br />&amp; FASE</th><th className="px-3 py-3">GURU PENYUSUN</th></tr></thead>
                <tbody className="divide-y divide-[#eceef3]">
                  {rows.map((r) => {
                    const Icon = typeIcons[r.type];
                    return (
                      <tr key={r.code} className="hover:bg-[#fbfcfd]">
                        <td className="py-6 pl-5"><input type="checkbox" aria-label={`Pilih ${r.name}`} checked={selected.includes(r.code)} onChange={() => setSelected((prev) => prev.includes(r.code) ? prev.filter((x) => x !== r.code) : [...prev, r.code])} className="size-4 accent-[#6c5dd3]" /></td>
                        <td className="px-3 py-6"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#6c5dd3]"><Icon className="size-4" /></span><div className="min-w-0"><p className="text-[11px] font-semibold text-[#4331a8]">{r.code} <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${r.draft ? "bg-[#eceef3] text-[#4e566c]" : "bg-[#f0edff] text-[#6c5dd3]"}`}>{r.version}</span></p><p className="mt-0.5 truncate text-xs font-semibold text-[#181c20]">{r.name}</p><p className="mt-0.5 text-[10px] text-[#787584]">{r.detail}</p></div></div></td>
                        <td className="px-3 py-6"><p className="text-[11px] font-semibold text-[#181c20]">{r.mapel}</p><p className="mt-1 text-[10px] leading-3.5 text-[#4e566c]">{r.phase}</p></td>
                        <td className="px-3 py-6"><div className="flex items-center gap-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6c5dd3] text-[9px] font-bold text-white">{r.initials}</span><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-[#181c20]">{r.teacher}</p><p className="truncate text-[9px] text-[#787584]">{r.nip}</p></div></div></td>
                      </tr>
                    );
                  })}
                  {!rows.length && <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-[#787584]">Tidak ada modul yang cocok dengan filter.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 bg-[#f8f9fc] px-5 py-3 text-[11px] text-[#4e566c] sm:flex-row sm:items-center sm:justify-between">
              <span>Menampilkan <b className="text-[#181c20]">1 – {rows.length} dari 142</b><br />Modul Ajar</span>
              <button type="button" onClick={() => window.alert("Ekspor Daftar Terpilih (.xlsx)")} className="inline-flex items-center gap-1.5 font-semibold text-[#6c5dd3] hover:underline"><Download className="size-3.5" /> Ekspor Daftar Terpilih</button>
              <nav aria-label="Paginasi modul" className="flex items-center gap-1"><button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] disabled:opacity-40"><ChevronLeft className="size-4" /></button>{[1, 2, 3].map((n) => <button key={n} type="button" aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#5343b9] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{n}</button>)}<span className="px-1">…</span><button type="button" onClick={() => setPage(PAGE_COUNT)} className="size-8 rounded-full text-[#181c20]">{PAGE_COUNT}</button><button type="button" aria-label="Halaman berikutnya" disabled={page >= PAGE_COUNT} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] disabled:opacity-40"><ChevronRight className="size-4" /></button></nav>
            </div>
          </section>

          <section className="flex flex-col items-start gap-4 rounded-2xl bg-[#5343b9] px-6 py-5 text-white sm:flex-row sm:items-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15"><ClipboardCheck className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold leading-5">Pedoman Penyusunan KOSP &amp; Modul Ajar SMK</h2>
              <p className="mt-1 text-[11px] leading-4 text-white/80">Pastikan modul memuat Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), rubrik asesmen autentik, dan integrasi Profil Pelajar Pancasila sesuai standar BSKAP 2026.</p>
            </div>
            <button type="button" onClick={() => window.alert("Unduh Template Pedoman (.docx)")} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#4331a8] hover:bg-[#e5deff]"><Download className="size-3.5" /> Unduh Template (.docx)</button>
          </section>
        </div>
        {aside}
      </div>
    </>
  );
}
