"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { masterDataApi } from "@/lib/api/master-data";
import { Subject, TeacherSummary } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
} from "lucide-react";

const statusStyle: Record<string, string> = {
  Aktif: "bg-[#ecfdf5] text-[#047857]",
  "Menunggu Verifikasi": "bg-[#fff7ed] text-[#b45309]",
  Cuti: "bg-[#fff7ed] text-[#b45309]",
};

function teacherGrades(classrooms: string | null): string[] {
  const grades = new Set<string>();
  for (const name of (classrooms ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)) {
    if (name.startsWith("XII ")) grades.add("XII");
    else if (name.startsWith("XI ")) grades.add("XI");
    else if (name.startsWith("X ")) grades.add("X");
  }
  return [...grades];
}

function matchesLoadFilter(scheduleCount: number, filter: string): boolean {
  switch (filter) {
    case "lte10":
      return scheduleCount <= 10;
    case "11-20":
      return scheduleCount >= 11 && scheduleCount <= 20;
    case "21-30":
      return scheduleCount >= 21 && scheduleCount <= 30;
    case "gt30":
      return scheduleCount > 30;
    default:
      return true;
  }
}

function teacherMajors(
  classrooms: string | null,
  majorNameToCode: Record<string, string>
): string[] {
  const majors = new Set<string>();
  for (const name of (classrooms ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)) {
    const parts = name.split(" ");
    const majorLabel =
      parts.length >= 3 ? parts.slice(1, -1).join(" ") : parts.slice(1).join(" ");
    if (!majorLabel) continue;
    majors.add(majorNameToCode[majorLabel] ?? majorLabel);
  }
  return [...majors];
}

export function TeachersTable({ isAdmin, onTeacherAdded }: { isAdmin: boolean; onTeacherAdded?: () => void }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [loadFilter, setLoadFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [page, setPage] = useState(1);
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const subjectsLoadedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await masterDataApi.teachers.list(query || undefined, statusFilter || undefined);
      if (res.error) throw new Error((res.error as { message?: string }).message ?? "Gagal memuat guru");
      setTeachers(res.data?.data ?? []);
      if (!subjectsLoadedRef.current) {
        const subjectRes = await masterDataApi.subjects.list();
        if (!subjectRes.error) {
          subjectsLoadedRef.current = true;
          setAllSubjects(subjectRes.data?.data ?? []);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat guru");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [query, statusFilter]);

  const majorNameToCode = useMemo(() => {
    const map: Record<string, string> = {};
    for (const subject of allSubjects) {
      if (subject.majorCode && subject.majorName) {
        map[subject.majorName] = subject.majorCode;
      }
    }
    return map;
  }, [allSubjects]);

  const subjectOptions: JurusanOption[] = useMemo(() => {
    const names = allSubjects.length
      ? allSubjects
          .filter(
            (s) =>
              (!fieldFilter || s.majorCode === fieldFilter || s.majorCode === null) &&
              (!gradeFilter || s.gradeCode === gradeFilter)
          )
          .map((s) => s.name)
      : teachers
          .flatMap((t) => (t.subjects ?? "").split(","))
          .map((name) => name.trim())
          .filter(Boolean);
    return [
      { value: "", label: "Semua Mapel" },
      ...[...new Set(names)].filter(Boolean).sort().map((name) => ({ value: name, label: name })),
    ];
  }, [allSubjects, teachers, fieldFilter, gradeFilter]);

  const effectiveSubjectFilter = subjectOptions.some((option) => option.value === subjectFilter)
    ? subjectFilter
    : "";

  const rows = useMemo(() => teachers.filter((t) => {
    const q = query.trim().toLowerCase();
    const subjectQuery = effectiveSubjectFilter.trim().toLowerCase();
    return (!q || [t.fullName, t.nomorInduk, t.kodeGuru, t.email].some((v) => (v ?? "").toLowerCase().includes(q)))
      && (!statusFilter || (t.isActive ? "Aktif" : "Nonaktif") === statusFilter)
      && (!fieldFilter || teacherMajors(t.classrooms, majorNameToCode).includes(fieldFilter))
      && (!gradeFilter || teacherGrades(t.classrooms).includes(gradeFilter))
      && matchesLoadFilter(t.scheduleCount, loadFilter)
      && (!subjectQuery || (t.subjects ?? "").toLowerCase().includes(subjectQuery));
  }), [teachers, query, statusFilter, fieldFilter, gradeFilter, loadFilter, effectiveSubjectFilter, majorNameToCode]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => {
    setQuery("");
    setStatusFilter("");
    setFieldFilter("");
    setGradeFilter("");
    setLoadFilter("");
    setSubjectFilter("");
    setPage(1);
  };

  const statusOptions: JurusanOption[] = [
    { value: "", label: "Semua Status" },
    { value: "Aktif", label: "Aktif" },
    { value: "Nonaktif", label: "Nonaktif" },
  ];
  const fieldOptions: JurusanOption[] = [
    { value: "", label: "Semua Bidang" },
    ...[...new Set(teachers.map((t) => t.majorCode).filter(Boolean))].map((code) => ({ value: code as string, label: code as string })),
  ];
  const gradeOptions: JurusanOption[] = [
    { value: "", label: "Semua Tingkat" },
    { value: "X", label: "Kelas X" },
    { value: "XI", label: "Kelas XI" },
    { value: "XII", label: "Kelas XII" },
  ];
  const loadOptions: JurusanOption[] = [
    { value: "", label: "Semua Beban" },
    { value: "lte10", label: "≤ 10 sesi/mgg" },
    { value: "11-20", label: "11–20 sesi/mgg" },
    { value: "21-30", label: "21–30 sesi/mgg" },
    { value: "gt30", label: "> 30 sesi/mgg" },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e0e2e7] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-3 border-b border-[#eceef3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-[#181c20]">Daftar Pendidik & Pengampu</h2>
          <span className="rounded-full bg-[#e5deff] px-2.5 py-1 text-[11px] font-semibold text-[#4331a8]">Total {rows.length} Guru</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b border-[#eceef3] px-5 py-4 md:flex-row md:flex-wrap md:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" aria-hidden="true" />
          <input aria-label="Cari guru" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Cari nama guru, kode guru, NIP, atau email..." className="h-11 w-full rounded-full bg-[#f1f4f9] pl-10 pr-4 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" />
        </label>
        <div className="w-[190px] shrink-0">
          <SearchableDropdown value={fieldFilter} onChange={(v) => { setFieldFilter(v); setPage(1); }} options={fieldOptions} label="Semua Bidang" />
        </div>
        <div className="w-[190px] shrink-0">
          <SearchableDropdown value={gradeFilter} onChange={(v) => { setGradeFilter(v); setPage(1); }} options={gradeOptions} label="Semua Tingkat" />
        </div>
        <div className="w-[190px] shrink-0">
          <SearchableDropdown value={loadFilter} onChange={(v) => { setLoadFilter(v); setPage(1); }} options={loadOptions} label="Semua Beban" />
        </div>
        <div className="w-[190px] shrink-0">
          <SearchableDropdown value={subjectFilter} onChange={(v) => { setSubjectFilter(v); setPage(1); }} options={subjectOptions} label="Semua Mapel" />
        </div>
        <div className="w-[190px] shrink-0">
          <SearchableDropdown value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} options={statusOptions} label="Semua Status" />
        </div>
        <button type="button" onClick={reset} aria-label="Reset filter" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff] hover:text-[#6c5dd3]"><RefreshCw className="size-[18px]" /></button>
      </div>
      <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-[#f8f9fc] text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">
              <tr><th className="px-5 py-3">Nama</th><th className="px-5 py-3">Kode Guru</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">NIP</th><th className="px-5 py-3">Jurusan</th><th className="px-5 py-3">Kelas</th><th className="px-5 py-3">Jam/Mgg</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {paged.map((teacher) => (
                <tr key={teacher.id} className="align-middle hover:bg-[#fbfcfd]">
                  <td className="px-5 py-4 text-sm font-medium text-[#181c20]">{teacher.fullName}</td>
                  <td className="px-5 py-4 text-xs font-semibold tracking-wide text-[#4331a8]">{teacher.kodeGuru ?? "—"}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#181c20]">{teacher.email ?? "—"}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#181c20]">{teacher.nomorInduk ?? "—"}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#181c20]">{teacher.majorName ?? "—"}</td>
                  <td className="px-5 py-4" title={teacher.classrooms ?? undefined}>
                    <span className="text-sm font-semibold text-[#181c20]">{teacher.classCount}</span>
                    <span className="ml-1 text-[10px] text-[#787584]">kelas</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-[#181c20]">{teacher.scheduleCount}</span>
                    <span className="ml-1 text-[10px] text-[#787584]">sesi</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[#181c20]"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${teacher.isActive ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#fff7ed] text-[#b45309]"}`}><span className="size-1.5 rounded-full bg-current" />{teacher.isActive ? "Aktif" : "Nonaktif"}</span></td>
                </tr>
              ))}
              {!paged.length && <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-[#787584]">Tidak ada guru yang cocok dengan filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-[#eceef3] px-5 py-3 text-[11px] text-[#787584] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><RefreshCw className="size-3.5 text-[#059669]" /> Terakhir disinkronkan dengan Dapodik Kemendikbud</span><nav aria-label="Paginasi guru" className="flex items-center gap-1"><button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] hover:bg-[#f1f4f9] disabled:opacity-40"><ChevronLeft className="size-4" /></button>{Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => <button key={n} type="button" aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#e5deff] text-[#6c5dd3]" : "text-[#4e566c] hover:bg-[#f1f4f9]"}`}>{n}</button>)}<button type="button" aria-label="Halaman berikutnya" disabled={page >= pageCount} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#f1f4f9] disabled:opacity-40"><ChevronRight className="size-4" /></button></nav></div>
    </section>
  );
}
