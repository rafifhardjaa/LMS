"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  KeyRound,
  Mail,
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
import type { Major, TeacherSummary } from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type TeacherMode = "add" | "edit" | "delete";

interface TeacherForm {
  fullName: string;
  nomorInduk: string;
  tanggalLahir: string;
  email: string;
  majorId: string;
  accountStatus: string;
}

const EMPTY_FORM: TeacherForm = {
  fullName: "",
  nomorInduk: "",
  tanggalLahir: "",
  email: "",
  majorId: "",
  accountStatus: "Aktif",
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

function matchesTeacherQuery(teacher: TeacherSummary, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [teacher.fullName, teacher.nomorInduk, teacher.kodeGuru, teacher.email]
    .map((v) => (v ?? "").toLowerCase())
    .some((v) => v.includes(q));
}

function matchesTeacherMajor(
  teacher: TeacherSummary,
  majorId: string,
  majors: Major[]
) {
  if (!majorId) return true;
  const code = majors.find((m) => m.id === majorId)?.code;
  return Boolean(code && (teacher.majorCodes ?? []).includes(code));
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

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: AddTeacherDialogProps) {
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [form, setForm] = useState<TeacherForm>(EMPTY_FORM);
  const [mode, setMode] = useState<TeacherMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<TeacherForm | null>(null);
  const [filterMajorId, setFilterMajorId] = useState("");
  const [filterTeacherQuery, setFilterTeacherQuery] = useState("");
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

  const selectedTeacher = teachers.find((t) => t.id === editingId);
  const majorOptions: JurusanOption[] = useMemo(
    () => majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` })),
    [majors]
  );

  const statusOptions: JurusanOption[] = [
    { value: "Aktif", label: "Aktif" },
    { value: "Nonaktif", label: "Nonaktif" },
  ];

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (t) =>
        matchesTeacherQuery(t, filterTeacherQuery) &&
        matchesTeacherMajor(t, filterMajorId, majors)
    );
  }, [teachers, filterTeacherQuery, filterMajorId, majors]);

  const teacherOptions: JurusanOption[] = useMemo(
    () =>
      filteredTeachers.map((t) => ({
        value: t.id,
        label: `${t.fullName} (${t.nomorInduk ?? "-"})${t.majorName ? ` • ${t.majorName}` : ""}`,
      })),
    [filteredTeachers]
  );

  const isDirty = Boolean(
    editingId &&
      baseline &&
      Object.keys(EMPTY_FORM).some((k) => form[k as keyof TeacherForm] !== baseline[k as keyof TeacherForm])
  );

  const dirtyConfirm = async (message: string) => !isDirty || (await askConfirm(message));

  const resetState = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
    setMode("add");
    setEditingId(null);
    setBaseline(null);
    setFilterMajorId("");
    setFilterTeacherQuery("");
  };

  const setField = <K extends keyof TeacherForm>(key: K, value: TeacherForm[K]) =>
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
    if (!form.majorId) next.majorId = "Jurusan / konsentrasi wajib dipilih";
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

    if (mode === "edit" && !editingId) {
      toast.error("Guru belum dipilih", {
        description: "Pilih guru pada panel sebelah kanan untuk mulai mengedit.",
      });
      return;
    }

    if (mode === "delete") {
      if (!editingId || !selectedTeacher) {
        toast.error("Guru belum dipilih", {
          description: "Pilih guru pada panel sebelah kanan untuk dihapus.",
        });
        return;
      }
      const ok = await askConfirm(
        `Hapus ${selectedTeacher.fullName} beserta seluruh penugasan (mapel, kelas, dan jadwal mengajar)? Slot jadwal pelajaran menjadi tanpa guru. Tindakan ini tidak bisa dibatalkan.`
      );
      setConfirmOpen(false);
      if (!ok) return;
      setSubmitting(true);
      try {
        const res = await masterDataApi.teachers.remove(editingId);
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        toast.success("Guru dihapus", {
          description: `${selectedTeacher.fullName} (${selectedTeacher.nomorInduk ?? "-"}) telah dihapus dari data pendidik.`,
        });
        onSuccess?.();
        resetState();
        onOpenChange(false);
      } catch (err) {
        toast.error("Gagal menghapus guru", {
          description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        nomorInduk: form.nomorInduk,
        tanggalLahir: form.tanggalLahir,
        email: form.email.trim() || null,
        majorId: form.majorId || null,
        ...(mode === "edit" ? { isActive: form.accountStatus === "Aktif" } : {}),
      };
      const res =
        mode === "edit" && editingId
          ? await masterDataApi.teachers.update(editingId, payload)
          : await masterDataApi.teachers.create(payload);
      if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);

      toast.success(
        mode === "edit" ? "Data guru diperbarui" : "Guru baru siap diaktifkan",
        {
          description: `${form.fullName.trim()} (${
            normalizeNomorInduk(form.nomorInduk)
          })${defaultPassword ? ` — kata sandi awal ${defaultPassword}` : ""}.`,
        }
      );
      onSuccess?.();
      resetState();
      onOpenChange(false);
    } catch (err) {
      toast.error(mode === "edit" ? "Gagal memperbarui guru" : "Gagal menyimpan guru", {
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

  const switchMode = async (nextMode: TeacherMode) => {
    if (submitting || nextMode === mode) return;
    const ok = await dirtyConfirm("Perubahan belum disimpan. Ganti mode dan buang perubahan?");
    setConfirmOpen(false);
    if (!ok) return;
    setMode(nextMode);
    setEditingId(null);
    setBaseline(null);
    if (nextMode === "add") setForm(EMPTY_FORM);
  };

  const handleSelectTeacher = (teacherId: string) => {
    const t = teachers.find((item) => item.id === teacherId);
    if (!t) return;
    const majorId = majors.find((m) => m.code === t.majorCode)?.id ?? "";
    const next: TeacherForm = {
      fullName: t.fullName,
      nomorInduk: t.nomorInduk ?? "",
      tanggalLahir: t.tanggalLahir ?? "",
      email: t.email ?? "",
      majorId,
      accountStatus: t.isActive ? "Aktif" : "Nonaktif",
    };
    setEditingId(t.id);
    setForm(next);
    setBaseline(next);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    const fetchData = async () => {
      try {
        const [teachersRes, majorsRes] = await Promise.all([
          masterDataApi.teachers.list(),
          masterDataApi.majors.list(),
        ]);
        if (!active) return;
        if (teachersRes.error || majorsRes.error) {
          throw new Error("Gagal memuat data guru dan jurusan");
        }
        setTeachers(teachersRes.data?.data ?? []);
        setMajors(majorsRes.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        if (!active) return;
        setTeachers([]);
        setMajors([]);
        toast.error("Gagal memuat data guru", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      }
    };
    void fetchData();
    return () => {
      active = false;
    };
  }, [open]);

  const handleMajorChange = (majorId: string) => {
    setFilterMajorId(majorId);
    if (mode === "edit" || mode === "delete") setEditingId((prev) => {
      if (!prev) return prev;
      const teacher = teachers.find((item) => item.id === prev);
      return teacher &&
        matchesTeacherQuery(teacher, filterTeacherQuery) &&
        matchesTeacherMajor(teacher, majorId, majors)
        ? prev
        : null;
    });
  };

  const handleTeacherQueryChange = (value: string) => {
    setFilterTeacherQuery(value);
    if (mode === "edit" || mode === "delete") setEditingId((prev) => {
      if (!prev) return prev;
      const teacher = teachers.find((item) => item.id === prev);
      return teacher &&
        matchesTeacherQuery(teacher, value) &&
        matchesTeacherMajor(teacher, filterMajorId, majors)
        ? prev
        : null;
    });
  };

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
                  Manajemen Data Guru
                </DialogTitle>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  SMK Mataram SSO
                </span>
              </div>
              <DialogDescription className="mt-0.5 text-xs text-indigo-100">
                Tambah, perbarui, atau hapus data pendidik bersama jurusan dan akun masuk.
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
                  ? "Tambah guru baru ke data pendidik tanpa menimpa data lain."
                  : mode === "edit"
                    ? editingId
                      ? "Ubah data guru terpilih lalu simpan."
                      : "Pilih guru pada panel sebelah kanan untuk mulai mengubah."
                    : "Hapus guru terpilih dari data pendidik."}
              </span>
            </p>
          </div>

          {mode === "delete" && (
            <div className="mt-4 flex items-center gap-3.5">
              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-full border-2 border-[#c9c4d5]/60 bg-[#e5deff] text-sm font-bold text-[#4331a8] shadow-sm">
                  {selectedTeacher ? buildInitials(selectedTeacher.fullName) : "?"}
                </div>
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-white ${
                    selectedTeacher?.isActive ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">
                    {selectedTeacher?.fullName ?? "Pilih guru terlebih dahulu"}
                  </h3>
                  {selectedTeacher ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      {selectedTeacher.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {selectedTeacher
                    ? `NIP: ${selectedTeacher.nomorInduk ?? "-"}${
                        selectedTeacher.email ? ` • ${selectedTeacher.email}` : ""
                      }`
                    : "Pilih guru dari daftar untuk menghapus."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
          <form id="add-teacher-form" onSubmit={handleSubmit} className="min-h-0 flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
            {mode === "delete" ? (
              editingId && selectedTeacher ? (
                <section className="space-y-4">
                  <div className="rounded-2xl border border-[#f3c9c4] bg-[#fef6f5] p-5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[#fde8e6] text-[#ba1a1a]">
<Trash2 className="size-4" />
                      </span>
                      <h3 className="text-sm font-bold text-[#ba1a1a]">Guru yang Akan Dihapus</h3>
                    </div>
                    <div className="mt-3 grid gap-1.5 text-xs leading-5 text-[#4e566c]">
                      <p>
                        <span className="font-semibold text-[#181c20]">Nama:</span> {selectedTeacher.fullName}
                      </p>
                      <p>
                        <span className="font-semibold text-[#181c20]">NIP:</span>{" "}
                        {selectedTeacher.nomorInduk ?? "-"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#181c20]">Kode Guru:</span>{" "}
                        {selectedTeacher.kodeGuru ?? "-"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#181c20]">Jurusan:</span>{" "}
                        {selectedTeacher.majorName ?? "-"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#181c20]">Status:</span>{" "}
                        {selectedTeacher.isActive ? "Aktif" : "Nonaktif"}
                      </p>
                    </div>
                    <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] leading-5 text-[#787584]">
                      Akun guru beserta seluruh penugasan (mapel, kelas, dan jadwal mengajar) akan
                      dihapus permanen. Slot jadwal pelajaran menjadi tanpa guru. Tindakan ini tidak
                      bisa dibatalkan.
                    </p>
                  </div>
                </section>
              ) : (
                <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#efc9c4] bg-[#fef6f5] px-6 py-16 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#fde8e6] text-[#ba1a1a]">
                    <Trash2 className="size-7" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Guru yang Akan Dihapus</h3>
                  <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">
                    Filter jurusan dan cari guru pada panel sebelah kanan, lalu pilih guru untuk dihapus.
                  </p>
                </section>
              )
            ) : mode === "edit" && !editingId ? (
              <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#c9c4d5] bg-[#f8f9fc] px-6 py-16 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#e5deff] text-[#5343b9]">
                  <PencilLine className="size-7" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Guru Terlebih Dahulu</h3>
                <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">
                  Pilih guru pada panel sebelah kanan untuk diedit. Isi formulir akan mengikuti guru yang
                  dipilih.
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
                      <h3 className="text-sm font-bold text-[#181c20]">Identitas Resmi Guru</h3>
                    </div>
                    <span className="text-[11px] font-medium text-[#787584]">* Kolom wajib diisi</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel required>Nama Lengkap Pendidik &amp; Gelar</FieldLabel>
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
                      <FieldLabel required>Jurusan / Konsentrasi Keahlian</FieldLabel>
                      <SearchableDropdown
                        value={form.majorId}
                        onChange={setField.bind(null, "majorId")}
                        options={majorOptions}
                        label={majors.length ? "Pilih jurusan konsentrasi" : "Belum ada data jurusan"}
                        disabled={!majors.length}
                      />
                      <FieldError message={errors.majorId} />
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
                      <p className="mt-1 text-[10px] text-[#787584]">Kosongkan jika guru login memakai nomor induk.</p>
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
                      />
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
              </>
            )}
          </form>

          {(mode === "edit" || mode === "delete") && (
            <aside className="min-h-0 flex-1 shrink-0 overflow-y-auto border-t border-slate-200/70 bg-[#f8f9fc] p-5 lg:w-[360px] lg:flex-none lg:border-l lg:border-t-0">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">Filter Jurusan</label>
                    <SearchableDropdown
                      value={filterMajorId}
                      onChange={handleMajorChange}
                      options={majorOptions}
                      label={majors.length ? "Pilih jurusan" : "Belum ada data jurusan"}
                      disabled={!majors.length || submitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">Cari Guru</label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                      <input
                        type="text"
                        value={filterTeacherQuery}
                        onChange={(e) => handleTeacherQueryChange(e.target.value)}
                        placeholder="Nama, NIP, atau kode guru..."
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-[11px] font-bold text-[#181c20]">
                    {mode === "delete" ? "Guru yang akan dihapus" : "Guru yang akan diperbarui"} <span className="text-[#c0262d]">*</span>
                  </label>
                  <SearchableDropdown
                    value={editingId ?? ""}
                    onChange={handleSelectTeacher}
                    options={teacherOptions}
                    label={
                      teacherOptions.length
                        ? "Pilih guru"
                        : "Tidak ada guru yang cocok"
                    }
                    disabled={submitting || !teacherOptions.length}
                  />
                  <p className="text-[11px] text-[#787584]">
                    {mode === "delete"
                      ? "Panel konfirmasi di sebelah kiri akan menampilkan guru yang dipilih."
                      : "Isi formulir di sebelah kiri akan mengikuti guru yang dipilih."}
                  </p>
                </div>

                {editingId && selectedTeacher ? (
                  <div className="rounded-xl border border-[#d9d3f0] bg-white p-3 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#5343b9]">
                        <PencilLine className="size-3.5" />
                      </span>
                      <p className="text-xs font-bold text-[#181c20]">Guru terpilih</p>
                      {editingId && selectedTeacher ? (
                        <span className="ml-auto rounded-full bg-[#f0edff] px-2 py-0.5 text-[9px] font-bold text-[#5343b9]">
                          # {isDirty ? "Diubah" : "Asli"}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[11px] leading-5 text-[#787584]">
                      <p><span className="font-semibold text-[#181c20]">Nama:</span> {selectedTeacher.fullName}</p>
                      <p><span className="font-semibold text-[#181c20]">NIP:</span> {selectedTeacher.nomorInduk ?? "-"}</p>
                      <p><span className="font-semibold text-[#181c20]">Kode Guru:</span> {selectedTeacher.kodeGuru ?? "-"}</p>
                      <p><span className="font-semibold text-[#181c20]">Jurusan:</span> {selectedTeacher.majorName ?? "-"}</p>
                      <p><span className="font-semibold text-[#181c20]">Status:</span> {selectedTeacher.isActive ? "Aktif" : "Nonaktif"}</p>
                    </div>
                    {!editingId ? (
                      <p className="mt-2 rounded-lg bg-[#f8f9fc] px-2.5 py-2 text-[10px] leading-4 text-[#787584]">
                        Belum ada guru dipilih. Filter jurusan dan cari guru, lalu pilih di atas.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </aside>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <BadgeCheck className="size-4 text-emerald-600" />
            <span>Data sesuai induk pendidik</span>
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
                  : mode === "edit"
                    ? "Menyimpan..."
                    : "Menyimpan..."
                : mode === "delete"
                  ? "Hapus Guru"
                  : mode === "edit"
                    ? "Simpan Perubahan"
                    : "Simpan & Aktifkan Guru"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={confirmOpen} onOpenChange={(next) => { if (!next) respondConfirm(false); }}>
      <DialogContent className="bg-[#f8f9fc] border border-[#c9c4d5]/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ffe5e5] text-[#ba1a1a]">
            <AlertTriangle className="size-5" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-sm font-bold text-[#181c20] tracking-tight">Konfirmasi Tindakan</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6 text-[#787584]">{confirmMessage}</DialogDescription>
          </div>
        </div>
        <DialogFooter className="border-t border-[#c9c4d5]/60 bg-[#f8f9fc] px-6 py-4 flex justify-end gap-2">
          <button type="button" onClick={() => respondConfirm(false)} className="flex items-center justify-center gap-1.5 rounded-xl border border-[#c9c4d5]/60 bg-white px-4 py-2.5 text-sm font-semibold text-[#4e566c] transition-all hover:bg-[#eceef3] active:bg-[#d9d3f0]">Batal</button>
          <button type="button" onClick={() => respondConfirm(true)} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#ba1a1a] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/20 transition-all hover:bg-[#93000a] active:bg-[#7a0008]">Ya, Lanjutkan</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

function buildInitials(name: string) {
  const parts = name
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter((part) => part && !/^(bpk|ibu|bapak|drs|dra|dr|hj|h)\.?$/i.test(part));
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

