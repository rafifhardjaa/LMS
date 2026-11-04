"use client";

import { useMemo, useState } from "react";
import { CirclePlus, Search } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type { GradeLevel } from "@/lib/api/master-data";
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

const fields: FieldDef[] = [
  { key: "code", label: "Kode Tingkatan", required: true, placeholder: "X" },
  { key: "name", label: "Nama Tingkatan", required: true, placeholder: "Kelas X" },
  { key: "isActive", label: "Aktif", type: "checkbox" },
];

type FormState =
  | { mode: "create" }
  | { mode: "edit"; grade: GradeLevel }
  | null;

export function GradeLevelsPanel({
  gradeLevels,
  isAdmin,
  onChanged,
}: {
  gradeLevels: GradeLevel[];
  isAdmin: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gradeLevels.filter(
      (item) =>
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q)
    );
  }, [gradeLevels, query]);

  const close = () => {
    setForm(null);
    setFormError(null);
  };

  const submit = async (values: Values) => {
    setSubmitting(true);
    setFormError(null);
    const payload = {
      code: String(values.code),
      name: String(values.name),
      isActive: Boolean(values.isActive),
    };
    const result =
      form?.mode === "edit"
        ? await masterDataApi.gradeLevels.update(form.grade.id, payload)
        : await masterDataApi.gradeLevels.create(payload);
    setSubmitting(false);
    if (result.error) {
      setFormError(
        (result.error as { message?: string }).message ??
          "Gagal menyimpan tingkatan"
      );
      return;
    }
    close();
    await onChanged();
  };

  const remove = async (grade: GradeLevel) => {
    if (!window.confirm(`Hapus tingkatan ${grade.code}?`)) return;
    const result = await masterDataApi.gradeLevels.remove(grade.id);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ??
          "Gagal menghapus tingkatan"
      );
      return;
    }
    await onChanged();
  };

  const toggle = async (grade: GradeLevel) => {
    const result = await masterDataApi.gradeLevels.update(grade.id, {
      isActive: !grade.isActive,
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
      <PanelCard>
        <PanelHeader
          title="Tingkatan Kelas"
          subtitle="Fase/tingkat X, XI, dan XII"
          count={rows.length}
          actions={
            <>
              <label className="relative">
                <span className="sr-only">Cari tingkatan</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#4e566c]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari tingkatan…"
                  className="h-9 w-44 rounded-full bg-[#f1f4f9] pl-9 pr-3 text-xs outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
                />
              </label>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setForm({ mode: "create" })}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#5343b9] px-3 text-xs font-semibold text-white hover:bg-[#4331a8]"
                >
                  <CirclePlus className="size-3.5" /> Tambah
                </button>
              ) : null}
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-[#f1f4f9]">
              <tr>
                <th className={thClass}>Kode</th>
                <th className={thClass}>Nama Tingkatan</th>
                <th className={thClass}>Kelas</th>
                <th className={thClass}>Mapel</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {rows.map((grade) => (
                <tr key={grade.id} className="hover:bg-[#fbfcfd]">
                  <td className={tdClass}>
                    <span className="rounded-full bg-[#f0edff] px-2.5 py-1 text-[10px] font-bold text-[#6c5dd3]">
                      {grade.code}
                    </span>
                  </td>
                  <td className={`${tdClass} font-semibold`}>{grade.name}</td>
                  <td className={tdClass}>{grade.classCount}</td>
                  <td className={tdClass}>{grade.subjectCount}</td>
                  <td className={tdClass}>
                    <StatusBadge active={grade.isActive} />
                  </td>
                  <td className={tdClass}>
                    <RowActions
                      canEdit={isAdmin}
                      active={grade.isActive}
                      onEdit={() => setForm({ mode: "edit", grade })}
                      onDelete={() => void remove(grade)}
                      onToggle={() => void toggle(grade)}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <EmptyRow colSpan={6} message="Belum ada tingkatan." />
              ) : null}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {form !== null ? (
        <EntityModal
          open
          title={form?.mode === "edit" ? "Ubah Tingkatan" : "Tambah Tingkatan"}
        fields={fields}
        initial={
          form?.mode === "edit"
            ? {
                code: form.grade.code,
                name: form.grade.name,
                isActive: form.grade.isActive,
              }
            : undefined
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
