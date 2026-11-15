"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type { GradeLevel, Major, Subject } from "@/lib/api/master-data";
import {
  EmptyRow,
  PanelCard,
  PanelHeader,
  RowActions,
  StatusBadge,
  tdClass,
  thClass,
} from "./panel-ui";

export function SubjectsPanel({
  subjects,
  majors,
  gradeLevels,
  isAdmin,
  onChanged,
  onRequestDialog,
}: {
  subjects: Subject[];
  majors: Major[];
  gradeLevels: GradeLevel[];
  isAdmin: boolean;
  onChanged: () => Promise<void> | void;
  onRequestDialog?: (mode: "edit" | "delete", subjectId: string) => void;
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

  const toggle = async (subject: Subject) => {
    const result = await masterDataApi.subjects.update(subject.id, {
      isActive: !subject.isActive,
    });
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ?? "Gagal mengubah status"
      );
      return;
    }
    await onChanged();
  };

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
        <label className="relative">
          <span className="sr-only">Cari mata pelajaran</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode atau nama mapel…"
            className="h-10 w-full rounded-full bg-[#f1f4f9] pl-10 pr-3 text-xs outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
          />
        </label>
        <select
          value={majorId}
          onChange={(e) => setMajorId(e.target.value)}
          aria-label="Filter jurusan"
          className="h-10 rounded-full bg-[#f1f4f9] px-3 text-xs text-[#181c20] outline-none"
        >
          <option value="">Semua jurusan</option>
          {majors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.code}
            </option>
          ))}
        </select>
        <select
          value={gradeLevelId}
          onChange={(e) => setGradeLevelId(e.target.value)}
          aria-label="Filter tingkatan"
          className="h-10 rounded-full bg-[#f1f4f9] px-3 text-xs text-[#181c20] outline-none"
        >
          <option value="">Semua tingkatan</option>
          {gradeLevels.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          aria-label="Filter semester"
          className="h-10 rounded-full bg-[#f1f4f9] px-3 text-xs text-[#181c20] outline-none"
        >
          <option value="">Semua semester</option>
          <option value="Ganjil">Ganjil</option>
          <option value="Genap">Genap</option>
        </select>
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
                <th className={thClass}>Aksi</th>
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
                  <td className={tdClass}>
                    <RowActions
                      canEdit={isAdmin}
                      active={subject.isActive}
                      onEdit={() => onRequestDialog?.("edit", subject.id)}
                      onDelete={() => onRequestDialog?.("delete", subject.id)}
                      onToggle={() => void toggle(subject)}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <EmptyRow
                  colSpan={7}
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
