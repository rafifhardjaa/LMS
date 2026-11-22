"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { masterDataApi, type SchoolClass, type TeacherSummary } from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

const PAGE_SIZE = 10;

type AdvisorStatusFilter = "" | "assigned" | "unassigned";

export function WaliKelasTable({
  onPlacement,
}: {
  onPlacement: () => void;
}) {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [majorId, setMajorId] = useState("");
  const [advisorStatus, setAdvisorStatus] = useState<AdvisorStatusFilter>("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [classesRes, teachersRes] = await Promise.all([
        masterDataApi.classes.list({ includeInactive: true }),
        masterDataApi.teachers.list(),
      ]);
      const firstError = classesRes.error ?? teachersRes.error;
      if (firstError) {
        throw new Error(
          (firstError as { message?: string }).message ??
            (firstError as { error?: string }).error ??
            "Gagal memuat data wali kelas"
        );
      }
      setClasses(classesRes.data?.data ?? []);
      setTeachers(teachersRes.data?.data ?? []);
    } catch (err) {
      setClasses([]);
      setTeachers([]);
      setError(err instanceof Error ? err.message : "Gagal memuat data wali kelas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const teacherById = useMemo(
    () => new Map(teachers.map((teacher) => [teacher.id, teacher])),
    [teachers]
  );

  const gradeOptions: JurusanOption[] = useMemo(() => {
    const map = new Map<string, string>();
    for (const classItem of classes) {
      map.set(classItem.gradeLevelId, classItem.gradeCode ?? classItem.gradeName ?? "-");
    }
    return [
      { value: "", label: "Semua Tingkat" },
      ...[...map.entries()]
        .sort((first, second) => first[1].localeCompare(second[1]))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [classes]);

  const majorOptions: JurusanOption[] = useMemo(() => {
    const map = new Map<string, string>();
    for (const classItem of classes) {
      map.set(
        classItem.majorId,
        classItem.majorCode
          ? `${classItem.majorCode} - ${classItem.majorName ?? ""}`.trim()
          : classItem.majorName ?? "-"
      );
    }
    return [
      { value: "", label: "Semua Jurusan" },
      ...[...map.entries()]
        .sort((first, second) => first[1].localeCompare(second[1]))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [classes]);

  const statusOptions: JurusanOption[] = [
    { value: "", label: "Semua Status Wali" },
    { value: "assigned", label: "Sudah Ada Wali" },
    { value: "unassigned", label: "Belum Ada Wali" },
  ];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes.filter((classItem) => {
      const matchesQuery =
        !q ||
        [
          classItem.name,
          classItem.section,
          classItem.gradeCode,
          classItem.gradeName,
          classItem.majorCode,
          classItem.majorName,
          classItem.advisorName,
        ].some((value) => (value ?? "").toLowerCase().includes(q));
      const matchesGrade = !gradeId || classItem.gradeLevelId === gradeId;
      const matchesMajor = !majorId || classItem.majorId === majorId;
      const matchesAdvisor =
        advisorStatus === "" ||
        (advisorStatus === "assigned" ? Boolean(classItem.advisorId) : !classItem.advisorId);
      return matchesQuery && matchesGrade && matchesMajor && matchesAdvisor;
    });
  }, [advisorStatus, classes, gradeId, majorId, query]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, rows]
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#eceef3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-[#181c20]">Daftar Wali Kelas</h2>
          <span className="rounded-full bg-[#e5deff] px-2.5 py-1 text-[11px] font-semibold text-[#4331a8]">
            Total {rows.length} Kelas
          </span>
        </div>
        <motion.button
          type="button"
          onClick={onPlacement}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e0e2e7] bg-white px-4 text-sm font-semibold text-[#181c20] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#f8f9fc]"
        >
          <UserRoundCheck className="size-4 text-[#5343b9]" /> Penempatan
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-2 border-b border-[#eceef3] px-5 pb-4 sm:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <label className="relative">
          <span className="sr-only">Cari kelas atau wali kelas</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari kelas, jurusan, atau wali kelas..."
            className="h-11 w-full rounded-full bg-[#f1f4f9] pl-10 pr-3 text-xs outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
          />
        </label>
        <SearchableDropdown
          value={gradeId}
          onChange={(value) => {
            setGradeId(value);
            setPage(1);
          }}
          options={gradeOptions}
          label="Semua Tingkat"
          textClassName="text-[#64748B]"
        />
        <SearchableDropdown
          value={majorId}
          onChange={(value) => {
            setMajorId(value);
            setPage(1);
          }}
          options={majorOptions}
          label="Semua Jurusan"
          textClassName="text-[#64748B]"
        />
        <SearchableDropdown
          value={advisorStatus}
          onChange={(value) => {
            setAdvisorStatus(value as AdvisorStatusFilter);
            setPage(1);
          }}
          options={statusOptions}
          label="Semua Status Wali"
          textClassName="text-[#64748B]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead className="bg-[#f1f4f9]">
            <tr>
              <th className="px-3 py-3 pl-5 text-[11px] font-semibold text-[#4e566c]">Kelas</th>
              <th className="px-3 py-3 text-[11px] font-semibold text-[#4e566c]">Tingkat</th>
              <th className="px-3 py-3 text-[11px] font-semibold text-[#4e566c]">Jurusan</th>
              <th className="px-3 py-3 text-[11px] font-semibold text-[#4e566c]">Wali Kelas</th>
              <th className="px-3 py-3 text-[11px] font-semibold text-[#4e566c]">NIP / Kode</th>
              <th className="px-3 py-3 text-[11px] font-semibold text-[#4e566c]">Siswa</th>
              <th className="px-3 py-3 pr-5 text-[11px] font-semibold text-[#4e566c]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eceef3]">
            {pageRows.map((classItem) => {
              const teacher = classItem.advisorId
                ? teacherById.get(classItem.advisorId)
                : null;
              return (
                <tr key={classItem.id} className="hover:bg-[#fbfcfd]">
                  <td className="px-3 py-4 pl-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f4f2ff] text-[#6c5dd3]">
                        <GraduationCap className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#181c20]">{classItem.name}</p>
                        <p className="text-[10px] text-[#787584]">Section {classItem.section}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-xs font-medium text-[#4e566c]">
                    {classItem.gradeCode ?? classItem.gradeName ?? "-"}
                  </td>
                  <td className="px-3 py-4">
                    <p className="text-xs font-semibold text-[#181c20]">{classItem.majorCode ?? "-"}</p>
                    <p className="text-[10px] text-[#787584]">{classItem.majorName ?? "-"}</p>
                  </td>
                  <td className="px-3 py-4">
                    {classItem.advisorName ? (
                      <p className="text-xs font-semibold text-[#181c20]">{classItem.advisorName}</p>
                    ) : (
                      <span className="inline-flex rounded-full bg-[#fef3c7] px-2 py-1 text-[10px] font-semibold text-[#d97706]">
                        Belum ditetapkan
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-xs text-[#4e566c]">
                    {teacher?.nomorInduk ?? teacher?.kodeGuru ?? "-"}
                  </td>
                  <td className="px-3 py-4 text-xs text-[#4e566c]">
                    {classItem.studentCount}/{classItem.capacity}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                        classItem.isActive
                          ? "bg-[#e7f6ec] text-[#1a7f3c]"
                          : "bg-[#eceef3] text-[#4e566c]"
                      }`}
                    >
                      {classItem.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!pageRows.length && !loading && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#787584]">
                  {error ?? "Tidak ada kelas yang cocok dengan filter."}
                </td>
              </tr>
            )}
            {loading && !pageRows.length && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#787584]">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Memuat data wali kelas…
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#eceef3] px-5 py-3 text-[11px] text-[#787584] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <nav aria-label="Paginasi wali kelas" className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="flex size-8 items-center justify-center rounded-full text-[#787584] hover:bg-[#f1f4f9] disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <label className="flex items-center gap-2">
            <span className="sr-only">Nomor halaman</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (!Number.isFinite(next)) return;
                setPage(Math.min(totalPages, Math.max(1, Math.round(next))));
              }}
              className="h-8 w-16 rounded-full border border-[#e0e2e7] bg-white px-3 text-center text-[11px] font-semibold text-[#4e566c] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30"
            />
          </label>
          <button
            type="button"
            aria-label="Halaman berikutnya"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#f1f4f9] disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      </div>
    </section>
  );
}
