"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  Info,
  Loader2,
  PencilLine,
  PlusCircle,
  School,
  Search,
  Sparkles,
  Timer,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { masterDataApi } from "@/lib/api/master-data";
import type { GradeLevel, JadwalPelajaran, Major, SchoolClass, Subject } from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

const HARI_LIST = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;
const SESI_LIST = [
  { sesi: 1, label: "Sesi 1 (07:00 - 08:00 WIB) - Pagi Utama", mulai: "07:00", selesai: "08:00", durasi: 60 },
  { sesi: 2, label: "Sesi 2 (08:00 - 09:00 WIB) - Pagi", mulai: "08:00", selesai: "09:00", durasi: 60 },
  { sesi: 3, label: "Sesi 3 (09:15 - 10:45 WIB) - Menengah", mulai: "09:15", selesai: "10:45", durasi: 90 },
  { sesi: 4, label: "Sesi 4 (10:45 - 12:00 WIB) - Menengah", mulai: "10:45", selesai: "12:00", durasi: 75 },
  { sesi: 5, label: "Sesi 5 (12:15 - 13:45 WIB) - Siang", mulai: "12:15", selesai: "13:45", durasi: 90 },
  { sesi: 6, label: "Sesi 6 (13:45 - 15:00 WIB) - Sore", mulai: "13:45", selesai: "15:00", durasi: 75 },
] as const;
const DURASI_LIST = [60, 75, 90] as const;

function gradePhase(code: string) {
  if (code === "X") return "Fase E";
  if (code === "XI") return "Fase F";
  if (code === "XII") return "Fase F Lanjutan";
  return code;
}

const EMPTY = { hari: "Senin", sesi: 1, durasi: 60, gradeLevelId: "", majorId: "", classId: "", subjectId: "" };

type ScheduleForm = typeof EMPTY;

function formFromSchedule(schedule: JadwalPelajaran): ScheduleForm {
  return {
    hari: schedule.hari || "Senin",
    sesi: schedule.sesi || 1,
    durasi: schedule.durasi || 60,
    gradeLevelId: schedule.gradeLevelId || "",
    majorId: schedule.majorId || "",
    classId: schedule.classId || "",
    subjectId: schedule.subjectId || "",
  };
}

const FORM_KEYS = ["hari", "sesi", "durasi", "gradeLevelId", "majorId", "classId", "subjectId"] as const;

type ScheduleMode = "add" | "edit" | "delete";

export function AddScheduleDialog({
  open,
  onOpenChange,
  onSuccess,
  schedules = [],
  initialSchedule = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  schedules?: JadwalPelajaran[];
  initialSchedule?: JadwalPelajaran | null;
}) {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dbSchedules, setDbSchedules] = useState<JadwalPelajaran[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<ScheduleMode>(initialSchedule ? "edit" : "add");
  const [editingId, setEditingId] = useState<string | null>(initialSchedule?.id ?? null);
  const [deletingId, setDeletingId] = useState<string>("");
  const [form, setForm] = useState<ScheduleForm>(initialSchedule ? formFromSchedule(initialSchedule) : EMPTY);
  const [baseline, setBaseline] = useState<ScheduleForm | null>(initialSchedule ? formFromSchedule(initialSchedule) : null);

  const selectedSesi = SESI_LIST.find((s) => s.sesi === form.sesi) ?? SESI_LIST[0];
  const selectedClass = classes.find((c) => c.id === form.classId);
  const selectedSubject = subjects.find((s) => s.id === form.subjectId);
  const scheduleList = dbSchedules ?? schedules;
  const [filterTingkat, setFilterTingkat] = useState("Semua Tingkat");
  const [filterJurusan, setFilterJurusan] = useState("Semua Jurusan");
  const [filterSubGrade, setFilterSubGrade] = useState("Semua Sub Grade");
  const [filterHari, setFilterHari] = useState("Semua Hari");
  const [filterSesi, setFilterSesi] = useState("Semua Sesi");
  const [filterMapel, setFilterMapel] = useState("");
  const scheduleConflict = mode !== "delete" && form.classId
    ? scheduleList.find((s) => s.id !== editingId && s.classId === form.classId && s.hari === form.hari && s.sesi === form.sesi)
    : undefined;
  const selectedSchedule = editingId
    ? scheduleList.find((s) => s.id === editingId) ?? initialSchedule ?? undefined
    : undefined;
  const isDirty = Boolean(editingId && baseline && FORM_KEYS.some((key) => form[key] !== baseline[key]));
  const dirtyConfirm = (message: string) => !isDirty || window.confirm(message);
  const dialogTitle = mode === "edit" ? "Perbarui Sesi Jadwal Pelajaran" : mode === "delete" ? "Hapus Sesi Jadwal Pelajaran" : "Tambah Sesi Jadwal Pelajaran";

  const reset = () => {
    setForm(EMPTY);
    setBaseline(null);
    setClasses([]);
    setSubjects([]);
    setSubmitting(false);
    setMode("add");
    setEditingId(null);
    setDeletingId("");
    setFilterTingkat("Semua Tingkat");
    setFilterJurusan("Semua Jurusan");
    setFilterSubGrade("Semua Sub Grade");
    setFilterHari("Semua Hari");
    setFilterSesi("Semua Sesi");
    setFilterMapel("");
  };

  const switchMode = (nextMode: ScheduleMode) => {
    if (submitting || nextMode === mode) return;
    if (nextMode !== "edit" && !dirtyConfirm("Perubahan belum disimpan. Ganti mode dan buang perubahan?")) return;
    setMode(nextMode);
    setEditingId(null);
    setDeletingId("");
    setBaseline(null);
    if (nextMode === "add") setForm(EMPTY);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    (async () => {
      setLoading(true);
      setLoadingSchedules(true);
      try {
        const [g, m, j] = await Promise.all([
          masterDataApi.gradeLevels.list(),
          masterDataApi.majors.list(),
          masterDataApi.jadwalPelajaran.list(),
        ]);
        if (!active) return;
        if (g.error || m.error) throw new Error("Gagal memuat data jadwal");
        setGradeLevels(g.data?.data ?? []);
        setMajors(m.data?.data ?? []);
        if (j.error) {
          toast.error("Gagal memuat daftar jadwal", { description: j.error.message || "Kesalahan tidak diketahui" });
        } else {
          setDbSchedules(j.data?.data ?? []);
        }
      } catch (e) {
        if (active) toast.error("Gagal memuat data jadwal", { description: e instanceof Error ? e.message : "Kesalahan tidak diketahui" });
      } finally {
        if (active) setLoading(false);
        if (active) setLoadingSchedules(false);
      }
    })();
    return () => { active = false; };
  }, [open]);

  useEffect(() => {
    if (!open || !form.gradeLevelId) return;
    let active = true;
    (async () => {
      try {
        const res = await masterDataApi.classes.list({ gradeLevelId: form.gradeLevelId, majorId: form.majorId || undefined });
        if (!active) return;
        if (res.error) throw new Error(res.error.message || `HTTP ${res.status}`);
        setClasses(res.data?.data ?? []);
      } catch (e) {
        if (active) { setClasses([]); toast.error("Gagal memuat kelas", { description: e instanceof Error ? e.message : "Kesalahan tidak diketahui" }); }
      }
    })();
    return () => { active = false; };
  }, [open, form.gradeLevelId, form.majorId]);

  useEffect(() => {
    if (!open || !form.gradeLevelId) return;
    let active = true;
    (async () => {
      setLoadingSubjects(true);
      try {
        const res = await masterDataApi.subjects.list({ gradeLevelId: form.gradeLevelId, includeInactive: true });
        if (!active) return;
        if (res.error) throw new Error(res.error.message || `HTTP ${res.status}`);
        const all = res.data?.data ?? [];
        setSubjects(form.majorId ? all.filter((s) => !s.majorId || s.majorId === form.majorId) : all);
      } catch (e) {
        if (active) { setSubjects([]); toast.error("Gagal memuat mata pelajaran", { description: e instanceof Error ? e.message : "Kesalahan tidak diketahui" }); }
      } finally {
        if (active) setLoadingSubjects(false);
      }
    })();
    return () => { active = false; };
  }, [open, form.gradeLevelId, form.majorId]);

  const hariOptions: JurusanOption[] = HARI_LIST.map((h) => ({ value: h, label: h }));
  const sesiOptions: JurusanOption[] = SESI_LIST.map((s) => ({ value: String(s.sesi), label: s.label }));
  const gradeOptions: JurusanOption[] = gradeLevels.map((g) => ({ value: g.id, label: `Kelas ${g.code} (${gradePhase(g.code)})` }));
  const majorOptions: JurusanOption[] = majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` }));
  const classOptions: JurusanOption[] = classes.map((c) => ({ value: c.id, label: `${c.name} • ${c.majorCode} ${c.gradeCode}` }));
  const subjectOptions: JurusanOption[] = subjects.map((s) => ({ value: s.id, label: `${s.name}${s.code ? ` [${s.code}]` : ""}` }));
  const filterTingkatOptions: JurusanOption[] = [{ value: "Semua Tingkat", label: "Semua Tingkat" }, ...gradeLevels.map((g) => ({ value: g.id, label: `Kelas ${g.code} (${gradePhase(g.code)})` }))];
  const filterJurusanOptions: JurusanOption[] = [{ value: "Semua Jurusan", label: "Semua Jurusan" }, ...majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` }))];
  const filterSubGradeOptions: JurusanOption[] = [{ value: "Semua Sub Grade", label: "Semua Sub Grade" }, ...[...new Set(scheduleList.map((s) => s.classSection || ""))].filter((section) => section).sort((a, b) => a.localeCompare(b)).map((section) => ({ value: section, label: `Sub Grade ${section}` }))];
  const filterHariOptions: JurusanOption[] = [{ value: "Semua Hari", label: "Semua Hari" }, ...HARI_LIST.map((h) => ({ value: h, label: h }))];
  const filterSesiOptions: JurusanOption[] = [{ value: "Semua Sesi", label: "Semua Sesi" }, ...SESI_LIST.map((s) => ({ value: String(s.sesi), label: `Sesi ${s.sesi} • ${s.mulai}-${s.selesai}` }))];
  const scheduleLabel = (s: JadwalPelajaran) => `Sesi ${s.sesi} • ${s.hari} ${String(s.waktuMulai ?? "").slice(0, 5)}-${String(s.waktuSelesai ?? "").slice(0, 5)} • ${s.className} • ${s.subjectName}`;
  const filteredSchedules = scheduleList.filter((s) =>
    (filterTingkat === "Semua Tingkat" || s.gradeLevelId === filterTingkat) &&
    (filterJurusan === "Semua Jurusan" || s.majorId === filterJurusan) &&
    (filterSubGrade === "Semua Sub Grade" || s.classSection === filterSubGrade) &&
    (filterHari === "Semua Hari" || s.hari === filterHari) &&
    (filterSesi === "Semua Sesi" || s.sesi === Number(filterSesi)) &&
    (!filterMapel.trim() || s.subjectName.toLowerCase().includes(filterMapel.trim().toLowerCase()))
  );
  const editScheduleOptions: JurusanOption[] = filteredSchedules.map((s) => ({ value: s.id, label: scheduleLabel(s) }));
  const deleteScheduleOptions: JurusanOption[] = scheduleList.map((s) => ({ value: s.id, label: scheduleLabel(s) }));

  const summary = useMemo(() => {
    if (!selectedClass || !selectedSubject) return "Alokasikan jam belajar mengajar, rombel kelas, dan mata pelajaran.";
    return `${selectedSubject.name} untuk ${selectedClass.name} pada ${form.hari} Sesi ${form.sesi} (${selectedSesi.mulai}-${selectedSesi.selesai} WIB, ${form.durasi} menit).`;
  }, [selectedClass, selectedSubject, form.hari, form.sesi, form.durasi, selectedSesi]);

  const handleCancel = () => {
    if (submitting) return;
    if (!dirtyConfirm("Perubahan belum disimpan. Tutup dan buang perubahan?")) return;
    reset();
    onOpenChange(false);
  };

  const handleSelectEdit = (schedule: JadwalPelajaran) => {
    if (editingId && editingId !== schedule.id && !dirtyConfirm("Perubahan pada jadwal sebelumnya belum disimpan. Ganti jadwal dan buang perubahan?")) return;
    const next = formFromSchedule(schedule);
    setEditingId(schedule.id);
    setForm(next);
    setBaseline(next);
  };

  const handleClearSelection = () => {
    if (!dirtyConfirm("Perubahan belum disimpan. Lepas jadwal terpilih dan buang perubahan?")) return;
    setEditingId(null);
    setForm(EMPTY);
    setBaseline(null);
  };

  const handleRevert = () => {
    if (baseline) setForm(baseline);
  };

  const handleDelete = async () => {
    const target = scheduleList.find((s) => s.id === deletingId);
    if (!target) {
      toast.error("Jadwal belum dipilih", { description: "Pilih jadwal yang akan dihapus terlebih dahulu." });
      return;
    }
    if (!window.confirm(`Hapus sesi jadwal ${target.className} • Sesi ${target.sesi} ${target.hari} • ${target.subjectName}?`)) return;
    setSubmitting(true);
    try {
      const res = await masterDataApi.jadwalPelajaran.remove(target.id);
      if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
      toast.success("Sesi jadwal dihapus", { description: `${target.className} • Sesi ${target.sesi} ${target.hari} • ${target.subjectName}.` });
      onSuccess?.();
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error("Gagal menghapus sesi jadwal", { description: err instanceof Error ? err.message : "Kesalahan tidak diketahui" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && !editingId) {
      toast.error("Jadwal belum dipilih", { description: "Pilih jadwal yang akan diperbarui terlebih dahulu." });
      return;
    }
    if (!form.gradeLevelId || !form.majorId || !form.classId || !form.subjectId) {
      toast.error("Form belum lengkap", { description: "Pilih tingkat, jurusan, rombel kelas, dan mata pelajaran." });
      return;
    }
    if (scheduleConflict) {
      toast.error("Jam bentrok", { description: `${selectedClass?.name ?? "Kelas"} sudah punya mapel pada ${form.hari} Sesi ${form.sesi}. Ubah hari atau sesi terlebih dahulu.` });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { classId: form.classId, subjectId: form.subjectId, hari: form.hari, sesi: form.sesi, durasi: form.durasi };
      const res = mode === "edit" && editingId
        ? await masterDataApi.jadwalPelajaran.update(editingId, payload)
        : await masterDataApi.jadwalPelajaran.create(payload);
      if (res.error) throw new Error(res.error.message || res.error.error || `HTTP ${res.status}`);
      toast.success(mode === "edit" ? "Sesi jadwal diperbarui" : "Sesi jadwal tersimpan", { description: `${selectedSubject?.name ?? "Mapel"} - ${selectedClass?.name ?? "Kelas"} ${form.hari} Sesi ${form.sesi}.` });
      onSuccess?.();
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(mode === "edit" ? "Gagal memperbarui sesi jadwal" : "Gagal menyimpan sesi jadwal", { description: err instanceof Error ? err.message : "Kesalahan tidak diketahui" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (next) { onOpenChange(true); return; }
      if (!dirtyConfirm("Perubahan belum disimpan. Tutup dan buang perubahan?")) return;
      reset();
      onOpenChange(false);
    }}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-slate-900/60 backdrop-blur-sm supports-backdrop-filter:backdrop-blur-sm"
        className="flex max-h-[calc(100dvh-10rem)] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:w-full sm:max-w-4xl"
      >
        {/* Header gradient — sesuai design */}
        <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-[#6c5dd3] via-indigo-600 to-indigo-700 px-7 py-5 text-white">
          <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-md">
              <CalendarDays className="size-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg font-bold tracking-tight text-white">{dialogTitle}</DialogTitle>
              </div>
            </div>
          </div>
          <button type="button" aria-label="Tutup" onClick={handleCancel} disabled={submitting} className="relative z-10 flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-50">
            <X className="size-5" />
          </button>
        </div>

        {/* Mode bar */}
        <div className="shrink-0 border-b border-slate-200/70 bg-[#f1f4f9] px-7 py-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#787584]"><GraduationCap className="size-4 text-[#5343b9]" /> Metode Tindakan / Manajemen Sesi</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => switchMode("add")} disabled={submitting} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${mode === "add" ? "bg-[#6c5dd3] text-white shadow-[0_4px_12px_rgba(108,93,211,0.25)]" : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"}`}><PlusCircle className="size-4" /> Tambah Baru </button>
              <button type="button" onClick={() => switchMode("edit")} disabled={submitting} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${mode === "edit" ? "bg-[#6c5dd3] text-white shadow-[0_4px_12px_rgba(108,93,211,0.25)]" : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"}`}><PencilLine className="size-4 text-[#5343b9]" /> Perbarui </button>
              <button type="button" onClick={() => switchMode("delete")} disabled={submitting} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${mode === "delete" ? "bg-[#ba1a1a] text-white shadow-[0_4px_12px_rgba(186,26,26,0.25)]" : "border border-slate-200 bg-white font-semibold text-[#4e566c] hover:text-[#181c20]"}`}><Trash2 className="size-4 text-[#ba1a1a]" /> Hapus </button>
            </div>
            {mode === "delete" ? (
              <div className="mt-2 rounded-2xl border border-red-200/70 bg-white p-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Jadwal yang akan dihapus <span className="text-[#c0262d]">*</span></label>
                  <SearchableDropdown
                    value={deletingId}
                    onChange={setDeletingId}
                    options={deleteScheduleOptions}
                    label={loadingSchedules ? "Memuat data jadwal..." : scheduleList.length ? "Pilih jadwal yang akan dihapus" : "Belum ada data jadwal"}
                    disabled={submitting || loadingSchedules || !scheduleList.length}
                  />
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ba1a1a]"><Info className="size-3.5" /> Mode Aktif: menghapus sesi jadwal dari Timetable Master. Tindakan ini tidak bisa dibatalkan.</p>
                </div>
              </div>
            ) : mode === "edit" ? (
              <p className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-2.5 py-1.5 text-[11px] text-[#4e566c]"><Info className="size-3.5 shrink-0 text-[#5343b9]" /><span><strong>Mode Aktif:</strong> {editingId ? "ubah detail jadwal terpilih lalu simpan ke Timetable Master." : "pilih jadwal pada panel kanan untuk mulai mengubah."}</span></p>
            ) : (
              <p className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-2.5 py-1.5 text-[11px] text-[#4e566c]"><Info className="size-3.5 shrink-0 text-[#5343b9]" /><span><strong>Mode Aktif:</strong> Tambah sesi belajar baru ke timetable rombel tanpa menimpa slot lain.</span></p>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
          <form id="add-schedule-form" onSubmit={handleSubmit} className="min-h-0 flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
          {mode === "delete" ? (
            <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-red-100 text-[#ba1a1a]"><Trash2 className="size-7" /></span>
              <h3 className="mt-4 text-sm font-bold text-[#181c20]">Hapus Sesi Jadwal Pelajaran</h3>
              <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">Pilih jadwal pada dropdown di atas untuk menghapusnya dari Timetable Master. Konten form tidak ditampilkan pada mode ini.</p>
            </section>
          ) : (
            <>
          {mode === "edit" && !editingId ? (
            <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#c9c4d5] bg-[#f8f9fc] px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#e5deff] text-[#5343b9]"><PencilLine className="size-7" /></span>
              <h3 className="mt-4 text-sm font-bold text-[#181c20]">Pilih Jadwal Terlebih Dahulu</h3>
              <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">Pilih jadwal pada panel di sebelah kanan untuk mengedit. Bagian 1-2 akan terkunci sampai jadwal dipilih.</p>
            </section>
          ) : (
            <>
          {mode === "edit" ? (
            <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e5deff] bg-[#faf8ff] px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#5343b9] text-white"><PencilLine className="size-4" /></span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#181c20]">Ubah Detail Jadwal</p>
                  <p className="text-[11px] text-[#787584]">Perubahan hanya berlaku untuk jadwal yang dipilih di panel kanan.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isDirty ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">Belum disimpan</span> : null}
                <button type="button" onClick={handleRevert} disabled={!isDirty || submitting} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#4e566c] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Batalkan perubahan</button>
              </div>
            </section>
          ) : null}
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">1</span>
              <h3 className="text-sm font-bold text-[#181c20]">Sesi Waktu &amp; Alokasi Durasi</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center text-xs font-semibold text-[#181c20]">Hari <span className="text-[#c0262d]">*</span></label>
                <SearchableDropdown value={form.hari} onChange={(v) => setForm((p) => ({ ...p, hari: v }))} options={hariOptions} label="Pilih hari" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center text-xs font-semibold text-[#181c20]">Sesi &amp; Jam Standar <span className="text-[#c0262d]">*</span></label>
                <SearchableDropdown value={String(form.sesi)} onChange={(v) => { const n = Number(v); setForm((p) => ({ ...p, sesi: n, durasi: SESI_LIST.find((s) => s.sesi === n)?.durasi ?? 60 })); }} options={sesiOptions} label="Pilih sesi" />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-[#181c20]">Durasi Pembelajaran <span className="text-[11px] font-semibold text-[#5343b9]">Otomatis terhitung</span></label>
              <div className="grid grid-cols-3 gap-2">
                {DURASI_LIST.map((d) => (
                  <button key={d} type="button" onClick={() => setForm((p) => ({ ...p, durasi: d }))} className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold transition-all ${form.durasi === d ? "border-2 border-[#5343b9] bg-[#5343b9]/10 text-[#5343b9] shadow-sm" : "border border-[#c9c4d5]/60 bg-white font-semibold text-[#4e566c] hover:bg-[#eceef3]"}`}>
                    <Timer className="size-4" /> {d} Menit
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">2</span>
              <h3 className="text-sm font-bold text-[#181c20]">Kelas, Rombel &amp; Jurusan</h3>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#181c20]">Tingkat<span className="text-[#c0262d]">*</span></label>
                <SearchableDropdown value={form.gradeLevelId} onChange={(v) => setForm((p) => ({ ...p, gradeLevelId: v, majorId: "", classId: "", subjectId: "" }))} options={gradeOptions} label={loading ? "Memuat..." : "Pilih tingkat kelas"} disabled={loading} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#181c20]">Jurusan / Konsentrasi <span className="text-[#c0262d]">*</span></label>
                <SearchableDropdown value={form.majorId} onChange={(v) => setForm((p) => ({ ...p, majorId: v, classId: "", subjectId: "" }))} options={majorOptions} label={!form.gradeLevelId ? "Pilih tingkat dulu" : "Pilih jurusan"} disabled={!form.gradeLevelId || loading} />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#181c20]">Rombel<span className="text-[#c0262d]">*</span></label>
              <SearchableDropdown value={form.classId} onChange={(v) => setForm((p) => ({ ...p, classId: v }))} options={classOptions} label={!form.majorId ? "Pilih jurusan dulu" : classes.length ? "Pilih rombel kelas" : "Tidak ada kelas"} disabled={!form.majorId} />
            </div>
          </section>

          {/* Section 3 — hanya mode Tambah */}
          {mode === "add" ? (
          <section>
            <div className="flex items-center gap-2 border-b border-[#eceef3] pb-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#e5deff] text-xs font-bold text-[#4331a8]">3</span>
              <h3 className="text-sm font-bold text-[#181c20]">Mata Pelajaran (Mapel)</h3>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#181c20]">Pilihan Mata Pelajaran <span className="text-[#c0262d]">*</span></label>
              <SearchableDropdown value={form.subjectId} onChange={(v) => setForm((p) => ({ ...p, subjectId: v }))} options={subjectOptions} label={!form.gradeLevelId ? "Pilih tingkat dulu" : loadingSubjects ? "Memuat..." : subjects.length ? "Pilih mata pelajaran" : "Tidak ada mata pelajaran"} disabled={!form.gradeLevelId || loadingSubjects} />
              <p className="flex items-center gap-1.5 text-[10px] text-[#787584]"><Info className="size-3.5" /> {summary}</p>
            </div>
          </section>
          ) : null}
          {scheduleConflict ? (
            <section className="relative -mt-3 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[11px] leading-5 text-[#7f1d1d]">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[#dc2626]" />
              <p><strong>Jam bentrok.</strong> {selectedClass?.name ?? "Rombel"} sudah punya {scheduleConflict.subjectName ?? "mata pelajaran"} pada {form.hari} Sesi {form.sesi} ({String(scheduleConflict.waktuMulai ?? "").slice(0, 5)}-{String(scheduleConflict.waktuSelesai ?? "").slice(0, 5)} WIB). Pilih hari atau sesi lain sebelum menyimpan.</p>
            </section>
          ) : null}
            </>
          )}
          </>
          )}
        </form>
        {mode === "edit" ? (
          <aside className="min-h-0 flex-1 shrink-0 overflow-y-auto border-t border-slate-200/70 bg-[#f8f9fc] p-5 lg:w-[360px] lg:flex-none lg:border-l lg:border-t-0">
            <div className="flex flex-col gap-2 pb-40">
              <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-[#f8f9fc] px-5 pb-3 pt-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#787584]"><Search className="size-4 text-[#5343b9]" /> Langkah 1 · Pilih Jadwal</span>
                  <span className="text-[10px] font-semibold text-[#787584]">{loadingSchedules ? "Memuat..." : `${filteredSchedules.length} ditemukan`}</span>
                </div>
                {selectedSchedule ? (
                  <div className="mt-2 rounded-xl border border-[#d9d3f0] bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#181c20]">{selectedSchedule.className} • {selectedSchedule.subjectName}</p>
                        <p className="mt-0.5 text-[11px] text-[#787584]">{selectedSchedule.hari} • Sesi {selectedSchedule.sesi} • {String(selectedSchedule.waktuMulai ?? "").slice(0, 5)}-{String(selectedSchedule.waktuSelesai ?? "").slice(0, 5)} WIB • {selectedSchedule.durasi} menit</p>
                      </div>
                      <button type="button" onClick={handleClearSelection} disabled={submitting} className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-[#4e566c] transition-colors hover:bg-slate-50 disabled:opacity-50">Ganti</button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 rounded-xl border border-dashed border-[#c9c4d5] bg-white px-3 py-2 text-[11px] leading-4 text-[#787584]">Belum ada jadwal dipilih. Gunakan filter di bawah untuk mempersempit pencarian.</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Tingkat</label>
                  <SearchableDropdown value={filterTingkat} onChange={setFilterTingkat} options={filterTingkatOptions} label="Semua Tingkat" disabled={loadingSchedules} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Jurusan</label>
                  <SearchableDropdown value={filterJurusan} onChange={setFilterJurusan} options={filterJurusanOptions} label="Semua Jurusan" disabled={loadingSchedules} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Sub Grade (A,B,C,D)</label>
                  <SearchableDropdown value={filterSubGrade} onChange={setFilterSubGrade} options={filterSubGradeOptions} label="Semua Sub Grade" disabled={loadingSchedules} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">Hari</label>
                    <SearchableDropdown value={filterHari} onChange={setFilterHari} options={filterHariOptions} label="Semua Hari" disabled={loadingSchedules} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#181c20]">Sesi</label>
                    <SearchableDropdown value={filterSesi} onChange={setFilterSesi} options={filterSesiOptions} label="Semua Sesi" disabled={loadingSchedules} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Cari Mapel</label>
                  <input type="text" value={filterMapel} onChange={(e) => setFilterMapel(e.target.value)} placeholder="Nama mata pelajaran..." className="h-11 w-full rounded-full bg-[#f1f4f9] px-4 text-xs font-semibold text-[#181c20] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30 disabled:opacity-50" disabled={loadingSchedules} />
                </div>
              </div>
              <div className="mt-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#181c20]">Jadwal yang akan diperbarui <span className="text-[#c0262d]">*</span></label>
                <SearchableDropdown
                  value={editingId ?? ""}
                  onChange={(v) => {
                    const s = scheduleList.find((item) => item.id === v);
                    if (s) handleSelectEdit(s);
                  }}
                  options={editScheduleOptions}
                  label={loadingSchedules ? "Memuat data jadwal..." : filteredSchedules.length ? "Pilih jadwal yang akan diperbarui" : "Tidak ada jadwal yang cocok"}
                  disabled={submitting || loadingSchedules || !filteredSchedules.length}
                />
                <p className="text-[11px] text-[#787584]">Isi form di sebelah kiri akan mengikuti jadwal yang dipilih.</p>
              </div>
            </div>
          </aside>
        ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
          {mode === "edit" && editingId ? (
            <p className="mr-auto hidden text-[11px] font-medium sm:block">{isDirty ? "Ada perubahan belum disimpan" : "Belum ada perubahan"}</p>
          ) : null}
          <button type="button" onClick={handleCancel} disabled={submitting} className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50">Batal</button>
          {mode === "delete" ? (
            <button type="button" onClick={() => void handleDelete()} disabled={submitting || !deletingId} className="flex items-center gap-1.5 rounded-xl bg-[#ba1a1a] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-900/20 transition-all hover:bg-[#93000a] disabled:opacity-60">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              <span>{submitting ? "Menghapus..." : "Hapus Sesi Jadwal"}</span>
            </button>
          ) : (
            <button type="submit" form="add-schedule-form" disabled={submitting || (mode === "edit" && (!editingId || !isDirty)) || Boolean(scheduleConflict)} className="flex items-center gap-1.5 rounded-xl bg-[#6c5dd3] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6c5dd3]/30 transition-all hover:bg-[#5343b9] disabled:opacity-60">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              <span>{submitting ? "Menyimpan..." : mode === "edit" ? " Simpan Perubahan" : " Simpan Sesi Jadwal"}</span>
            </button>
          )}
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
