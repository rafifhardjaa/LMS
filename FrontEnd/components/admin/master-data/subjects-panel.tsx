"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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

export function SubjectsPanel({
  subjects,
  majors,
  gradeLevels,
}: {
  subjects: Subject[];
  majors: Major[];
  gradeLevels: GradeLevel[];
}) {
  const [query, setQuery] = useState("");
  const [majorId, setMajorId] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState("");
  const [semester, setSemester] = useState("");

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

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
        <label className="relative">
          <span className="sr-only">Cari mata pelajaran</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode atau nama mapel…"
            className="h-11 w-full rounded-full bg-[#f1f4f9] pl-10 pr-3 text-xs outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
          />
        </label>
        <div className="min-w-0">
          <SearchableDropdown value={majorId} onChange={setMajorId} options={majorOptions} label="Semua jurusan" />
        </div>
        <div className="min-w-0">
          <SearchableDropdown value={gradeLevelId} onChange={setGradeLevelId} options={gradeOptions} label="Semua tingkatan" />
        </div>
        <div className="min-w-0">
          <SearchableDropdown value={semester} onChange={setSemester} options={semesterOptions} label="Semua semester" />
        </div>
      </div>

      <PanelCard>
        <PanelHeader
          title="Daftar Mata Pelajaran"
          subtitle="Kejuruan dan umum per tingkatan, semester, dan tahun ajaran"
          count={rows.length}
        />
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
              {rows.map((subject) => (
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
              {rows.length === 0 ? (
                <EmptyRow
                  colSpan={6}
                  message="Tidak ada mata pelajaran yang cocok dengan filter."
                />
              ) : null}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </>
  );
}
