"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type {
  GradeLevel,
  Major,
  SchoolClass,
  Subject,
  TeacherClassroomAssignment,
  TeacherSubjectAssignment,
  TeacherSummary,
} from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { MajorsPanel } from "./master-data/majors-panel";
import { GradeLevelsPanel } from "./master-data/grade-levels-panel";
import { ClassesPanel } from "./master-data/classes-panel";
import { SubjectsPanel } from "./master-data/subjects-panel";
import { AssignmentsPanel } from "./master-data/assignments-panel";

const tabs = [
  { id: "subjects", label: "Mata Pelajaran" },
  { id: "majors", label: "Jurusan" },
  { id: "grades", label: "Tingkatan" },
  { id: "classes", label: "Kelas" },
  { id: "assignments", label: "Guru Pengampu" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CourseMasterData() {
  const role = useAuthStore((state) => state.user?.role ?? "admin");
  const isAdmin = role === "admin";
  const canSeeAssignments = role === "admin" || role === "guru";

  const [tab, setTab] = useState<TabId>("subjects");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<
    TeacherSubjectAssignment[]
  >([]);
  const [teacherClassrooms, setTeacherClassrooms] = useState<
    TeacherClassroomAssignment[]
  >([]);
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const includeInactive = isAdmin;
      const [majorRes, gradeRes, classRes, subjectRes] = await Promise.all([
        masterDataApi.majors.list(includeInactive),
        masterDataApi.gradeLevels.list(includeInactive),
        masterDataApi.classes.list({ includeInactive }),
        masterDataApi.subjects.list({ includeInactive }),
      ]);

      const firstError =
        majorRes.error ?? gradeRes.error ?? classRes.error ?? subjectRes.error;
      if (firstError) {
        setError(
          (firstError as { message?: string; error?: string }).message ??
            (firstError as { error?: string }).error ??
            "Gagal memuat data"
        );
      }

      setMajors(majorRes.data?.data ?? []);
      setGradeLevels(gradeRes.data?.data ?? []);
      setClasses(classRes.data?.data ?? []);
      setSubjects(subjectRes.data?.data ?? []);

      if (canSeeAssignments) {
        const [subjectAssign, classAssign] = await Promise.all([
          masterDataApi.teacherAssignments.listSubjects(),
          masterDataApi.teacherAssignments.listClasses(),
        ]);
        setTeacherSubjects(subjectAssign.data?.data ?? []);
        setTeacherClassrooms(classAssign.data?.data ?? []);
      }

      if (role !== "siswa") {
        const teacherRes = await masterDataApi.teachers.list();
        setTeachers(teacherRes.data?.data ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [canSeeAssignments, isAdmin, role]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const stats = useMemo(() => {
    const activeSubjects = subjects.filter((s) => s.isActive);
    return {
      subjects: activeSubjects.length,
      vocational: activeSubjects.filter((s) => s.majorId).length,
      majors: majors.filter((m) => m.isActive).length,
      classes: classes.filter((c) => c.isActive).length,
      teachers: teachers.length,
    };
  }, [subjects, majors, classes, teachers]);

  const visibleTabs = useMemo(
    () => tabs.filter((item) => canSeeAssignments || item.id !== "assignments"),
    [canSeeAssignments]
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          icon={<BookOpen className="size-5" />}
          label="Mapel Aktif"
          value={stats.subjects}
        />
        <StatCard
          icon={<Layers className="size-5" />}
          label="Mapel Kejuruan"
          value={stats.vocational}
        />
        <StatCard
          icon={<Building2 className="size-5" />}
          label="Jurusan"
          value={stats.majors}
        />
        <StatCard
          icon={<GraduationCap className="size-5" />}
          label="Kelas"
          value={stats.classes}
        />
        <StatCard
          icon={<Users className="size-5" />}
          label="Guru"
          value={stats.teachers}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eceef3] px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-1 rounded-full bg-[#f1f4f9] p-1">
            {visibleTabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-3.5 py-2 text-[11px] font-semibold transition ${
                  tab === item.id
                    ? "bg-[#5343b9] text-white shadow-sm"
                    : "text-[#4e566c] hover:bg-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 self-start rounded-full bg-[#f1f4f9] px-3 text-xs font-semibold text-[#4e566c] hover:bg-[#eceef3] disabled:opacity-60 sm:self-auto"
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            Muat ulang
          </button>
        </div>

        {error ? (
          <p className="mx-4 mt-4 rounded-xl bg-[#fdecec] px-3 py-2 text-xs font-medium text-[#c0262d]">
            {error}
          </p>
        ) : null}

        <div className="p-4">
          {loading && subjects.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#787584]">
              <Loader2 className="size-4 animate-spin" /> Memuat master data…
            </div>
          ) : (
            <>
              {tab === "subjects" ? (
                <SubjectsPanel
                  subjects={subjects}
                  majors={majors}
                  gradeLevels={gradeLevels}
                  isAdmin={isAdmin}
                  onChanged={load}
                />
              ) : null}
              {tab === "majors" ? (
                <MajorsPanel
                  majors={majors}
                  isAdmin={isAdmin}
                  onChanged={load}
                />
              ) : null}
              {tab === "grades" ? (
                <GradeLevelsPanel
                  gradeLevels={gradeLevels}
                  isAdmin={isAdmin}
                  onChanged={load}
                />
              ) : null}
              {tab === "classes" ? (
                <ClassesPanel
                  classes={classes}
                  majors={majors}
                  gradeLevels={gradeLevels}
                  isAdmin={isAdmin}
                  onChanged={load}
                />
              ) : null}
              {tab === "assignments" && canSeeAssignments ? (
                <AssignmentsPanel
                  teachers={teachers}
                  subjects={subjects}
                  classes={classes}
                  teacherSubjects={teacherSubjects}
                  teacherClassrooms={teacherClassrooms}
                  isAdmin={isAdmin}
                  onChanged={load}
                />
              ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#eef0f5] bg-white p-4 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4e566c]">
          {label}
        </p>
        <span className="flex size-8 items-center justify-center rounded-xl bg-[#f4f2ff] text-[#6c5dd3]">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#181c20]">{value}</p>
    </div>
  );
}
