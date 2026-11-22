"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CirclePlus, Loader2, RefreshCw, Search } from "lucide-react";
import type { GradeLevel, Major, Subject } from "@/lib/api/master-data";
import {
  EmptyRow,
  PanelCard,
  PanelHeader,
  StatusBadge,
  tdClass,
  thClass,
} from "./panel-ui";
import { SearchableDropdown } from "@/components/admin/searchable-dropdown";

const PAGE_SIZE = 15;

function pageWindow(current: number, total: number): number[] {
  const size = Math.min(5, total);
  let start = Math.max(1, current - Math.floor(size / 2));
  start = Math.min(start, total - size + 1);
  return Array.from({ length: size }, (_, index) => start + index);
}

export function SubjectsPanel({
  subjects,
  majors,
  gradeLevels,
  loading = false,
  onReload,
  onAddSubject,
}: {
  subjects: Subject[];
  majors: Major[];
  gradeLevels: GradeLevel[];
  loading?: boolean;
  onReload?: () => void;
  onAddSubject?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [majorId, setMajorId] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState("");
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subjects.filter((item) => {
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.code.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (majorId && item.majorId !== majorId) return false;
      if (gradeLevelId && item.gradeLevelId !== gradeLevelId) return false;
      if (semester && item.semester !== semester) return false;
      return true;
    });
  }, [subjects, query, majorId, gradeLevelId, semester]);

  const majorOptions = useMemo(
    () => [
      { value: "", label: "Semua jurusan" },
      ...majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` })),
    ],
    [majors]
  );

  const gradeOptions = useMemo(
    () => [
      { value: "", label: "Semua tingkatan" },
      ...gradeLevels.map((g) => ({ value: g.id, label: `Kelas ${g.code}` })),
    ],
    [gradeLevels]
  );

  const semesterOptions = [
    { value: "", label: "Semua semester" },
    { value: "Ganjil", label: "Ganjil" },
    { value: "Genap", label: "Genap" },
  ];

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [rows, currentPage]
  );
  const startRow = rows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(currentPage * PAGE_SIZE, rows.length);

  return (
    <PanelCard>
      <PanelHeader
        title="Daftar Mata Pelajaran"
        subtitle="Kejuruan dan umum per tingkatan, semester, dan tahun ajaran"
        count={rows.length}
        actions={
          <>
            {onAddSubject ? (
              <button
                type="button"
                onClick={onAddSubject}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#5343b9] px-3 text-xs font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"
              >
                <CirclePlus className="size-3.5" />
                Tambah Mapel Baru
              </button>
            ) : null}
            <button
              type="button"
              onClick={onReload}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#f1f4f9] px-3 text-xs font-semibold text-[#4e566c] hover:bg-[#eceef3] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              Muat ulang
            </button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-2 border-b border-[#eceef3] px-5 pb-4 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
        <label className="relative">
          <span className="sr-only">Cari mata pelajaran</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cari kode atau nama mapel…"
            className="h-11 w-full rounded-full bg-[#f1f4f9] pl-10 pr-3 text-xs outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
          />
        </label>
        <div className="min-w-0">
          <SearchableDropdown value={majorId} onChange={(v) => { setMajorId(v); setPage(1); }} options={majorOptions} label="Semua jurusan" />
        </div>
        <div className="min-w-0">
          <SearchableDropdown value={gradeLevelId} onChange={(v) => { setGradeLevelId(v); setPage(1); }} options={gradeOptions} label="Semua tingkatan" />
        </div>
        <div className="min-w-0">
          <SearchableDropdown value={semester} onChange={(v) => { setSemester(v); setPage(1); }} options={semesterOptions} label="Semua semester" />
        </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-[#f1f4f9]">
              <tr>
                <th className={thClass}>Kode</th>
                <th className={thClass}>Nama Mapel</th>
                <th className={thClass}>Jurusan</th>
                <th className={thClass}>Tingkatan</th>
                <th className={thClass}>Semester / T.A.</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {pageRows.map((subject) => (
                <tr key={subject.id} className="hover:bg-[#fbfcfd]">
                  <td className={tdClass}>
                    <span className="rounded-full bg-[#f0edff] px-2.5 py-1 text-[10px] font-bold text-[#6c5dd3]">
                      {subject.code}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <p className="font-semibold">{subject.name}</p>
                    {subject.description ? (
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-[#787584]">
                        {subject.description}
                      </p>
                    ) : null}
                  </td>
                  <td className={tdClass}>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                        subject.majorId
                          ? "bg-[#f0edff] text-[#4331a8]"
                          : "bg-[#eceef3] text-[#4e566c]"
                      }`}
                    >
                      {subject.majorCode ?? "Umum"}
                    </span>
                  </td>
                  <td className={tdClass}>{subject.gradeCode ?? "—"}</td>
                  <td className={tdClass}>
                    <p>
                      {subject.semester}
                    </p>
                  </td>
                  <td className={tdClass}>
                    <StatusBadge active={subject.isActive} />
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <EmptyRow
                  colSpan={6}
                  message="Tidak ada mata pelajaran yang cocok dengan filter."
                />
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 bg-[#f8f9fc] px-5 py-3 text-[11px] text-[#4e566c] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Menampilkan <b className="font-semibold text-[#181c20]">{startRow}–{endRow}</b> dari{" "}
            <b className="font-semibold text-[#181c20]">{rows.length} Mapel</b>
          </span>
          <nav aria-label="Paginasi mata pelajaran" className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#eceef3] disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {pageWindow(currentPage, totalPages).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={currentPage === n ? "page" : undefined}
                onClick={() => setPage(n)}
                className={`size-8 rounded-full font-semibold ${
                  currentPage === n
                    ? "bg-[#4331a8] text-white"
                    : "text-[#181c20] hover:bg-[#eceef3]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="flex size-8 items-center justify-center rounded-full text-[#181c20] hover:bg-[#eceef3] disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        </div>
    </PanelCard>
  );
}
