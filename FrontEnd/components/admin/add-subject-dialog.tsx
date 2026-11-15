"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Layers,
  PencilLine,
  PlusCircle,
  Search,
  Sparkles,
  Trash2,
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
import type { GradeLevel, Major, Subject } from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialMode?: SubjectMode;
  initialSubjectId?: string | null;
}

type SubjectMode = "add" | "edit" | "delete";

interface SubjectForm {
  name: string;
  code: string;
  description: string;
  majorId: string;
  gradeLevelId: string;
  semester: string;
  subjectStatus: string;
}

const EMPTY_FORM: SubjectForm = {
  name: "",
  code: "",
  description: "",
  majorId: "",
  gradeLevelId: "",
  semester: "Ganjil",
  subjectStatus: "Aktif",
};

const semesterOptions: JurusanOption[] = [
  { value: "Ganjil", label: "Ganjil" },
  { value: "Genap", label: "Genap" },
];

const statusOptions: JurusanOption[] = [
  { value: "Aktif", label: "Aktif" },
  { value: "Nonaktif", label: "Nonaktif" },
];

function matchesSubjectQuery(subject: Subject, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [subject.name, subject.code, subject.description]
    .map((v) => (v ?? "").toLowerCase())
    .some((v) => v.includes(q));
}

function matchesSubjectMajor(subject: Subject, majorId: string) {
  if (!majorId) return true;
  return subject.majorId === majorId;
}

function matchesSubjectGrade(subject: Subject, gradeLevelId: string) {
  if (!gradeLevelId) return true;
  return subject.gradeLevelId === gradeLevelId;
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

export function AddSubjectDialog({
  open,
  onOpenChange,
  onSuccess,
  initialMode = "add",
  initialSubjectId = null,
}: AddSubjectDialogProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [form, setForm] = useState<SubjectForm>(EMPTY_FORM);
  const [modeOverride, setModeOverride] = useState<SubjectMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<SubjectForm | null>(null);
  const [filterMajorId, setFilterMajorId] = useState("");
  const [filterGradeLevelId, setFilterGradeLevelId] = useState("");
  const [filterSubjectQuery, setFilterSubjectQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmResolveRef = useRef<(ok: boolean) => void>(() => {});

  const mode: SubjectMode = modeOverride ?? initialMode;

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

  const selectedSubject = subjects.find((s) => s.id === editingId);

  const majorOptions: JurusanOption[] = useMemo(
    () => majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` })),
    [majors]
  );

  const gradeOptions: JurusanOption[] = useMemo(
    () => gradeLevels.map((g) => ({ value: g.id, label: `${g.code} — ${g.name}` })),
    [gradeLevels]
  );

  const filterMajorOptions: JurusanOption[] = useMemo(
    () => [{ value: "", label: "Semua jurusan" }, ...majorOptions],
    [majorOptions]
  );

  const filterGradeOptions: JurusanOption[] = useMemo(
    () => [{ value: "", label: "Semua tingkatan" }, ...gradeOptions],
    [gradeOptions]
  );

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (s) =>
        matchesSubjectQuery(s, filterSubjectQuery) &&
        matchesSubjectMajor(s, filterMajorId) &&
        matchesSubjectGrade(s, filterGradeLevelId)
    );
  }, [subjects, filterSubjectQuery, filterMajorId, filterGradeLevelId]);

  const subjectOptions: JurusanOption[] = useMemo(
    () =>
      filteredSubjects.map((s) => ({
        value: s.id,
        label: `${s.code} — ${s.name}${s.gradeCode ? ` (${s.gradeCode} ${s.semester})` : ""}`,
      })),
    [filteredSubjects]
  );

  const isDirty = Boolean(
    editingId &&
      baseline &&
      Object.keys(EMPTY_FORM).some((k) => form[k as keyof SubjectForm] !== baseline[k as keyof SubjectForm])
  );

  const dirtyConfirm = async (message: string) => !isDirty || (await askConfirm(message));

  const resetState = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
    setModeOverride(null);
    setEditingId(null);
    setBaseline(null);
    setFilterMajorId("");
    setFilterGradeLevelId("");
    setFilterSubjectQuery("");
  };

  const setField = <K extends keyof SubjectForm>(key: K, value: SubjectForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toForm = (s: Subject): SubjectForm => ({
    name: s.name,
    code: s.code,
    description: s.description ?? "",
    majorId: s.majorId ?? "",
    gradeLevelId: s.gradeLevelId,
    semester: s.semester,
    subjectStatus: s.isActive ? "Aktif" : "Nonaktif",
  });

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "Nama mata pelajaran wajib diisi";
    if (!form.code.trim()) next.code = "Kode mata pelajaran wajib diisi";
    if (!form.gradeLevelId) next.gradeLevelId = "Tingkatan wajib dipilih";
    if (!form.semester) next.semester = "Semester wajib dipilih";

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    if (mode === "edit" && !editingId) {
      toast.error("Mata pelajaran belum dipilih", {
        description: "Pilih mata pelajaran pada panel sebelah kanan untuk mulai mengedit.",
      });
      return;
    }

    if (mode === "delete") {
      if (!editingId || !selectedSubject) {
        toast.error("Mata pelajaran belum dipilih", {
          description: "Pilih mata pelajaran pada panel sebelah kanan untuk dihapus.",
        });
        return;
      }
      const ok = await askConfirm(
        `Hapus ${selectedSubject.name} (${selectedSubject.code})? Mata pelajaran yang masih dipakai modul, enrollment, atau pengajar tidak dapat dihapus. Tindakan ini tidak bisa dibatalkan.`
      );
      setConfirmOpen(false);
      if (!ok) return;
      setSubmitting(true);
      try {
        const res = await masterDataApi.subjects.remove(editingId);
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        toast.success("Mata pelajaran dihapus", {
          description: `${selectedSubject.name} (${selectedSubject.code}) telah dihapus dari kurikulum.`,
        });
        onSuccess?.();
        resetState();
        onOpenChange(false);
      } catch (err) {
        toast.error("Gagal menghapus mata pelajaran", {
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
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || null,
        majorId: form.majorId || null,
        gradeLevelId: form.gradeLevelId,
        semester: form.semester,
        isActive: form.subjectStatus === "Aktif",
      };
      const res =
        mode === "edit" && editingId
          ? await masterDataApi.subjects.update(editingId, payload)
          : await masterDataApi.subjects.create(payload);
      if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);

      const gradeCode = gradeLevels.find((g) => g.id === form.gradeLevelId)?.code;
      toast.success(mode === "edit" ? "Mata pelajaran diperbarui" : "Mata pelajaran baru ditambahkan", {
        description: `${form.name.trim()} (${form.code.trim()})${
          gradeCode ? ` — ${gradeCode} ${form.semester}` : ""
        }.`,
      });
      onSuccess?.();
      resetState();
      onOpenChange(false);
    } catch (err) {
      toast.error(mode === "edit" ? "Gagal memperbarui mata pelajaran" : "Gagal menyimpan mata pelajaran", {
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

  const switchMode = async (nextMode: SubjectMode) => {
    if (submitting || nextMode === mode) return;
    const ok = await dirtyConfirm("Perubahan belum disimpan. Ganti mode dan buang perubahan?");
    setConfirmOpen(false);
    if (!ok) return;
    setModeOverride(nextMode);
    setEditingId(null);
    setBaseline(null);
    setErrors({});
    if (nextMode === "add") setForm(EMPTY_FORM);
  };

  const handleSelectSubject = (subjectId: string) => {
    const s = subjects.find((item) => item.id === subjectId);
    if (!s) return;
    const next = toForm(s);
    setEditingId(s.id);
    setForm(next);
    setBaseline(next);
  };

  const handleMajorFilterChange = (majorId: string) => {
    setFilterMajorId(majorId);
    if (mode === "edit" || mode === "delete") {
      setEditingId((prev) => {
        if (!prev) return prev;
        const subject = subjects.find((item) => item.id === prev);
        return subject &&
          matchesSubjectQuery(subject, filterSubjectQuery) &&
          matchesSubjectMajor(subject, majorId) &&
          matchesSubjectGrade(subject, filterGradeLevelId)
          ? prev
          : null;
      });
    }
  };

  const handleGradeFilterChange = (gradeLevelId: string) => {
    setFilterGradeLevelId(gradeLevelId);
    if (mode === "edit" || mode === "delete") {
      setEditingId((prev) => {
        if (!prev) return prev;
        const subject = subjects.find((item) => item.id === prev);
        return subject &&
          matchesSubjectQuery(subject, filterSubjectQuery) &&
          matchesSubjectMajor(subject, filterMajorId) &&
          matchesSubjectGrade(subject, gradeLevelId)
          ? prev
          : null;
      });
    }
  };

  const handleSubjectQueryChange = (value: string) => {
    setFilterSubjectQuery(value);
    if (mode === "edit" || mode === "delete") {
      setEditingId((prev) => {
        if (!prev) return prev;
        const subject = subjects.find((item) => item.id === prev);
        return subject &&
          matchesSubjectQuery(subject, value) &&
          matchesSubjectMajor(subject, filterMajorId) &&
          matchesSubjectGrade(subject, filterGradeLevelId)
          ? prev
          : null;
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    const fetchData = async () => {
      try {
        const [subjectsRes, majorsRes, gradesRes] = await Promise.all([
          masterDataApi.subjects.list({ includeInactive: true }),
          masterDataApi.majors.list(true),
          masterDataApi.gradeLevels.list(true),
        ]);
        if (!active) return;
        if (subjectsRes.error || majorsRes.error || gradesRes.error) {
          throw new Error("Gagal memuat data mata pelajaran, jurusan, dan tingkatan");
        }
        const list = subjectsRes.data?.data ?? [];
        setSubjects(list);
        setMajors(majorsRes.data?.data ?? []);
        setGradeLevels(gradesRes.data?.data ?? []);
        if (initialSubjectId && initialMode !== "add") {
          const selected = list.find((item) => item.id === initialSubjectId);
          if (selected) {
            const next = toForm(selected);
            setEditingId(selected.id);
            setForm(next);
            setBaseline(next);
          }
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        if (!active) return;
        setSubjects([]);
        setMajors([]);
        setGradeLevels([]);
        toast.error("Gagal memuat data mata pelajaran", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      }
    };
    void fetchData();
    return () => {
      active = false;
    };
  }, [open, initialMode, initialSubjectId]);

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
                <BookOpen className="size-6 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-lg font-bold tracking-tight text-white">
                    Manajemen Mata Pelajaran
                  </DialogTitle>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                    SMK Mataram SSO
                  </span>
                </div>
                <DialogDescription className="mt-0.5 text-xs text-indigo-100">
                  Tambah, perbarui, atau hapus mata pelajaran pada kurikulum sekolah.
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
                    ? "Tambah mata pelajaran baru tanpa menimpa data lain."
                    : mode === "edit"
                      ? editingId
                        ? "Ubah data mata pelajaran terpilih lalu simpan."
                        : "Pilih mata pelajaran pada panel sebelah kanan untuk mulai mengubah."
                      : "Hapus mata pelajaran terpilih dari kurikulum."}
                </span>
              </p>
            </div>

            {mode === "delete" && (
              <div className="mt-4 flex items-center gap-3.5">
                <div className="relative">
                  <div className="flex size-11 items-center justify-center rounded-full border-2 border-[#c9c4d5]/60 bg-[#e5deff] text-sm font-bold text-[#4331a8] shadow-sm">
                    {selectedSubject ? buildInitials(selectedSubject.name) : "?"}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-white ${
                      selectedSubject?.isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">
                      {selectedSubject?.name ?? "Pilih mata pelajaran terlebih dahulu"}
                    </h3>
                    {selectedSubject ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        {selectedSubject.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {selectedSubject
                      ? `${selectedSubject.code}${
                          selectedSubject.gradeCode ? ` • ${selectedSubject.gradeCode}` : ""
                        } • ${selectedSubject.semester}`
                      : "Pilih mata pelajaran dari daftar untuk menghapus."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
            <form
              id="add-subject-form"
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
            >
              {mode === "delete" ? (
                editingId && selectedSubject ? (
                  <section className="space-y-4">
                    <div className="rounded-2xl border border-[#f3c9c4] bg-[#fef6f5] p-5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-[#fde8e6] text-[#ba1a1a]">
                          <Trash2 className="size-4" />
                        </span>
                        <h3 className="text-sm font-bold text-[#ba1a1a]">Mata Pelajaran yang Akan Dihapus</h3>
                      </div>
                      <div className="mt-3 grid gap-1.5 text-xs leading-5 text-[#4e566c]">
                        <p>
                          <span className="font-semibold text-[#181c20]">Kode:</span> {selectedSubject.code}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Nama:</span> {selectedSubject.name}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Jurusan:</span>{" "}
                          {selectedSubject.majorName ?? "Umum"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Tingkatan:</span>{" "}
                          {selectedSubject.gradeCode ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Semester:</span>{" "}
                          {selectedSubject.semester}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Status:</span>{" "}
                          {selectedSubject.isActive ? "Aktif" : "Nonaktif"}
                        </p>
                      </div>
                      <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] leading-5 text-[#787584]">
                        Mata pelajaran yang masih memiliki modul, enrollment, atau pengajar tidak dapat
                        dihapus — nonaktifkan saja sebagai gantinya. Tindakan ini tidak bisa dibatalkan.
                      </p>
                    </div>
                  </section>
                ) : (
                  <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#efc9c4] bg-[#fef6f5] px-6 py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-[#fde8e6] text-[#ba1a1a]">
                      <Trash2 className="size-7" />
                    </span>
                    <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Mata Pelajaran yang Akan Dihapus</h3>
                    <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">
                      Filter jurusan/tingkatan dan cari mata pelajaran pada panel sebelah kanan, lalu pilih
                      untuk dihapus.
                    </p>
                  </section>
                )
              ) : mode === "edit" && !editingId ? (
                <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#c9c4d5] bg-[#f8f9fc] px-6 py-16 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#e5deff] text-[#5343b9]">
                    <PencilLine className="size-7" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Mata Pelajaran Terlebih Dahulu</h3>
                  <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">
                    Pilih mata pelajaran pada panel sebelah kanan untuk diedit. Isi formulir akan mengikuti
                    data yang dipilih.
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
                        <h3 className="text-sm font-bold text-[#181c20]">Identitas Mata Pelajaran</h3>
                      </div>
                      <span className="text-[11px] font-medium text-[#787584]">* Kolom wajib diisi</span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <FieldLabel required>Nama Mata Pelajaran</FieldLabel>
                        <div className="relative">
                          <BookOpen className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="Contoh: Pemrograman Web & Perangkat Bergerak"
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                        <FieldError message={errors.name} />
                      </div>

                      <div>
                        <FieldLabel required>Kode Mata Pelajaran</FieldLabel>
                        <div className="relative">
                          <Layers className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                          <input
                            type="text"
                            value={form.code}
                            onChange={(e) => setField("code", e.target.value.toUpperCase())}
                            placeholder="Contoh: RPL-X-1"
                            className={`${inputClass} pl-10 font-mono`}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-[#787584]">
                          Kode unik per kombinasi tingkatan + semester.
                        </p>
                        <FieldError message={errors.code} />
                      </div>

                      <div className="sm:col-span-2">
                        <FieldLabel>Deskripsi (Opsional)</FieldLabel>
                        <textarea
                          value={form.description}
                          onChange={(e) => setField("description", e.target.value)}
                          placeholder="Ringkasan isi atau capaian pembelajaran mapel"
                          rows={3}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20"
                        />
                        <FieldError message={errors.description} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">
                        2
                      </span>
                      <h3 className="text-sm font-bold text-[#181c20]">Kurikulum &amp; Tingkatan</h3>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel required>Tingkatan</FieldLabel>
                        <SearchableDropdown
                          value={form.gradeLevelId}
                          onChange={setField.bind(null, "gradeLevelId")}
                          options={gradeOptions}
                          label={gradeLevels.length ? "Pilih tingkatan" : "Belum ada data tingkatan"}
                          disabled={!gradeLevels.length}
                        />
                        <FieldError message={errors.gradeLevelId} />
                      </div>

                      <div>
                        <FieldLabel>Jurusan / Konsentrasi</FieldLabel>
                        <SearchableDropdown
                          value={form.majorId}
                          onChange={setField.bind(null, "majorId")}
                          options={[{ value: "", label: "Umum (tanpa jurusan)" }, ...majorOptions]}
                          label="Umum (tanpa jurusan)"
                        />
                        <p className="mt-1 text-[10px] text-[#787584]">
                          Kosongkan untuk mata pelajaran umum.
                        </p>
                        <FieldError message={errors.majorId} />
                      </div>

                      <div>
                        <FieldLabel required>Semester</FieldLabel>
                        <SearchableDropdown
                          value={form.semester}
                          onChange={setField.bind(null, "semester")}
                          options={semesterOptions}
                          label="Pilih semester"
                        />
                        <FieldError message={errors.semester} />
                      </div>

                      <div>
                        <FieldLabel>Status Mata Pelajaran</FieldLabel>
                        <SearchableDropdown
                          value={form.subjectStatus}
                          onChange={setField.bind(null, "subjectStatus")}
                          options={statusOptions}
                          label="Aktif"
                          disabled={mode === "add"}
                        />
                        <p className="mt-1 text-[10px] text-[#787584]">
                          {mode === "add"
                            ? "Mata pelajaran baru langsung aktif setelah disimpan."
                            : "Nonaktifkan mapel tanpa menghapus datanya."}
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
                        onChange={handleMajorFilterChange}
                        options={filterMajorOptions}
                        label="Semua jurusan"
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#181c20]">Filter Tingkatan</label>
                      <SearchableDropdown
                        value={filterGradeLevelId}
                        onChange={handleGradeFilterChange}
                        options={filterGradeOptions}
                        label="Semua tingkatan"
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#181c20]">Cari Mata Pelajaran</label>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                        <input
                          type="text"
                          value={filterSubjectQuery}
                          onChange={(e) => handleSubjectQueryChange(e.target.value)}
                          placeholder="Nama, kode, atau deskripsi..."
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">
                      {mode === "delete" ? "Mata pelajaran yang akan dihapus" : "Mata pelajaran yang akan diperbarui"}{" "}
                      <span className="text-[#c0262d]">*</span>
                    </label>
                    <SearchableDropdown
                      value={editingId ?? ""}
                      onChange={handleSelectSubject}
                      options={subjectOptions}
                      label={subjectOptions.length ? "Pilih mata pelajaran" : "Tidak ada mata pelajaran yang cocok"}
                      disabled={submitting || !subjectOptions.length}
                    />
                    <p className="text-[11px] text-[#787584]">
                      {mode === "delete"
                        ? "Panel konfirmasi di sebelah kiri akan menampilkan mapel yang dipilih."
                        : "Isi formulir di sebelah kiri akan mengikuti mapel yang dipilih."}
                    </p>
                  </div>

                  {editingId && selectedSubject ? (
                    <div className="mt-2 rounded-xl border border-[#d9d3f0] bg-white p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#5343b9]">
                          <PencilLine className="size-3.5" />
                        </span>
                        <p className="text-xs font-bold text-[#181c20]">Mapel terpilih</p>
                        <span className="ml-auto rounded-full bg-[#f0edff] px-2 py-0.5 text-[9px] font-bold text-[#5343b9]">
                          # {isDirty ? "Diubah" : "Asli"}
                        </span>
                      </div>
                      <div className="text-[11px] leading-5 text-[#787584]">
                        <p>
                          <span className="font-semibold text-[#181c20]">Kode:</span> {selectedSubject.code}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Nama:</span> {selectedSubject.name}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Jurusan:</span>{" "}
                          {selectedSubject.majorName ?? "Umum"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Tingkatan:</span>{" "}
                          {selectedSubject.gradeCode ?? "-"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Semester:</span>{" "}
                          {selectedSubject.semester}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Status:</span>{" "}
                          {selectedSubject.isActive ? "Aktif" : "Nonaktif"}
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
              <span>Data sesuai kurikulum sekolah</span>
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
                form="add-subject-form"
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
                    ? "Hapus Mapel"
                    : mode === "edit"
                      ? "Simpan Perubahan"
                      : "Simpan & Tambah Mapel"}
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
