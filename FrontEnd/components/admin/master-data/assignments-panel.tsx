"use client";

import { useMemo, useState } from "react";
import { BookOpen, CirclePlus, GraduationCap, Search, Trash2 } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type {
  SchoolClass,
  Subject,
  TeacherClassroomAssignment,
  TeacherSubjectAssignment,
  TeacherSummary,
} from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { PanelCard, PanelHeader, tdClass, thClass } from "./panel-ui";

export function AssignmentsPanel({
  teachers,
  subjects,
  classes,
  teacherSubjects,
  teacherClassrooms,
  isAdmin,
  onChanged,
}: {
  teachers: TeacherSummary[];
  subjects: Subject[];
  classes: SchoolClass[];
  teacherSubjects: TeacherSubjectAssignment[];
  teacherClassrooms: TeacherClassroomAssignment[];
  isAdmin: boolean;
  onChanged: () => Promise<void> | void;
}) {
  const currentUser = useAuthStore((state) => state.user);
  const [query, setQuery] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [subjectToAdd, setSubjectToAdd] = useState("");
  const [classToAdd, setClassToAdd] = useState("");
  const [busy, setBusy] = useState(false);

  const teacherId = isAdmin
    ? selectedTeacherId || teachers[0]?.id || ""
    : currentUser?.id ?? "";

  const teacherRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers.filter(
      (t) =>
        !q ||
        t.fullName.toLowerCase().includes(q) ||
        (t.nomorInduk ?? "").toLowerCase().includes(q)
    );
  }, [teachers, query]);

  const assignedSubjects = useMemo(
    () => teacherSubjects.filter((item) => item.teacherId === teacherId),
    [teacherSubjects, teacherId]
  );
  const assignedClasses = useMemo(
    () => teacherClassrooms.filter((item) => item.teacherId === teacherId),
    [teacherClassrooms, teacherId]
  );

  const availableSubjects = useMemo(() => {
    const assignedIds = new Set(assignedSubjects.map((item) => item.subjectId));
    return subjects.filter((s) => !assignedIds.has(s.id));
  }, [subjects, assignedSubjects]);

  const availableClasses = useMemo(() => {
    const assignedIds = new Set(assignedClasses.map((item) => item.classId));
    return classes.filter((c) => !assignedIds.has(c.id));
  }, [classes, assignedClasses]);

  const selectedTeacher =
    teachers.find((t) => t.id === teacherId) ??
    (currentUser ? { fullName: currentUser.name ?? "Guru" } : null);

  const assignSubject = async () => {
    if (!teacherId || !subjectToAdd) return;
    setBusy(true);
    const result = await masterDataApi.teacherAssignments.assignSubject({
      teacherId,
      subjectId: subjectToAdd,
    });
    setBusy(false);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ?? "Gagal menugaskan mapel"
      );
      return;
    }
    setSubjectToAdd("");
    await onChanged();
  };

  const assignClass = async () => {
    if (!teacherId || !classToAdd) return;
    setBusy(true);
    const result = await masterDataApi.teacherAssignments.assignClass({
      teacherId,
      classId: classToAdd,
    });
    setBusy(false);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ?? "Gagal menugaskan kelas"
      );
      return;
    }
    setClassToAdd("");
    await onChanged();
  };

  const removeSubject = async (id: string) => {
    if (!window.confirm("Hapus penugasan mata pelajaran ini?")) return;
    const result = await masterDataApi.teacherAssignments.removeSubject(id);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ?? "Gagal menghapus"
      );
      return;
    }
    await onChanged();
  };

  const removeClass = async (id: string) => {
    if (!window.confirm("Hapus penugasan kelas ini?")) return;
    const result = await masterDataApi.teacherAssignments.removeClass(id);
    if (result.error) {
      window.alert(
        (result.error as { message?: string }).message ?? "Gagal menghapus"
      );
      return;
    }
    await onChanged();
  };

  return (
    <div
      className={`grid grid-cols-1 items-start gap-4 ${
        isAdmin ? "xl:grid-cols-[300px_minmax(0,1fr)]" : ""
      }`}
    >
      {isAdmin ? (
      <PanelCard>
        <PanelHeader title="Guru" count={teacherRows.length} />
        <div className="p-3">
          <label className="relative block">
            <span className="sr-only">Cari guru</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#4e566c]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau NIP…"
              className="h-9 w-full rounded-full bg-[#f1f4f9] pl-9 pr-3 text-xs outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
            />
          </label>
          <div className="mt-2 max-h-[520px] space-y-1 overflow-y-auto">
            {teacherRows.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => setSelectedTeacherId(teacher.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition ${
                  teacherId === teacher.id
                    ? "bg-[#f0edff] text-[#4331a8]"
                    : "text-[#181c20] hover:bg-[#f8f9fc]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {teacher.fullName}
                  </span>
                  <span className="block truncate text-[10px] text-[#787584]">
                    {teacher.nomorInduk ?? "—"}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold">
                  {teacher.subjectCount} mapel
                </span>
              </button>
            ))}
            {teacherRows.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-[#787584]">
                Guru tidak ditemukan.
              </p>
            ) : null}
          </div>
        </div>
      </PanelCard>
      ) : null}

      <div className="flex flex-col gap-4">
        <PanelCard>
          <PanelHeader
            title="Mata Pelajaran Diampu"
            subtitle={selectedTeacher?.fullName ?? "Pilih guru"}
            count={assignedSubjects.length}
          />
          <div className="flex flex-col gap-2 border-b border-[#eceef3] p-3 sm:flex-row">
            <select
              value={subjectToAdd}
              onChange={(e) => setSubjectToAdd(e.target.value)}
              disabled={!isAdmin || !teacherId}
              className="h-10 flex-1 rounded-full bg-[#f1f4f9] px-3 text-xs text-[#181c20] outline-none disabled:opacity-60"
            >
              <option value="">Pilih mata pelajaran…</option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} — {subject.name}
                  {subject.majorCode ? ` (${subject.majorCode})` : ""}
                </option>
              ))}
            </select>
            {isAdmin ? (
              <button
                type="button"
                disabled={busy || !subjectToAdd}
                onClick={() => void assignSubject()}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#5343b9] px-4 text-xs font-semibold text-white hover:bg-[#4331a8] disabled:opacity-50"
              >
                <CirclePlus className="size-3.5" /> Tugaskan
              </button>
            ) : null}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left">
              <thead className="bg-[#f1f4f9]">
                <tr>
                  <th className={thClass}>Kode</th>
                  <th className={thClass}>Mata Pelajaran</th>
                  {isAdmin ? <th className={thClass}>Aksi</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef3]">
                {assignedSubjects.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbfcfd]">
                    <td className={tdClass}>
                      <span className="rounded-full bg-[#f0edff] px-2 py-1 text-[10px] font-bold text-[#6c5dd3]">
                        {item.subjectCode ?? "—"}
                      </span>
                    </td>
                    <td className={`${tdClass} font-semibold`}>
                      {item.subjectName ?? "—"}
                    </td>
                    {isAdmin ? (
                      <td className={tdClass}>
                        <button
                          type="button"
                          aria-label="Hapus penugasan"
                          onClick={() => void removeSubject(item.id)}
                          className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#fdecec] hover:text-[#c0262d]"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
                {assignedSubjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 3 : 2}
                      className="px-3 py-8 text-center text-xs text-[#787584]"
                    >
                      <BookOpen className="mx-auto mb-2 size-5 text-[#a39afd]" />
                      Belum ada mata pelajaran yang diampu.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard>
          <PanelHeader
            title="Kelas Diampu"
            subtitle={selectedTeacher?.fullName ?? "Pilih guru"}
            count={assignedClasses.length}
          />
          <div className="flex flex-col gap-2 border-b border-[#eceef3] p-3 sm:flex-row">
            <select
              value={classToAdd}
              onChange={(e) => setClassToAdd(e.target.value)}
              disabled={!isAdmin || !teacherId}
              className="h-10 flex-1 rounded-full bg-[#f1f4f9] px-3 text-xs text-[#181c20] outline-none disabled:opacity-60"
            >
              <option value="">Pilih kelas…</option>
              {availableClasses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.majorCode ?? "—"} {item.gradeCode ?? ""}
                </option>
              ))}
            </select>
            {isAdmin ? (
              <button
                type="button"
                disabled={busy || !classToAdd}
                onClick={() => void assignClass()}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#5343b9] px-4 text-xs font-semibold text-white hover:bg-[#4331a8] disabled:opacity-50"
              >
                <CirclePlus className="size-3.5" /> Tugaskan
              </button>
            ) : null}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left">
              <thead className="bg-[#f1f4f9]">
                <tr>
                  <th className={thClass}>Kelas</th>
                  <th className={thClass}>Jurusan</th>
                  <th className={thClass}>Tingkatan</th>
                  {isAdmin ? <th className={thClass}>Aksi</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef3]">
                {assignedClasses.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbfcfd]">
                    <td className={`${tdClass} font-semibold`}>
                      {item.className ?? "—"}
                    </td>
                    <td className={tdClass}>{item.majorCode ?? "—"}</td>
                    <td className={tdClass}>{item.gradeCode ?? "—"}</td>
                    {isAdmin ? (
                      <td className={tdClass}>
                        <button
                          type="button"
                          aria-label="Hapus penugasan"
                          onClick={() => void removeClass(item.id)}
                          className="flex size-8 items-center justify-center rounded-full text-[#4e566c] hover:bg-[#fdecec] hover:text-[#c0262d]"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
                {assignedClasses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 4 : 3}
                      className="px-3 py-8 text-center text-xs text-[#787584]"
                    >
                      <GraduationCap className="mx-auto mb-2 size-5 text-[#a39afd]" />
                      Belum ada kelas yang diampu.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
