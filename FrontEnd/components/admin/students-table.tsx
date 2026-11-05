"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { masterDataApi } from "@/lib/api/master-data";
import {
  EmptyRow,
  PanelCard,
  PanelHeader,
  RowActions,
  StatusBadge,
  thClass,
  tdClass,
} from "@/components/admin/master-data/panel-ui";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  FileSpreadsheet,
  History,
  IdCard,
  Mail,
  MoreVertical,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export function StudentsTable({ aside }: { aside: ReactNode }) {
  const [query, setQuery] = useState("");
  const [jurusan, setJurusan] = useState("Semua Jurusan");
  const [tingkat, setTingkat] = useState("Semua Tingkat");
  const [sso, setSso] = useState("Semua Status SSO");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      if (query) filters.q = query;
      if (jurusan !== "Semua Jurusan") filters.majorId = jurusan;
      if (tingkat !== "Semua Tingkat") filters.gradeLevelId = tingkat;
      if (sso !== "Semua Status SSO") filters.status = sso === "Aktif" ? "active" : "inactive";
      
      const res = await masterDataApi.students.list(filters);
      if (res.error) throw new Error((res.error as { message?: string }).message ?? "Gagal memuat siswa");
      setStudents(res.data?.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [query, jurusan, tingkat, sso]);

  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => students, [students]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.nomorInduk));
  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(allSelected ? [] : rows.map((r) => r.nomorInduk));
  const reset = () => { setQuery(""); setJurusan("Semua Jurusan"); setTingkat("Semua Tingkat"); setSso("Semua Status SSO"); setSelected([]); };

  const jurusanOptions = ["Semua Jurusan", ...new Set(students.map((s: any) => s.majorName).filter(Boolean))];
  const tingkatOptions = ["Semua Tingkat", "Kelas X", "Kelas XI", "Kelas XII"];
  const ssoOptions = ["Semua Status SSO", "Aktif", "Butuh Aktivasi"];

  if (loading && students.length === 0) {
    return <div className="flex items-center justify-center py-16 text-sm text-[#787584]">Memuat siswa…</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#eef0f5] bg-white p-4 shadow-[0_8px_24px_rgba(32,44,90,0.04)] md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_0.8fr_0.7fr_auto]">
        <label className="relative">
          <span className="sr-only">Cari siswa</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama siswa, NISN, atau kelas" className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" />
        </label>
        <select value={jurusan} onChange={(e) => setJurusan(e.target.value)} className="h-11 w-full appearance-none rounded-full bg-[#f1f4f9] pl-4 pr-10 text-sm font-medium text-[#181c20] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30">
          {jurusanOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={tingkat} onChange={(e) => setTingkat(e.target.value)} className="h-11 w-full appearance-none rounded-full bg-[#f1f4f9] pl-4 pr-10 text-sm font-medium text-[#181c20] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30">
          {tingkatOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={sso} onChange={(e) => setSso(e.target.value)} className="h-11 w-full appearance-none rounded-full bg-[#f1f4f9] pl-4 pr-10 text-sm font-medium text-[#181c20] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30">
          {ssoOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <button type="button" onClick={reset} aria-label="Reset filter" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff] hover:text-[#6c5dd3]"><RefreshCw className="size-[18px]" /></button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
          <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[#181c20]">Daftar Siswa & Peserta Didik</h2>
              <span className="rounded-full bg-[#e5deff] px-2 py-0.5 text-[11px] font-semibold text-[#4331a8]">{rows.length} Total</span>
            </div>
            <div className="flex items-center gap-2 max-lg:flex-wrap">
              <button type="button" onClick={() => window.alert("Filter Lanjutan")} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#eceef3] px-3 text-[11px] font-medium text-[#4e566c] hover:bg-[#e0e2e7]"><SlidersHorizontal className="size-3.5" /> Filter Lanjutan</button>
              <button type="button" onClick={() => window.alert("Kolom Tampilan")} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#eceef3] px-3 text-[11px] font-medium text-[#4e566c] hover:bg-[#e0e2e7]"><Columns3 className="size-3.5" /> Kolom Tampilan</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-[#f1f4f9] text-xs font-semibold text-[#181c20]">
                <tr>
                  <th className="w-12 py-3.5 pl-6"><input type="checkbox" aria-label="Pilih semua siswa" checked={allSelected} onChange={toggleAll} className="size-4 accent-[#6c5dd3]" /></th>
                  <th className="px-3 py-3.5">Siswa & Identitas</th>
                  <th className="w-[96px] px-3 py-3.5">Kelas &<br />Jurusan</th>
                  <th className="w-[108px] px-3 py-3.5">Wali Kelas /<br />Pembimbing</th>
                  <th className="w-[112px] px-3 py-3.5">Status SSO<br />& Dapodik</th>
                  <th className="px-3 py-3.5 pr-6 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef3]">
                {rows.map((s) => (
                  <tr key={s.id} className={`align-middle ${selected.includes(s.nomorInduk) ? "bg-[#f8f6ff]" : "hover:bg-[#fbfcfd]"}`}>
                    <td className="py-5 pl-6"><input type="checkbox" aria-label={`Pilih ${s.fullName}`} checked={selected.includes(s.nomorInduk)} onChange={() => toggle(s.nomorInduk)} className="size-4 accent-[#6c5dd3]" /></td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-3">
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold bg-[#f0edff] text-[#6c5dd3]`}>{s.fullName?.charAt(0) ?? "?"}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#181c20]">{s.fullName}</p>
                          <p className="mt-0.5 flex items-center gap-2 text-[11px] leading-4 text-[#4e566c]">
                            <span>NISN:<br />{s.nomorInduk ?? "—"}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-xs leading-4"><p className="text-[#181c20]">{s.kelas ?? s.gradeName ?? "—"}</p><p className="mt-0.5 text-[11px] text-[#6c5dd3]">{s.majorName ?? "—"}</p></td>
                    <td className="px-3 py-5 text-[13px] leading-[18px] text-[#181c20]">
                      <p>Wali Kelas</p>
                    </td>
                    <td className="px-3 py-5 text-[11px] leading-4">
                      {s.isActive
                        ? <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-1 text-[10px] leading-3 text-[#047857]"><span className="size-1.5 shrink-0 rounded-full bg-current" />SSO<br />Aktif</span>
                        : <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7e6] px-2 py-1 text-[10px] leading-3 text-[#b45309]"><span className="size-1.5 shrink-0 rounded-full bg-current" />Butuh<br />Aktivasi<br />SSO</span>}
                      <p className="mt-1.5 text-[#4e566c]">Dapodik Terverifikasi</p>
                    </td>
                    <td className="px-3 py-5 pr-6">
                      <div className="flex items-center justify-end gap-1">
                        {s.isActive
                          ? <button type="button" aria-label={`Kartu identitas ${s.fullName}`} onClick={() => window.alert(`Kartu identitas: ${s.fullName}`)} className="rounded-lg p-1.5 text-[#4e566c] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><IdCard className="size-[18px]" /></button>
                          : <button type="button" aria-label={`Kirim ulang undangan SSO ${s.fullName}`} onClick={() => window.alert(`Kirim ulang undangan SSO: ${s.fullName}`)} className="rounded-lg p-1.5 text-[#6c5dd3] hover:bg-[#f1f4f9]"><Mail className="size-[18px]" /></button>}
                        <button type="button" aria-label={`Riwayat ${s.fullName}`} onClick={() => window.alert(`Riwayat: ${s.fullName}`)} className="rounded-lg p-1.5 text-[#4e566c] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><History className="size-[18px]" /></button>
                        <button type="button" aria-label={`Aksi lain ${s.fullName}`} onClick={() => window.alert(`Aksi lain: ${s.fullName}`)} className="rounded-lg p-1.5 text-[#4e566c] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><MoreVertical className="size-[18px]" /></button>
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
              <span>Menampilkan 1 – {rows.length} dari<br /><b className="font-semibold text-[#181c20]">{students.length} Siswa</b></span>
              <span aria-hidden="true">•</span>
              <button type="button" onClick={() => window.alert("Unduh Rekap NISN Lengkap (.xlsx)")} className="inline-flex items-center gap-1 text-left font-medium text-[#6c5dd3] hover:underline"><FileSpreadsheet className="size-3.5 shrink-0" /> Unduh Rekap NISN<br />Lengkap (.xlsx)</button>
            </div>
            <nav aria-label="Paginasi siswa" className="flex items-center gap-1 text-sm">
              <button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#eceef3] disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              {[1, 2, 3].map((n) => <button key={n} type="button" aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#4331a8] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{n}</button>)}
              <span className="px-1 text-[#787584]">…</span>
              <button type="button" aria-current={page === 999 ? "page" : undefined} onClick={() => setPage(999)} className={`h-8 min-w-8 rounded-full px-2 font-semibold ${page === 999 ? "bg-[#4331a8] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>999</button>
              <button type="button" aria-label="Halaman berikutnya" disabled={page >= 999} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] hover:bg-[#eceef3] disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </nav>
          </div>
        </section>
        {aside}
      </div>
    </>
  );
}