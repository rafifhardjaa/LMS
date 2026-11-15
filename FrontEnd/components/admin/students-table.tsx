"use client";

import { useEffect, useMemo, useState } from "react";
import { masterDataApi } from "@/lib/api/master-data";
import type { StudentSummary, Major, GradeLevel, SchoolClass } from "@/lib/api/master-data";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

type SsoFilter = "" | "active" | "inactive";

const PAGE_SIZE = 20;

function pageWindow(current: number, total: number): number[] {
  const size = Math.min(5, total);
  let start = Math.max(1, current - Math.floor(size / 2));
  start = Math.min(start, total - size + 1);
  return Array.from({ length: size }, (_, index) => start + index);
}

export function StudentsTable() {
  const [query, setQuery] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [tingkat, setTingkat] = useState("");
  const [rombel, setRombel] = useState("");
  const [sso, setSso] = useState<SsoFilter>("");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    let active = true;
    const loadMasters = async () => {
      try {
        const [majorsRes, gradesRes, classesRes] = await Promise.all([
          masterDataApi.majors.list(true),
          masterDataApi.gradeLevels.list(true),
          masterDataApi.classes.list({ includeInactive: true }),
        ]);
        if (!active) return;
        if (majorsRes.error || gradesRes.error || classesRes.error) {
          throw new Error("Gagal memuat data master");
        }
        setMajors(majorsRes.data?.data ?? []);
        setGradeLevels(gradesRes.data?.data ?? []);
        setClasses(classesRes.data?.data ?? []);
      } catch (e) {
        console.error("Error loading master data:", e);
        if (!active) return;
        setMajors([]);
        setGradeLevels([]);
        setClasses([]);
      } finally {
        if (active) setLoadingFilters(false);
      }
    };
    void loadMasters();
    return () => {
      active = false;
    };
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: {
        q?: string;
        majorId?: string;
        gradeLevelId?: string;
        classId?: string;
        status?: "active" | "inactive" | "all";
      } = {};
      if (query) filters.q = query;
      if (jurusan) filters.majorId = jurusan;
      if (tingkat) filters.gradeLevelId = tingkat;
      if (rombel) filters.classId = rombel;
      if (sso) filters.status = sso;

      const res = await masterDataApi.students.list(filters);
      if (res.error) throw new Error((res.error as { message?: string }).message ?? "Gagal memuat siswa");
      setStudents(res.data?.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat siswa");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [query, jurusan, tingkat, rombel, sso]);

  const reset = () => {
    setQuery("");
    setJurusan("");
    setTingkat("");
    setRombel("");
    setSso("");
    setPage(1);
  };

  const rombelOptions: JurusanOption[] = useMemo(() => {
    const filtered = classes.filter(
      (c) =>
        (!jurusan || c.majorId === jurusan) &&
        (!tingkat || c.gradeLevelId === tingkat)
    );
    return [
      { value: "", label: "Semua Kelas" },
      ...filtered.map((c) => ({ value: c.id, label: c.name })),
    ];
  }, [classes, jurusan, tingkat]);

  const jurusanOptions: JurusanOption[] = useMemo(
    () => [
      { value: "", label: "Semua Jurusan" },
      ...majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` })),
    ],
    [majors]
  );

  const tingkatOptions: JurusanOption[] = useMemo(
    () => [
      { value: "", label: "Semua Tingkat" },
      ...gradeLevels.map((g) => ({ value: g.id, label: `Kelas ${g.code}` })),
    ],
    [gradeLevels]
  );

  const ssoOptions: JurusanOption[] = [
    { value: "", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Butuh Aktivasi" },
  ];

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => students.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [students, currentPage]
  );
  const startRow = students.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(currentPage * PAGE_SIZE, students.length);

  if (loading && students.length === 0) {
    return <div className="flex items-center justify-center py-16 text-sm text-[#787584]">Memuat siswa…</div>;
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
      <div className="flex flex-wrap items-center gap-2 px-6 pt-5 pb-4">
        <h2 className="text-lg font-bold text-[#181c20]">Daftar Siswa & Peserta Didik</h2>
        <span className="rounded-full bg-[#e5deff] px-2 py-0.5 text-[11px] font-semibold text-[#4331a8]">{students.length} Total</span>
      </div>
      <div className="grid grid-cols-1 gap-3 border-b border-[#eceef3] px-6 pb-5 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_0.7fr_auto]">
        <label className="relative">
          <span className="sr-only">Cari siswa</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Cari nama siswa, NISN, atau kelas" className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" />
        </label>
        <div className="w-[220px] shrink-0">
          <SearchableDropdown value={jurusan} onChange={(v) => { setJurusan(v); setRombel(""); setPage(1); }} options={jurusanOptions} label="Semua Jurusan" />
        </div>
        <div className="w-[200px] shrink-0">
          <SearchableDropdown value={tingkat} onChange={(v) => { setTingkat(v); setRombel(""); setPage(1); }} options={tingkatOptions} label="Semua Tingkat" />
        </div>
        <div className="w-[150px] shrink-0">
          <SearchableDropdown value={rombel} onChange={(v) => { setRombel(v); setPage(1); }} options={rombelOptions} label="Semua Kelas" disabled={loadingFilters} />
        </div>
        <div className="w-[150px] shrink-0">
          <SearchableDropdown value={sso} onChange={(v) => { setSso(v as SsoFilter); setPage(1); }} options={ssoOptions} label="Semua Status" />
        </div>
        <button type="button" onClick={reset} aria-label="Reset filter" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff] hover:text-[#6c5dd3]"><RefreshCw className="size-[18px]" /></button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-[#f1f4f9] text-xs font-semibold text-[#181c20]">
            <tr>
              <th className="px-6 py-3.5">Siswa</th>
              <th className="w-[150px] px-3 py-3.5">NISN</th>
              <th className="w-[220px] px-3 py-3.5">Jurusan</th>
              <th className="w-[130px] px-3 py-3.5">Kelas</th>
              <th className="w-[130px] px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5 pr-6">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eceef3]">
            {pageRows.map((s) => (
              <tr key={s.id} className="align-middle hover:bg-[#fbfcfd]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0edff] text-sm font-bold text-[#6c5dd3]">{s.fullName?.charAt(0) ?? "?"}</span>
                    <p className="min-w-0 truncate text-sm font-semibold text-[#181c20]">{s.fullName}</p>
                  </div>
                </td>
                <td className="px-3 py-4 text-xs text-[#181c20]">{s.nisn ?? "—"}</td>
                <td className="px-3 py-4 text-xs text-[#181c20]">{s.majorName ?? "—"}</td>
                <td className="px-3 py-4 text-xs text-[#181c20]">{s.className ?? "—"}</td>
                <td className="px-3 py-4 text-xs">
                  {s.isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      Butuh Aktivasi
                    </span>
                  )}
                </td>
                <td className="px-3 py-4 pr-6 text-xs text-[#4e566c]">{s.email ?? "—"}</td>
              </tr>
            ))}
            {!pageRows.length && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-[#787584]">{error ?? "Tidak ada siswa yang cocok dengan filter."}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 bg-[#f8f9fc] px-6 py-4 text-[11px] text-[#4e566c] lg:flex-row lg:items-center lg:justify-between">
        <span>Menampilkan <b className="font-semibold text-[#181c20]">{startRow}–{endRow}</b> dari <b className="font-semibold text-[#181c20]">{students.length} Siswa</b></span>
        <nav aria-label="Paginasi siswa" className="flex items-center gap-1 text-sm">
          <button type="button" aria-label="Halaman sebelumnya" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#eceef3] disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          {pageWindow(currentPage, totalPages).map((n) => (
            <button key={n} type="button" aria-current={currentPage === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${currentPage === n ? "bg-[#4331a8] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}>{n}</button>
          ))}
          <button type="button" aria-label="Halaman berikutnya" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] hover:bg-[#eceef3] disabled:opacity-40"><ChevronRight className="size-4" /></button>
        </nav>
      </div>
    </section>
  );
}
