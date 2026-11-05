"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Camera,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  Phone,
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

type RoleKey = "waliKelas" | "asesorLsp" | "guruBk";

interface FormState {
  fullName: string;
  nip: string;
  nik: string;
  gender: string;
  employmentStatus: string;
  major: string;
  subject: string;
  classTarget: string;
  roles: Record<RoleKey, boolean>;
  email: string;
  belajarEmail: string;
  whatsapp: string;
  password: string;
  sendCredentials: boolean;
  syncDapodik: boolean;
}

const MAJORS = [
  { value: "TKJ", label: "Teknik Jaringan Komputer & Telekomunikasi (TKJ)" },
  { value: "DKV", label: "Desain Komunikasi Visual (DKV)" },
  { value: "BOGA", label: "Tata Boga / Kuliner" },
  { value: "TKR", label: "Teknik Kendaraan Ringan Otomotif (TKR)" },
  { value: "UMUM", label: "Mata Pelajaran Umum (Normatif / Adaptif)" },
];

const SUBJECTS = [
  { value: "INF", label: "Informatika & Sains Komputasi" },
  { value: "RPL", label: "Pemrograman Web & Mobile" },
  { value: "JARKOM", label: "Jaringan Komputer & Cloud Infrastructure" },
  { value: "UIUX", label: "Desain UI/UX & Interaktif (DKV)" },
  { value: "MAT", label: "Matematika Tingkat Lanjut" },
  { value: "FIS", label: "Fisika Terapan & Robotika" },
  { value: "BOGA_PR", label: "Pastry & Bakery Artisan" },
  { value: "TKR_ENG", label: "Engine Management System (TKR)" },
];

const CLASS_TARGETS = [
  { value: "XII_MIPA1", label: "Fase F - Kelas XII TKJ 1 & XII DKV 1" },
  { value: "XI_ALL", label: "Fase F - Kelas XI (Semua Jurusan)" },
  { value: "X_ALL", label: "Fase E - Kelas X (Dasar Kejuruan)" },
  { value: "CROSS", label: "Lintas Tingkat (X, XI, XII)" },
];

const EMPLOYMENT_STATUSES = [
  { value: "PNS", label: "PNS / ASN Guru" },
  { value: "PPPK", label: "PPPK Kemendikbud" },
  { value: "GTY", label: "Guru Tetap Yayasan (GTY)" },
  { value: "HONORER", label: "Guru Honorer / Kontrak Sekolah" },
  { value: "INDUSTRI", label: "Praktisi / Guru Tamu Industri" },
];

const ROLES = [
  { key: "waliKelas" as const, title: "Wali Kelas", desc: "Akses rekap rapor & presensi siswa", icon: GraduationCap },
  { key: "asesorLsp" as const, title: "Asesor LSP-P1 BNSP", desc: "Hak uji kompetensi & penilai UKK", icon: Award },
  { key: "guruBk" as const, title: "Guru Pembimbing BK", desc: "Akses modul booking chat konseling", icon: BookOpen },
];

const EMPTY_FORM: FormState = {
  fullName: "",
  nip: "",
  nik: "",
  gender: "L",
  employmentStatus: "PNS",
  major: "TKJ",
  subject: "INF",
  classTarget: "XII_MIPA1",
  roles: { waliKelas: false, asesorLsp: false, guruBk: false },
  email: "",
  belajarEmail: "",
  whatsapp: "",
  password: "GuruSMK#2025",
  sendCredentials: true,
  syncDapodik: true,
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
      {children}
      {required ? <span className="text-rose-500"> *</span> : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] font-medium text-rose-500">{message}</p>;
}

function SectionHeader({ number, title, helper }: { number: number; title: string; helper?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">
          {number}
        </span>
        <span>{title}</span>
      </div>
      {helper ? <span className="text-[11px] font-medium text-slate-400">{helper}</span> : null}
    </div>
  );
}

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: AddTeacherDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
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

  const toggleRole = (key: RoleKey) =>
    setField("roles", { ...form.roles, [key]: !form.roles[key] });

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
    if (!form.fullName.trim()) next.fullName = "Nama wajib diisi";
    if (!form.nip.trim()) next.nip = "NIP/NUPTK wajib diisi";
    if (!form.nik.trim()) next.nik = "NIK wajib diisi";
    if (!form.gender) next.gender = "Jenis kelamin wajib dipilih";
    if (!form.employmentStatus) next.employmentStatus = "Status kepegawaian wajib dipilih";
    if (!form.major) next.major = "Jurusan wajib dipilih";
    if (!form.subject) next.subject = "Mata pelajaran wajib dipilih";
    if (!form.classTarget) next.classTarget = "Rombel kelas wajib dipilih";
    if (!form.email.trim()) next.email = "Surel institusi wajib diisi";
    if (!form.whatsapp.trim()) next.whatsapp = "Nomor WhatsApp wajib diisi";
    if (!form.password.trim()) next.password = "Kata sandi wajib diisi";
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    window.setTimeout(() => {
      toast.success("Guru baru siap diaktifkan", {
        description: `${form.fullName} (${form.nip}) akan ditambahkan sebagai guru aktif.`,
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
    "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20";
  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20";

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
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-bold tracking-tight text-white">
                  Tambah Pendidik / Guru Baru
                </DialogTitle>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  SMK Mataram SSO
                </span>
              </div>
              <DialogDescription className="mt-0.5 text-xs text-indigo-100">
                Daftarkan kredensial akun, data Dapodik Kemendikbudristek, dan plotting mata pelajaran.
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

        <div className="flex shrink-0 items-center justify-between border-b border-[#e5deff] bg-[#e5deff]/70 px-7 py-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Sparkles className="size-4 text-[#4331a8]" />
            <span>
              <strong>Integrasi Otomatis:</strong> Akun guru baru akan otomatis terhubung ke portal Dapodik.
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast("Fitur tarik data Dapodik belum tersedia.")}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#4331a8] hover:underline"
          >
            Tarik dari Dapodik
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <form
          id="add-teacher-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
        >
          <div>
            <SectionHeader number={1} title="Identitas Resmi & Kredensial Dapodik" helper="Kolom wajib diisi" />
            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-12">
              <div className="flex flex-col items-center rounded-xl border border-slate-200/70 bg-[#f1f4f9] p-4 text-center md:col-span-3">
                <label className="group flex size-20 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ddd6fe] bg-white text-slate-400 shadow-sm transition-all hover:border-[#6c5dd3] hover:text-[#6c5dd3]">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Pratinjau foto guru" className="size-20 rounded-2xl object-cover" />
                  ) : (
                    <>
                      <Camera className="size-7 text-[#6c5dd3] transition-transform group-hover:scale-110" />
                      <span className="mt-1 text-[10px] font-semibold">Unggah Foto</span>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={onAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-[10px] text-slate-400">Maks. 2MB (JPG/PNG)</p>
                <div className="mt-2.5 inline-flex items-center gap-1 rounded border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Foto Resmi PTK
                </div>
                <FieldError message={avatarError ?? undefined} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-9">
                <div className="sm:col-span-2">
                  <FieldLabel required>Nama Lengkap Pendidik & Gelar</FieldLabel>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 size-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      placeholder="Contoh: Bpk. Arya Wiguna, M.Cs"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                  <FieldError message={errors.fullName} />
                </div>

                <div>
                  <FieldLabel required>NIP / NUPTK</FieldLabel>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 size-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.nip}
                      onChange={(e) => setField("nip", e.target.value)}
                      placeholder="Contoh: 19870512 201201 1 004"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                  <FieldError message={errors.nip} />
                </div>

                <div>
                  <FieldLabel required>Nomor Induk Kependudukan (NIK)</FieldLabel>
                  <input
                    type="text"
                    value={form.nik}
                    onChange={(e) => setField("nik", e.target.value)}
                    placeholder="16 Digit NIK terdaftar Disdukcapil"
                    className={inputClass}
                  />
                  <FieldError message={errors.nik} />
                </div>

                <div>
                  <FieldLabel required>Jenis Kelamin</FieldLabel>
                  <select
                    value={form.gender}
                    onChange={(e) => setField("gender", e.target.value)}
                    className={selectClass}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  <FieldError message={errors.gender} />
                </div>

                <div>
                  <FieldLabel required>Status Kepegawaian</FieldLabel>
                  <select
                    value={form.employmentStatus}
                    onChange={(e) => setField("employmentStatus", e.target.value)}
                    className={selectClass}
                  >
                    {EMPLOYMENT_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.employmentStatus} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader number={2} title="Penugasan Mata Pelajaran, Konsentrasi & Peran" helper="35 Mapel Aktif SMK Mataram" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <FieldLabel required>Konsentrasi Keahlian (Jurusan)</FieldLabel>
                <select
                  value={form.major}
                  onChange={(e) => setField("major", e.target.value)}
                  className={selectClass}
                >
                  {MAJORS.map((major) => (
                    <option key={major.value} value={major.value}>
                      {major.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.major} />
              </div>

              <div>
                <FieldLabel required>Mata Pelajaran Utama Diampu</FieldLabel>
                <select
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  className={selectClass}
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.subject} />
              </div>

              <div>
                <FieldLabel required>Fase & Rombel Kelas Target</FieldLabel>
                <select
                  value={form.classTarget}
                  onChange={(e) => setField("classTarget", e.target.value)}
                  className={selectClass}
                >
                  {CLASS_TARGETS.map((target) => (
                    <option key={target.value} value={target.value}>
                      {target.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.classTarget} />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Tugas Tambahan / Peran Spesial di LMS
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    return (
                      <label
                        key={role.key}
                        className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-[#6c5dd3]"
                      >
                        <input
                          type="checkbox"
                          checked={form.roles[role.key]}
                          onChange={() => toggleRole(role.key)}
                          className="mt-0.5 size-4 accent-[#6c5dd3]"
                        />
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <Icon className="size-3.5 text-[#6c5dd3]" />
                            {role.title}
                          </p>
                          <p className="text-[10px] text-slate-400">{role.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader number={3} title="Kredensial Akun SSO SiManis & Kontak" helper="Domain resmi @smkmataram.sch.id" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Surel Institusi Sekolah (SSO)</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="nama.guru@smkmataram.sch.id"
                    className={`${inputClass} pl-9`}
                  />
                </div>
                <FieldError message={errors.email} />
              </div>

              <div>
                <FieldLabel>Surel Akun Belajar.id (Opsional)</FieldLabel>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.belajarEmail}
                    onChange={(e) => setField("belajarEmail", e.target.value)}
                    placeholder="nama.ptk@guru.smk.belajar.id"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel required>Nomor WhatsApp Aktif (Untuk Notifikasi OTP)</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setField("whatsapp", e.target.value)}
                    placeholder="+62 812-XXXX-XXXX"
                    className={`${inputClass} pl-9`}
                  />
                </div>
                <FieldError message={errors.whatsapp} />
              </div>

              <div>
                <FieldLabel required>Kata Sandi Awal / Default</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    className={`${inputClass} bg-slate-50 pl-9`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  Guru diwajibkan mengubah sandi pada saat pertama kali login SSO.
                </p>
                <FieldError message={errors.password} />
              </div>
            </div>
          </div>

          <div className="space-y-2.5 rounded-xl border border-slate-200/70 bg-[#f1f4f9] p-3.5">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.sendCredentials}
                onChange={(e) => setField("sendCredentials", e.target.checked)}
                className="size-4 accent-[#6c5dd3]"
              />
              <span className="text-xs font-medium text-slate-700">
                Kirimkan rincian akun dan panduan aktivasi SSO melalui surel dan WhatsApp secara otomatis.
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.syncDapodik}
                onChange={(e) => setField("syncDapodik", e.target.checked)}
                className="size-4 accent-[#6c5dd3]"
              />
              <span className="text-xs font-medium text-slate-700">
                Otomatis sinkronkan penugasan guru ke server Dapodik pada siklus sinkronisasi berikutnya.
              </span>
            </label>
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between border-t border-slate-200/80 bg-slate-50 px-7 py-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <BadgeCheck className="size-4 text-emerald-600" />
            <span>Divalidasi dengan Standar Dapodik Kemendikbudristek</span>
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
