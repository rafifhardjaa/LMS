"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  KeyRound,
  Mail,
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

interface AddTeacherDialogProps {
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
  subject: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  nomorInduk: "",
  tanggalLahir: "",
  email: "",
  major: "",
  gradeLevel: "",
  subject: "",
};

const MAJORS = [
  "Teknik Komputer & Jaringan (TKJ)",
  "Desain Komunikasi Visual (DKV)",
  "Tata Boga / Kuliner",
  "Teknik Kendaraan Ringan Otomotif (TKRO)",
  "Perhotelan",
];

const GRADE_LEVELS = [
  "Fase E - Kelas X",
  "Fase F - Kelas XI",
  "Fase F - Kelas XII",
];

const SUBJECTS = [
  "Informatika & Sains Komputasi",
  "Pemrograman Web & Mobile",
  "Jaringan Komputer & Cloud Infrastructure",
  "Matematika Tingkat Lanjut",
  "Fisika Terapan & Robotika",
];

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
  options: string[];
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#787584]" />
    </div>
  );
}

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: AddTeacherDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const resetState = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const defaultPassword = buildDefaultPassword(form.tanggalLahir, form.nomorInduk);

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    const digits = normalizeNomorInduk(form.nomorInduk);

    if (!form.fullName.trim()) next.fullName = "Nama lengkap wajib diisi";
    if (!digits) {
      next.nomorInduk = "NIP / Nomor Induk wajib diisi";
    } else if (digits.length < 3) {
      next.nomorInduk = "Nomor induk minimal 3 digit";
    }
    if (!form.tanggalLahir) next.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!form.major) next.major = "Konsentrasi keahlian wajib dipilih";
    if (!form.gradeLevel) next.gradeLevel = "Tingkat / fase wajib dipilih";
    if (!form.subject) next.subject = "Mata pelajaran wajib dipilih";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Format surel tidak valid";
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "guru",
          fullName: form.fullName,
          nomor_induk: form.nomorInduk,
          tanggal_lahir: form.tanggalLahir,
          email: form.email || null,
          major: form.major || null,
          gradeLevel: form.gradeLevel || null,
          subject: form.subject || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan guru");
      }

      toast.success("Guru baru siap diaktifkan", {
        description: `${form.fullName.trim()} (${normalizeNomorInduk(form.nomorInduk)}) dibuat dengan kata sandi awal ${defaultPassword}.`,
      });
      onSuccess?.();
      resetState();
      onOpenChange(false);
    } catch (err) {
      toast.error("Gagal menyimpan guru", {
        description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
      });
    } finally {
      setSubmitting(false);
    }
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
        className="flex max-h-[calc(100dvh-10rem)] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:w-full sm:max-w-4xl"
      >
        <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-[#6c5dd3] via-indigo-600 to-indigo-700 px-7 py-5 text-white">
          <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-md">
              <UserPlus className="size-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg font-bold tracking-tight text-white">
                  Tambah Pendidik / Guru Baru
                </DialogTitle>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  SMK Mataram SSO
                </span>
              </div>
              <DialogDescription className="mt-0.5 text-xs text-indigo-100">
                Buat akun guru aktif dari data induk: nama, nomor induk, tanggal lahir, dan surel.
              </DialogDescription>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={handleCancel}
            disabled={submitting}
            className="relative z-10 flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          id="add-teacher-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-[#e5deff] bg-[#f5f3ff] p-4">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-[#6c5dd3]" />
            <div>
              <p className="text-xs font-bold text-[#4331a8]">Kredensial dibuat otomatis</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#4e566c]">
                Akun guru langsung aktif. Kata sandi awal dihitung dari tanggal lahir dan 3 digit terakhir
                nomor induk, lalu wajib diganti saat login pertama.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-b border-[#eceef3] pb-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">
                  1
                </span>
                <h3 className="text-sm font-bold text-[#181c20]">Identitas Resmi Guru</h3>
              </div>
              <span className="text-[11px] font-medium text-[#787584]">* Kolom wajib diisi</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel required>Nama Lengkap Pendidik & Gelar</FieldLabel>
                <div className="relative">
                  <UserCircle className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    placeholder="Contoh: Bpk. Arya Wiguna, M.Cs"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <FieldError message={errors.fullName} />
              </div>

              <div>
                <FieldLabel required>NIP / Nomor Induk</FieldLabel>
                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.nomorInduk}
                    onChange={(e) => setField("nomorInduk", normalizeNomorInduk(e.target.value))}
                    placeholder="Contoh: 198705122012011004"
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
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="nama.guru@smkmataram.sch.id"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#787584]">
                  Kosongkan jika guru login memakai nomor induk.
                </p>
                <FieldError message={errors.email} />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">
                2
              </span>
              <h3 className="text-sm font-bold text-[#181c20]">Penempatan Rombel &amp; Peminatan Kejuruan</h3>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <FieldLabel required>Konsentrasi Keahlian</FieldLabel>
                <SelectInput
                  value={form.major}
                  onChange={(value) => setField("major", value)}
                  options={MAJORS}
                  placeholder="Pilih jurusan"
                />
                <FieldError message={errors.major} />
              </div>
              <div>
                <FieldLabel required>Tingkat / Fase</FieldLabel>
                <SelectInput
                  value={form.gradeLevel}
                  onChange={(value) => setField("gradeLevel", value)}
                  options={GRADE_LEVELS}
                  placeholder="Pilih tingkat"
                />
                <FieldError message={errors.gradeLevel} />
              </div>
              <div>
                <FieldLabel required>Mata Pelajaran</FieldLabel>
                <SelectInput
                  value={form.subject}
                  onChange={(value) => setField("subject", value)}
                  options={SUBJECTS}
                  placeholder="Pilih mapel"
                />
                <FieldError message={errors.subject} />
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
                  Guru
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
                  Guru wajib mengganti kata sandi ini pada login pertama.
                </p>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <BadgeCheck className="size-4 text-emerald-600" />
            <span>Akun dibuat sesuai data induk guru</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              form="add-teacher-form"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-xl bg-[#6c5dd3] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6c5dd3]/30 transition-all hover:bg-[#5343b9] disabled:opacity-60"
            >
              <CheckCircle2 className="size-4" />
              {submitting ? "Menyimpan..." : "Simpan & Aktifkan Guru"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
