"use client";

import { type ReactNode, useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Columns3, FileSpreadsheet, History, IdCard, Mail, MoreVertical, RefreshCw, Search, SlidersHorizontal } from "lucide-react";

type Student = {
  initials: string;
  name: string;
  nisn: string;
  gender: "Lk" | "Pr";
  kelas: string;
  jurusan: string;
  group: string;
  wali: string;
  nip?: string;
  alert?: string;
  sso: "Aktif" | "Butuh Aktivasi";
  note: string;
  noteTone: string;
  tone: string;
};

const students: Student[] = [
  { initials: "PB", name: "Pawell Bennett", nisn: "0072819284", gender: "Lk", kelas: "XII TKJ 1", jurusan: "Teknik Komputer & Jaringan", group: "Teknik Komputer & Jaringan (TKJ)", wali: "Dr. Pawell S.Kom", nip: "NIP. 19840212 201001 1 008", sso: "Aktif", note: "Dapodik Terverifikasi", noteTone: "text-[#4e566c]", tone: "bg-[#eceef3] text-[#4e566c]" },
  { initials: "SA", name: "Sarah Azzahra", nisn: "0081293847", gender: "Pr", kelas: "XII DKV 1", jurusan: "Desain Komunikasi Visual", group: "Desain Komunikasi Visual (DKV)", wali: "Arya Wiguna M.Cs", nip: "NIP. 19780518 200501 1 002", sso: "Aktif", note: "Kandidat LKS SMK 2026", noteTone: "text-[#6c5dd3]", tone: "bg-[#f1e5ff] text-[#6b21a8]" },
  { initials: "DR", name: "Danu Ramadhan", nisn: "0093849182", gender: "Lk", kelas: "XI TKR 2", jurusan: "Teknik Kendaraan Ringan", group: "Teknik Kendaraan Ringan (TKR)", wali: "Drs. Bambang Sutrisno", nip: "NIP. 19690412 199403 1 005", sso: "Aktif", note: "Praktik Industri (PKL)", noteTone: "text-[#4e566c]", tone: "bg-[#e5deff] text-[#4331a8]" },
  { initials: "LH", name: "Lisa Hilton", nisn: "0102938472", gender: "Pr", kelas: "X Tata Boga 1", jurusan: "Kuliner & Patiseri", group: "Kuliner & Tata Boga", wali: "Dewa Ayu Citra S.Pd", nip: "NIP. 19890924 201602 2 001", sso: "Aktif", note: "Fase E Pemula", noteTone: "text-[#4e566c]", tone: "bg-[#fff3c4] text-[#8a5a00]" },
  { initials: "JA", name: "Jim Anderson", nisn: "0091823746", gender: "Lk", kelas: "XI TKR 1", jurusan: "Teknik Kendaraan Ringan", group: "Teknik Kendaraan Ringan (TKR)", wali: "Drs. Bambang Sutrisno", alert: "Presensi < 82% (Catatan BK)", sso: "Butuh Aktivasi", note: "Undangan Terkirim", noteTone: "text-[#4e566c]", tone: "bg-[#fee2e2] text-[#dc2626]" },
  { initials: "NH", name: "Natasha Hughes", nisn: "0079182345", gender: "Pr", kelas: "XII Perhotelan 2", jurusan: "Hospitality & Front Office", group: "Perhotelan & Hospitality", wali: "Dra. Sri Rahayu", nip: "NIP. 19730310 199802 2 004", sso: "Aktif", note: "Sertifikasi LSP BNSP", noteTone: "text-[#4e566c]", tone: "bg-[#dbeafe] text-[#1d4ed8]" },
];

const ALL_JURUSAN = "Semua Jurusan / Kejuruan";
const ALL_TINGKAT = "Semua Tingkat Kelas";
const ALL_SSO = "Status Akun SSO";
const PAGE_COUNT = 307;

const selectClass = "h-11 w-full appearance-none rounded-full bg-[#f1f4f9] pl-4 pr-10 text-sm font-medium text-[#181c20] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30";

function FilterSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <label className="sr-only" htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" aria-hidden="true" />
    </div>
  );
}

export function StudentsTable({ aside }: { aside: ReactNode }) {
  const [query, setQuery] = useState("");
  const [jurusan, setJurusan] = useState(ALL_JURUSAN);
  const [tingkat, setTingkat] = useState(ALL_TINGKAT);
  const [sso, setSso] = useState(ALL_SSO);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => students.filter((s) => {
    const q = query.trim().toLowerCase();
    return (!q || [s.name, s.nisn, s.kelas].some((v) => v.toLowerCase().includes(q)))
      && (jurusan === ALL_JURUSAN || s.group === jurusan)
      && (tingkat === ALL_TINGKAT || s.kelas.split(" ")[0] === tingkat.replace("Kelas ", ""))
      && (sso === ALL_SSO || s.sso === sso);
  }), [query, jurusan, tingkat, sso]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.nisn));
  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(allSelected ? [] : rows.map((r) => r.nisn));
  const reset = () => { setQuery(""); setJurusan(ALL_JURUSAN); setTingkat(ALL_TINGKAT); setSso(ALL_SSO); setSelected([]); };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#eef0f5] bg-white p-4 shadow-[0_8px_24px_rgba(32,44,90,0.04)] md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_0.8fr_0.7fr_auto]">
        <label className="relative">
          <span className="sr-only">Cari siswa</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama siswa, NISN, atau kelas" className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" />
        </label>
        <FilterSelect id="student-jurusan" label="Filter jurusan" value={jurusan} onChange={setJurusan} options={[ALL_JURUSAN, ...new Set(students.map((s) => s.group))]} />
        <FilterSelect id="student-tingkat" label="Filter tingkat kelas" value={tingkat} onChange={setTingkat} options={[ALL_TINGKAT, "Kelas X", "Kelas XI", "Kelas XII"]} />
        <FilterSelect id="student-sso" label="Filter status akun SSO" value={sso} onChange={setSso} options={[ALL_SSO, "Aktif", "Butuh Aktivasi"]} />
        <button type="button" onClick={reset} aria-label="Reset filter" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff] hover:text-[#6c5dd3]"><RefreshCw className="size-[18px]" /></button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
          <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[#181c20]">Daftar Siswa &amp; Peserta Didik</h2>
              <span className="rounded-full bg-[#e5deff] px-2 py-0.5 text-[11px] font-semibold text-[#4331a8]">1.842 Total</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => window.alert("Filter Lanjutan")} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#eceef3] px-3 text-[11px] font-medium text-[#4e566c] hover:bg-[#e0e2e7]"><SlidersHorizontal className="size-3.5" /> Filter Lanjutan</button>
              <button type="button" onClick={() => window.alert("Kolom Tampilan")} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#eceef3] px-3 text-[11px] font-medium text-[#4e566c] hover:bg-[#e0e2e7]"><Columns3 className="size-3.5" /> Kolom Tampilan</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-[#f1f4f9] text-xs font-semibold text-[#181c20]">
                <tr>
                  <th className="w-12 py-3.5 pl-6"><input type="checkbox" aria-label="Pilih semua siswa" checked={allSelected} onChange={toggleAll} className="size-4 accent-[#6c5dd3]" /></th>
                  <th className="px-3 py-3.5">Siswa &amp; Identitas</th>
                  <th className="w-[96px] px-3 py-3.5">Kelas &amp;<br />Jurusan</th>
                  <th className="w-[108px] px-3 py-3.5">Wali Kelas /<br />Pembimbing</th>
                  <th className="w-[112px] px-3 py-3.5">Status SSO<br />&amp; Dapodik</th>
                  <th className="px-3 py-3.5 pr-6 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef3]">
                {rows.map((s) => (
                  <tr key={s.nisn} className={`align-middle ${s.alert ? "bg-[#fffbf3]" : selected.includes(s.nisn) ? "bg-[#f8f6ff]" : "hover:bg-[#fbfcfd]"}`}>
                    <td className="py-5 pl-6"><input type="checkbox" aria-label={`Pilih ${s.name}`} checked={selected.includes(s.nisn)} onChange={() => toggle(s.nisn)} className="size-4 accent-[#6c5dd3]" /></td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-3">
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${s.tone}`}>{s.initials}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#181c20]">{s.name}</p>
                          <p className="mt-0.5 flex items-center gap-2 text-[11px] leading-4 text-[#4e566c]">
                            <span>NISN:<br />{s.nisn}</span>
                            <span aria-hidden="true">•</span>
                            <span className="rounded bg-[#eceef3] px-1.5 text-[10px]">{s.gender}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-xs leading-4"><p className="text-[#181c20]">{s.kelas}</p><p className="mt-0.5 text-[11px] text-[#6c5dd3]">{s.jurusan}</p></td>
                    <td className="px-3 py-5 text-[13px] leading-[18px] text-[#181c20]">
                      <p>{s.wali}</p>
                      {s.nip && <p className="mt-0.5 text-[11px] leading-4 text-[#4e566c]">{s.nip}</p>}
                      {s.alert && <p className="mt-0.5 text-[11px] leading-4 text-[#dc2626]">{s.alert}</p>}
                    </td>
                    <td className="px-3 py-5 text-[11px] leading-4">
                      {s.sso === "Aktif"
                        ? <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-1 text-[10px] leading-3 text-[#047857]"><span className="size-1.5 shrink-0 rounded-full bg-current" />SSO<br />Aktif</span>
                        : <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7e6] px-2 py-1 text-[10px] leading-3 text-[#b45309]"><span className="size-1.5 shrink-0 rounded-full bg-current" />Butuh<br />Aktivasi<br />SSO</span>}
                      <p className={`mt-1.5 ${s.noteTone}`}>{s.note}</p>
                    </td>
                    <td className="px-3 py-5 pr-6">
                      <div className="flex items-center justify-end gap-1">
                        {s.sso === "Aktif"
                          ? <button type="button" aria-label={`Kartu identitas ${s.name}`} onClick={() => window.alert(`Kartu identitas: ${s.name}`)} className="rounded-lg p-1.5 text-[#4e566c] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><IdCard className="size-[18px]" /></button>
                          : <button type="button" aria-label={`Kirim ulang undangan SSO ${s.name}`} onClick={() => window.alert(`Kirim ulang undangan SSO: ${s.name}`)} className="rounded-lg p-1.5 text-[#6c5dd3] hover:bg-[#f1f4f9]"><Mail className="size-[18px]" /></button>}
                        <button type="button" aria-label={`Riwayat ${s.name}`} onClick={() => window.alert(`Riwayat: ${s.name}`)} className="rounded-lg p-1.5 text-[#4e566c] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><History className="size-[18px]" /></button>
                        <button type="button" aria-label={`Aksi lain ${s.name}`} onClick={() => window.alert(`Aksi lain: ${s.name}`)} className="rounded-lg p-1.5 text-[#4e566c] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><MoreVertical className="size-[18px]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-[#787584]">Tidak ada siswa yang cocok dengan filter.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 bg-[#f8f9fc] px-6 py-4 text-[11px] text-[#4e566c] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span>Menampilkan 1 – {rows.length} dari<br /><b className="font-semibold text-[#181c20]">1.842 Siswa</b></span>
              <span aria-hidden="true">•</span>
              <button type="button" onClick={() => window.alert("Unduh Rekap NISN Lengkap (.xlsx)")} className="inline-flex items-center gap-1 text-left font-medium text-[#6c5dd3] hover:underline"><FileSpreadsheet className="size-3.5 shrink-0" /> Unduh Rekap NISN<br />Lengkap (.xlsx)</button>
            </div>
            {/* shortcut: static page numbers, wire to API pagination when backend endpoint exists */}
            <nav aria-label="Paginasi siswa" className="flex items-center gap-1 text-sm">
              <button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#eceef3] disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              {[1, 2, 3].map((n) => <button type="button" key={n} aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#4331a8] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{n}</button>)}
              <span className="px-1 text-[#787584]">…</span>
              <button type="button" aria-current={page === PAGE_COUNT ? "page" : undefined} onClick={() => setPage(PAGE_COUNT)} className={`h-8 min-w-8 rounded-full px-2 font-semibold ${page === PAGE_COUNT ? "bg-[#4331a8] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{PAGE_COUNT}</button>
              <button type="button" aria-label="Halaman berikutnya" disabled={page >= PAGE_COUNT} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] hover:bg-[#eceef3] disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </nav>
          </div>
        </section>
        {aside}
      </div>
    </>
  );
}
