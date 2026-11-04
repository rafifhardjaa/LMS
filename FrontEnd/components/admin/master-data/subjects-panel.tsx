"use client";

import { useMemo, useState } from "react";
import { CirclePlus, FilterX, Search } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type { GradeLevel, Major, Subject } from "@/lib/api/master-data";
import { EntityModal, type FieldDef, type Values } from "./entity-modal";
import {
  EmptyRow,
  PanelCard,
  PanelHeader,
  RowActions,
  StatusBadge,
  tdClass,
  thClass,
} from "./panel-ui";

type FormState = { mode: "create" } | { mode: "edit"; subject: Subject } | null;

export function SubjectsPanel({
  subjects,
  majors,
  gradeLevels,
  isAdmin,
  onChanged,
}: {
  subjects: Subject[];
  majors: Major[];
  gradeLevels: GradeLevel[];
  isAdmin: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");
  const [majorId, setMajorId] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState("");
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [form, setForm] = useState<FormState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const years = useMemo(
    () => Array.from(new Set(subjects.map((s) => s.academicYear))).sort(),
    [subjects]
  );

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
      if (academicYear && item.academicYear !== academicYear) return false;
      return true;
    });
  }, [subjects, query, majorId, gradeLevelId, semester, academicYear]);

  const fields: FieldDef[] = [
    { key: "name", label: "Nama Mapel", required: true, colSpan: 2 },
    { key: "code", label: "Kode Mapel", required: true, placeholder: "RPL-X-1" },
    {
      key: "gradeLevelId",
      label: "Tingkatan",
      type: "select",
      required: true,
      options: gradeLevels.map((g) => ({ value: g.id, label: `${g.code} — ${g.name}` })),
    },
    {
      key: "majorId",
      label: "Jurusan",
      type: "select",
      options: [
        { value: "", label: "Umum (tanpa jurusan)" },
        ...majors.map((m) => ({ value: m.id, label: `${m.code} — ${m.name}` })),
      ],
      help: "Kosongkan untuk mata pelajaran umum.",
    },
    {
      key: "semester",
      label: "Semester",
      type: "select",
      required: true,
      options: [
        { value: "Ganjil", label: "Ganjil" },
        { value: "Genap", label: "Genap" },
      ],
    },
    {
      key: "academicYear",
      label: "Tahun Ajaran",
      required: true,
      placeholder: "2026/2027",
    },
    { key: "description", label: "Deskripsi", type: "textarea", colSpan: 2 },
    { key: "isActive", label: "Aktif", type: "checkbox" },
  ];

  const resetFilters = () => {
    setQuery("");
    setMajorId("");
    setGradeLevelId("");
    setSemester("");
    setAcademicYear("");
  };

  const close = () => {
    setForm(null);
    setFormError(null);
  };

  const submit = async (values: Values) => {
    setSubmitting(true);
    setFormError(null);
    const payload = {
      name: String(values.name),
      code: String(values.code),
      description: values.description ? String(values.description) : null,
      majorId: values.majorId ? String(values.majorId) : null,
      gradeLevelId: String(values.gradeLevelId),
      semester: String(values.semester),
      academicYear: String(values.academicYear),
      isActive: Boolean(values.isActive),
    };
    const result =
      form?.mode === "edit"
        ? await masterDataApi.subjects.update(form.subject.id, payload)
        : await masterDataApi.subjects.create(payload);
    setSubmitting(false);
    if (result.error) {
      setFormError(
        (result.error as { message?: string }).message ??
          "Gagal menyimpan mata pelajaran"
      );
      return;
    }
    close();
    await onChanged();
  };

  const remove = async (subject: Subject) => {
    if (!window.confirm(`Hapus mata pelajaran ${subject.name}?`)) return;
    const result = await masterDataApi.subjects.remove(subject.id);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ??
          "Gagal menghapus mata pelajaran"
      );
      return;
    }
    await onChanged();
  };

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
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.9fr_auto]">
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
        <select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          aria-label="Filter tahun ajaran"
          className="h-10 rounded-full bg-[#f1f4f9] px-3 text-xs text-[#181c20] outline-none"
        >
          <option value="">Semua T.A.</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-label="Reset filter"
          onClick={resetFilters}
          className="flex h-10 items-center justify-center rounded-full bg-[#f1f4f9] px-3 text-[#4e566c] hover:bg-[#e5deff]"
        >
          <FilterX className="size-4" />
        </button>
      </div>

      <PanelCard>
        <PanelHeader
          title="Daftar Mata Pelajaran"
          subtitle="Kejuruan dan umum per tingkatan, semester, dan tahun ajaran"
          count={rows.length}
          actions={
            isAdmin ? (
              <button
                type="button"
                onClick={() => setForm({ mode: "create" })}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#5343b9] px-3 text-xs font-semibold text-white hover:bg-[#4331a8]"
              >
                <CirclePlus className="size-3.5" /> Tambah Mapel
              </button>
            ) : null
          }
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
                      {subject.semester} · {subject.academicYear}
                    </p>
                  </td>
                  <td className={tdClass}>
                    <StatusBadge active={subject.isActive} />
                  </td>
                  <td className={tdClass}>
                    <RowActions
                      canEdit={isAdmin}
                      active={subject.isActive}
                      onEdit={() => setForm({ mode: "edit", subject })}
                      onDelete={() => void remove(subject)}
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

      {form !== null ? (
        <EntityModal
          open
          title={
            form?.mode === "edit" ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"
          }
        description="Mapel umum dikosongkan jurusannya; mapel kejuruan wajib memilih jurusan."
        fields={fields}
        initial={
          form?.mode === "edit"
            ? {
                name: form.subject.name,
                code: form.subject.code,
                description: form.subject.description ?? "",
                majorId: form.subject.majorId ?? "",
                gradeLevelId: form.subject.gradeLevelId,
                semester: form.subject.semester,
                academicYear: form.subject.academicYear,
                isActive: form.subject.isActive,
              }
            : {
                semester: "Ganjil",
                academicYear: "2026/2027",
                isActive: true,
              }
        }
        submitting={submitting}
        error={formError}
          onClose={close}
          onSubmit={submit}
        />
      ) : null}
    </>
  );
}
