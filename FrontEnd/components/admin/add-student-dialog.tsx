"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  KeyRound,
  Mail,
  MapPin,
  PencilLine,
  PlusCircle,
  Search,
  Sparkles,
  Trash2,
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
import { masterDataApi } from "@/lib/api/master-data";
import type { StudentSummary } from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type StudentMode = "add" | "edit" | "delete";

interface StudentForm {
  fullName: string;
  nomorInduk: string;
  nisn: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  angkatan: string;
  email: string;
  accountStatus: string;
}

const EMPTY_FORM: StudentForm = {
  fullName: "",
  nomorInduk: "",
  nisn: "",
  jenisKelamin: "",
  tempatLahir: "",
  tanggalLahir: "",
  angkatan: "",
  email: "",
  accountStatus: "Aktif",
};

const genderOptions: JurusanOption[] = [
  { value: "L", label: "Laki-laki (L)" },
  { value: "P", label: "Perempuan (P)" },
];

const statusOptions: JurusanOption[] = [
  { value: "Aktif", label: "Aktif" },
  { value: "Nonaktif", label: "Nonaktif" },
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

function slugifyEmail(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".");
  return slug ? `${slug}@smkmataram.sch.id` : "";
}

function matchesStudentQuery(student: StudentSummary, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [student.fullName, student.nomorInduk, student.nisn, student.email]
    .map((v) => (v ?? "").toLowerCase())
    .some((v) => v.includes(q));
}

function buildInitials(name: string) {
  const parts = name
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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

export function AddStudentDialog({ open, onOpenChange, onSuccess }: AddStudentDialogProps) {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [form, setForm] = useState<StudentForm>(EMPTY_FORM);
  const [mode, setMode] = useState<StudentMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<StudentForm | null>(null);
  const [filterStudentQuery, setFilterStudentQuery] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmResolveRef = useRef<(ok: boolean) => void>(() => {});

  const askConfirm = (message: string) =>
    new Promise<boolean>((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmMessage(message);
      setConfirmOpen(true);
    });

  const respondConfirm = (ok: boolean) => {
    confirmResolveRef.current(ok);
    confirmResolveRef.current = () => {};
  };

  const selectedStudent = students.find((s) => s.id === editingId);

  const filteredStudents = useMemo(
    () => students.filter((s) => matchesStudentQuery(s, filterStudentQuery)),
    [students, filterStudentQuery]
  );

  const studentOptions: JurusanOption[] = useMemo(
    () =>
      filteredStudents.map((s) => ({
        value: s.id,
        label: `${s.fullName} (${s.nomorInduk ?? s.nisn ?? "-"})${s.kelas ? ` • ${s.kelas}` : ""}`,
      })),
    [filteredStudents]
  );

  const isDirty = Boolean(
    editingId &&
      baseline &&
      Object.keys(EMPTY_FORM).some((k) => form[k as keyof StudentForm] !== baseline[k as keyof StudentForm])
  );

  const dirtyConfirm = async (message: string) => !isDirty || (await askConfirm(message));

  const resetState = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
    setMode("add");
    setEditingId(null);
    setBaseline(null);
    setFilterStudentQuery("");
    setEmailTouched(false);
  };

  const setField = <K extends keyof StudentForm>(key: K, value: StudentForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onNameChange = (value: string) =>
    setForm((prev) => ({
      ...prev,
      fullName: value,
      email: emailTouched ? prev.email : slugifyEmail(value),
    }));

  const defaultPassword = buildDefaultPassword(form.tanggalLahir, form.nomorInduk);

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    const digits = normalizeNomorInduk(form.nomorInduk);

    if (!form.fullName.trim()) next.fullName = "Nama lengkap wajib diisi";
    if (!digits) {
      next.nomorInduk = "NIS / Nomor Induk wajib diisi";
    } else if (digits.length < 3) {
      next.nomorInduk = "Nomor induk minimal 3 digit";
    }
    if (!form.tanggalLahir) next.tanggalLahir = "Tanggal lahir wajib diisi";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Format surel tidak valid";
    }
    if (form.angkatan.trim() && !/^\d+$/.test(form.angkatan.trim())) {
      next.angkatan = "Angkatan harus berupa angka bulat";
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    if (mode === "edit" && !editingId) {
      toast.error("Siswa belum dipilih", {
        description: "Pilih siswa pada panel sebelah kanan untuk mulai mengedit.",
      });
      return;
    }

    if (mode === "delete") {
      if (!editingId || !selectedStudent) {
        toast.error("Siswa belum dipilih", {
          description: "Pilih siswa pada panel sebelah kanan untuk dihapus.",
        });
        return;
      }
      const ok = await askConfirm(
        `Hapus ${selectedStudent.fullName} beserta akun masuknya? Tindakan ini tidak bisa dibatalkan.`
      );
      setConfirmOpen(false);
      if (!ok) return;
      setSubmitting(true);
      try {
        const res = await masterDataApi.students.remove(editingId);
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        toast.success("Siswa dihapus", {
          description: `${selectedStudent.fullName} (${selectedStudent.nomorInduk ?? "-"}) telah dihapus dari data peserta didik.`,
        });
        onSuccess?.();
        resetState();
        onOpenChange(false);
      } catch (err) {
        toast.error("Gagal menghapus siswa", {
          description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && editingId) {
        const payload = {
          fullName: form.fullName.trim(),
          nisn: form.nisn.trim(),
          jenisKelamin: form.jenisKelamin,
          tempatLahir: form.tempatLahir.trim(),
          angkatan: form.angkatan.trim() ? Number(form.angkatan) : undefined,
          tanggalLahir: form.tanggalLahir,
          email: form.email.trim() || null,
          isActive: form.accountStatus === "Aktif",
        };
        const res = await masterDataApi.students.update(editingId, payload);
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        toast.success("Data siswa diperbarui", {
          description: `${form.fullName.trim()} (${normalizeNomorInduk(form.nomorInduk)}).`,
        });
      } else {
        const payload = {
          fullName: form.fullName.trim(),
          nomorInduk: form.nomorInduk,
          nisn: form.nisn.trim() || undefined,
          jenisKelamin: form.jenisKelamin || undefined,
          tempatLahir: form.tempatLahir.trim() || undefined,
          angkatan: form.angkatan.trim() ? Number(form.angkatan) : undefined,
          tanggalLahir: form.tanggalLahir,
          email: form.email.trim() || null,
        };
        const res = await masterDataApi.students.create(payload);
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        toast.success("Siswa baru siap diaktifkan", {
          description: `${form.fullName.trim()} (${normalizeNomorInduk(form.nomorInduk)})${
            defaultPassword ? ` — kata sandi awal ${defaultPassword}` : ""
          }.`,
        });
      }
      onSuccess?.();
      resetState();
      onOpenChange(false);
    } catch (err) {
      toast.error(mode === "edit" ? "Gagal memperbarui siswa" : "Gagal menyimpan siswa", {
        description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (submitting) return;
    const ok = await dirtyConfirm("Perubahan belum disimpan. Tutup dan buang perubahan?");
    setConfirmOpen(false);
    if (!ok) return;
    resetState();
    onOpenChange(false);
  };

  const switchMode = async (nextMode: StudentMode) => {
    if (submitting || nextMode === mode) return;
    const ok = await dirtyConfirm("Perubahan belum disimpan. Ganti mode dan buang perubahan?");
    setConfirmOpen(false);
    if (!ok) return;
    setMode(nextMode);
    setEditingId(null);
    setBaseline(null);
    setErrors({});
    if (nextMode === "add") {
      setForm(EMPTY_FORM);
      setEmailTouched(false);
    }
  };

  const handleSelectStudent = (studentId: string) => {
    const s = students.find((item) => item.id === studentId);
    if (!s) return;
    const next: StudentForm = {
      fullName: s.fullName,
      nomorInduk: s.nomorInduk ?? "",
      nisn: s.nisn ?? "",
      jenisKelamin: s.jenisKelamin ?? "",
      tempatLahir: s.tempatLahir ?? "",
      tanggalLahir: s.tanggalLahir ?? "",
      angkatan: s.angkatan !== null && s.angkatan !== undefined ? String(s.angkatan) : "",
      email: s.email ?? "",
      accountStatus: s.isActive ? "Aktif" : "Nonaktif",
    };
    setEditingId(s.id);
    setForm(next);
    setBaseline(next);
    setEmailTouched(true);
  };

  const handleStudentQueryChange = (value: string) => {
    setFilterStudentQuery(value);
    if (mode === "edit" || mode === "delete") {
      setEditingId((prev) => {
        if (!prev) return prev;
        const student = students.find((item) => item.id === prev);
        return student && matchesStudentQuery(student, value) ? prev : null;
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    const fetchData = async () => {
      try {
        const res = await masterDataApi.students.list();
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message || res.error.error || "Gagal memuat data siswa");
        }
        setStudents(res.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching student data:", error);
        if (!active) return;
        setStudents([]);
        toast.error("Gagal memuat data siswa", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      }
    };
    void fetchData();
    return () => {
      active = false;
    };
  }, [open]);

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20";

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={async (next) => {
          if (next) {
            onOpenChange(true);
            return;
          }
          const ok = await dirtyConfirm("Perubahan belum disimpan. Tutup dan buang perubahan?");
          setConfirmOpen(false);
          if (!ok) return;
          resetState();
          onOpenChange(false);
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
                    Manajemen Data Siswa
                  </DialogTitle>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                    SMK Mataram SSO
                  </span>
                </div>
                <DialogDescription className="mt-0.5 text-xs text-indigo-100">
                  Tambah, perbarui, atau hapus data peserta didik beserta akun masuk.
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

          <div className="shrink-0 border-b border-slate-200/70 bg-[#f1f4f9] px-7 py-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#787584]">
                  <Sparkles className="size-4 text-[#5343b9]" /> Metode Tindakan / Manajemen Data
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => switchMode("add")}
                  disabled={submitting}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    mode === "add"
                      ? "bg-[#6c5dd3] text-white shadow-[0_4px_12px_rgba(108,93,211,0.25)]"
                      : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"
                  }`}
                >
                  <PlusCircle className="size-4" /> Tambah Baru
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("edit")}
                  disabled={submitting}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    mode === "edit"
                      ? "bg-[#6c5dd3] text-white shadow-[0_4px_12px_rgba(108,93,211,0.25)]"
                      : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"
                  }`}
                >
                  <PencilLine className="size-4 text-[#5343b9]" /> Perbarui
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("delete")}
                  disabled={submitting}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    mode === "delete"
                      ? "bg-[#ba1a1a] text-white shadow-[0_4px_12px_rgba(186,26,26,0.25)]"
                      : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"
                  }`}
                >
                  <Trash2 className="size-4 text-[#ba1a1a]" /> Hapus
                </button>
              </div>
              <p className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-2.5 py-1.5 text-[11px] text-[#4e566c]">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-[#6c5dd3]" />
                <span>
                  <strong>Mode Aktif:</strong>{" "}
                  {mode === "add"
                    ? "Tambah siswa baru ke data peserta didik tanpa menimpa data lain."
                    : mode === "edit"
                      ? editingId
                        ? "Ubah data siswa terpilih lalu simpan."
                        : "Pilih siswa pada panel sebelah kanan untuk mulai mengubah."
                      : "Hapus siswa terpilih dari data peserta didik."}
                </span>
              </p>
            </div>

            {mode === "delete" && (
              <div className="mt-4 flex items-center gap-3.5">
                <div className="relative">
                  <div className="flex size-11 items-center justify-center rounded-full border-2 border-[#c9c4d5]/60 bg-[#e5deff] text-sm font-bold text-[#4331a8] shadow-sm">
                    {selectedStudent ? buildInitials(selectedStudent.fullName) : "?"}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-white ${
                      selectedStudent?.isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">
                      {selectedStudent?.fullName ?? "Pilih siswa terlebih dahulu"}
                    </h3>
                    {selectedStudent ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        {selectedStudent.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {selectedStudent
                      ? `NIS: ${selectedStudent.nomorInduk ?? "-"}${
                          selectedStudent.email ? ` • ${selectedStudent.email}` : ""
                        }`
                      : "Pilih siswa dari daftar untuk menghapus."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
            <form
              id="add-student-form"
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
            >
              {mode === "delete" ? (
                editingId && selectedStudent ? (
                  <section className="space-y-4">
                    <div className="rounded-2xl border border-[#f3c9c4] bg-[#fef6f5] p-5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-[#fde8e6] text-[#ba1a1a]">
                          <Trash2 className="size-4" />
                        </span>
                        <h3 className="text-sm font-bold text-[#ba1a1a]">Siswa yang Akan Dihapus</h3>
                      </div>
                      <div className="mt-3 grid gap-1.5 text-xs leading-5 text-[#4e566c]">
                        <p>
                          <span className="font-semibold text-[#181c20]">Nama:</span> {selectedStudent.fullName}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">NIS:</span>{" "}
                          {selectedStudent.nomorInduk ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">NISN:</span>{" "}
                          {selectedStudent.nisn ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Email:</span>{" "}
                          {selectedStudent.email ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Status:</span>{" "}
                          {selectedStudent.isActive ? "Aktif" : "Nonaktif"}
                        </p>
                      </div>
                      <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] leading-5 text-[#787584]">
                        Akun siswa akan dihapus permanen. Siswa yang masih memiliki data enrollment
                        tidak dapat dihapus — nonaktifkan akunnya sebagai gantinya. Tindakan ini tidak
                        bisa dibatalkan.
                      </p>
                    </div>
                  </section>
                ) : (
                  <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#efc9c4] bg-[#fef6f5] px-6 py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-[#fde8e6] text-[#ba1a1a]">
                      <Trash2 className="size-7" />
                    </span>
                    <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Siswa yang Akan Dihapus</h3>
                    <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">
                      Cari siswa pada panel sebelah kanan, lalu pilih siswa untuk dihapus.
                    </p>
                  </section>
                )
              ) : mode === "edit" && !editingId ? (
                <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#c9c4d5] bg-[#f8f9fc] px-6 py-16 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#e5deff] text-[#5343b9]">
                    <PencilLine className="size-7" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Siswa Terlebih Dahulu</h3>
                  <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">
                    Pilih siswa pada panel sebelah kanan untuk diedit. Isi formulir akan mengikuti siswa
                    yang dipilih.
                  </p>
                </section>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
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
                        <FieldLabel required>NIS / Nomor Induk</FieldLabel>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={form.nomorInduk}
                            onChange={(e) => setField("nomorInduk", normalizeNomorInduk(e.target.value))}
                            placeholder="Contoh: 0067829102"
                            disabled={mode === "edit"}
                            className={`${inputClass} pl-10 font-mono disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-[#787584]">
                          {mode === "edit"
                            ? "Nomor induk tidak dapat diubah saat memperbarui data."
                            : "Hanya angka, minimal 3 digit."}
                        </p>
                        <FieldError message={errors.nomorInduk} />
                      </div>

                      <div>
                        <FieldLabel>NISN (Opsional)</FieldLabel>
                        <div className="relative">
                          <BadgeCheck className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={form.nisn}
                            onChange={(e) => setField("nisn", e.target.value.replace(/\D/g, ""))}
                            placeholder="Contoh: 0067829102"
                            className={`${inputClass} pl-10 font-mono`}
                          />
                        </div>
                        <FieldError message={errors.nisn} />
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

                      <div>
                        <FieldLabel>Jenis Kelamin</FieldLabel>
                        <SearchableDropdown
                          value={form.jenisKelamin}
                          onChange={setField.bind(null, "jenisKelamin")}
                          options={genderOptions}
                          label="Pilih jenis kelamin"
                        />
                        <FieldError message={errors.jenisKelamin} />
                      </div>

                      <div>
                        <FieldLabel>Tempat Lahir (Opsional)</FieldLabel>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                          <input
                            type="text"
                            value={form.tempatLahir}
                            onChange={(e) => setField("tempatLahir", e.target.value)}
                            placeholder="Contoh: Mataram"
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                        <FieldError message={errors.tempatLahir} />
                      </div>

                      <div>
                        <FieldLabel>Angkatan (Opsional)</FieldLabel>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={form.angkatan}
                            onChange={(e) => setField("angkatan", e.target.value.replace(/\D/g, ""))}
                            placeholder="Contoh: 2024"
                            className={`${inputClass} pl-10 font-mono`}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-[#787584]">Tahun masuk, hanya angka.</p>
                        <FieldError message={errors.angkatan} />
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
                          Dibuat otomatis dari nama, bisa diubah. Kosongkan jika siswa login memakai nomor
                          induk.
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
                      <h3 className="text-sm font-bold text-[#181c20]">Akun &amp; Status</h3>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel>Status Akun</FieldLabel>
                        <SearchableDropdown
                          value={form.accountStatus}
                          onChange={setField.bind(null, "accountStatus")}
                          options={statusOptions}
                          label="Aktif"
                          disabled={mode === "add"}
                        />
                        <p className="mt-1 text-[10px] text-[#787584]">
                          {mode === "add"
                            ? "Siswa baru langsung aktif setelah disimpan."
                            : "Nonaktifkan akun tanpa menghapus data siswa."}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <FieldLabel>Kata Sandi Awal (Otomatis)</FieldLabel>
                        <div className="flex h-11 items-center gap-2 rounded-xl border border-dashed border-[#c9c4d5] bg-[#f8f9fc] px-3.5 font-mono text-xs font-semibold text-[#6c5dd3]">
                          <KeyRound className="size-[18px] shrink-0 text-[#787584]" />
                          {mode === "edit" ? (
                            <span className="font-sans font-normal text-[#787584]">
                              Kata sandi tidak berubah saat memperbarui data siswa.
                            </span>
                          ) : (
                            defaultPassword || (
                              <span className="font-sans font-normal text-[#787584]">
                                Terisi otomatis setelah nomor induk dan tanggal lahir lengkap.
                              </span>
                            )
                          )}
                        </div>
                        {mode === "add" && (
                          <p className="mt-1 text-[10px] text-[#787584]">
                            Siswa wajib mengganti kata sandi ini pada login pertama.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>

            {(mode === "edit" || mode === "delete") && (
              <aside className="min-h-0 flex-1 shrink-0 overflow-y-auto border-t border-slate-200/70 bg-[#f8f9fc] p-5 lg:w-[360px] lg:flex-none lg:border-l lg:border-t-0">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">Cari Siswa</label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                      <input
                        type="text"
                        value={filterStudentQuery}
                        onChange={(e) => handleStudentQueryChange(e.target.value)}
                        placeholder="Nama, NIS, NISN, atau email..."
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="mt-1 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">
                      {mode === "delete" ? "Siswa yang akan dihapus" : "Siswa yang akan diperbarui"}{" "}
                      <span className="text-[#c0262d]">*</span>
                    </label>
                    <SearchableDropdown
                      value={editingId ?? ""}
                      onChange={handleSelectStudent}
                      options={studentOptions}
                      label={studentOptions.length ? "Pilih siswa" : "Tidak ada siswa yang cocok"}
                      disabled={submitting || !studentOptions.length}
                    />
                    <p className="text-[11px] text-[#787584]">
                      {mode === "delete"
                        ? "Panel konfirmasi di sebelah kiri akan menampilkan siswa yang dipilih."
                        : "Isi formulir di sebelah kiri akan mengikuti siswa yang dipilih."}
                    </p>
                  </div>

                  {editingId && selectedStudent ? (
                    <div className="mt-2 rounded-xl border border-[#d9d3f0] bg-white p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#5343b9]">
                          <PencilLine className="size-3.5" />
                        </span>
                        <p className="text-xs font-bold text-[#181c20]">Siswa terpilih</p>
                        <span className="ml-auto rounded-full bg-[#f0edff] px-2 py-0.5 text-[9px] font-bold text-[#5343b9]">
                          # {isDirty ? "Diubah" : "Asli"}
                        </span>
                      </div>
                      <div className="text-[11px] leading-5 text-[#787584]">
                        <p>
                          <span className="font-semibold text-[#181c20]">Nama:</span>{" "}
                          {selectedStudent.fullName}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">NIS:</span>{" "}
                          {selectedStudent.nomorInduk ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">NISN:</span>{" "}
                          {selectedStudent.nisn ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Kelas:</span>{" "}
                          {selectedStudent.kelas ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Status:</span>{" "}
                          {selectedStudent.isActive ? "Aktif" : "Nonaktif"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </aside>
            )}
          </div>

          <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <BadgeCheck className="size-4 text-emerald-600" />
              <span>Data sesuai induk siswa</span>
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
                form="add-student-form"
                disabled={
                  submitting ||
                  (mode === "edit" && (!editingId || !isDirty)) ||
                  (mode === "delete" && !editingId)
                }
                className={`flex items-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-all disabled:opacity-60 ${
                  mode === "delete"
                    ? "bg-[#ba1a1a] shadow-[#ba1a1a]/30 hover:bg-[#8f1515]"
                    : "bg-[#6c5dd3] shadow-[#6c5dd3]/30 hover:bg-[#5343b9]"
                }`}
              >
                {mode === "delete" ? <Trash2 className="size-4" /> : <CheckCircle2 className="size-4" />}
                {submitting
                  ? mode === "delete"
                    ? "Menghapus..."
                    : "Menyimpan..."
                  : mode === "delete"
                    ? "Hapus Siswa"
                    : mode === "edit"
                      ? "Simpan Perubahan"
                      : "Simpan & Daftarkan Siswa"}
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={(next) => { if (!next) respondConfirm(false); }}>
        <DialogContent className="border border-[#c9c4d5]/60 bg-[#f8f9fc]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ffe5e5] text-[#ba1a1a]">
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm font-bold tracking-tight text-[#181c20]">Konfirmasi Tindakan</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6 text-[#787584]">{confirmMessage}</DialogDescription>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 border-t border-[#c9c4d5]/60 bg-[#f8f9fc] px-6 py-4">
            <button type="button" onClick={() => respondConfirm(false)} className="flex items-center justify-center gap-1.5 rounded-xl border border-[#c9c4d5]/60 bg-white px-4 py-2.5 text-sm font-semibold text-[#4e566c] transition-all hover:bg-[#eceef3] active:bg-[#d9d3f0]">Batal</button>
            <button type="button" onClick={() => respondConfirm(true)} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#ba1a1a] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/20 transition-all hover:bg-[#93000a] active:bg-[#7a0008]">Ya, Lanjutkan</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
