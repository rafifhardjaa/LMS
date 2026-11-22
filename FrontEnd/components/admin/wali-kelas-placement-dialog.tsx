"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  GraduationCap,
  Loader2,
  PencilLine,
  PlusCircle,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";
import {
  masterDataApi,
  type SchoolClass,
  type TeacherSummary,
} from "@/lib/api/master-data";

type PlacementMode = "add" | "edit" | "delete";

type WaliKelasPlacementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function WaliKelasPlacementDialog({
  open,
  onOpenChange,
  onSuccess,
}: WaliKelasPlacementDialogProps) {
  const [mode, setMode] = useState<PlacementMode>("add");
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [query, setQuery] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [majorId, setMajorId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;

    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;

      setMode("add");
      setSelectedClassId("");
      setSelectedTeacherId("");
      setQuery("");
      setGradeId("");
      setMajorId("");
      setConfirmDelete(false);
      setLoading(true);

      (async () => {
        try {
          const [classesRes, teachersRes] = await Promise.all([
            masterDataApi.classes.list({ includeInactive: true }),
            masterDataApi.teachers.list(),
          ]);
          if (!active) return;
          const firstError = classesRes.error ?? teachersRes.error;
          if (firstError) {
            throw new Error(
              firstError.message ?? firstError.error ?? "Gagal memuat data penempatan"
            );
          }
          setClasses(classesRes.data?.data ?? []);
          setTeachers(teachersRes.data?.data ?? []);
        } catch (err) {
          if (active) {
            setClasses([]);
            setTeachers([]);
            toast.error("Gagal memuat data penempatan", {
              description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
            });
          }
        } finally {
          if (active) setLoading(false);
        }
      })();
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [open]);

  const selectedClass = classes.find((classItem) => classItem.id === selectedClassId) ?? null;
  const selectedTeacher =
    teachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;

  const teacherOptions: JurusanOption[] = useMemo(
    () =>
      teachers
        .filter((teacher) => teacher.isActive)
        .sort((first, second) => first.fullName.localeCompare(second.fullName))
        .map((teacher) => ({
          value: teacher.id,
          label: `${teacher.fullName}${teacher.nomorInduk ? ` • ${teacher.nomorInduk}` : ""}${teacher.majorCode ? ` • ${teacher.majorCode}` : ""}`,
        })),
    [teachers]
  );

  const gradeOptions: JurusanOption[] = useMemo(() => {
    const map = new Map<string, string>();
    for (const classItem of classes) {
      map.set(classItem.gradeLevelId, classItem.gradeCode ?? classItem.gradeName ?? "-");
    }
    return [
      { value: "", label: "Semua Tingkat" },
      ...[...map.entries()]
        .sort((first, second) => first[1].localeCompare(second[1]))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [classes]);

  const majorOptions: JurusanOption[] = useMemo(() => {
    const map = new Map<string, string>();
    for (const classItem of classes) {
      map.set(
        classItem.majorId,
        classItem.majorCode
          ? `${classItem.majorCode} - ${classItem.majorName ?? ""}`.trim()
          : classItem.majorName ?? "-"
      );
    }
    return [
      { value: "", label: "Semua Jurusan" },
      ...[...map.entries()]
        .sort((first, second) => first[1].localeCompare(second[1]))
        .map(([value, label]) => ({ value, label })),
    ];
  }, [classes]);

  const filteredClasses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes.filter((classItem) => {
      const matchesMode =
        mode === "add" ? !classItem.advisorId : Boolean(classItem.advisorId);
      const matchesQuery =
        !q ||
        [classItem.name, classItem.gradeCode, classItem.majorCode, classItem.advisorName].some(
          (value) => (value ?? "").toLowerCase().includes(q)
        );
      const matchesGrade = !gradeId || classItem.gradeLevelId === gradeId;
      const matchesMajor = !majorId || classItem.majorId === majorId;
      return matchesMode && matchesQuery && matchesGrade && matchesMajor;
    });
  }, [classes, gradeId, majorId, mode, query]);

  const modeOptions: {
    value: PlacementMode;
    title: string;
    description: string;
    icon: typeof PlusCircle;
    activeClassName: string;
    iconClassName: string;
  }[] = [
    {
      value: "add",
      title: "Tambah",
      description: "Tetapkan wali pada kelas kosong",
      icon: PlusCircle,
      activeClassName: "border-[#86efac] bg-[#f0fdf4]",
      iconClassName: "bg-[#dcfce7] text-[#16a34a]",
    },
    {
      value: "edit",
      title: "Perbarui",
      description: "Ganti wali kelas terpilih",
      icon: PencilLine,
      activeClassName: "border-[#93c5fd] bg-[#eff6ff]",
      iconClassName: "bg-[#dbeafe] text-[#3b82f6]",
    },
    {
      value: "delete",
      title: "Hapus",
      description: "Lepas wali dari kelas",
      icon: Trash2,
      activeClassName: "border-[#fecaca] bg-[#fef2f2]",
      iconClassName: "bg-[#fee2e2] text-[#ba1a1a]",
    },
  ];

  function switchMode(nextMode: PlacementMode) {
    if (submitting || nextMode === mode) return;
    setMode(nextMode);
    setSelectedClassId("");
    setSelectedTeacherId("");
    setConfirmDelete(false);
  }

  function selectClass(classItem: SchoolClass) {
    setSelectedClassId(classItem.id);
    setSelectedTeacherId(
      mode === "edit" && classItem.advisorId ? classItem.advisorId : ""
    );
    setConfirmDelete(false);
  }

  async function submit() {
    if (!selectedClass) {
      toast.error("Pilih kelas terlebih dahulu");
      return;
    }

    const nextAdvisorId =
      mode === "delete" ? null : selectedTeacherId || null;

    if (mode !== "delete" && !nextAdvisorId) {
      toast.error("Pilih guru wali kelas terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      const res = await masterDataApi.classes.assignAdvisor(
        selectedClass.id,
        nextAdvisorId
      );
      if (res.error) {
        throw new Error(
          res.error.message ?? res.error.error ?? "Gagal menyimpan penempatan wali kelas"
        );
      }
      toast.success(
        mode === "delete"
          ? "Wali kelas dilepas"
          : mode === "edit"
            ? "Wali kelas diperbarui"
            : "Wali kelas ditambahkan",
        { description: selectedClass.name }
      );
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error("Gagal menyimpan penempatan wali kelas", {
        description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    if (mode === "delete" && !confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    void submit();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setConfirmDelete(false);
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[80] bg-slate-900/40 backdrop-blur-sm"
        className="z-[80] flex max-h-[calc(100dvh-4rem)] w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:w-full sm:max-w-5xl"
      >
        <FadeIn className="shrink-0">
          <div className="relative flex items-start justify-between gap-3 overflow-hidden bg-gradient-to-r from-[#6c5dd3] via-indigo-600 to-indigo-700 px-6 py-5 text-white">
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
            <SlideIn direction="left" className="relative z-10 min-w-0">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-inner backdrop-blur-md">
                  <GraduationCap className="size-5" />
                </span>
                <div>
                  <DialogTitle className="text-base font-bold text-white">
                    Penempatan Wali Kelas
                  </DialogTitle>
                  <DialogDescription className="mt-1 max-w-2xl text-xs leading-5 text-indigo-100">
                    Tambah, perbarui, atau lepas penugasan wali kelas untuk setiap rombel.
                  </DialogDescription>
                </div>
              </div>
            </SlideIn>
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => onOpenChange(false)}
              className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
              disabled={submitting}
            >
              <X className="size-5" />
            </button>
          </div>
        </FadeIn>

        <div className="shrink-0 border-b border-[#eceef3] bg-[#f8f9fc] px-6 py-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {modeOptions.map(({ value, title, description, icon: Icon, activeClassName, iconClassName }) => (
              <button
                key={value}
                type="button"
                onClick={() => switchMode(value)}
                disabled={submitting}
                aria-pressed={mode === value}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  mode === value ? activeClassName : "border-[#e2e8f0] bg-white hover:border-[#c9c4d5]/70"
                }`}
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-[#181c20]">{title}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-[#787584]">{description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-h-0 overflow-y-auto overscroll-contain p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-5">
              {selectedClass ? (
                <div className="rounded-xl border border-[#eef0f5] bg-[#f8f9fc] p-4">
                  <p className="text-xs font-bold text-[#181c20]">{selectedClass.name}</p>
                  <p className="mt-1 text-[11px] text-[#787584]">
                    {selectedClass.gradeCode ?? selectedClass.gradeName ?? "-"} •{" "}
                    {selectedClass.majorCode ?? selectedClass.majorName ?? "-"} •{" "}
                    {selectedClass.studentCount}/{selectedClass.capacity} siswa
                  </p>
                  <p className="mt-1 text-[11px] text-[#787584]">
                    Wali saat ini:{" "}
                    <span className="font-semibold text-[#181c20]">
                      {selectedClass.advisorName ?? "Belum ditetapkan"}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#d9d3f0] bg-[#faf8ff] p-4">
                  <p className="text-xs font-semibold text-[#4331a8]">
                    Pilih rombel pada panel kanan
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#787584]">
                    {mode === "add"
                      ? "Hanya kelas yang belum memiliki wali yang ditampilkan."
                      : "Pilih kelas yang sudah memiliki wali kelas."}
                  </p>
                </div>
              )}

              {mode === "delete" ? (
                confirmDelete ? (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    <p>
                      Lepas <strong>{selectedClass?.advisorName ?? "wali kelas"}</strong> dari{" "}
                      {selectedClass?.name ?? "kelas ini"}?
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] leading-5 text-[#787584]">
                    Wali kelas akan dilepas dari rombel tanpa menghapus akun guru.
                  </p>
                )
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#181c20]">
                    Guru Wali Kelas
                  </label>
                  <SearchableDropdown
                    value={selectedTeacherId}
                    onChange={setSelectedTeacherId}
                    options={teacherOptions}
                    label={
                      loading
                        ? "Memuat data guru..."
                        : teacherOptions.length
                          ? "Pilih guru wali kelas"
                          : "Tidak ada guru aktif"
                    }
                    disabled={loading || submitting || !teacherOptions.length}
                    textClassName="text-[#64748B]"
                  />
                  {selectedTeacher ? (
                    <p className="text-[11px] text-[#787584]">
                      NIP {selectedTeacher.nomorInduk ?? "-"} •{" "}
                      {selectedTeacher.majorName ?? "-"}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <aside className="min-h-0 overflow-y-auto overscroll-contain border-t border-[#eceef3] bg-[#f8f9fc] p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:border-l lg:border-t-0">
            <div className="flex flex-col gap-2">
              <label className="relative">
                <span className="sr-only">Cari kelas</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari kelas atau wali..."
                  className="h-9 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-[11px] text-[#181c20] outline-none placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#6c5dd3]/30"
                />
              </label>
              <SearchableDropdown
                value={gradeId}
                onChange={setGradeId}
                options={gradeOptions}
                label="Semua Tingkat"
                textClassName="text-[#64748B]"
              />
              <SearchableDropdown
                value={majorId}
                onChange={setMajorId}
                options={majorOptions}
                label="Semua Jurusan"
                textClassName="text-[#64748B]"
              />
            </div>

            <div className="mt-3 flex max-h-[320px] flex-col gap-1.5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-[11px] text-[#787584]">
                  <Loader2 className="size-4 animate-spin" /> Memuat kelas…
                </div>
              ) : filteredClasses.length ? (
                filteredClasses.map((classItem) => (
                  <button
                    key={classItem.id}
                    type="button"
                    onClick={() => selectClass(classItem)}
                    className={`rounded-lg border p-2.5 text-left transition-colors ${
                      selectedClassId === classItem.id
                        ? "border-[#b7a9f5] bg-[#f4f2ff]"
                        : "border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                    }`}
                  >
                    <p className="text-[11px] font-bold text-[#181c20]">{classItem.name}</p>
                    <p className="mt-0.5 text-[10px] text-[#787584]">
                      {classItem.gradeCode ?? "-"} • {classItem.majorCode ?? "-"} •{" "}
                      {classItem.advisorName ?? "Belum ada wali"}
                    </p>
                  </button>
                ))
              ) : (
                <p className="py-8 text-center text-[11px] text-[#787584]">
                  Tidak ada kelas yang cocok.
                </p>
              )}
            </div>
          </aside>
        </div>

        <DialogFooter className="mx-0 mb-0 flex shrink-0 flex-row items-center justify-between gap-3 border-t border-[#eceef3] bg-[#f8f9fc] px-6 py-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="rounded-xl border border-[#e0e2e7] bg-white px-4 py-2 text-xs font-semibold text-[#4e566c] hover:bg-[#f1f4f9] disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              loading ||
              !selectedClass ||
              (mode !== "delete" && !selectedTeacherId)
            }
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 ${
              mode === "delete"
                ? "bg-[#ba1a1a] hover:bg-[#93000a]"
                : "bg-[#6c5dd3] hover:bg-[#5343b9]"
            }`}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "delete" ? (
              <Trash2 className="size-4" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {mode === "add"
              ? "Tambah Penempatan"
              : mode === "edit"
                ? "Simpan Perubahan"
                : confirmDelete
                  ? "Ya, Lepas Wali"
                  : "Lepas Wali"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
