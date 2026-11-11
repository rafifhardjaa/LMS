"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  GraduationCap,
  Info,
  PencilLine,
  PlusCircle,
  Trash2,
  UserRoundCheck,
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
import type {
  GradeLevel,
  Major,
  SchoolClass,
  Subject,
  TeachingAssignment,
  TeacherSummary,
} from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

interface AddPlacementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
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

function gradePhase(code: string) {
  if (code === "X") return "Fase E";
  if (code === "XI") return "Fase F";
  if (code === "XII") return "Fase F Lanjutan";
  return code;
}

const EMPTY_STATE = {
  teacherId: "",
  majorId: "",
  gradeLevelId: "",
  subjectId: "",
  classId: "",
};

export function AddPlacementDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddPlacementDialogProps) {
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(EMPTY_STATE);
  const [mode, setMode] = useState<"add" | "edit" | "delete">("add");
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<typeof EMPTY_STATE | null>(null);
  const [filterTingkat, setFilterTingkat] = useState("Semua Tingkat");
  const [filterSubGrade, setFilterSubGrade] = useState("Semua Sub Grade");
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const selectedTeacher = teachers.find((teacher) => teacher.id === form.teacherId);
  const selectedSubject = subjects.find((subject) => subject.id === form.subjectId);
  const selectedAssignment = assignments.find((a) => a.id === editingId);
  const selectedGrade = gradeLevels.find((g) => g.id === form.gradeLevelId);
  const isDirty = Boolean(editingId && baseline && ((Object.keys(EMPTY_STATE) as (keyof typeof EMPTY_STATE)[]).some((k) => form[k] !== baseline[k])));

  const teacherOptions: JurusanOption[] = useMemo(
    () =>
      teachers.map((teacher) => ({
        value: teacher.id,
        label: `${teacher.fullName} (${teacher.nomorInduk ?? "-"})`,
      })),
    [teachers]
  );

  const majorOptions: JurusanOption[] = useMemo(
    () => majors.map((major) => ({ value: major.id, label: `${major.code} - ${major.name}` })),
    [majors]
  );

  const tingkatChosen = filterTingkat !== "Semua Tingkat";
  const subGradeChosen = tingkatChosen && filterSubGrade !== "Semua Sub Grade";

  const filterTingkatOptions: JurusanOption[] = useMemo(
    () => [
      { value: "Semua Tingkat", label: "Semua Tingkat" },
      ...gradeLevels.map((g) => ({ value: g.code, label: `Kelas ${g.code} (${gradePhase(g.code)})` })),
    ],
    [gradeLevels]
  );
  const filterSubGradeOptions: JurusanOption[] = useMemo(
    () => [
      { value: "Semua Sub Grade", label: "Semua Sub Grade" },
      ...["A", "B", "C", "D"].map((section) => ({ value: section, label: `Sub Grade ${section}` })),
    ],
    []
  );

  // Filter sisi klien: tingkat (gradeCode) + sub grade (classSection) per penugasan triple
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (filterTingkat !== "Semua Tingkat" && (a.gradeCode ?? "") !== filterTingkat) return false;
      if (filterSubGrade !== "Semua Sub Grade" && (a.classSection ?? "") !== filterSubGrade) return false;
      // Guru diurut dari field "Pilih guru" (bar atas) — sembunyikan guru lain; bila belum ada guru dipilih, tampil semua.
      if (form.teacherId && a.teacherId !== form.teacherId) return false;
      return true;
    });
  }, [assignments, filterTingkat, filterSubGrade, form.teacherId]);

  const assignmentOptions: JurusanOption[] = useMemo(
    () =>
      filteredAssignments.map((a) => ({
        value: a.id,
        label: `${a.teacherName ?? "-"} • ${a.subjectName ?? "-"} • ${a.className ?? "-"}`,
      })),
    [filteredAssignments]
  );

  const handleFilterTingkatChange = (v: string) => {
    setFilterTingkat(v);
    if (v === "Semua Tingkat") setFilterSubGrade("Semua Sub Grade");
    setEditingId((prev) => {
      if (!prev) return prev;
      const still = filteredAssignments.some((a) => a.id === prev);
      return still ? prev : null;
    });
  };
  const handleFilterSubGradeChange = (v: string) => {
    setFilterSubGrade(v);
    setEditingId((prev) => {
      if (!prev) return prev;
      const still = assignments.some((a) => a.id === prev && (filterTingkat === "Semua Tingkat" || (a.gradeCode ?? "") === filterTingkat) && (v === "Semua Sub Grade" || (a.classSection ?? "") === v));
      return still ? prev : null;
    });
  };

  const resetState = () => {
    setForm(EMPTY_STATE);
    setSubjects([]);
    setClasses([]);
    setLoadingSubjects(false);
    setLoadingClasses(false);
    setSubmitting(false);
    setMode("add");
    setEditingId(null);
    setBaseline(null);
    setFilterTingkat("Semua Tingkat");
    setFilterSubGrade("Semua Sub Grade");
  };

  const handleSelectAssignment = (assignmentId: string) => {
    const a = assignments.find((item) => item.id === assignmentId);
    if (!a) return;
    // DB adalah sumber kebenaran: jurusan/tingkat diturunkan dari kelas pada penugasan
    const next = {
      teacherId: a.teacherId ?? "",
      majorId: majors.find((m) => m.code === a.majorCode)?.id ?? "",
      gradeLevelId: gradeLevels.find((g) => g.code === a.gradeCode)?.id ?? "",
      subjectId: a.subjectId ?? "",
      classId: a.classId ?? "",
    };
    setEditingId(a.id);
    setForm(next);
    setBaseline(next);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    const fetchData = async () => {
      setLoadingAssignments(true);
      try {
        const [teachersRes, majorsRes, gradeRes, assignRes] = await Promise.all([
          masterDataApi.teachers.list(),
          masterDataApi.majors.list(),
          masterDataApi.gradeLevels.list(),
          masterDataApi.teacherAssignments.list(),
        ]);
        if (!active) return;
        if (teachersRes.error || majorsRes.error || gradeRes.error) {
          throw new Error("Gagal memuat data penempatan");
        }
        if (assignRes.error) {
          throw new Error(assignRes.error.message || (assignRes.error as { error?: string }).error || `HTTP ${assignRes.status}`);
        }
        setTeachers(teachersRes.data?.data ?? []);
        setMajors(majorsRes.data?.data ?? []);
        setGradeLevels(gradeRes.data?.data ?? []);
        setAssignments(assignRes.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching placement data:", error);
        if (!active) return;
        setTeachers([]);
        setMajors([]);
        setGradeLevels([]);
        setAssignments([]);
        toast.error("Gagal memuat data penempatan", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      } finally {
        if (active) setLoadingAssignments(false);
      }
    };
    void fetchData();
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !form.gradeLevelId) return;

    let active = true;
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const res = await masterDataApi.subjects.list({
          gradeLevelId: form.gradeLevelId,
          includeInactive: true,
        });
        if (!active) return;
        if (res.error) {
          const message = res.error.message || res.error.error || `HTTP ${res.status}`;
          console.error("fetchSubjects error:", message, res);
          setSubjects([]);
          toast.error("Gagal memuat mata pelajaran", { description: message });
          return;
        }
        setSubjects(res.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        if (!active) return;
        setSubjects([]);
        toast.error("Gagal memuat mata pelajaran", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      } finally {
        if (active) setLoadingSubjects(false);
      }
    };
    void fetchSubjects();
    return () => {
      active = false;
    };
  }, [open, form.gradeLevelId]);

  // Daftar kelas (rombel) untuk jurusan + tingkat terpilih — sumber pemilih rombel & mode edit/hapus
  useEffect(() => {
    if (!open || !form.majorId || !form.gradeLevelId) return;

    let active = true;
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const res = await masterDataApi.classes.list({
          majorId: form.majorId,
          gradeLevelId: form.gradeLevelId,
        });
        if (!active) return;
        if (res.error) {
          const message = res.error.message || res.error.error || `HTTP ${res.status}`;
          setClasses([]);
          toast.error("Gagal memuat daftar kelas", { description: message });
          return;
        }
        setClasses(res.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        if (!active) return;
        setClasses([]);
        toast.error("Gagal memuat daftar kelas", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      } finally {
        if (active) setLoadingClasses(false);
      }
    };
    void fetchClasses();
    return () => {
      active = false;
    };
  }, [open, form.majorId, form.gradeLevelId]);

  const subjectOptions = useMemo(() => {
    const relevant = form.majorId
      ? subjects.filter((subject) => !subject.majorId || subject.majorId === form.majorId)
      : subjects;
    return relevant.map((subject) => ({
      value: subject.id,
      label: `${subject.name}${subject.code ? ` (${subject.code})` : ""}`,
    }));
  }, [subjects, form.majorId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === "edit" && !editingId) {
      toast.error("Penempatan belum dipilih", {
        description: "Pilih penempatan pada panel kanan untuk mulai mengedit.",
      });
      return;
    }

    if (mode === "delete") {
      if (!editingId) {
        toast.error("Penempatan belum dipilih", {
          description: "Pilih penempatan pada panel kanan untuk menghapus.",
        });
        return;
      }
      setSubmitting(true);
      try {
        const res = await masterDataApi.teacherAssignments.remove(editingId);
        if (res.error) {
          throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
        }
        toast.success("Penempatan dihapus", {
          description: `${selectedTeacher?.fullName ?? "Guru"} tidak lagi mengampu ${
            selectedSubject?.name ?? "mata pelajaran"
          } di ${selectedAssignment?.className ?? "kelas terpilih"}.`,
        });
        onSuccess?.();
        resetState();
        onOpenChange(false);
      } catch (error) {
        toast.error("Gagal menghapus penempatan", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!form.teacherId || !form.majorId || !form.gradeLevelId || !form.subjectId || !form.classId) {
      toast.error("Penempatan belum lengkap", {
        description: "Pilih guru, konsentrasi keahlian, tingkat kelas, mata pelajaran, dan rombel.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = mode === "edit" && editingId
        ? await masterDataApi.teacherAssignments.update(editingId, {
            teacherId: form.teacherId,
            subjectId: form.subjectId,
            classId: form.classId,
          })
        : await masterDataApi.teacherAssignments.assign({
            teacherId: form.teacherId,
            subjectId: form.subjectId,
            classId: form.classId,
          });
      if (res.error) {
        throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
      }

      const selectedClassName =
        classes.find((c) => c.id === form.classId)?.name ?? "kelas terpilih";
      toast.success(mode === "edit" ? "Penempatan diperbarui" : "Penempatan tersimpan", {
        description: `${selectedTeacher?.fullName ?? "Guru"} ditempatkan pada ${
          selectedSubject?.name ?? "mata pelajaran"
        } — ${selectedClassName}.`,
      });
      onSuccess?.();
      resetState();
      onOpenChange(false);
    } catch (error) {
      toast.error(mode === "edit" ? "Gagal memperbarui penempatan" : "Gagal menyimpan penempatan", {
        description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
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

  const handleGradeLevelChange = (gradeLevelId: string) => {
    setForm((prev) => ({ ...prev, gradeLevelId, subjectId: "", classId: "" }));
    setSubjects([]);
    setClasses([]);
  };

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
              <UserRoundCheck className="size-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg font-bold tracking-tight text-white">
                  Penempatan Guru &amp; Jurusan
                </DialogTitle>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  KURIKULUM MERDEKA • SMK MATARAM
                </span>
              </div>
              <DialogDescription className="mt-0.5 text-xs text-indigo-100">
                Plotting distribusi penempatan guru pendidik ke konsentrasi keahlian, tingkatan kelas, dan mata pelajaran.
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
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#787584]"><GraduationCap className="size-4 text-[#5343b9]" /> Metode Tindakan / Manajemen Sesi</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setMode("add")} disabled={submitting} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${mode === "add" ? "bg-[#6c5dd3] text-white shadow-[0_4px_12px_rgba(108,93,211,0.25)]" : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"}`}><PlusCircle className="size-4" /> Tambah Baru </button>
              <button type="button" onClick={() => setMode("edit")} disabled={submitting} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${mode === "edit" ? "bg-[#6c5dd3] text-white shadow-[0_4px_12px_rgba(108,93,211,0.25)]" : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"}`}><PencilLine className="size-4 text-[#5343b9]" /> Perbarui </button>
              <button type="button" onClick={() => setMode("delete")} disabled={submitting} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${mode === "delete" ? "bg-[#ba1a1a] text-white shadow-[0_4px_12px_rgba(186,26,26,0.25)]" : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"}`}><Trash2 className="size-4 text-[#ba1a1a]" /> Hapus </button>
            </div>
            <p className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-2.5 py-1.5 text-[11px] text-[#4e566c]"><Info className="size-3.5 shrink-0 text-[#5343b9]" /><span><strong>Mode Aktif:</strong> {mode === "add" ? "Tambah penempatan guru baru ke mata pelajaran tanpa menimpa slot lain." : mode === "edit" ? (editingId ? "ubah penempatan terpilih lalu simpan ke Penempatan Guru." : "pilih penempatan pada panel kanan untuk mulai mengubah.") : "Hapus penempatan guru dari mata pelajaran."}</span></p>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
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
                      {selectedTeacher.isActive ? "Aktif Mengajar" : "Nonaktif"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {selectedTeacher
                    ? `NIP: ${selectedTeacher.nomorInduk ?? "-"}${
                        selectedTeacher.email ? ` • ${selectedTeacher.email}` : ""
                      }`
                    : "Pilih guru dari daftar untuk mulai menempatkan."}
                </p>
              </div>
            </div>
            <div className="min-w-[260px] flex-1 sm:max-w-[320px]">
              <SearchableDropdown
                value={form.teacherId}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, teacherId: value }));
                  setEditingId((prev) => {
                    if (!prev) return prev;
                    const still = assignments.some((a) => a.id === prev && a.teacherId === value);
                    return still ? prev : null;
                  });
                }}
                options={teacherOptions}
                label={teachers.length ? "Cari dan pilih guru" : "Belum ada data guru"}
                disabled={!teachers.length}
              />
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
        <form
          id="add-placement-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
        >
          {mode === "delete" ? (
            editingId && selectedAssignment ? (
              <section className="space-y-4">
                <div className="rounded-2xl border border-[#f3c9c4] bg-[#fef6f5] p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#fde8e6] text-[#ba1a1a]"><Trash2 className="size-4" /></span>
                    <h3 className="text-sm font-bold text-[#ba1a1a]">Penempatan yang Akan Dihapus</h3>
                  </div>
                  <div className="mt-3 grid gap-1.5 text-xs leading-5 text-[#4e566c]">
                    <p><span className="font-semibold text-[#181c20]">Guru:</span> {selectedAssignment.teacherName ?? "-"} ({selectedAssignment.teacherNip ?? "-"})</p>
                    <p><span className="font-semibold text-[#181c20]">Kode Guru:</span> {selectedAssignment.teacherCode ?? "-"}</p>
                    <p><span className="font-semibold text-[#181c20]">Mapel:</span> {selectedAssignment.subjectName ?? "-"}{selectedAssignment.subjectCode ? ` (${selectedAssignment.subjectCode})` : ""}</p>
                    <p><span className="font-semibold text-[#181c20]">Kelas:</span> {selectedAssignment.className ?? "-"}</p>
                    <p><span className="font-semibold text-[#181c20]">Tingkat:</span> {selectedAssignment.gradeCode ? `Kelas ${selectedAssignment.gradeCode} (${gradePhase(selectedAssignment.gradeCode)})` : "-"}</p>
                  </div>
                  <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] leading-5 text-[#787584]">
                    Setelah dihapus, guru tidak lagi dihitung mengampu mapel ini di kelas ini. Tabel turunan (mapel diampu &amp; kelas guru) disinkronkan otomatis.
                  </p>
                </div>
              </section>
            ) : (
              <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#efc9c4] bg-[#fef6f5] px-6 py-16 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#fde8e6] text-[#ba1a1a]"><Trash2 className="size-7" /></span>
                <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Penempatan yang Akan Dihapus</h3>
                <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">Pilih penempatan pada panel di sebelah kanan (tingkat, sub grade, lalu penempatan) untuk menghapus.</p>
              </section>
            )
          ) : mode === "edit" && !editingId ? (
            <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#c9c4d5] bg-[#f8f9fc] px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#e5deff] text-[#5343b9]"><PencilLine className="size-7" /></span>
              <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Penempatan Terlebih Dahulu</h3>
              <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">Pilih penempatan pada panel di sebelah kanan untuk mengedit. Field di samping akan mengikuti penempatan yang dipilih.</p>
            </section>
          ) : (
            <>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                Konsentrasi Keahlian <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Pilih kompetensi keahlian sasaran pengajaran kurikulum.
              </span>
            </div>
            <div className="mt-2">
              <SearchableDropdown
                value={form.majorId}
                onChange={(value) => {
                  setForm((prev) => ({
                    ...prev,
                    majorId: value,
                    subjectId: "",
                    classId: "",
                  }));
                  setClasses([]);
                }}
                options={majorOptions}
                label={majors.length ? "Pilih konsentrasi keahlian" : "Belum ada data konsentrasi keahlian"}
                disabled={!majors.length}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="space-y-2 md:col-span-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                Tingkat &amp; Fase Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {gradeLevels.map((grade) => {
                  const selected = form.gradeLevelId === grade.id;
                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => handleGradeLevelChange(grade.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        selected
                          ? "border-2 border-[#6c5dd3] bg-[#f5f3ff]/60"
                          : "border border-slate-200 bg-white hover:border-[#c9c4d5]"
                      }`}
                    >
                      <span className={`text-xs font-bold ${selected ? "text-[#4331a8]" : "text-slate-700"}`}>{grade.name}</span>
                      <span className={`text-[10px] font-medium ${selected ? "text-[#6c5dd3]" : "text-slate-400"}`}>{gradePhase(grade.code)}</span>
                    </button>
                  );
                })}
                {!gradeLevels.length ? (
                  <p className="col-span-full rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[11px] text-slate-400">Belum ada data tingkat kelas.</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2 md:col-span-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                Mata Pelajaran Diampu <span className="text-rose-500">*</span>
              </label>
              <SearchableDropdown
                value={form.subjectId}
                onChange={(value) => setForm((prev) => ({ ...prev, subjectId: value }))}
                options={subjectOptions}
                label={
                  !form.majorId
                    ? "Pilih konsentrasi dulu"
                    : !form.gradeLevelId
                      ? "Pilih tingkat dulu"
                      : loadingSubjects
                        ? "Memuat..."
                        : subjectOptions.length
                          ? "Pilih mata pelajaran"
                          : "Tidak ada mata pelajaran"
                }
                disabled={!form.majorId || !form.gradeLevelId || loadingSubjects}
              />
              {selectedSubject ? (
                <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <CheckCircle2 className="size-3.5 text-[#6c5dd3]" />
                  {selectedSubject.semester ? `Semester ${selectedSubject.semester} • ` : ""}
                  Kurikulum Merdeka
                </p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                Rombel <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {classes.map((cls) => {
                  const selected = form.classId === cls.id;
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, classId: cls.id }))}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        selected
                          ? "border-2 border-[#6c5dd3] bg-[#f5f3ff]/60"
                          : "border border-slate-200 bg-white hover:border-[#c9c4d5]"
                      }`}
                    >
                      <span className={`text-xs font-bold ${selected ? "text-[#4331a8]" : "text-slate-700"}`}>{cls.section}</span>
                      <span className={`text-[10px] font-medium ${selected ? "text-[#6c5dd3]" : "text-slate-400"}`}>{cls.name}</span>
                    </button>
                  );
                })}
                {!classes.length ? (
                  <p className="col-span-full rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[11px] text-slate-400">
                    {loadingClasses
                      ? "Memuat rombel..."
                      : !form.majorId || !form.gradeLevelId
                        ? "Pilih konsentrasi dan tingkat dulu."
                        : "Belum ada kelas untuk kombinasi ini."}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
            </>
          )}
        </form>
        {mode === "edit" || mode === "delete" ? (
          <aside className="min-h-0 flex-1 shrink-0 overflow-y-auto border-t border-slate-200/70 bg-[#f8f9fc] p-5 lg:w-[360px] lg:flex-none lg:border-l lg:border-t-0">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Tingkat</label>
                  <SearchableDropdown value={filterTingkat === "Semua Tingkat" ? "" : filterTingkat} onChange={handleFilterTingkatChange} options={filterTingkatOptions} label="Pilih tingkat terlebih dahulu" disabled={submitting || loadingAssignments} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Sub Grade (A,B,C,D)</label>
                  <SearchableDropdown value={filterSubGrade === "Semua Sub Grade" ? "" : filterSubGrade} onChange={handleFilterSubGradeChange} options={filterSubGradeOptions} label={!tingkatChosen ? "Pilih tingkat terlebih dahulu" : loadingAssignments ? "Memuat data penempatan..." : "Pilih sub grade terlebih dahulu"} disabled={submitting || loadingAssignments || !tingkatChosen} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#181c20]">{mode === "delete" ? "Penempatan yang akan dihapus" : "Penempatan yang akan diperbarui"} <span className="text-[#c0262d]">*</span></label>
                <SearchableDropdown
                  value={editingId ?? ""}
                  onChange={handleSelectAssignment}
                  options={assignmentOptions}
                  label={loadingAssignments ? "Memuat data penempatan..." : !tingkatChosen ? "Pilih tingkat terlebih dahulu" : !subGradeChosen ? "Pilih sub grade terlebih dahulu" : assignmentOptions.length ? "Pilih penempatan" : "Tidak ada penempatan yang cocok"}
                  disabled={submitting || loadingAssignments || !subGradeChosen || !assignmentOptions.length}
                />
                <p className="text-[11px] text-[#787584]">{mode === "delete" ? "Panel konfirmasi di sebelah kiri akan menampilkan penempatan yang dipilih." : "Isi form di sebelah kiri akan mengikuti penempatan yang dipilih."}</p>
              </div>
              {/* Isi form penempatan yang dipilih — ringkasan live dari form (DB) */}
              <div className="rounded-xl border border-[#d9d3f0] bg-white p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#5343b9]"><PencilLine className="size-3.5" /></span>
                  <p className="text-xs font-bold text-[#181c20]">Penempatan terpilih</p>
                  {editingId && selectedAssignment ? (
                    <span className="ml-auto rounded-full bg-[#f0edff] px-2 py-0.5 text-[9px] font-bold text-[#5343b9]"># {isDirty ? "Diubah" : "Asli"}</span>
                  ) : null}
                </div>
                <div className="text-[11px] leading-5 text-[#787584]">
                  <p><span className="font-semibold text-[#181c20]">Guru:</span> {selectedTeacher?.fullName ?? "-"}</p>
                  <p><span className="font-semibold text-[#181c20]">NIP:</span> {selectedTeacher?.nomorInduk ?? "-"}</p>
                  <p><span className="font-semibold text-[#181c20]">Tingkat:</span> {selectedGrade ? `Kelas ${selectedGrade.code} (${gradePhase(selectedGrade.code)})` : "-"}</p>
                  <p><span className="font-semibold text-[#181c20]">Mapel:</span> {selectedSubject ? `${selectedSubject.name}${selectedSubject.code ? ` (${selectedSubject.code})` : ""}` : "-"}</p>
                  <p><span className="font-semibold text-[#181c20]">Sub Grade:</span> {filterSubGrade !== "Semua Sub Grade" ? filterSubGrade : (selectedAssignment?.classSection ?? "-")}</p>
                </div>
                {!editingId ? (
                  <p className="mt-2 rounded-lg bg-[#f8f9fc] px-2.5 py-2 text-[10px] leading-4 text-[#787584]">Belum ada penempatan dipilih. Pilih tingkat, sub grade, lalu penempatan di atas.</p>
                ) : null}
              </div>
            </div>
          </aside>
        ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="size-4 text-[#6c5dd3]" />
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
              form="add-placement-form"
              disabled={submitting || (mode === "edit" && (!editingId || !isDirty)) || (mode === "delete" && !editingId)}
              className={`flex items-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-all disabled:opacity-60 ${
                mode === "delete"
                  ? "bg-[#ba1a1a] shadow-[#ba1a1a]/30 hover:bg-[#8f1515]"
                  : "bg-[#6c5dd3] shadow-[#6c5dd3]/30 hover:bg-[#5343b9]"
              }`}
            >
              {mode === "delete" ? <Trash2 className="size-4" /> : <CheckCircle2 className="size-4" />}
              {submitting
                ? mode === "delete" ? "Menghapus..." : "Menyimpan..."
                : mode === "delete" ? "Hapus Penempatan" : mode === "edit" ? "Simpan Perubahan" : "Simpan Penempatan Guru"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
