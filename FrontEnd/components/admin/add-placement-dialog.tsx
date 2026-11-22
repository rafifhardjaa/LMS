"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
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

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#eceef3] pb-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-[11px] font-bold text-[#4331a8]">
        {number}
      </span>
      <div>
        <h4 className="text-[13px] font-bold text-[#181c20]">{title}</h4>
        <p className="mt-0.5 text-[11px] text-[#787584]">{description}</p>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
  hint,
}: {
  children: ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[11px] font-bold text-[#64748B]">
        {children} {required ? <span className="text-[#c0262d]">*</span> : null}
      </label>
      {hint ? <p className="text-[10px] leading-4 text-[#94A3B8]">{hint}</p> : null}
    </div>
  );
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

  const scopedAssignments = useMemo(() => {
    if (mode === "add" || !form.teacherId) return assignments;
    return assignments.filter((assignment) => assignment.teacherId === form.teacherId);
  }, [assignments, form.teacherId, mode]);

  const scopedMajorCodes = useMemo(
    () => new Set(scopedAssignments.map((a) => a.majorCode).filter(Boolean) as string[]),
    [scopedAssignments]
  );
  const scopedGradeCodes = useMemo(
    () => new Set(scopedAssignments.map((a) => a.gradeCode).filter(Boolean) as string[]),
    [scopedAssignments]
  );
  const scopedSubjectIds = useMemo(
    () => new Set(scopedAssignments.map((a) => a.subjectId).filter(Boolean) as string[]),
    [scopedAssignments]
  );
  const scopedClassIds = useMemo(
    () => new Set(scopedAssignments.map((a) => a.classId).filter(Boolean) as string[]),
    [scopedAssignments]
  );
  const majorOptions: JurusanOption[] = useMemo(
    () =>
      majors
        .filter((major) => mode === "add" || !form.teacherId || scopedMajorCodes.has(major.code))
        .map((major) => ({ value: major.id, label: `${major.code} - ${major.name}` })),
    [form.teacherId, majors, mode, scopedMajorCodes]
  );

  const tingkatChosen = filterTingkat !== "Semua Tingkat";
  const subGradeChosen = tingkatChosen && filterSubGrade !== "Semua Sub Grade";

  const filterTingkatOptions: JurusanOption[] = useMemo(
    () => [
      { value: "Semua Tingkat", label: "Semua Tingkat" },
      ...gradeLevels
        .filter((g) => mode === "add" || !form.teacherId || scopedGradeCodes.has(g.code))
        .map((g) => ({ value: g.code, label: `Kelas ${g.code} (${gradePhase(g.code)})` })),
    ],
    [form.teacherId, gradeLevels, mode, scopedGradeCodes]
  );
  const filterSubGradeOptions: JurusanOption[] = useMemo(
    () => [
      { value: "Semua Sub Grade", label: "Semua Sub Grade" },
      ...[
        ...new Set(
          scopedAssignments
            .filter((a) => filterTingkat === "Semua Tingkat" || (a.gradeCode ?? "") === filterTingkat)
            .map((a) => a.classSection)
            .filter(Boolean) as string[],
        ),
      ].map((section) => ({ value: section, label: `Sub Grade ${section}` })),
    ],
    [filterTingkat, scopedAssignments]
  );

  const filteredAssignments = useMemo(() => {
    return scopedAssignments.filter((a) => {
      if (filterTingkat !== "Semua Tingkat" && (a.gradeCode ?? "") !== filterTingkat) return false;
      if (filterSubGrade !== "Semua Sub Grade" && (a.classSection ?? "") !== filterSubGrade) return false;
      return true;
    });
  }, [filterSubGrade, filterTingkat, scopedAssignments]);

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
      const still = scopedAssignments.some((a) => a.id === prev && (filterTingkat === "Semua Tingkat" || (a.gradeCode ?? "") === filterTingkat) && (v === "Semua Sub Grade" || (a.classSection ?? "") === v));
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
    setConfirmOpen(false);
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

  const formGradeLevels = useMemo(
    () =>
      gradeLevels.filter((grade) => mode === "add" || !form.teacherId || scopedGradeCodes.has(grade.code)),
    [form.teacherId, gradeLevels, mode, scopedGradeCodes]
  );

  const formClasses = useMemo(
    () => classes.filter((cls) => mode === "add" || !form.teacherId || scopedClassIds.has(cls.id)),
    [classes, form.teacherId, mode, scopedClassIds]
  );

  const formGradeOptions = useMemo(
    () => formGradeLevels.map((grade) => ({ value: grade.id, label: `${grade.name} • ${gradePhase(grade.code)}` })),
    [formGradeLevels]
  );

  const rombelOptions = useMemo(
    () => formClasses.map((cls) => ({ value: cls.id, label: `${cls.section} • ${cls.name}` })),
    [formClasses]
  );

  const subjectOptions = useMemo(() => {
    let relevant = subjects;
    if (mode !== "add" && form.teacherId) {
      relevant = relevant.filter((subject) => scopedSubjectIds.has(subject.id));
    }
    if (form.majorId) {
      relevant = relevant.filter((subject) => !subject.majorId || subject.majorId === form.majorId);
    }
    return relevant.map((subject) => ({
      value: subject.id,
      label: `${subject.name}${subject.code ? ` (${subject.code})` : ""}`,
    }));
  }, [form.majorId, form.teacherId, mode, scopedSubjectIds, subjects]);

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
      const ok = await askConfirm(
        `Hapus penempatan ${selectedTeacher?.fullName ?? "guru"} pada ${
          selectedSubject?.name ?? "mata pelajaran"
        } di ${selectedAssignment?.className ?? "kelas terpilih"}? Tindakan ini tidak bisa dibatalkan.`
      );
      setConfirmOpen(false);
      if (!ok) return;
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
    <>
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
        <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-[#5343b9] via-[#6c5dd3] to-[#6c5dd3] px-7 py-5 text-white">
          <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-md">
              <UserRoundCheck className="size-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-base font-bold tracking-tight text-white">
                  Penempatan Guru &amp; Jurusan
                </DialogTitle>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
                  KURIKULUM MERDEKA • SMK MATARAM
                </span>
              </div>
              <DialogDescription className="mt-0.5 text-[11px] leading-4 text-indigo-100">
                Atur penempatan guru ke konsentrasi keahlian, tingkat kelas, mata pelajaran, dan rombel.
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
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c8495]">
              Metode Tindakan / Manajemen Data
            </span>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setMode("add")}
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
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#7c8495]">Buat penempatan baru</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode("edit")}
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
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#7c8495]">Ubah data penempatan</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode("delete")}
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
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#7c8495]">Hapus penempatan</span>
                </span>
              </button>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] leading-4 text-[#7c8495]">
              <Info className="size-3.5 shrink-0 text-[#5343b9]" />
              <span><strong>Mode Aktif:</strong> {mode === "add" ? "Tambah penempatan baru tanpa menimpa data lain." : mode === "edit" ? (editingId ? "Ubah penempatan terpilih." : "Pilih penempatan pada panel kanan.") : "Hapus penempatan terpilih."}</span>
            </p>
          </div>

        </div>

        <div className={`grid min-h-0 flex-1 grid-cols-1 overflow-hidden ${mode === "add" ? "" : "lg:grid-cols-[minmax(0,1fr)_360px]"}`}>
          <div className="flex min-h-0 min-w-0 flex-col">
            <section className="mx-7 mt-4 shrink-0 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c8495]">
                Profil Guru Terpilih
              </span>
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#d9d3f0] bg-[#e5deff] text-[12px] font-bold text-[#4331a8] shadow-sm">
                      {selectedTeacher ? buildInitials(selectedTeacher.fullName) : "?"}
                    </div>
                    <span className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-white ${selectedTeacher?.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-[13px] font-bold text-slate-800">
                        {selectedTeacher?.fullName ?? "Pilih guru terlebih dahulu"}
                      </h3>
                      {selectedTeacher ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                          {selectedTeacher.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      {selectedTeacher ? (
                        <>NIP <span className="font-mono">{selectedTeacher.nomorInduk ?? "-"}</span>{selectedTeacher.email ? ` • ${selectedTeacher.email}` : ""}</>
                      ) : (
                        "Pilih guru untuk memfilter penempatan."
                      )}
                    </p>
                  </div>
                </div>
                <div className="w-full min-w-0">
                  <SearchableDropdown
                    value={form.teacherId}
                    onChange={(value) => {
                      setForm({ ...EMPTY_STATE, teacherId: value });
                      setEditingId(null);
                      setBaseline(null);
                      setFilterTingkat("Semua Tingkat");
                      setFilterSubGrade("Semua Sub Grade");
                      setSubjects([]);
                      setClasses([]);
                    }}
                    options={teacherOptions}
                    label={teachers.length ? "Cari dan pilih guru" : "Belum ada data guru"}
                    disabled={!teachers.length}
                  />
                </div>
              </div>
            </section>

            <form
          id="add-placement-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-7 text-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              <SectionHeading
                number="1"
                title="Konsentrasi & Tingkat"
                description="Tentukan jurusan dan tingkat kelas sebelum memilih mapel serta rombel."
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel required hint="Kompetensi keahlian sasaran penempatan guru.">
                    Konsentrasi Keahlian
                  </FieldLabel>
                  <SearchableDropdown
                    value={form.majorId}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, majorId: value, subjectId: "", classId: "" }));
                      setClasses([]);
                    }}
                    options={majorOptions}
                    label={majorOptions.length ? "Pilih konsentrasi keahlian" : "Belum ada data konsentrasi"}
                    disabled={!majorOptions.length}
                    textClassName="text-[#64748B]"
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel required hint="Tingkat kelas dan fase kurikulum.">
                    Tingkat &amp; Fase Kelas
                  </FieldLabel>
                  <SearchableDropdown
                    value={form.gradeLevelId}
                    onChange={handleGradeLevelChange}
                    options={formGradeOptions}
                    label={formGradeOptions.length ? "Pilih tingkat kelas" : "Belum ada tingkat kelas"}
                    disabled={!formGradeOptions.length}
                    textClassName="text-[#64748B]"
                  />
                </div>
              </div>

              <SectionHeading
                number="2"
                title="Mata Pelajaran & Rombel"
                description="Pilih mapel yang diampu lalu tentukan rombel tujuan."
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel required hint="Mata pelajaran sesuai konsentrasi dan tingkat.">
                    Mata Pelajaran Diampu
                  </FieldLabel>
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
                    textClassName="text-[#64748B]"
                  />
                  {selectedSubject ? (
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 className="size-3.5 text-[#5343b9]" />
                      {selectedSubject.semester ? `Semester ${selectedSubject.semester} • ` : ""}
                      Kurikulum Merdeka
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <FieldLabel required hint="Rombel tersedia untuk kombinasi ini.">
                    Rombel
                  </FieldLabel>
                  <SearchableDropdown
                    value={form.classId}
                    onChange={(value) => setForm((prev) => ({ ...prev, classId: value }))}
                    options={rombelOptions}
                    label={
                      loadingClasses
                        ? "Memuat rombel..."
                        : !form.majorId || !form.gradeLevelId
                          ? "Pilih konsentrasi dan tingkat dulu"
                          : rombelOptions.length
                            ? "Pilih rombel"
                            : "Belum ada rombel"
                    }
                    disabled={loadingClasses || !form.majorId || !form.gradeLevelId || !rombelOptions.length}
                    textClassName="text-[#64748B]"
                  />
                </div>
              </div>
            </>
          )}
            </form>
          </div>
          {mode === "edit" || mode === "delete" ? (
          <aside className="min-h-0 w-full min-w-0 overflow-y-auto overscroll-contain border-t border-slate-200/70 bg-[#f8f9fc] p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-[360px] lg:min-w-[360px] lg:max-w-[360px] lg:border-l lg:border-t-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-[13px] font-bold text-[#181c20]">Filter Penempatan</h3>
                  <p className="mt-0.5 text-[11px] text-[#787584]">
                    {form.teacherId ? `Opsi mengikuti guru ${selectedTeacher?.fullName ?? "terpilih"}.` : "Pilih guru untuk menyaring opsi."}
                  </p>
                </div>
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#e5deff] text-[#5343b9]">
                  <PencilLine className="size-4" />
                </span>
              </div>

              <div className="space-y-2">
                <FieldLabel>Tingkat</FieldLabel>
                <SearchableDropdown value={filterTingkat === "Semua Tingkat" ? "" : filterTingkat} onChange={handleFilterTingkatChange} options={filterTingkatOptions} label="Semua Tingkat" disabled={submitting || loadingAssignments} />
              </div>

              <div className="space-y-2">
                <FieldLabel>Sub Grade</FieldLabel>
                <SearchableDropdown value={filterSubGrade === "Semua Sub Grade" ? "" : filterSubGrade} onChange={handleFilterSubGradeChange} options={filterSubGradeOptions} label={!tingkatChosen ? "Pilih tingkat dulu" : "Semua Sub Grade"} disabled={submitting || loadingAssignments || !tingkatChosen} />
              </div>

              <div className="space-y-2">
                <FieldLabel required>{mode === "delete" ? "Penempatan yang Dihapus" : "Penempatan yang Diperbarui"}</FieldLabel>
                <SearchableDropdown
                  value={editingId ?? ""}
                  onChange={handleSelectAssignment}
                  options={assignmentOptions}
                  label={loadingAssignments ? "Memuat data..." : !tingkatChosen ? "Pilih tingkat dulu" : !subGradeChosen ? "Pilih sub grade dulu" : assignmentOptions.length ? "Pilih penempatan" : "Tidak ada penempatan"}
                  disabled={submitting || loadingAssignments || !subGradeChosen || !assignmentOptions.length}
                />
                <p className="text-[11px] leading-4 text-[#787584]">
                  {mode === "delete" ? "Detail penempatan tampil di panel kiri." : "Form kiri akan mengikuti penempatan dipilih."}
                </p>
              </div>

              <div className="rounded-xl border border-[#d9d3f0] bg-white p-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-[#5343b9]"><PencilLine className="size-3.5" /></span>
                  <p className="text-[12px] font-bold text-[#181c20]">Penempatan terpilih</p>
                  {editingId && selectedAssignment ? (
                    <span className="ml-auto rounded-full bg-[#f0edff] px-2 py-0.5 text-[9px] font-bold text-[#5343b9]">{isDirty ? "Diubah" : "Asli"}</span>
                  ) : null}
                </div>
                <div className="mt-2 space-y-1 text-[11px] leading-5 text-[#787584]">
                  <p><span className="font-semibold text-[#181c20]">Guru:</span> {selectedTeacher?.fullName ?? "-"}</p>
                  <p><span className="font-semibold text-[#181c20]">NIP:</span> <span className="font-mono">{selectedTeacher?.nomorInduk ?? "-"}</span></p>
                  <p><span className="font-semibold text-[#181c20]">Tingkat:</span> {selectedGrade ? `Kelas ${selectedGrade.code} (${gradePhase(selectedGrade.code)})` : "-"}</p>
                  <p><span className="font-semibold text-[#181c20]">Mapel:</span> {selectedSubject ? `${selectedSubject.name}${selectedSubject.code ? ` (${selectedSubject.code})` : ""}` : "-"}</p>
                  <p><span className="font-semibold text-[#181c20]">Sub Grade:</span> {filterSubGrade !== "Semua Sub Grade" ? filterSubGrade : (selectedAssignment?.classSection ?? "-")}</p>
                </div>
                {!editingId ? (
                  <p className="mt-2 rounded-lg bg-[#f8f9fc] px-2.5 py-2 text-[10px] leading-4 text-[#787584]">
                    Belum ada penempatan dipilih.
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
        ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="size-4 shrink-0 text-[#5343b9]" />
            <span>
              {mode === "add"
                ? "Pastikan guru belum memiliki penempatan yang sama."
                : mode === "edit"
                  ? "Perubahan akan diperbarui pada data penempatan terpilih."
                  : "Penempatan yang dihapus tidak dapat dibatalkan."}
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
              form="add-placement-form"
              disabled={submitting || (mode === "edit" && (!editingId || !isDirty)) || (mode === "delete" && !editingId)}
              className={`flex items-center gap-1.5 rounded-xl px-6 py-2.5 text-[12px] font-semibold text-white shadow-md transition-all disabled:opacity-60 ${
                mode === "delete"
                  ? "bg-[#ba1a1a] shadow-[#ba1a1a]/30 hover:bg-[#8f1515]"
                  : "bg-[#5343b9] shadow-[#5343b9]/30 hover:bg-[#4331a8]"
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

      <Dialog
        open={confirmOpen}
        onOpenChange={(next) => {
          if (!next) respondConfirm(false);
        }}
      >
        <DialogContent className="border border-[#c9c4d5]/60 bg-[#f8f9fc]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ffe5e5] text-[#ba1a1a]">
              <Trash2 className="size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm font-bold tracking-tight text-[#181c20]">
                Konfirmasi Hapus Penempatan
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6 text-[#787584]">
                {confirmMessage}
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 border-t border-[#c9c4d5]/60 bg-[#f8f9fc] px-6 py-4">
            <button
              type="button"
              onClick={() => respondConfirm(false)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#c9c4d5]/60 bg-white px-4 py-2.5 text-sm font-semibold text-[#4e566c] transition-all hover:bg-[#eceef3] active:bg-[#d9d3f0]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => respondConfirm(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#ba1a1a] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/20 transition-all hover:bg-[#93000a] active:bg-[#7a0008]"
            >
              Ya, Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
