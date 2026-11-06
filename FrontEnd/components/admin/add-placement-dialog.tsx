"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Info,
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
  Subject,
  TeacherSummary,
} from "@/lib/api/master-data";

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
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(EMPTY_STATE);

  const selectedTeacher = teachers.find((teacher) => teacher.id === form.teacherId);
  const selectedSubject = subjects.find((subject) => subject.id === form.subjectId);

  const resetState = () => {
    setForm(EMPTY_STATE);
    setSubjects([]);
    setLoadingSubjects(false);
    setSubmitting(false);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    const fetchData = async () => {
      try {
        const [teachersRes, majorsRes, gradeRes] = await Promise.all([
          masterDataApi.teachers.list(),
          masterDataApi.majors.list(),
          masterDataApi.gradeLevels.list(),
        ]);
        if (!active) return;
        if (teachersRes.error || majorsRes.error || gradeRes.error) {
          throw new Error("Gagal memuat data penempatan");
        }
        setTeachers(teachersRes.data?.data ?? []);
        setMajors(majorsRes.data?.data ?? []);
        setGradeLevels(gradeRes.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching placement data:", error);
        if (!active) return;
        setTeachers([]);
        setMajors([]);
        setGradeLevels([]);
        toast.error("Gagal memuat data penempatan", {
          description: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
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

  const subjectOptions = useMemo(() => {
    const relevant = form.majorId
      ? subjects.filter((subject) => !subject.majorId || subject.majorId === form.majorId)
      : subjects;
    return relevant;
  }, [subjects, form.majorId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.teacherId || !form.majorId || !form.gradeLevelId || !form.subjectId) {
      toast.error("Penempatan belum lengkap", {
        description: "Pilih guru, konsentrasi keahlian, tingkat kelas, dan mata pelajaran.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await masterDataApi.teacherAssignments.assignSubject({
        teacherId: form.teacherId,
        subjectId: form.subjectId,
      });
      if (res.error) {
        throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
      }

      toast.success("Penempatan tersimpan", {
        description: `${selectedTeacher?.fullName ?? "Guru"} ditempatkan pada ${
          selectedSubject?.name ?? "mata pelajaran"
        }.`,
      });
      onSuccess?.();
      resetState();
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal menyimpan penempatan", {
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
    setForm((prev) => ({ ...prev, gradeLevelId, subjectId: "" }));
    setSubjects([]);
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

        <div className="shrink-0 border-b border-slate-200/80 bg-[#f1f4f9] px-7 py-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
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
                    ? `NIP: ${selectedTeacher.nomorInduk ?? "—"}${
                        selectedTeacher.email ? ` • ${selectedTeacher.email}` : ""
                      }`
                    : "Pilih guru dari daftar untuk mulai menempatkan."}
                </p>
              </div>
            </div>
            <div className="relative min-w-[240px]">
              <UserRoundCheck className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
              <select
                value={form.teacherId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, teacherId: event.target.value }))
                }
                disabled={!teachers.length}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-semibold text-slate-700 shadow-sm outline-none transition-all hover:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {teachers.length ? "Pilih guru" : "Belum ada data guru"}
                </option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                    {teacher.nomorInduk ? ` (${teacher.nomorInduk})` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <form
          id="add-placement-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
        >
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                Konsentrasi Keahlian <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Pilih kompetensi keahlian sasaran pengajaran kurikulum.
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
              {majors.map((major) => {
                const selected = form.majorId === major.id;
                return (
                  <button
                    key={major.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, majorId: major.id, subjectId: "" }))
                    }
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      selected
                        ? "border-[#6c5dd3] bg-[#f5f3ff]/70 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#c9c4d5]"
                    }`}
                  >
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? "border-[#6c5dd3]" : "border-slate-300"
                      }`}
                    >
                      {selected ? <span className="size-2 rounded-full bg-[#6c5dd3]" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-slate-900">
                        {major.code} — {major.name}
                      </span>
                      <span
                        className={`mt-0.5 block text-[10px] font-medium ${
                          selected ? "text-[#6c5dd3]" : "text-slate-400"
                        }`}
                      >
                        {major.classCount} kelas • {major.subjectCount} mapel
                      </span>
                    </span>
                  </button>
                );
              })}
              {!majors.length ? (
                <p className="col-span-full rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[11px] text-slate-400">
                  Belum ada data konsentrasi keahlian.
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="space-y-2 md:col-span-6">
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
                      <span
                        className={`text-xs font-bold ${
                          selected ? "text-[#4331a8]" : "text-slate-700"
                        }`}
                      >
                        {grade.name}
                      </span>
                      <span
                        className={`text-[10px] font-medium ${
                          selected ? "text-[#6c5dd3]" : "text-slate-400"
                        }`}
                      >
                        {gradePhase(grade.code)}
                      </span>
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

            <div className="space-y-2 md:col-span-6">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                Mata Pelajaran Diampu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                <select
                  value={form.subjectId}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, subjectId: event.target.value }))
                  }
                  disabled={!form.majorId || !form.gradeLevelId || loadingSubjects}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-700 shadow-sm outline-none transition-all hover:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {!form.majorId
                      ? "Pilih konsentrasi dulu"
                      : !form.gradeLevelId
                        ? "Pilih tingkat dulu"
                        : loadingSubjects
                          ? "Memuat..."
                          : subjectOptions.length
                            ? "Pilih mata pelajaran"
                            : "Tidak ada mata pelajaran"}
                  </option>
                  {subjectOptions.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                      {subject.code ? ` (${subject.code})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
              </div>
              {selectedSubject ? (
                <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <CheckCircle2 className="size-3.5 text-[#6c5dd3]" />
                  {selectedSubject.semester
                    ? `Semester ${selectedSubject.semester} • `
                    : ""}
                  Kurikulum Merdeka
                </p>
              ) : null}
            </div>
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="size-4 text-[#6c5dd3]" />
            <span>Penempatan menyimpan guru pada mata pelajaran yang dipilih.</span>
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
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-xl bg-[#6c5dd3] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6c5dd3]/30 transition-all hover:bg-[#5343b9] disabled:opacity-60"
            >
              <CheckCircle2 className="size-4" />
              {submitting ? "Menyimpan..." : "Simpan Penempatan Guru"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
