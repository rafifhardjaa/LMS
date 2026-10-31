"use client";

import { type ReactNode, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileDown, FilterX, Search } from "lucide-react";

type Course = { code: string; name: string; detail: string; group: "Kejuruan Produktif" | "Umum Adaptif"; phase: string; teacher: string; initials: string; nip: string; tone: string };
const courses: Course[] = [
  { code: "INF", name: "Pemrograman Web & Mobile", detail: "INF-301 • Konsentrasi RPL/DKV", group: "Kejuruan Produktif", phase: "Fase F (Kelas XI & XII)", teacher: "Dr. Pawell, S.Kom., M.T.", initials: "PW", nip: "NIP. 19880412 201002 1 008", tone: "bg-[#6c5dd3] text-white" },
  { code: "TKR", name: "Pemeliharaan Mesin Otomotif", detail: "TKR-201 • Konsentrasi Otomotif", group: "Kejuruan Produktif", phase: "Fase F (Kelas XI)", teacher: "Drs. Bambang Sutrisno", initials: "BS", nip: "NIP. 19740921 200112 1 002", tone: "bg-[#6c5dd3] text-white" },
  { code: "BOG", name: "Pengolahan Pastry & Bakery", detail: "BOG-102 • Kuliner & Patiseri", group: "Kejuruan Produktif", phase: "Fase F (Kelas XI)", teacher: "Dewa Ayu Citra, S.Pd.", initials: "DA", nip: "NIP. 19851104 201012 009", tone: "bg-[#6c5dd3] text-white" },
  { code: "DKV", name: "Desain Komunikasi Visual & 3D", detail: "DKV-304 • Animasi & Grafika", group: "Kejuruan Produktif", phase: "Fase F (Kelas XII)", teacher: "Arya Wiguna, M.Cs.", initials: "AW", nip: "NIP. 19890117 201504 001", tone: "bg-[#6c5dd3] text-white" },
  { code: "MAT", name: "Matematika Terapan Kejuruan", detail: "MAT-101 • Kelompok Dasar", group: "Umum Adaptif", phase: "Fase E (Kelas X)", teacher: "Siti Nurhaliza, M.Pd.", initials: "SN", nip: "NIP. 19820719 200801 2 015", tone: "bg-[#4e566c] text-white" },
  { code: "FIS", name: "Fisika Terapan & Instrumentasi", detail: "FIS-202 • Dasar Kejuruan Teknik", group: "Umum Adaptif", phase: "Fase E (Kelas X)", teacher: "Hendro Danuarta, S.Si.", initials: "HD", nip: "NIP. 19870314 201101 008", tone: "bg-[#a39afd] text-[#181c20]" },
];
const PAGE_COUNT = 6;

export function CourseTable({ aside }: { aside: ReactNode }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Semua Kelompok (Kejuruan/Umum)");
  const [phase, setPhase] = useState("Semua Fase / Tingkat");
  const [status, setStatus] = useState("Semua Status Modul");
  const [tab, setTab] = useState("Semua (35)");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => courses.filter((c) => {
    const q = query.trim().toLowerCase();
    return (!q || [c.name, c.code, c.detail, c.teacher].some((v) => v.toLowerCase().includes(q)))
      && (group === "Semua Kelompok (Kejuruan/Umum)" || c.group.startsWith(group))
      && (phase === "Semua Fase / Tingkat" || c.phase.startsWith(phase.split(" ")[0]));
  }), [query, group, phase]);

  const allSelected = rows.length > 0 && rows.every((c) => selected.includes(c.code));
  const reset = () => { setQuery(""); setGroup("Semua Kelompok (Kejuruan/Umum)"); setPhase("Semua Fase / Tingkat"); setStatus("Semua Status Modul"); setSelected([]); };
  const tabs = ["Semua (35)", "Fase E (10)", "Fase F (25)"];

  return (
    <>
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#eef0f5] bg-white p-3 shadow-[0_8px_24px_rgba(32,44,90,0.04)] sm:grid-cols-2 xl:grid-cols-[1fr_1.2fr_0.9fr_0.9fr_auto]">
        <label className="relative"><span className="sr-only">Cari mata pelajaran</span><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari kode mapel, mata pelajaran..." className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" /></label>
        <label className="sr-only" htmlFor="course-group">Filter kelompok</label><select id="course-group" value={group} onChange={(e) => setGroup(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Semua Kelompok (Kejuruan/Umum)</option><option>Kejuruan</option><option>Umum</option></select>
        <label className="sr-only" htmlFor="course-phase">Filter fase</label><select id="course-phase" value={phase} onChange={(e) => setPhase(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Semua Fase / Tingkat</option><option>Fase E</option><option>Fase F</option></select>
        <label className="sr-only" htmlFor="course-status">Filter status modul</label><select id="course-status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#181c20] outline-none"><option>Semua Status Modul</option><option>Lengkap</option><option>Perlu Revisi</option></select>
        <button type="button" aria-label="Reset filter" onClick={reset} className="flex size-11 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><FilterX className="size-4" /></button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_294px]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
          <div className="flex flex-col justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3"><h2 className="max-w-[190px] text-base font-bold leading-5 text-[#181c20]">Daftar Mata Pelajaran<br />Terdaftar</h2><span className="rounded-full bg-[#e5deff] px-2 py-1 text-[10px] font-semibold text-[#4331a8]">35<br />Total</span></div>
            <div role="tablist" aria-label="Filter fase mata pelajaran" className="flex rounded-full bg-[#f1f4f9] p-1">
              {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => { setTab(item); setPhase(item.startsWith("Fase E") ? "Fase E" : item.startsWith("Fase F") ? "Fase F" : "Semua Fase / Tingkat"); }} className={`rounded-full px-3 py-2 text-[10px] font-medium ${tab === item ? "bg-[#5343b9] text-white shadow-sm" : "text-[#4e566c] hover:bg-white"}`}>{item}</button>)}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[590px] text-left">
              <thead className="bg-[#f1f4f9] text-[11px] font-semibold text-[#4e566c]"><tr><th className="w-12 py-3 pl-5"><input type="checkbox" aria-label="Pilih semua mata pelajaran" checked={allSelected} onChange={() => setSelected(allSelected ? [] : rows.map((c) => c.code))} className="size-4 accent-[#6c5dd3]" /></th><th className="px-3 py-3">Kode &amp; Nama Mata Pelajaran</th><th className="w-[100px] px-3 py-3">Kelompok<br />&amp; Fase</th><th className="px-3 py-3">Guru Pengampu</th></tr></thead>
              <tbody className="divide-y divide-[#eceef3]">
                {rows.map((c) => <tr key={c.code} className="hover:bg-[#fbfcfd]"><td className="py-6 pl-5"><input type="checkbox" aria-label={`Pilih ${c.name}`} checked={selected.includes(c.code)} onChange={() => setSelected((prev) => prev.includes(c.code) ? prev.filter((x) => x !== c.code) : [...prev, c.code])} className="size-4 accent-[#6c5dd3]" /></td><td className="px-3 py-6"><div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0edff] text-[10px] font-bold text-[#6c5dd3]">{c.code}</span><div className="min-w-0"><p className="text-xs font-semibold text-[#181c20]">{c.name}</p><p className="mt-0.5 text-[10px] text-[#787584]">{c.detail}</p></div></div></td><td className="px-3 py-6"><span className={`inline-block rounded-full px-2 py-1 text-[10px] leading-3 ${c.group === "Kejuruan Produktif" ? "bg-[#f0edff] text-[#4331a8]" : "bg-[#eceef3] text-[#4e566c]"}`}>{c.group}</span><p className="mt-1 text-[10px] leading-3.5 text-[#4e566c]">{c.phase}</p></td><td className="px-3 py-6"><div className="flex items-center gap-2"><span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${c.tone}`}>{c.initials}</span><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-[#181c20]">{c.teacher}</p><p className="truncate text-[9px] text-[#787584]">{c.nip}</p></div></div></td></tr>)}
                {!rows.length && <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-[#787584]">Tidak ada mata pelajaran yang cocok dengan filter.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 bg-[#f8f9fc] px-5 py-3 text-[11px] text-[#4e566c] sm:flex-row sm:items-center sm:justify-between"><span>Menampilkan <b className="text-[#181c20]">1 – {rows.length} dari 35</b><br />Mapel</span><button type="button" onClick={() => window.alert("Unduh KOSP Lengkap")} className="inline-flex items-center gap-1.5 font-semibold text-[#6c5dd3] hover:underline"><FileDown className="size-3.5" /> Unduh KOSP Lengkap</button><nav aria-label="Paginasi mata pelajaran" className="flex items-center gap-1"><button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] disabled:opacity-40"><ChevronLeft className="size-4" /></button>{[1, 2, 3].map((n) => <button key={n} type="button" aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#5343b9] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{n}</button>)}<span className="px-1">…</span><button type="button" onClick={() => setPage(PAGE_COUNT)} className="size-8 rounded-full text-[#181c20]">{PAGE_COUNT}</button><button type="button" aria-label="Halaman berikutnya" disabled={page >= PAGE_COUNT} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] disabled:opacity-40"><ChevronRight className="size-4" /></button></nav></div>
        </section>
        {aside}
      </div>
    </>
  );
}

