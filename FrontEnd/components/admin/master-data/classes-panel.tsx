"use client";

import { useMemo, useState } from "react";
import { CirclePlus, Search } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type { GradeLevel, Major, SchoolClass } from "@/lib/api/master-data";
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

type FormState = { mode: "create" } | { mode: "edit"; item: SchoolClass } | null;

export function ClassesPanel({
  classes,
  majors,
  gradeLevels,
  isAdmin,
  onChanged,
}: {
  classes: SchoolClass[];
  majors: Major[];
  gradeLevels: GradeLevel[];
  isAdmin: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");
  const [majorId, setMajorId] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState("");
  const [form, setForm] = useState<FormState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes.filter((item) => {
      if (majorId && item.majorId !== majorId) return false;
      if (gradeLevelId && item.gradeLevelId !== gradeLevelId) return false;
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !(item.majorName ?? "").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [classes, query, majorId, gradeLevelId]);

  const fields: FieldDef[] = [
    { key: "name", label: "Nama Kelas", required: true, placeholder: "X RPL A" },
    { key: "section", label: "Section", required: true, placeholder: "A" },
    {
      key: "majorId",
      label: "Jurusan",
      type: "select",
      required: true,
      options: majors.map((m) => ({ value: m.id, label: `${m.code} — ${m.name}` })),
    },
    {
      key: "gradeLevelId",
      label: "Tingkatan",
      type: "select",
      required: true,
      options: gradeLevels.map((g) => ({ value: g.id, label: `${g.code} — ${g.name}` })),
    },
    { key: "capacity", label: "Kapasitas", type: "number" },
    { key: "isActive", label: "Aktif", type: "checkbox" },
  ];

  const close = () => {
    setForm(null);
    setFormError(null);
  };

  const submit = async (values: Values) => {
    setSubmitting(true);
    setFormError(null);
    const payload = {
      name: String(values.name),
      section: String(values.section),
      majorId: String(values.majorId),
      gradeLevelId: String(values.gradeLevelId),
      capacity: Number(values.capacity) || 10,
      isActive: Boolean(values.isActive),
    };
    const result =
      form?.mode === "edit"
        ? await masterDataApi.classes.update(form.item.id, payload)
        : await masterDataApi.classes.create(payload);
    setSubmitting(false);
    if (result.error) {
      setFormError(
        (result.error as { message?: string }).message ?? "Gagal menyimpan kelas"
      );
      return;
    }
    close();
    await onChanged();
  };

  const remove = async (item: SchoolClass) => {
    if (!window.confirm(`Hapus kelas ${item.name}?`)) return;
    const result = await masterDataApi.classes.remove(item.id);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ?? "Gagal menghapus kelas"
      );
      return;
    }
    await onChanged();
  };

  const toggle = async (item: SchoolClass) => {
    const result = await masterDataApi.classes.update(item.id, {
      isActive: !item.isActive,
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
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Cari kelas</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama kelas…"
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
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setMajorId("");
            setGradeLevelId("");
          }}
          className="h-10 rounded-full bg-[#f1f4f9] px-4 text-xs font-semibold text-[#4e566c] hover:bg-[#e5deff]"
        >
          Reset
        </button>
      </div>

      <PanelCard>
        <PanelHeader
          title="Daftar Kelas"
          subtitle="Rombongan belajar per jurusan dan tingkatan"
          count={rows.length}
          actions={
            isAdmin ? (
              <button
                type="button"
                onClick={() => setForm({ mode: "create" })}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#5343b9] px-3 text-xs font-semibold text-white hover:bg-[#4331a8]"
              >
                <CirclePlus className="size-3.5" /> Tambah Kelas
              </button>
            ) : null
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-[#f1f4f9]">
              <tr>
                <th className={thClass}>Kelas</th>
                <th className={thClass}>Jurusan</th>
                <th className={thClass}>Tingkatan</th>
                <th className={thClass}>Section</th>
                <th className={thClass}>Kapasitas</th>
                <th className={thClass}>Siswa</th>
                <th className={thClass}>Guru</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {rows.map((item) => (
                <tr key={item.id} className="hover:bg-[#fbfcfd]">
                  <td className={`${tdClass} font-semibold`}>{item.name}</td>
                  <td className={tdClass}>
                    <span className="rounded-full bg-[#f0edff] px-2 py-1 text-[10px] font-semibold text-[#4331a8]">
                      {item.majorCode ?? "—"}
                    </span>
                  </td>
                  <td className={tdClass}>{item.gradeCode ?? "—"}</td>
                  <td className={tdClass}>{item.section}</td>
                  <td className={tdClass}>{item.capacity}</td>
                  <td className={tdClass}>{item.studentCount}</td>
                  <td className={tdClass}>{item.teacherCount}</td>
                  <td className={tdClass}>
                    <StatusBadge active={item.isActive} />
                  </td>
                  <td className={tdClass}>
                    <RowActions
                      canEdit={isAdmin}
                      active={item.isActive}
                      onEdit={() => setForm({ mode: "edit", item })}
                      onDelete={() => void remove(item)}
                      onToggle={() => void toggle(item)}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <EmptyRow colSpan={9} message="Belum ada kelas yang cocok." />
              ) : null}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {form !== null ? (
        <EntityModal
          open
          title={form?.mode === "edit" ? "Ubah Kelas" : "Tambah Kelas"}
        fields={fields}
        initial={
          form?.mode === "edit"
            ? {
                name: form.item.name,
                section: form.item.section,
                majorId: form.item.majorId,
                gradeLevelId: form.item.gradeLevelId,
                capacity: form.item.capacity,
                isActive: form.item.isActive,
              }
            : { capacity: 10, isActive: true }
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
