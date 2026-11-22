"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  GraduationCap,
  Loader2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";
import {
  masterDataApi,
  type SchoolClass,
  type TeacherSummary,
} from "@/lib/api/master-data";

type AssignWaliKelasDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: SchoolClass | null;
  onSuccess?: () => void;
};

export function AssignWaliKelasDialog({
  open,
  onOpenChange,
  classData,
  onSuccess,
}: AssignWaliKelasDialogProps) {
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [advisorId, setAdvisorId] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (!open) return;

    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;

      setAdvisorId(classData?.advisorId ?? "");
      setConfirmRemove(false);
      setLoading(true);

      (async () => {
        try {
          const res = await masterDataApi.teachers.list();
          if (!active) return;
          if (res.error) {
            throw new Error(res.error.message ?? res.error.error ?? "Gagal memuat data guru");
          }
          setTeachers(res.data?.data ?? []);
        } catch (err) {
          if (active) {
            setTeachers([]);
            toast.error("Gagal memuat data guru", {
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
  }, [open, classData]);

  const options: JurusanOption[] = useMemo(
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

  const selectedTeacher = teachers.find((teacher) => teacher.id === advisorId);

  async function submit(nextAdvisorId: string | null) {
    if (!classData) return;

    setSubmitting(true);
    try {
      const res = await masterDataApi.classes.assignAdvisor(classData.id, nextAdvisorId);
      if (res.error) {
        throw new Error(res.error.message ?? res.error.error ?? "Gagal memperbarui wali kelas");
      }
      toast.success(nextAdvisorId ? "Wali kelas diperbarui" : "Wali kelas dihapus", {
        description: classData.name,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error("Gagal memperbarui wali kelas", {
        description: err instanceof Error ? err.message : "Kesalahan tidak diketahui",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleSave() {
    if (!advisorId) {
      toast.error("Pilih guru terlebih dahulu");
      return;
    }
    void submit(advisorId);
  }

  function handleRemove() {
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }
    void submit(null);
  }

  if (!classData) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setConfirmRemove(false);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f2ff] text-[#6c5dd3]">
            <GraduationCap className="size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-base font-bold text-[#181c20]">
              Atur Wali Kelas
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-5 text-[#787584]">
              Tetapkan satu guru sebagai wali kelas untuk rombel ini.
            </DialogDescription>
          </div>
        </div>

        <div className="rounded-xl border border-[#eef0f5] bg-[#f8f9fc] p-3">
          <p className="text-xs font-bold text-[#181c20]">{classData.name}</p>
          <p className="mt-1 text-[11px] text-[#787584]">
            {classData.gradeCode ?? classData.gradeName ?? "-"} •{" "}
            {classData.majorCode ?? classData.majorName ?? "-"} •{" "}
            {classData.studentCount}/{classData.capacity} siswa
          </p>
          <p className="mt-1 text-[11px] text-[#787584]">
            Wali saat ini:{" "}
            <span className="font-semibold text-[#181c20]">
              {classData.advisorName ?? "Belum ditetapkan"}
            </span>
          </p>
        </div>

        {confirmRemove ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <p>
              Hapus <strong>{classData.advisorName}</strong> sebagai wali kelas{" "}
              {classData.name}? Tindakan ini tidak menghapus akun guru.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#181c20]">Guru Wali Kelas</label>
            <SearchableDropdown
              value={advisorId}
              onChange={setAdvisorId}
              options={options}
              label={
                loading
                  ? "Memuat data guru..."
                  : options.length
                    ? "Pilih guru wali kelas"
                    : "Tidak ada guru aktif"
              }
              disabled={loading || submitting || !options.length}
              textClassName="text-[#64748B]"
            />
            {selectedTeacher ? (
              <p className="text-[11px] text-[#787584]">
                NIP {selectedTeacher.nomorInduk ?? "-"} • {selectedTeacher.majorName ?? "-"}
              </p>
            ) : null}
          </div>
        )}

        <DialogFooter className="mx-0 mb-0 flex flex-row items-center justify-between gap-3 border-t border-[#eceef3] bg-[#f8f9fc] px-0 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="rounded-xl border border-[#e0e2e7] px-4 py-2 text-xs font-semibold text-[#4e566c] hover:bg-[#f1f4f9] disabled:opacity-50"
            >
              Batal
            </button>
            {confirmRemove ? (
              <button
                type="button"
                onClick={() => setConfirmRemove(false)}
                disabled={submitting}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#4e566c] hover:bg-[#f1f4f9] disabled:opacity-50"
              >
                Batal hapus
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {classData.advisorId ? (
              <button
                type="button"
                onClick={handleRemove}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#ba1a1a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#93000a] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                {confirmRemove ? "Ya, Hapus" : "Hapus Wali"}
              </button>
            ) : null}
            {!confirmRemove ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={submitting || loading || !advisorId}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#6c5dd3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5343b9] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Simpan
              </button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
