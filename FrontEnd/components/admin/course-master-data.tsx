"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import type { GradeLevel, Major, Subject } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { SubjectsPanel } from "./master-data/subjects-panel";

export function CourseMasterData({
  refreshKey = 0,
}: {
  refreshKey?: number;
} = {}) {
  const role = useAuthStore((state) => state.user?.role ?? "admin");
  const isAdmin = role === "admin";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const includeInactive = isAdmin;
      const [majorRes, gradeRes, subjectRes] = await Promise.all([
        masterDataApi.majors.list(includeInactive),
        masterDataApi.gradeLevels.list(includeInactive),
        masterDataApi.subjects.list({ includeInactive }),
      ]);

      const firstError = majorRes.error ?? gradeRes.error ?? subjectRes.error;
      if (firstError) {
        setError(
          (firstError as { message?: string; error?: string }).message ??
            (firstError as { error?: string }).error ??
            "Gagal memuat data"
        );
      }

      setMajors(majorRes.data?.data ?? []);
      setGradeLevels(gradeRes.data?.data ?? []);
      setSubjects(subjectRes.data?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load, refreshKey]);

  if (loading && subjects.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#eef0f5] bg-white py-16 text-sm text-[#787584]">
        <Loader2 className="size-4 animate-spin" /> Memuat master data…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <p className="rounded-xl bg-[#fdecec] px-3 py-2 text-xs font-medium text-[#c0262d]">
          {error}
        </p>
      ) : null}
      <SubjectsPanel
        subjects={subjects}
        majors={majors}
        gradeLevels={gradeLevels}
        loading={loading}
        onReload={() => void load()}
      />
    </div>
  );
}
