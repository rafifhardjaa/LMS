"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, MoreHorizontal, RefreshCw, Search } from "lucide-react";

type Teacher = {
  initials: string;
  name: string;
  id: string;
  field: string;
  subject: string;
  email: string;
  phone: string;
  status: "Aktif" | "Menunggu Verifikasi" | "Cuti";
  tone: string;
};

const teachers: Teacher[] = [
  { initials: "BS", name: "Drs. Bambang Sutrisno", id: "NIP: 19780412 199403 1 004", field: "Teknik Otomotif (TKR)", subject: "Pemeliharaan Mesin Kendaraan Ringan", email: "bambang.sutrisno@smkmataram.sch.id", phone: "0812 3456 7890", status: "Aktif", tone: "bg-[#fff3c4] text-[#8a5a00]" },
  { initials: "SN", name: "Siti Nurhaliza, S.Psi", id: "NUPTK: 4539768670230043", field: "BK & Konseling", subject: "Bimbingan Konseling & Karir LSP", email: "siti.nurhaliza@smkmataram.sch.id", phone: "0813 4567 8901", status: "Aktif", tone: "bg-[#f1e5ff] text-[#6b21a8]" },
  { initials: "AW", name: "Arya Wiguna, M.Cs", id: "NIP: 19850920 201001 1 012", field: "Desain Komunikasi Visual (DKV)", subject: "Desain Grafis & Animasi 3D Studio", email: "arya.wiguna@smkmataram.sch.id", phone: "0812 8901 2345", status: "Aktif", tone: "bg-[#e5eaff] text-[#3730a3]" },
  { initials: "DC", name: "Dewa Ayu Citra, S.Pd", id: "NIP: 19890115 201402 2 003", field: "Kuliner & Tata Boga", subject: "Pengolahan Pastry & Bakery Praktik", email: "dewa.citra@smkmataram.sch.id", phone: "0819 1234 5678", status: "Menunggu Verifikasi", tone: "bg-[#ffe8eb] text-[#9f1239]" },
  { initials: "SR", name: "Dra. Sri Rahayu", id: "NIP: 19650310 199103 2 002", field: "Normatif / Bahasa", subject: "Bahasa Indonesia & Literasi Kejuruan", email: "sri.rahayu@smkmataram.sch.id", phone: "0817 2345 6789", status: "Cuti", tone: "bg-[#e9edf2] text-[#4e566c]" },
  { initials: "MF", name: "Muhammad Firdaus, S.Pd", id: "NIP: 19881122 201501 1 006", field: "Teknik Komputer & Jaringan", subject: "Administrasi Infrastruktur Jaringan", email: "m.firdaus@smkmataram.sch.id", phone: "0812 3456 1234", status: "Aktif", tone: "bg-[#e0f2fe] text-[#075985]" },
  { initials: "RA", name: "Rina Anggraini, S.Pd", id: "NUPTK: 7643289012450012", field: "Matematika", subject: "Matematika Terapan", email: "rina.anggraini@smkmataram.sch.id", phone: "0813 5678 9012", status: "Menunggu Verifikasi", tone: "bg-[#fce7f3] text-[#9d174d]" },
];

const statusStyle: Record<Teacher["status"], string> = {
  Aktif: "bg-[#ecfdf5] text-[#047857]",
  "Menunggu Verifikasi": "bg-[#fff7ed] text-[#b45309]",
  Cuti: "bg-[#fff7ed] text-[#b45309]",
};

export function TeachersTable() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("Semua Rumpun Kejuruan");
  const [status, setStatus] = useState("Semua Status Guru");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => teachers.filter((teacher) => {
    const text = `${teacher.name} ${teacher.id} ${teacher.field} ${teacher.subject}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (field === "Semua Rumpun Kejuruan" || teacher.field === field) && (status === "Semua Status Guru" || teacher.status === status);
  }), [query, field, status]);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => { setQuery(""); setField("Semua Rumpun Kejuruan"); setStatus("Semua Status Guru"); setPage(1); };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e0e2e7] bg-white p-4 md:flex-row md:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" aria-hidden="true" />
          <input aria-label="Cari guru" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Cari nama guru, NIP, atau mata pelajaran..." className="h-11 w-full rounded-full bg-[#f1f4f9] pl-10 pr-4 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" />
        </label>
        <label className="sr-only" htmlFor="teacher-field">Filter rumpun kejuruan</label>
        <select id="teacher-field" value={field} onChange={(e) => { setField(e.target.value); setPage(1); }} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#4e566c] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30">
          <option>Semua Rumpun Kejuruan</option>
          {[...new Set(teachers.map((teacher) => teacher.field))].map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="sr-only" htmlFor="teacher-status">Filter status guru</label>
        <select id="teacher-status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#4e566c] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30">
          <option>Semua Status Guru</option>
          <option>Aktif</option><option>Menunggu Verifikasi</option><option>Cuti</option>
        </select>
        <button type="button" onClick={reset} aria-label="Reset filter" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff] hover:text-[#6c5dd3]"><RefreshCw className="size-[18px]" /></button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e0e2e7] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-3 border-b border-[#eceef3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-[#181c20]">Daftar Pendidik & Pengampu</h2>
            <span className="rounded-full bg-[#e5deff] px-2.5 py-1 text-[11px] font-semibold text-[#4331a8]">Total {filtered.length} Guru</span>
          </div>
          <div className="flex items-center gap-3 max-lg:flex-wrap text-xs text-[#4e566c]">
            <span>Menampilkan {rows.length} dari {filtered.length} guru</span>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] hover:bg-[#f1f4f9] disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => <button type="button" key={n} aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#e5deff] text-[#6c5dd3]" : "text-[#4e566c] hover:bg-[#f1f4f9]"}`}>{n}</button>)}
              <button type="button" aria-label="Halaman berikutnya" disabled={page >= pageCount} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#f1f4f9] disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#f8f9fc] text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">
              <tr><th className="px-5 py-3">Guru & Identitas</th><th className="px-5 py-3">Bidang Rumpun & Mapel</th><th className="px-5 py-3">Rombel & Beban (Jam Pelajaran)</th><th className="px-5 py-3">Status & Dapodik</th><th className="px-5 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {rows.map((teacher, index) => (
                <tr key={teacher.id} className="align-middle hover:bg-[#fbfcfd]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${teacher.tone}`}>{teacher.initials}</span><div className="min-w-0"><p className="font-semibold text-[#181c20]">{teacher.name}</p><p className="mt-0.5 text-[11px] text-[#787584]">{teacher.id}</p><p className="mt-1 text-[11px] text-[#787584]">{teacher.email}<br />{teacher.phone}</p></div></div></td>
                  <td className="px-5 py-4"><span className={`inline-block rounded-md px-2 py-1 text-[10px] font-medium ${teacher.tone}`}>{teacher.field}</span><p className="mt-2 max-w-[240px] text-xs leading-5 text-[#181c20]">{teacher.subject}</p></td>
                  <td className="px-5 py-4"><p className="font-bold text-[#181c20]">{[28, 24, 30, 32, 0, 26, 20][index % 7]} Jam Pelajaran <span className="text-[10px] font-normal text-[#787584]">/ minggu</span></p><p className="mt-1 text-[11px] text-[#787584]">{["4 Rombel (Kelas XII TKR 1–4)", "6 Rombel (Lintas Jurusan)", "3 Rombel (Kelas XI & XII DKV)", "4 Rombel (Kelas X & XI Kuliner)", "Guru Pengganti", "3 Rombel (Kelas XI TKJ)", "2 Rombel (Kelas X)" ][index % 7]}</p></td>
                  <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${statusStyle[teacher.status]}`}><span className="size-1.5 rounded-full bg-current" />{teacher.status}</span><p className="mt-2 flex items-center gap-1 text-[10px] text-[#6c5dd3]"><BadgeCheck className="size-3.5" /> Dapodik Valid</p></td>
                  <td className="px-5 py-4 text-right"><button type="button" aria-label={`Aksi untuk ${teacher.name}`} onClick={() => window.alert(`Aksi guru: ${teacher.name}`)} className="rounded-lg p-2 text-[#787584] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><MoreHorizontal className="size-5" /></button></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-[#787584]">Tidak ada guru yang cocok dengan filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-[#eceef3] px-5 py-3 text-[11px] text-[#787584] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><RefreshCw className="size-3.5 text-[#059669]" /> Terakhir disinkronkan dengan Dapodik Kemendikbud: Hari ini, 07:45 WITA</span><span>Aturan Distribusi Beban Jam Pelajaran <span className="px-2">•</span> Panduan Sinkronisasi NUPTK</span></div>
      </div>
    </section>
  );
}
