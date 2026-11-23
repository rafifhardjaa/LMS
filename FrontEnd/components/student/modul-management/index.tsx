"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/animations";
import { masterDataApi, type JadwalPelajaran } from "@/lib/api/master-data";
import { modulesApi } from "@/lib/api/client";
import type { BackendModule } from "@/lib/api/types";
import { useAuthStore } from "@/lib/store/auth-store";
import { StudentModulesHeader } from "./modules-header";
import { JadwalTable, type StudentCourseRow } from "./jadwal-table";
import { JadwalAnalyticsPanel } from "./jadwal-analytics-panel";

export function ModulesManagement() {
  const user = useAuthStore((state) => state.user);
  const [rows, setRows] = useState<JadwalPelajaran[]>([]);
  const [modules, setModules] = useState<BackendModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user.kelas) {
          setRows([]);
          setModules([]);
          setError("Kelas siswa belum diatur. Hubungi admin sekolah.");
          return;
        }

        const classRes = await masterDataApi.classes.list();
        if (!active) return;
        if (classRes.error) {
          throw new Error(classRes.error.message ?? "Gagal memuat data kelas.");
        }

        const found = (classRes.data?.data ?? []).find((item) => item.name === user.kelas);
        if (!found) {
          setRows([]);
          setModules([]);
          setError("Kelas siswa tidak ditemukan.");
          return;
        }

        const [jadwalRes, modulesRes] = await Promise.all([
          masterDataApi.jadwalPelajaran.list({ classId: found.id, activeOnly: true }),
          modulesApi.list(),
        ]);
        if (!active) return;

        const firstError = jadwalRes.error ?? modulesRes.error;
        if (firstError) {
          throw new Error(
            firstError.message ?? firstError.error ?? "Gagal memuat jadwal kelas."
          );
        }

        setRows(jadwalRes.data?.data ?? []);
        setModules(modulesRes.data?.data ?? []);
        setError(null);
      } catch (err) {
        if (active) {
          setRows([]);
          setModules([]);
          setError(err instanceof Error ? err.message : "Gagal memuat jadwal kelas.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [user]);

  const rowsWithModule = useMemo<StudentCourseRow[]>(() => {
    const firstBySubject = new Map<string, string>();
    const ordered = [...modules].sort((first, second) => first.order_index - second.order_index);
    for (const moduleItem of ordered) {
      if (moduleItem.subject_id && !firstBySubject.has(moduleItem.subject_id)) {
        firstBySubject.set(moduleItem.subject_id, moduleItem.id);
      }
    }
    return rows.map((row) => ({
      ...row,
      moduleId: firstBySubject.get(row.subjectId) ?? null,
    }));
  }, [modules, rows]);

  return (
    <div className="flex w-full flex-col gap-5 text-[#1E293B]">
      <StudentModulesHeader />

      <AnimatePresence mode="wait">
        {error ? (
          <FadeIn key="error">
            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#b91c1c]">
              {error}
            </div>
          </FadeIn>
        ) : loading ? (
          <FadeIn key="loading">
            <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <div className="animate-pulse space-y-3 border-b border-[#E2E8F0] px-5 py-4">
                <div className="h-4 w-1/3 rounded bg-[#E2E8F0]" />
                <div className="h-3 w-1/4 rounded bg-[#E2E8F0]" />
              </div>
              <div className="animate-pulse space-y-2 p-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="h-8 w-full rounded bg-[#F1F5F9]" />
                ))}
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn key="table">
            <JadwalTable rows={rowsWithModule} />
          </FadeIn>
        )}
      </AnimatePresence>

      {!loading && !error ? (
        <FadeIn delay={0.1}>
          <JadwalAnalyticsPanel rows={rows} />
        </FadeIn>
      ) : null}
    </div>
  );
}
