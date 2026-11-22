"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Info,
  PencilLine,
  PlusCircle,
  Search,
  Trash2,
  UserRoundCheck,
  Users,
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
import type { GradeLevel, Major, SchoolClass, StudentSummary } from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

interface AddStudentPlacementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type PlacementMode = "add" | "edit" | "delete";

const EMPTY_FORM = {
  majorId: "",
  gradeLevelId: "",
  classId: "",
};

const MAX_STUDENT_ROWS = 200;

function buildInitials(name: string) {
  const parts = name
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function gradePhase(code: string) {
  if (code === "X") return "Fase E";
  if (code === "XI") return "Fase F";
  if (code === "XII") return "Fase F Lanjutan";
  return code;
}

export function AddStudentPlacementDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddStudentPlacementDialogProps) {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [mode, setMode] = useState<PlacementMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<typeof EMPTY_FORM | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterMajorCode, setFilterMajorCode] = useState("");
  const [filterGradeCode, setFilterGradeCode] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
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
  const selectedClass = classes.find((c) => c.id === form.classId);

  const isDirty = Boolean(
    editingId &&
      baseline &&
      (Object.keys(EMPTY_FORM) as (keyof typeof EMPTY_FORM)[]).some(
        (k) => form[k] !== baseline[k]
      )
  );

  const majorOptions: JurusanOption[] = useMemo(
    () => majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` })),
    [majors]
  );

  const filterMajorOptions: JurusanOption[] = useMemo(
    () => [{ value: "", label: "Semua jurusan" }, ...majors.map((m) => ({ value: m.code, label: `${m.code} - ${m.name}` }))],
    [majors]
  );

  const filterGradeOptions: JurusanOption[] = useMemo(
    () => [{ value: "", label: "Semua tingkat" }, ...gradeLevels.map((g) => ({ value: g.code, label: `Kelas ${g.code} (${gradePhase(g.code)})` }))],
    [gradeLevels]
  );

  const classesForForm = useMemo(
    () =>
      classes.filter(
        (c) => c.majorId === form.majorId && c.gradeLevelId === form.gradeLevelId
      ),
    [classes, form.majorId, form.gradeLevelId]
  );

  const filteredStudents = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    const rows = students.filter((s) => {
      if (filterMajorCode && (s.majorCode ?? "") !== filterMajorCode) return false;
      if (filterGradeCode && (s.gradeCode ?? "") !== filterGradeCode) return false;
      if (!q) return true;
      return [s.fullName, s.nomorInduk, s.nisn, s.email]
        .map((v) => (v ?? "").toLowerCase())
        .some((v) => v.includes(q));
    });
    return rows.sort((a, b) => {
      const az = a.classId ? 1 : 0;
      const bz = b.classId ? 1 : 0;
      if (az !== bz) return az - bz;
      return a.fullName.localeCompare(b.fullName);
    });
  }, [students, filterMajorCode, filterGradeCode, filterQuery]);

  const studentOptions: JurusanOption[] = useMemo(
    () =>
      filteredStudents.map((s) => ({
        value: s.id,
        label: `${s.fullName} (${s.nomorInduk ?? s.nisn ?? "-"})${s.className ? ` • ${s.className}` : " • Belum ditempatkan"}`,
      })),
    [filteredStudents]
  );

  const resetState = () => {
    setForm(EMPTY_FORM);
    setSubmitting(false);
    setMode("add");
    setEditingId(null);
    setBaseline(null);
    setSelectedIds([]);
    setFilterMajorCode("");
    setFilterGradeCode("");
    setFilterQuery("");
  };

  const toggleStudent = (studentId: string) =>
    setSelectedIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );

  const handleModeChange = (nextMode: PlacementMode) => {
    if (submitting || nextMode === mode) return;
    setMode(nextMode);
    setEditingId(null);
    setBaseline(null);
    if (nextMode !== "add") setSelectedIds([]);
  };

  const handleFormMajorChange = (majorId: string) => {
    setForm((prev) => ({ ...prev, majorId, classId: "" }));
  };

  const handleFormGradeChange = (gradeLevelId: string) => {
    setForm((prev) => ({ ...prev, gradeLevelId, classId: "" }));
  };

  const handleSelectStudent = (studentId: string) => {
    const s = students.find((item) => item.id === studentId);
    if (!s) return;
    const cls = s.classId ? classes.find((c) => c.id === s.classId) : undefined;
    const next = {
      majorId: cls?.majorId ?? "",
      gradeLevelId: cls?.gradeLevelId ?? "",
      classId: s.classId ?? "",
    };
    setEditingId(s.id);
    setForm(next);
    setBaseline(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === "edit" && !editingId) {
      toast.error("Siswa belum dipilih", {
        description: "Pilih siswa pada panel sebelah kanan untuk mulai mengubah penempatan.",
      });
      return;
    }

    if (mode === "delete") {
      if (!editingId || !selectedStudent) {
        toast.error("Siswa belum dipilih", {
          description: "Pilih siswa pada panel sebelah kanan untuk dikeluarkan dari rombel.",
        });
        return;
      }
      if (!selectedStudent.classId) {
        toast.error("Siswa belum ditempatkan", {
          description: `${selectedStudent.fullName} saat ini tidak berada di rombel mana pun.`,
        });
        return;
      }
      const ok = await askConfirm(
        `Keluarkan ${selectedStudent.fullName} dari ${selectedStudent.className ?? "rombel"}? Akun siswa tetap ada, hanya penempatan kelas yang dilepas.`
      );
      setConfirmOpen(false);
      if (!ok) return;
      setSubmitting(true);
      try {
        const res = await masterDataApi.students.update(editingId, { classId: null });
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        toast.success("Siswa dikeluarkan dari rombel", {
          description: `${selectedStudent.fullName} tidak lagi ditempatkan di ${selectedStudent.className ?? "kelas tersebut"}.`,
        });
        onSuccess?.();
        resetState();
        onOpenChange(false);
      } catch (err) {
        toast.error("Gagal mengeluarkan siswa dari rombel", {
          description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!form.classId) {
      toast.error("Rombel belum dipilih", {
        description: "Pilih jurusan, tingkat, lalu rombel tujuan terlebih dahulu.",
      });
      return;
    }

    const targetClass = classes.find((c) => c.id === form.classId);

    if (mode === "edit") {
      if (!editingId || !selectedStudent) return;
      if (selectedStudent.classId === form.classId) {
        toast.error("Rombel tidak berubah", {
          description: "Pilih rombel tujuan yang berbeda dari rombel saat ini.",
        });
        return;
      }
      setSubmitting(true);
      try {
        const res = await masterDataApi.students.update(editingId, { classId: form.classId });
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        toast.success("Penempatan diperbarui", {
          description: `${selectedStudent.fullName}: ${selectedStudent.className ?? "Belum ditempatkan"} → ${targetClass?.name ?? "rombel baru"}.`,
        });
        onSuccess?.();
        resetState();
        onOpenChange(false);
      } catch (err) {
        toast.error("Gagal memperbarui penempatan", {
          description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const targets = selectedIds.filter((id) => {
      const s = students.find((item) => item.id === id);
      return s && s.classId !== form.classId;
    });

    if (!targets.length) {
      toast.error("Belum ada siswa dipilih", {
        description: "Centang minimal satu siswa pada panel sebelah kanan.",
      });
      return;
    }

    const remaining = targetClass ? targetClass.capacity - targetClass.studentCount : 0;
    if (targetClass && targets.length > remaining) {
      const ok = await askConfirm(
        `${targets.length} siswa akan ditempatkan ke ${targetClass.name}, melebihi sisa kapasitas (${Math.max(0, remaining)} slot dari ${targetClass.capacity}). Lanjutkan?`
      );
      setConfirmOpen(false);
      if (!ok) return;
    }

    setSubmitting(true);
    let successCount = 0;
    const failed: string[] = [];
    let firstError = "";
    for (const id of targets) {
      try {
        const res = await masterDataApi.students.update(id, { classId: form.classId });
        if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        successCount += 1;
      } catch (err) {
        failed.push(id);
        if (!firstError) {
          firstError = err instanceof Error ? err.message : "Kesalahan tidak diketahui";
        }
      }
    }
    setSubmitting(false);
    onSuccess?.();

    if (failed.length) {
      setSelectedIds(failed);
      toast.error(`${successCount} siswa berhasil, ${failed.length} gagal ditempatkan`, {
        description: firstError,
      });
      return;
    }

    toast.success(`${successCount} siswa ditempatkan`, {
      description: `Rombel tujuan: ${targetClass?.name ?? "rombel terpilih"}.`,
    });
    resetState();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (submitting) return;
    resetState();
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    const fetchData = async () => {
      try {
        const [studentsRes, majorsRes, gradesRes, classesRes] = await Promise.all([
          masterDataApi.students.list(),
          masterDataApi.majors.list(true),
          masterDataApi.gradeLevels.list(true),
          masterDataApi.classes.list({ includeInactive: true }),
        ]);
        if (!active) return;
        if (studentsRes.error || majorsRes.error || gradesRes.error || classesRes.error) {
          throw new Error("Gagal memuat data penempatan siswa");
        }
        setStudents(studentsRes.data?.data ?? []);
        setMajors(majorsRes.data?.data ?? []);
        setGradeLevels(gradesRes.data?.data ?? []);
        setClasses(classesRes.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching student placement data:", error);
        if (!active) return;
        setStudents([]);
        setMajors([]);
        setGradeLevels([]);
        setClasses([]);
        toast.error("Gagal memuat data penempatan siswa", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      } finally {
        if (active) setLoaded(true);
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
        onOpenChange={(next) => {
          if (!next && submitting) return;
          if (!next) resetState();
          onOpenChange(next);
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-slate-900/60 backdrop-blur-sm supports-backdrop-filter:backdrop-blur-sm"
          className="flex max-h-[calc(100dvh-10rem)] w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:w-full sm:max-w-5xl"
        >
          <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-[#6c5dd3] via-indigo-600 to-indigo-700 px-7 py-5 text-white">
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-md">
                <UserRoundCheck className="size-6 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-lg font-bold tracking-tight text-white">
                    Penempatan Siswa &amp; Rombel
                  </DialogTitle>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                    KURIKULUM MERDEKA • SMK MATARAM
                  </span>
                </div>
                <DialogDescription className="mt-0.5 text-xs text-indigo-100">
                  Plotting distribusi siswa ke konsentrasi keahlian, tingkatan kelas, dan rombongan belajar.
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
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c8495]">
              Metode Tindakan / Manajemen Penempatan
            </span>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handleModeChange("add")}
                disabled={submitting}
                aria-pressed={mode === "add"}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                  mode === "add"
                    ? "border-[#86efac] bg-[#f0fdf4]"
                    : "border-[#E2E8F0] bg-white hover:border-[#86efac]/70"
                }`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]">
                  <PlusCircle className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-[#181c20]">Tambah Baru</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#7c8495]">Tempatkan banyak siswa</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("edit")}
                disabled={submitting}
                aria-pressed={mode === "edit"}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                  mode === "edit"
                    ? "border-[#93c5fd] bg-[#eff6ff]"
                    : "border-[#E2E8F0] bg-white hover:border-[#93c5fd]/70"
                }`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe] text-[#3b82f6]">
                  <PencilLine className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-[#181c20]">Perbarui</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#7c8495]">Pindahkan siswa terpilih</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("delete")}
                disabled={submitting}
                aria-pressed={mode === "delete"}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                  mode === "delete"
                    ? "border-[#fecaca] bg-[#fef2f2]"
                    : "border-[#E2E8F0] bg-white hover:border-[#fecaca]/80"
                }`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#fee2e2] text-[#ba1a1a]">
                  <Trash2 className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-[#181c20]">Hapus</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#7c8495]">Keluarkan dari rombel</span>
                </span>
              </button>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] leading-4 text-[#7c8495]">
              <Info className="size-3.5 shrink-0 text-[#5343b9]" />
              <span>
                <strong>Mode Aktif:</strong>{" "}
                {mode === "add"
                  ? "Tempatkan banyak siswa sekaligus ke rombel tujuan."
                  : mode === "edit"
                    ? editingId
                      ? "Pindahkan siswa terpilih ke rombel lain lalu simpan."
                      : "Pilih siswa pada panel sebelah kanan untuk mulai mengubah."
                    : "Keluarkan siswa terpilih dari rombelnya (akun tetap ada)."}
              </span>
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex min-h-0 min-w-0 flex-col">
              <section className="mx-7 mt-4 shrink-0 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c8495]">
                  Profil Siswa Terpilih
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative">
                    <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#d9d3f0] bg-[#e5deff] text-[12px] font-bold text-[#4331a8] shadow-sm">
                      {mode === "add"
                        ? selectedIds.length || "?"
                        : selectedStudent
                          ? buildInitials(selectedStudent.fullName)
                          : "?"}
                    </div>
                    <span className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-white ${mode === "add" || selectedStudent ? "bg-emerald-500" : "bg-slate-300"}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] font-bold text-slate-800">
                      {mode === "add"
                        ? selectedIds.length
                          ? `${selectedIds.length} siswa dipilih`
                          : "Belum ada siswa dipilih"
                        : selectedStudent?.fullName ?? "Pilih siswa terlebih dahulu"}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      {mode === "add"
                        ? selectedClass
                          ? `Rombel tujuan: ${selectedClass.name} (sisa ${Math.max(0, selectedClass.capacity - selectedClass.studentCount)} slot)`
                          : "Pilih jurusan, tingkat, dan rombel tujuan."
                        : selectedStudent
                          ? `NIS ${selectedStudent.nomorInduk ?? "-"} • Kelas ${selectedStudent.className ?? "Belum ditempatkan"}`
                          : "Pilih siswa pada panel kanan untuk menampilkan profil."}
                    </p>
                  </div>
                </div>
              </section>

              <form
                id="student-placement-form"
                onSubmit={handleSubmit}
                className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-7 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
              {!loaded ? (
                <div className="flex items-center justify-center py-16 text-sm text-[#787584]">
                  Memuat data penempatan…
                </div>
              ) : mode === "delete" ? (
                editingId && selectedStudent ? (
                  <section className="space-y-4">
                    <div className="rounded-2xl border border-[#f3c9c4] bg-[#fef6f5] p-5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-[#fde8e6] text-[#ba1a1a]">
                          <Trash2 className="size-4" />
                        </span>
                        <h3 className="text-sm font-bold text-[#ba1a1a]">Siswa yang Akan Dikeluarkan</h3>
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
                          <span className="font-semibold text-[#181c20]">Rombel saat ini:</span>{" "}
                          {selectedStudent.className ?? "Belum ditempatkan"}
                        </p>
                        <p>
                          <span className="font-semibold text-[#181c20]">Jurusan:</span>{" "}
                          {selectedStudent.majorCode ?? "-"}
                        </p>
                      </div>
                      <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] leading-5 text-[#787584]">
                        Siswa hanya dilepas dari rombel — akun, NIS, dan data diri tetap tersimpan dan dapat
                        ditempatkan kembali kapan saja.
                      </p>
                    </div>
                  </section>
                ) : (
                  <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#efc9c4] bg-[#fef6f5] px-6 py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-[#fde8e6] text-[#ba1a1a]">
                      <Trash2 className="size-7" />
                    </span>
                    <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Siswa yang Akan Dikeluarkan</h3>
                    <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">
                      Cari dan pilih siswa pada panel sebelah kanan untuk dilepas dari rombelnya.
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
                    Pilih siswa pada panel sebelah kanan untuk dipindahkan ke rombel lain.
                  </p>
                </section>
              ) : (
                <>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        Konsentrasi Keahlian <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] font-medium text-slate-400">Jurusan rombel tujuan.</span>
                    </div>
                    <SearchableDropdown
                      value={form.majorId}
                      onChange={handleFormMajorChange}
                      options={majorOptions}
                      label={majors.length ? "Pilih konsentrasi keahlian" : "Belum ada data jurusan"}
                      disabled={!majors.length || submitting}
                      textClassName="text-[#64748B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                    <div className="space-y-2 md:col-span-4">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        Tingkat &amp; Fase <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {gradeLevels.map((grade) => {
                          const active = form.gradeLevelId === grade.id;
                          return (
                            <button
                              key={grade.id}
                              type="button"
                              onClick={() => handleFormGradeChange(grade.id)}
                              disabled={submitting}
                              className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                                active
                                  ? "border-2 border-[#6c5dd3] bg-[#f5f3ff]/60"
                                  : "border border-slate-200 bg-white hover:border-[#c9c4d5]"
                              }`}
                            >
                              <span className={`text-xs font-bold ${active ? "text-[#4331a8]" : "text-slate-700"}`}>{grade.name}</span>
                              <span className={`text-[10px] font-medium ${active ? "text-[#6c5dd3]" : "text-slate-400"}`}>{gradePhase(grade.code)}</span>
                            </button>
                          );
                        })}
                        {!gradeLevels.length ? (
                          <p className="col-span-full rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[11px] text-slate-400">
                            Belum ada data tingkat kelas.
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-8">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        Rombel Tujuan <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {classesForForm.map((cls) => {
                          const active = form.classId === cls.id;
                          const remaining = Math.max(0, cls.capacity - cls.studentCount);
                          return (
                            <button
                              key={cls.id}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, classId: cls.id }))}
                              disabled={submitting}
                              className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                                active
                                  ? "border-2 border-[#6c5dd3] bg-[#f5f3ff]/60"
                                  : "border border-slate-200 bg-white hover:border-[#c9c4d5]"
                              }`}
                            >
                              <span className={`text-xs font-bold ${active ? "text-[#4331a8]" : "text-slate-700"}`}>{cls.name}</span>
                              <span className={`text-[10px] font-medium ${remaining > 0 ? (active ? "text-[#6c5dd3]" : "text-slate-400") : "text-rose-500"}`}>
                                Sisa {remaining} slot
                              </span>
                            </button>
                          );
                        })}
                        {!classesForForm.length ? (
                          <p className="col-span-full rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[11px] text-slate-400">
                            {!form.majorId || !form.gradeLevelId
                              ? "Pilih konsentrasi dan tingkat dulu."
                              : "Belum ada kelas untuk kombinasi ini."}
                          </p>
                        ) : null}
                      </div>
                      {selectedClass ? (
                        <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <CheckCircle2 className="size-3.5 text-[#6c5dd3]" />
                          {selectedClass.name} • {selectedClass.studentCount}/{selectedClass.capacity} siswa terisi
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              </form>
            </div>

            <aside className="min-h-0 w-full min-w-0 overflow-y-auto overscroll-contain border-t border-slate-200/70 bg-[#f8f9fc] p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-[360px] lg:min-w-[360px] lg:max-w-[360px] lg:border-l lg:border-t-0">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Cari Siswa</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-3 size-[18px] text-[#787584]" />
                    <input
                      type="text"
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      placeholder="Nama, NIS, NISN, atau email..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">Filter Jurusan</label>
                    <SearchableDropdown
                      value={filterMajorCode}
                      onChange={setFilterMajorCode}
                      options={filterMajorOptions}
                      label="Semua jurusan"
                      disabled={submitting}
                      textClassName="text-[#64748B]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">Filter Tingkat</label>
                    <SearchableDropdown
                      value={filterGradeCode}
                      onChange={setFilterGradeCode}
                      options={filterGradeOptions}
                      label="Semua tingkat"
                      disabled={submitting}
                      textClassName="text-[#64748B]"
                    />
                  </div>
                </div>

                {mode === "add" ? (
                  <>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#787584]">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {filteredStudents.length} siswa cocok
                      </span>
                      <span className="font-semibold text-[#5343b9]">{selectedIds.length} dipilih</span>
                    </div>
                    <div className="max-h-[42vh] space-y-0.5 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5">
                      {filteredStudents.slice(0, MAX_STUDENT_ROWS).map((s) => {
                        const alreadyPlacedHere = Boolean(form.classId) && s.classId === form.classId;
                        const checked = selectedIds.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className={`flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-[11px] transition-colors hover:bg-[#f8f9fc] ${
                              alreadyPlacedHere ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={alreadyPlacedHere || submitting}
                              onChange={() => toggleStudent(s.id)}
                              className="mt-0.5 size-3.5 shrink-0 accent-[#6c5dd3]"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-semibold text-[#181c20]">{s.fullName}</span>
                              <span className="block truncate text-[10px] text-[#787584]">
                                {s.nomorInduk ?? s.nisn ?? "-"}
                                {alreadyPlacedHere
                                  ? " • Sudah di rombel ini"
                                  : s.className
                                    ? ` • ${s.className}`
                                    : " • Belum ditempatkan"}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                      {!filteredStudents.length ? (
                        <p className="px-2 py-6 text-center text-[11px] text-[#787584]">
                          Tidak ada siswa yang cocok dengan filter.
                        </p>
                      ) : null}
                    </div>
                    {filteredStudents.length > MAX_STUDENT_ROWS ? (
                      <p className="text-[10px] text-[#787584]">
                        Menampilkan {MAX_STUDENT_ROWS} dari {filteredStudents.length} siswa — persempit filter untuk melihat sisanya.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="mt-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#181c20]">
                        {mode === "delete" ? "Siswa yang akan dikeluarkan" : "Siswa yang akan dipindahkan"}{" "}
                        <span className="text-[#c0262d]">*</span>
                      </label>
                      <SearchableDropdown
                        value={editingId ?? ""}
                        onChange={handleSelectStudent}
                        options={studentOptions}
                        label={studentOptions.length ? "Pilih siswa" : "Tidak ada siswa yang cocok"}
                        disabled={submitting || !studentOptions.length}
                        textClassName="text-[#64748B]"
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
                            <span className="font-semibold text-[#181c20]">Nama:</span> {selectedStudent.fullName}
                          </p>
                          <p>
                            <span className="font-semibold text-[#181c20]">NIS:</span>{" "}
                            {selectedStudent.nomorInduk ?? "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-[#181c20]">Kelas saat ini:</span>{" "}
                            {selectedStudent.className ?? "Belum ditempatkan"}
                          </p>
                          <p>
                            <span className="font-semibold text-[#181c20]">Status:</span>{" "}
                            {selectedStudent.isActive ? "Aktif" : "Nonaktif"}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </aside>
          </div>

          <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Info className="size-4 text-[#6c5dd3]" />
              <span>
                {mode === "add"
                  ? `${selectedIds.length} siswa • ${selectedClass?.name ?? "belum ada rombel"}`
                  : "Data tersimpan pada users.class_id"}
              </span>
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
                form="student-placement-form"
                disabled={
                  submitting ||
                  (mode === "add" && (!form.classId || selectedIds.length === 0)) ||
                  (mode === "edit" && (!editingId || !isDirty || !form.classId)) ||
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
                    ? "Mengeluarkan..."
                    : "Menyimpan..."
                  : mode === "delete"
                    ? "Keluarkan dari Rombel"
                    : mode === "edit"
                      ? "Simpan Perubahan"
                      : `Tempatkan ${selectedIds.length || ""} Siswa`}
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
