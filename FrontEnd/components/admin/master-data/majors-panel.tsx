"use client";

import { useMemo, useState } from "react";
import { CirclePlus, Search } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type { Major } from "@/lib/api/master-data";
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
  { key: "code", label: "Kode Jurusan", required: true, placeholder: "RPL" },
  { key: "name", label: "Nama Jurusan", required: true, placeholder: "Rekayasa Perangkat Lunak" },
  { key: "isActive", label: "Aktif", type: "checkbox" },
];

type FormState = { mode: "create" } | { mode: "edit"; major: Major } | null;

export function MajorsPanel({
  majors,
  isAdmin,
  onChanged,
}: {
  majors: Major[];
  isAdmin: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return majors.filter(
      (item) =>
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q)
    );
  }, [majors, query]);

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
        ? await masterDataApi.majors.update(form.major.id, payload)
        : await masterDataApi.majors.create(payload);
    setSubmitting(false);
    if (result.error) {
      setFormError(
        (result.error as { message?: string }).message ?? "Gagal menyimpan jurusan"
      );
      return;
    }
    close();
    await onChanged();
  };

  const remove = async (major: Major) => {
    if (!window.confirm(`Hapus jurusan ${major.code}?`)) return;
    const result = await masterDataApi.majors.remove(major.id);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ?? "Gagal menghapus jurusan"
      );
      return;
    }
    await onChanged();
  };

  const toggle = async (major: Major) => {
    const result = await masterDataApi.majors.update(major.id, {
      isActive: !major.isActive,
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
          title="Jurusan"
          subtitle="Kelola konsentrasi keahlian SMK"
          count={rows.length}
          actions={
            <>
              <label className="relative">
                <span className="sr-only">Cari jurusan</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#4e566c]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari jurusan…"
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
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-[#f1f4f9]">
              <tr>
                <th className={thClass}>Kode</th>
                <th className={thClass}>Nama Jurusan</th>
                <th className={thClass}>Kelas</th>
                <th className={thClass}>Mapel</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {rows.map((major) => (
                <tr key={major.id} className="hover:bg-[#fbfcfd]">
                  <td className={tdClass}>
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#f0edff] text-[10px] font-bold text-[#6c5dd3]">
                      {major.code}
                    </span>
                  </td>
                  <td className={`${tdClass} font-semibold`}>{major.name}</td>
                  <td className={tdClass}>{major.classCount}</td>
                  <td className={tdClass}>{major.subjectCount}</td>
                  <td className={tdClass}>
                    <StatusBadge active={major.isActive} />
                  </td>
                  <td className={tdClass}>
                    <RowActions
                      canEdit={isAdmin}
                      active={major.isActive}
                      onEdit={() => setForm({ mode: "edit", major })}
                      onDelete={() => void remove(major)}
                      onToggle={() => void toggle(major)}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <EmptyRow colSpan={6} message="Belum ada jurusan." />
              ) : null}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {form !== null ? (
        <EntityModal
          open
        title={form?.mode === "edit" ? "Ubah Jurusan" : "Tambah Jurusan"}
        fields={fields}
        initial={
          form?.mode === "edit"
            ? {
                code: form.major.code,
                name: form.major.name,
                isActive: form.major.isActive,
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
