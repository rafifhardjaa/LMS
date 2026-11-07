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
  Sparkles,
  Timer,
  Trash2,
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

type ScheduleMode = "add" | "edit" | "delete";

export function AddScheduleDialog({
  open,
  onOpenChange,
  onSuccess,
  schedules = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  schedules?: JadwalPelajaran[];
}) {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<ScheduleMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string>("");
  const [form, setForm] = useState(EMPTY);

  const selectedSesi = SESI_LIST.find((s) => s.sesi === form.sesi) ?? SESI_LIST[0];
  const selectedClass = classes.find((c) => c.id === form.classId);
  const selectedSubject = subjects.find((s) => s.id === form.subjectId);

  const reset = () => {
    setForm(EMPTY);
    setClasses([]);
    setSubjects([]);
    setSubmitting(false);
    setMode("add");
    setEditingId(null);
    setDeletingId("");
  };

  const switchMode = (nextMode: ScheduleMode) => {
    if (submitting) return;
    setMode(nextMode);
    setEditingId(null);
    setDeletingId("");
    if (nextMode === "add") setForm(EMPTY);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [g, m] = await Promise.all([masterDataApi.gradeLevels.list(), masterDataApi.majors.list()]);
        if (!active) return;
        if (g.error || m.error) throw new Error("Gagal memuat data jadwal");
        setGradeLevels(g.data?.data ?? []);
        setMajors(m.data?.data ?? []);
      } catch (e) {
        if (active) toast.error("Gagal memuat data jadwal", { description: e instanceof Error ? e.message : "Kesalahan tidak diketahui" });
      } finally {
        if (active) setLoading(false);
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
  const scheduleLabel = (s: JadwalPelajaran) => `Sesi ${s.sesi} • ${s.hari} ${String(s.waktuMulai ?? "").slice(0, 5)}-${String(s.waktuSelesai ?? "").slice(0, 5)} • ${s.className} • ${s.subjectName}`;
  const editScheduleOptions: JurusanOption[] = schedules.map((s) => ({ value: s.id, label: scheduleLabel(s) }));
  const deleteScheduleOptions: JurusanOption[] = schedules.map((s) => ({ value: s.id, label: scheduleLabel(s) }));

  const summary = useMemo(() => {
    if (!selectedClass || !selectedSubject) return "Alokasikan jam belajar mengajar, rombel kelas, dan mata pelajaran.";
    return `${selectedSubject.name} untuk ${selectedClass.name} pada ${form.hari} Sesi ${form.sesi} (${selectedSesi.mulai}-${selectedSesi.selesai} WIB, ${form.durasi} menit).`;
  }, [selectedClass, selectedSubject, form.hari, form.sesi, form.durasi, selectedSesi]);

  const handleCancel = () => {
    if (submitting) return;
    reset();
    onOpenChange(false);
  };

  const handleSelectEdit = (schedule: JadwalPelajaran) => {
    setEditingId(schedule.id);
    setForm({ hari: schedule.hari || "Senin", sesi: schedule.sesi || 1, durasi: schedule.durasi || 60, gradeLevelId: schedule.gradeLevelId || "", majorId: schedule.majorId || "", classId: schedule.classId || "", subjectId: schedule.subjectId || "" });
  };

  const handleDelete = async () => {
    const target = schedules.find((s) => s.id === deletingId);
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
    <Dialog open={open} onOpenChange={(next) => { if (!next) reset(); onOpenChange(next); }}>
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
                <DialogTitle className="text-lg font-bold tracking-tight text-white">Tambah Sesi Jadwal Pelajaran</DialogTitle>
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
            {mode === "edit" ? (
              <div className="mt-2 rounded-2xl border border-slate-200/70 bg-white p-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Jadwal yang akan diperbarui <span className="text-[#c0262d]">*</span></label>
                  <SearchableDropdown
                    value={editingId ?? ""}
                    onChange={(v) => {
                      const s = schedules.find((item) => item.id === v);
                      if (s) handleSelectEdit(s);
                    }}
                    options={editScheduleOptions}
                    label={schedules.length ? "Pilih jadwal yang akan diperbarui" : "Belum ada data jadwal"}
                    disabled={submitting || !schedules.length}
                  />
                  <p className="text-[11px] text-[#787584]">Isi konten form di bawah akan mengikuti jadwal yang dipilih. Simpan untuk memperbarui.</p>
                </div>
                {editingId ? <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#059669]"><Info className="size-3.5" /> Mode Aktif: mengubah sesi jadwal terpilih di Timetable Master.</p> : null}
              </div>
            ) : mode === "delete" ? (
              <div className="mt-2 rounded-2xl border border-red-200/70 bg-white p-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#181c20]">Jadwal yang akan dihapus <span className="text-[#c0262d]">*</span></label>
                  <SearchableDropdown
                    value={deletingId}
                    onChange={setDeletingId}
                    options={deleteScheduleOptions}
                    label={schedules.length ? "Pilih jadwal yang akan dihapus" : "Belum ada data jadwal"}
                    disabled={submitting || !schedules.length}
                  />
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ba1a1a]"><Info className="size-3.5" /> Mode Aktif: menghapus sesi jadwal dari Timetable Master. Tindakan ini tidak bisa dibatalkan.</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-2.5 py-1.5 text-[11px] text-[#4e566c]"><Info className="size-3.5 shrink-0 text-[#5343b9]" /><span><strong>Mode Aktif:</strong> Tambah sesi belajar baru ke timetable rombel tanpa menimpa slot lain.</span></p>
            )}
          </div>
        </div>

        <form id="add-schedule-form" onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto p-7 text-xs [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
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
              <p className="mt-1 max-w-md text-[11px] leading-5 text-[#787584]">Pilih jadwal pada dropdown di atas untuk mengedit. Bagian 1-2 akan terkunci sampai jadwal dipilih.</p>
            </section>
          ) : (
            <>
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
            </>
          )}
          </>
          )}
        </form>

        <DialogFooter className="mx-0 mb-0 flex flex-row shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50 px-7 py-4">
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <button type="button" onClick={handleCancel} disabled={submitting} className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50">Batal</button>
            {mode === "delete" ? (
              <button type="button" onClick={() => void handleDelete()} disabled={submitting || !deletingId} className="flex items-center gap-1.5 rounded-xl bg-[#ba1a1a] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-900/20 transition-all hover:bg-[#93000a] disabled:opacity-60">
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                <span>{submitting ? "Menghapus..." : "Hapus Sesi Jadwal"}</span>
              </button>
            ) : (
              <button type="submit" form="add-schedule-form" disabled={submitting || (mode === "edit" && !editingId)} className="flex items-center gap-1.5 rounded-xl bg-[#6c5dd3] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6c5dd3]/30 transition-all hover:bg-[#5343b9] disabled:opacity-60">
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
