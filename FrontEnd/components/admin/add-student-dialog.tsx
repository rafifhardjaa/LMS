"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Badge,
  BellRing,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  Fingerprint,
  KeyRound,
  Mail,
  MapPin,
  MessageCircle,
  School,
  ShieldCheck,
  Users,
  UserPlus,
  X,
  Zap,
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
  nisn: string;
  nik: string;
  gender: string;
  birthPlace: string;
  motherName: string;
  major: string;
  classTarget: string;
  academicYear: string;
  pip: boolean;
  industri: boolean;
  lsp: boolean;
  email: string;
  belajarEmail: string;
  studentWhatsapp: string;
  guardianWhatsapp: string;
}

const MAJORS = [
  { value: "TKJ", label: "Teknik Komputer & Jaringan (TKJ)" },
  { value: "DKV", label: "Desain Komunikasi Visual (DKV)" },
  { value: "BOGA", label: "Tata Boga / Kuliner" },
  { value: "TKRO", label: "Teknik Kendaraan Ringan Otomotif (TKRO)" },
  { value: "PERHOTELAN", label: "Perhotelan" },
];

const CLASS_TARGETS = [
  { value: "XII_TKJ_1", label: "Fase F - Kelas XII TKJ 1" },
  { value: "XII_DKV_1", label: "Fase F - Kelas XII DKV 1" },
  { value: "X_TKJ_2", label: "Fase E - Kelas X TKJ 2" },
  { value: "XI_KULINER_2", label: "Fase F - Kelas XI Kuliner 2" },
  { value: "X_TKRO_1", label: "Fase E - Kelas X TKRO 1" },
];

const ACADEMIC_YEARS = [
  { value: "2024_2025_NEW", label: "2024/2025 - Siswa Baru Reguler" },
  { value: "2024_2025_TRANSFER", label: "2024/2025 - Pindahan (Mutasi Masuk)" },
  { value: "2023_2024_RETENTION", label: "2023/2024 - Retensi / Akselerasi" },
];

const DEFAULT_PASSWORD = "SiswaSMK#2025";

const EMPTY_FORM: FormState = {
  fullName: "",
  nisn: "",
  nik: "",
  gender: "L",
  birthPlace: "",
  motherName: "",
  major: "TKJ",
  classTarget: "XII_TKJ_1",
  academicYear: "2024_2025_NEW",
  pip: true,
  industri: false,
  lsp: false,
  email: "",
  belajarEmail: "",
  studentWhatsapp: "",
  guardianWhatsapp: "",
};

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
    <label className="mb-1 block text-xs font-semibold text-[#4e566c]">
      {children}
      {required ? <span className="text-[#ba1a1a]"> *</span> : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] font-medium text-[#ba1a1a]">{message}</p>;
}

function SectionHeader({ number, title, right }: { number: number; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#eceef3] pb-2">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#6c5dd3]/10 text-xs font-bold text-[#6c5dd3]">
          {number}
        </span>
        <h3 className="text-sm font-bold text-[#181c20]">{title}</h3>
      </div>
      {right}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border-0 bg-[#f1f4f9] pl-3.5 pr-9 text-xs font-medium text-[#181c20] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#6c5dd3]/40"
      >
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const resetState = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
    setEmailTouched(false);
    setAvatarError(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onNameChange = (value: string) =>
    setForm((prev) => ({
      ...prev,
      fullName: value,
      email: emailTouched ? prev.email : slugifyEmail(value),
    }));

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Maks. 2MB (JPG/PNG)");
      setAvatarPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAvatarError("Format harus JPG/PNG");
      setAvatarPreview(null);
      return;
    }
    setAvatarError(null);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setAvatarPreview(url);
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Nama lengkap wajib diisi";
    if (!/^\d{10}$/.test(form.nisn.trim())) next.nisn = "NISN harus 10 digit angka";
    if (!/^\d{16}$/.test(form.nik.trim())) next.nik = "NIK harus 16 digit angka";
    if (!form.gender) next.gender = "Jenis kelamin wajib dipilih";
    if (!form.birthPlace.trim()) next.birthPlace = "Tempat & tanggal lahir wajib diisi";
    if (!form.motherName.trim()) next.motherName = "Nama ibu kandung / wali wajib diisi";
    if (!form.major) next.major = "Konsentrasi keahlian wajib dipilih";
    if (!form.classTarget) next.classTarget = "Kelas wajib dipilih";
    if (!form.academicYear) next.academicYear = "Tahun ajaran wajib dipilih";
    if (!form.guardianWhatsapp.trim()) next.guardianWhatsapp = "Nomor WhatsApp wali murid wajib diisi";
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
        description: `${form.fullName} (${form.nisn}) akan ditempatkan di ${form.classTarget}.`,
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
    "h-11 w-full rounded-xl border-0 bg-[#f1f4f9] px-4 text-xs font-medium text-[#181c20] outline-none transition-all placeholder:text-[#787584] focus:bg-white focus:ring-2 focus:ring-[#6c5dd3]/40";

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
                    SMK Mataram SSO • Dapodik Kemendikbud
                  </span>
                </div>
                <DialogDescription className="max-w-2xl text-xs leading-relaxed text-white/80">
                  Daftarkan identitas resmi NISN, rombongan belajar (rombel), konsentrasi keahlian, dan generate kredensial SSO SiManis.
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
          <div className="flex flex-col justify-between gap-3 rounded-2xl bg-[#e5deff]/50 p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#6c5dd3] text-white shadow-sm">
                <Zap className="size-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#4331a8]">Integrasi Otomatis Dapodik</span>
                <span className="block text-[11px] text-[#4e566c]">
                  Masukkan NISN untuk auto-fill data kependudukan dari Pusdatin Kemendikbudristek.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast("Fitur tarik data Dapodik belum tersedia.")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#6c5dd3] px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[#5343b9]"
            >
              Tarik dari Dapodik
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="space-y-4">
            <SectionHeader
              number={1}
              title="Identitas Resmi & Kredensial Dapodik"
              right={<span className="text-[11px] font-medium text-[#ba1a1a]">* Kolom wajib diisi</span>}
            />
            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-12">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f1f4f9] p-5 text-center transition-all hover:bg-[#eceef3] md:col-span-4">
                <label className="group cursor-pointer">
                  <div className="mb-3 flex h-28 w-24 flex-col items-center justify-center overflow-hidden rounded-xl bg-white text-[#787584] shadow-sm">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Pratinjau foto siswa" className="h-28 w-24 object-cover" />
                    ) : (
                      <>
                        <Camera className="size-8 text-[#6c5dd3]" />
                        <span className="mt-1 text-[10px] text-[#4e566c]">3 x 4 cm</span>
                      </>
                    )}
                  </div>
                  <span className="block text-xs font-bold text-[#181c20]">Unggah Foto Siswa</span>
                  <span className="mt-1 block text-[11px] text-[#787584]">Maks. 2MB (JPG/PNG)</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={onAvatarChange}
                    className="hidden"
                  />
                </label>
                <span className="mt-1 rounded-full bg-[#e5deff] px-2.5 py-0.5 text-[11px] font-semibold text-[#4331a8]">
                  Foto Resmi Seragam Sekolah
                </span>
                <FieldError message={avatarError ?? undefined} />
              </div>

              <div className="space-y-4 md:col-span-8">
                <div>
                  <FieldLabel required>Nama Lengkap Siswa</FieldLabel>
                  <div className="relative">
                    <Badge className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel required>NISN (10 Digit Nasional)</FieldLabel>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.nisn}
                        onChange={(e) => setField("nisn", e.target.value.replace(/\D/g, ""))}
                        placeholder="0067829102"
                        className={`${inputClass} pl-10 font-mono`}
                      />
                    </div>
                    <FieldError message={errors.nisn} />
                  </div>
                  <div>
                    <FieldLabel required>NIK (16 Digit KTP/KK)</FieldLabel>
                    <div className="relative">
                      <Fingerprint className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={16}
                        value={form.nik}
                        onChange={(e) => setField("nik", e.target.value.replace(/\D/g, ""))}
                        placeholder="527102xxxxxxxxxx"
                        className={`${inputClass} pl-10 font-mono`}
                      />
                    </div>
                    <FieldError message={errors.nik} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel required>Jenis Kelamin</FieldLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "L", label: "Laki-laki" },
                        { value: "P", label: "Perempuan" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl p-2.5 transition-colors ${
                            form.gender === option.value
                              ? "bg-[#e5deff] ring-1 ring-[#6c5dd3]"
                              : "bg-[#f1f4f9] hover:bg-[#eceef3]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="student-gender"
                            checked={form.gender === option.value}
                            onChange={() => setField("gender", option.value)}
                            className="size-4 accent-[#6c5dd3]"
                          />
                          <span className="text-xs text-[#181c20]">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <FieldError message={errors.gender} />
                  </div>
                  <div>
                    <FieldLabel required>Tempat, Tanggal Lahir</FieldLabel>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
                      <input
                        type="text"
                        value={form.birthPlace}
                        onChange={(e) => setField("birthPlace", e.target.value)}
                        placeholder="Kota, Tgl-Bln-Thn"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                    <FieldError message={errors.birthPlace} />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4e566c]">
                    Nama Ibu Kandung / Wali Sah <span className="text-[#ba1a1a]">*</span>
                    <span className="ml-1 font-normal text-[#787584]">(Validasi sinkronisasi data Pusdatin)</span>
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
                    <input
                      type="text"
                      value={form.motherName}
                      onChange={(e) => setField("motherName", e.target.value)}
                      placeholder="Nama lengkap ibu kandung sesuai kartu keluarga"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <FieldError message={errors.motherName} />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-[#eceef3]" />

          <div className="space-y-4">
            <SectionHeader number={2} title="Penempatan Rombongan Belajar (Rombel) & Peminatan Kejuruan" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <FieldLabel required>Konsentrasi Keahlian</FieldLabel>
                <SelectField
                  value={form.major}
                  onChange={(value) => setField("major", value)}
                  options={MAJORS}
                />
                <FieldError message={errors.major} />
              </div>
              <div>
                <FieldLabel required>Tingkat / Fase & Kelas</FieldLabel>
                <SelectField
                  value={form.classTarget}
                  onChange={(value) => setField("classTarget", value)}
                  options={CLASS_TARGETS}
                />
                <FieldError message={errors.classTarget} />
              </div>
              <div>
                <FieldLabel required>Tahun Ajaran & Masuk</FieldLabel>
                <SelectField
                  value={form.academicYear}
                  onChange={(value) => setField("academicYear", value)}
                  options={ACADEMIC_YEARS}
                />
                <FieldError message={errors.academicYear} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#f1f4f9] p-3.5">
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.pip}
                  onChange={(e) => setField("pip", e.target.checked)}
                  className="size-4 rounded accent-[#6c5dd3]"
                />
                <span className="text-xs text-[#181c20]">Penerima Program Indonesia Pintar (PIP) / Beasiswa</span>
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.industri}
                  onChange={(e) => setField("industri", e.target.checked)}
                  className="size-4 rounded accent-[#6c5dd3]"
                />
                <span className="text-xs text-[#181c20]">Peserta Kelas Industri / Rekanan DUDI</span>
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.lsp}
                  onChange={(e) => setField("lsp", e.target.checked)}
                  className="size-4 rounded accent-[#6c5dd3]"
                />
                <span className="text-xs text-[#181c20]">Jalur Percepatan LSP-P1 Asesmen Kejuruan</span>
              </label>
            </div>
          </div>

          <div className="h-px w-full bg-[#eceef3]" />

          <div className="space-y-4">
            <SectionHeader
              number={3}
              title="Kredensial Akun SSO SiManis & Kontak Wali"
              right={
                <span className="rounded-full bg-[#e5deff] px-2 py-0.5 text-[11px] font-semibold text-[#6c5dd3]">
                  Domain: @smkmataram.sch.id
                </span>
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Surel Institusi Siswa (Auto-generate)</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
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
                <FieldError message={errors.email} />
              </div>
              <div>
                <FieldLabel>Surel Belajar.id Siswa (Opsional)</FieldLabel>
                <div className="relative">
                  <School className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
                  <input
                    type="email"
                    value={form.belajarEmail}
                    onChange={(e) => setField("belajarEmail", e.target.value)}
                    placeholder="nama.siswa@smk.belajar.id"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Nomor WhatsApp Siswa</FieldLabel>
                <div className="relative">
                  <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
                  <input
                    type="tel"
                    value={form.studentWhatsapp}
                    onChange={(e) => setField("studentWhatsapp", e.target.value)}
                    placeholder="08..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#4e566c]">
                  Nomor WhatsApp Wali Murid <span className="text-[#ba1a1a]">*</span>
                  <span className="ml-1 font-normal text-[#787584]">(Notifikasi absensi & e-Rapor)</span>
                </label>
                <div className="relative">
                  <BellRing className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#787584]" />
                  <input
                    type="tel"
                    value={form.guardianWhatsapp}
                    onChange={(e) => setField("guardianWhatsapp", e.target.value)}
                    placeholder="08..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <FieldError message={errors.guardianWhatsapp} />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3 rounded-2xl bg-[#f1f4f9] p-3.5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <KeyRound className="size-5 shrink-0 text-[#787584]" />
                <div>
                  <span className="text-xs font-semibold text-[#181c20]">Kata Sandi Default Awal: </span>
                  <code className="rounded bg-white px-2 py-0.5 font-mono text-xs font-bold text-[#6c5dd3]">
                    {DEFAULT_PASSWORD}
                  </code>
                </div>
              </div>
              <span className="text-[11px] text-[#787584]">
                Siswa diwajibkan ganti sandi saat login pertama kali via portal SSO.
              </span>
            </div>
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 flex flex-col shrink-0 items-center justify-between gap-4 border-t border-[#eceef3] bg-[#f1f4f9] px-7 py-4 sm:flex-row">
          <div className="flex items-center gap-2 text-[#4e566c]">
            <ShieldCheck className="size-[18px] shrink-0 text-emerald-600" />
            <span className="text-[11px]">
              Divalidasi dengan Standar Pusdatin Kemendikbudristek & Google Workspace for Education
            </span>
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
