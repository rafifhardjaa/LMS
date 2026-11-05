"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  KeyRound,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCircle,
  UserPlus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormState {
  fullName: string;
  nomorInduk: string;
  tanggalLahir: string;
  email: string;
  major: string;
  gradeLevel: string;
  className: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const MAJORS = [
  { value: "AKL", label: "Akuntansi dan Keuangan Lembaga (AKL)" },
  { value: "BDG", label: "Bisnis Digital (BDG)" },
  { value: "DKV", label: "Desain Komunikasi Visual (DKV)" },
  { value: "HTL", label: "Perhotelan (HTL)" },
  { value: "KUL", label: "Kuliner (KUL)" },
  { value: "RPL", label: "Rekayasa Perangkat Lunak (RPL)" },
  { value: "TKJ", label: "Teknik Komputer dan Jaringan (TKJ)" },
  { value: "TKR", label: "Teknik Kendaraan Ringan (TKR)" },
];

const GRADE_LEVELS = [
  { value: "X", label: "Kelas X (Fase E)" },
  { value: "XI", label: "Kelas XI (Fase F)" },
  { value: "XII", label: "Kelas XII (Fase F)" },
];

const CLASS_OPTIONS = MAJORS.flatMap((major) =>
  GRADE_LEVELS.map((grade) => ({
    value: `${grade.value} ${major.value} A`,
    label: `${grade.value} ${major.value} A`,
    major: major.value,
    grade: grade.value,
  }))
);

const EMPTY_FORM: FormState = {
  fullName: "",
  nomorInduk: "",
  tanggalLahir: "",
  email: "",
  major: "",
  gradeLevel: "",
  className: "",
};

function normalizeNomorInduk(value: string) {
  return value.replace(/\D/g, "");
}

function buildDefaultPassword(tanggalLahir: string, nomorInduk: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahir)) return "";
  const [year, month, day] = tanggalLahir.split("-");
  const digits = normalizeNomorInduk(nomorInduk);
  if (digits.length < 3) return "";
  return `${day}${month}${year}${digits.slice(-3)}`;
}

function slugifyEmail(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".");
  return slug ? `${slug}@smkmataram.sch.id` : "";
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-[#4e566c]">
      {children}
      {required ? <span className="text-[#ba1a1a]"> *</span> : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] font-medium text-[#ba1a1a]">{message}</p>;
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-xs font-medium text-slate-800 outline-none transition-all focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#787584]" />
    </div>
  );
}

export function AddStudentDialog({ open, onOpenChange, onSuccess }: AddStudentDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const resetState = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
    setEmailTouched(false);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onNameChange = (value: string) =>
    setForm((prev) => ({
      ...prev,
      fullName: value,
      email: emailTouched ? prev.email : slugifyEmail(value),
    }));

  const onPlacementChange = (key: "major" | "gradeLevel", value: string) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      const valid = CLASS_OPTIONS.some(
        (option) =>
          option.value === next.className &&
          (!next.major || option.major === next.major) &&
          (!next.gradeLevel || option.grade === next.gradeLevel)
      );
      if (!valid) next.className = "";
      return next;
    });

  const classOptions = CLASS_OPTIONS.filter(
    (option) =>
      (!form.major || option.major === form.major) &&
      (!form.gradeLevel || option.grade === form.gradeLevel)
  );

  const defaultPassword = buildDefaultPassword(form.tanggalLahir, form.nomorInduk);

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    const digits = normalizeNomorInduk(form.nomorInduk);

    if (!form.fullName.trim()) next.fullName = "Nama lengkap wajib diisi";
    if (!digits) {
      next.nomorInduk = "NISN / Nomor Induk wajib diisi";
    } else if (digits.length < 3) {
      next.nomorInduk = "Nomor induk minimal 3 digit";
    }
    if (!form.tanggalLahir) next.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!form.major) next.major = "Konsentrasi keahlian wajib dipilih";
    if (!form.gradeLevel) next.gradeLevel = "Tingkat / fase wajib dipilih";
    if (!form.className) next.className = "Kelas / rombel wajib dipilih";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Format surel tidak valid";
    }

    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    window.setTimeout(() => {
      toast.success("Siswa baru siap didaftarkan", {
        description: `${form.fullName.trim()} (${normalizeNomorInduk(form.nomorInduk)}) - ${form.className} dengan kata sandi awal ${defaultPassword}.`,
      });
      onSuccess?.();
      resetState();
      onOpenChange(false);
    }, 450);
  };

  const handleCancel = () => {
    if (submitting) return;
    resetState();
    onOpenChange(false);
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetState();
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-slate-900/60 backdrop-blur-sm supports-backdrop-filter:backdrop-blur-sm"
        className="flex max-h-[calc(100dvh-10rem)] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:w-full sm:max-w-4xl"
      >
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#6c5dd3] to-indigo-700 px-7 py-6 text-white">
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-44 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-md">
                <UserPlus className="size-7" />
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    Tambah Peserta Didik / Siswa Baru
                  </DialogTitle>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-sm">
                    SMK Mataram SSO
                  </span>
                </div>
                <DialogDescription className="max-w-2xl text-xs leading-relaxed text-white/80">
                  Daftarkan identitas siswa, penempatan rombel, dan kredensial akun yang dibuat otomatis.
                </DialogDescription>
              </div>
            </div>
            <button
              type="button"
              aria-label="Tutup modal"
              onClick={handleCancel}
              disabled={submitting}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form
          id="add-student-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-[#e5deff] bg-[#f5f3ff] p-4">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-[#6c5dd3]" />
            <div>
              <p className="text-xs font-bold text-[#4331a8]">Akun dibuat otomatis</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#4e566c]">
                Siswa langsung aktif. Kata sandi awal dihitung dari tanggal lahir dan 3 digit terakhir nomor
                induk, lalu wajib diganti pada login pertama.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-b border-[#eceef3] pb-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">
                  1
                </span>
                <h3 className="text-sm font-bold text-[#181c20]">Identitas Resmi Siswa</h3>
              </div>
              <span className="text-[11px] font-medium text-[#787584]">* Kolom wajib diisi</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel required>Nama Lengkap Siswa</FieldLabel>
                <div className="relative">
                  <UserCircle className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Contoh: Pawell Bennett"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <FieldError message={errors.fullName} />
              </div>

              <div>
                <FieldLabel required>NISN / Nomor Induk</FieldLabel>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.nomorInduk}
                    onChange={(e) => setField("nomorInduk", normalizeNomorInduk(e.target.value))}
                    placeholder="Contoh: 0067829102"
                    className={`${inputClass} pl-10 font-mono`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#787584]">Hanya angka, minimal 3 digit.</p>
                <FieldError message={errors.nomorInduk} />
              </div>

              <div>
                <FieldLabel required>Tanggal Lahir</FieldLabel>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                  <input
                    type="date"
                    value={form.tanggalLahir}
                    onChange={(e) => setField("tanggalLahir", e.target.value)}
                    className={`${inputClass} pl-10 font-mono`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#787584]">Format YYYY-MM-DD.</p>
                <FieldError message={errors.tanggalLahir} />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel>Email Institusi (Opsional)</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setEmailTouched(true);
                      setField("email", e.target.value);
                    }}
                    placeholder="nama.siswa@smkmataram.sch.id"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#787584]">
                  Dibuat otomatis dari nama, bisa diubah. Kosongkan jika siswa login memakai nomor induk.
                </p>
                <FieldError message={errors.email} />
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-[#eceef3]" />

          <div>
            <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">
                2
              </span>
              <h3 className="text-sm font-bold text-[#181c20]">Penempatan Rombongan Belajar (Rombel)</h3>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FieldLabel required>Konsentrasi Keahlian</FieldLabel>
                <SelectInput
                  value={form.major}
                  onChange={(value) => onPlacementChange("major", value)}
                  options={MAJORS}
                  placeholder="Pilih jurusan"
                />
                <FieldError message={errors.major} />
              </div>

              <div>
                <FieldLabel required>Tingkat / Fase</FieldLabel>
                <SelectInput
                  value={form.gradeLevel}
                  onChange={(value) => onPlacementChange("gradeLevel", value)}
                  options={GRADE_LEVELS}
                  placeholder="Pilih tingkat"
                />
                <FieldError message={errors.gradeLevel} />
              </div>

              <div>
                <FieldLabel required>Kelas / Rombel</FieldLabel>
                <SelectInput
                  value={form.className}
                  onChange={(value) => setField("className", value)}
                  options={classOptions}
                  placeholder={classOptions.length ? "Pilih kelas" : "Pilih jurusan & tingkat dulu"}
                />
                <p className="mt-1 text-[10px] text-[#787584]">
                  Tersimpan pada users.class_id (tabel classes).
                </p>
                <FieldError message={errors.className} />
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-[#eceef3]" />

          <div>
            <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">
                3
              </span>
              <h3 className="text-sm font-bold text-[#181c20]">Akun &amp; Kredensial Otomatis</h3>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Peran Akun</FieldLabel>
                <div className="flex h-11 items-center gap-2 rounded-xl bg-[#f1f4f9] px-3.5 text-xs font-medium text-[#181c20]">
                  <ShieldCheck className="size-[18px] text-[#6c5dd3]" />
                  Siswa
                </div>
              </div>

              <div>
                <FieldLabel>Status Akun</FieldLabel>
                <div className="flex h-11 items-center gap-2 rounded-xl bg-[#f1f4f9] px-3.5 text-xs font-medium text-[#181c20]">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Aktif
                </div>
              </div>

              <div className="sm:col-span-2">
                <FieldLabel>Kata Sandi Awal (Otomatis)</FieldLabel>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-dashed border-[#c9c4d5] bg-[#f8f9fc] px-3.5 font-mono text-xs font-semibold text-[#6c5dd3]">
                  <KeyRound className="size-[18px] shrink-0 text-[#787584]" />
                  {defaultPassword || (
                    <span className="font-sans font-normal text-[#787584]">
                      Terisi otomatis setelah nomor induk dan tanggal lahir lengkap.
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-[#787584]">
                  Siswa wajib mengganti kata sandi ini pada login pertama.
                </p>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 flex flex-col shrink-0 items-center justify-between gap-4 border-t border-[#eceef3] bg-[#f1f4f9] px-7 py-4 sm:flex-row">
          <div className="flex items-center gap-2 text-[#4e566c]">
            <BadgeCheck className="size-[18px] shrink-0 text-emerald-600" />
            <span className="text-[11px]">Akun siswa dibuat sesuai skema users &amp; user_roles.</span>
          </div>
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="rounded-full bg-[#eceef3] px-5 py-2.5 text-xs font-semibold text-[#4e566c] transition-colors hover:bg-[#e0e2e7] disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              form="add-student-form"
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-[#6c5dd3] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6c5dd3]/30 transition-all hover:bg-[#5343b9] disabled:opacity-60"
            >
              <CheckCircle2 className="size-[18px]" />
              {submitting ? "Menyimpan..." : "Simpan & Daftarkan Siswa"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
