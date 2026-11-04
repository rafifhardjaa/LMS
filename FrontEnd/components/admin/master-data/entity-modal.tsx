"use client";

import { useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";

export type FieldOption = { value: string; label: string };

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "checkbox" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  colSpan?: 1 | 2;
  help?: string;
};

export type Values = Record<string, string | number | boolean>;

export function EntityModal({
  open,
  title,
  description,
  fields,
  initial,
  submitting,
  error,
  submitLabel = "Simpan",
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial?: Values;
  submitting?: boolean;
  error?: string | null;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (values: Values) => void | Promise<void>;
}) {
  const defaults = useMemo(() => {
    const base: Values = {};
    for (const field of fields) {
      const value = initial?.[field.key];
      if (value !== undefined) {
        base[field.key] = value;
      } else if (field.type === "checkbox") {
        base[field.key] = true;
      } else if (field.type === "number") {
        base[field.key] = 1;
      } else {
        base[field.key] = "";
      }
    }
    return base;
  }, [fields, initial]);

  const [values, setValues] = useState<Values>(defaults);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!open) return null;

  const setValue = (key: string, value: string | number | boolean) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    for (const field of fields) {
      if (field.required && !String(values[field.key] ?? "").trim()) {
        setLocalError(`${field.label} wajib diisi`);
        return;
      }
    }
    setLocalError(null);
    await onSubmit(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#181c20]/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eef0f5] bg-white p-6 shadow-[0_24px_60px_rgba(32,44,90,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#181c20]">{title}</h2>
            {description ? (
              <p className="mt-1 text-xs text-[#4e566c]">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#eceef3]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const colSpan = field.colSpan === 2 ? "sm:col-span-2" : "";
            if (field.type === "checkbox") {
              return (
                <label
                  key={field.key}
                  className={`flex items-center gap-2 text-sm text-[#181c20] ${colSpan}`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(values[field.key])}
                    onChange={(e) => setValue(field.key, e.target.checked)}
                    className="size-4 accent-[#6c5dd3]"
                  />
                  {field.label}
                </label>
              );
            }

            return (
              <label key={field.key} className={`flex flex-col gap-1.5 ${colSpan}`}>
                <span className="text-xs font-semibold text-[#4e566c]">
                  {field.label}
                  {field.required ? <span className="text-[#c0262d]"> *</span> : null}
                </span>
                {field.type === "select" ? (
                  <select
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    className="h-11 rounded-xl bg-[#f1f4f9] px-3 text-sm text-[#181c20] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30"
                  >
                    <option value="">Pilih {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="rounded-xl bg-[#f1f4f9] px-3 py-2.5 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    min={field.type === "number" ? 1 : undefined}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) =>
                      setValue(
                        field.key,
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                    placeholder={field.placeholder}
                    className="h-11 rounded-xl bg-[#f1f4f9] px-3 text-sm text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
                  />
                )}
                {field.help ? (
                  <span className="text-[10px] text-[#787584]">{field.help}</span>
                ) : null}
              </label>
            );
          })}
        </div>

        {localError || error ? (
          <p className="mt-4 rounded-xl bg-[#fdecec] px-3 py-2 text-xs font-medium text-[#c0262d]">
            {localError ?? error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-5 text-sm font-semibold text-white hover:bg-[#4331a8] disabled:opacity-60"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
