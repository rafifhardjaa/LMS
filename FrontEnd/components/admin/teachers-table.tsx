"use client";

import { useEffect, useMemo, useState } from "react";
import { masterDataApi } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  Search,
} from "lucide-react";

const statusStyle: Record<string, string> = {
  Aktif: "bg-[#ecfdf5] text-[#047857]",
  "Menunggu Verifikasi": "bg-[#fff7ed] text-[#b45309]",
  Cuti: "bg-[#fff7ed] text-[#b45309]",
};

export function TeachersTable({ isAdmin, onTeacherAdded }: { isAdmin: boolean; onTeacherAdded?: () => void }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [fieldFilter, setFieldFilter] = useState("Semua Bidang");
  const [page, setPage] = useState(1);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await masterDataApi.teachers.list(query || undefined);
      if (res.error) throw new Error((res.error as { message?: string }).message ?? "Gagal memuat guru");
      setTeachers(res.data?.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat guru");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [query, statusFilter, fieldFilter]);

  const rows = useMemo(() => teachers.filter((t) => {
    const q = query.trim().toLowerCase();
    return (!q || [t.fullName, t.nomorInduk, t.email].some((v) => (v ?? "").toLowerCase().includes(q)))
      && (statusFilter === "Semua Status" || (t.isActive ? "Aktif" : "Nonaktif") === statusFilter)
      && (fieldFilter === "Semua Bidang" || true);
  }), [teachers, query, statusFilter, fieldFilter]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => { setQuery(""); setStatusFilter("Semua Status"); setFieldFilter("Semua Bidang"); setPage(1); };

  const statusOptions = ["Semua Status", "Aktif", "Nonaktif"];
  const fieldOptions = ["Semua Bidang", ...new Set(teachers.map((t: any) => t.fullName).filter(Boolean))];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e0e2e7] bg-white p-4 md:flex-row md:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" aria-hidden="true" />
          <input aria-label="Cari guru" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Cari nama guru, NIP, atau email..." className="h-11 w-full rounded-full bg-[#f1f4f9] pl-10 pr-4 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" />
        </label>
        <select value={fieldFilter} onChange={(e) => { setFieldFilter(e.target.value); setPage(1); }} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#4e566c] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30">
          {fieldOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-11 rounded-full bg-[#f1f4f9] px-4 text-sm text-[#4e566c] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30">
          {statusOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <button type="button" onClick={reset} aria-label="Reset filter" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff] hover:text-[#6c5dd3]"><RefreshCw className="size-[18px]" /></button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e0e2e7] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-3 border-b border-[#eceef3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-[#181c20]">Daftar Pendidik & Pengampu</h2>
            <span className="rounded-full bg-[#e5deff] px-2.5 py-1 text-[11px] font-semibold text-[#4331a8]">Total {rows.length} Guru</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#f8f9fc] text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">
              <tr><th className="px-5 py-3">Guru & Identitas</th><th className="px-5 py-3">Bidang Rumpun & Mapel</th><th className="px-5 py-3">Status & Dapodik</th><th className="px-5 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {paged.map((teacher, index) => (
                <tr key={teacher.id} className="align-middle hover:bg-[#fbfcfd]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold bg-[#f0edff] text-[#6c5dd3]`}>{teacher.fullName?.charAt(0)??"?"}</span><div className="min-w-0"><p className="font-semibold text-[#181c20]">{teacher.fullName}</p><p className="mt-0.5 text-[11px] text-[#787584]">{teacher.nomorInduk ?? "—"}</p><p className="mt-1 text-[11px] text-[#787584]">{teacher.email ?? "—"}</p></div></div></td>
                  <td className="px-5 py-4"><span className="inline-block rounded-md px-2 py-1 text-[10px] font-medium bg-[#f0edff] text-[#6c5dd3]">Guru</span><p className="mt-2 max-w-[240px] text-xs leading-5 text-[#181c20]">Mata Pelajaran</p></td>
                  <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${teacher.isActive ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#fff7ed] text-[#b45309]"}`}><span className="size-1.5 rounded-full bg-current" />{teacher.isActive ? "Aktif" : "Nonaktif"}</span><p className="mt-2 flex items-center gap-1 text-[10px] text-[#6c5dd3]"><BadgeCheck className="size-3.5" /> Dapodik Valid</p></td>
                  <td className="px-5 py-4 text-right"><button type="button" aria-label={`Aksi untuk ${teacher.fullName}`} onClick={() => window.alert(`Aksi guru: ${teacher.fullName}`)} className="rounded-lg p-2 text-[#787584] hover:bg-[#f1f4f9] hover:text-[#6c5dd3]"><MoreHorizontal className="size-5" /></button></td>
                </tr>
              ))}
              {!paged.length && <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-[#787584]">Tidak ada guru yang cocok dengan filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-[#eceef3] px-5 py-3 text-[11px] text-[#787584] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><RefreshCw className="size-3.5 text-[#059669]" /> Terakhir disinkronkan dengan Dapodik Kemendikbud</span><nav aria-label="Paginasi guru" className="flex items-center gap-1"><button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] hover:bg-[#f1f4f9] disabled:opacity-40"><ChevronLeft className="size-4" /></button>{Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => <button key={n} type="button" aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#e5deff] text-[#6c5dd3]" : "text-[#4e566c] hover:bg-[#f1f4f9]"}`}>{n}</button>)}<button type="button" aria-label="Halaman berikutnya" disabled={page >= pageCount} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#f1f4f9] disabled:opacity-40"><ChevronRight className="size-4" /></button></nav></div>
      </div>
    </section>
  );
}