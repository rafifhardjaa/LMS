"use client";

import { useEffect, useMemo, useState } from "react";
import { TeachersTable } from "@/components/admin/teachers-table";
import { AddTeacherDialog } from "@/components/admin/add-teacher-dialog";
import { AddPlacementDialog } from "@/components/admin/add-placement-dialog";
import { TeacherMajorDistributionChart, type TeacherMajorDatum } from "@/components/admin/teacher-major-distribution-chart";
import { TeachingLoadChart } from "@/components/admin/teaching-load-chart";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { dashboardApi, type TeachingLoadDatum } from "@/lib/api/dashboard";
import { masterDataApi } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";

export default function TeachersPage() {
  const role = useAuthStore((state) => state.user?.role ?? "admin");
  const isAdmin = role === "admin";
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [teachingLoad, setTeachingLoad] = useState<TeachingLoadDatum[]>();
  const [majorDistribution, setMajorDistribution] = useState<TeacherMajorDatum[]>();
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadCharts = async () => {
      try {
        setChartsLoading(true);
        setChartsError(null);
        const [statsRes, teachersRes] = await Promise.all([
          dashboardApi.stats(),
          masterDataApi.teachers.list(),
        ]);
        if (!active) return;

        if (statsRes.error || teachersRes.error) {
          throw new Error(
            statsRes.error?.message ??
              teachersRes.error?.message ??
              "Gagal memuat grafik guru.",
          );
        }

        setTeachingLoad(statsRes.data?.data?.teachingLoad ?? []);

        const counts = new Map<string, number>();
        for (const teacher of teachersRes.data?.data ?? []) {
          const major = teacher.majorCode || teacher.majorName || "Tanpa Jurusan";
          counts.set(major, (counts.get(major) ?? 0) + 1);
        }
        setMajorDistribution(
          [...counts.entries()]
            .map(([major, total]) => ({ major, total }))
            .sort((first, second) => second.total - first.total || first.major.localeCompare(second.major)),
        );
      } catch (err) {
        if (active) {
          setChartsError(err instanceof Error ? err.message : "Gagal memuat grafik guru.");
          setTeachingLoad([]);
          setMajorDistribution([]);
        }
      } finally {
        if (active) setChartsLoading(false);
      }
    };

    void loadCharts();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const chartGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TeachingLoadChart data={teachingLoad} loading={chartsLoading} />
        <TeacherMajorDistributionChart
          data={majorDistribution}
          loading={chartsLoading}
        />
      </div>
    ),
    [chartsLoading, majorDistribution, teachingLoad],
  );

  return (
    <div className="flex w-full flex-col gap-7 pt-4">
      <FadeIn>
        <div className="flex flex-col gap-5">
          <SlideIn direction="left">
            <div className="max-w-[440px]">
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[32px]">Manajemen Tenaga Pendidik & Guru</h1>
              <p className="mt-2 text-sm leading-6 text-[#4e566c]">Kelola data guru pengampu, distribusi mata pelajaran, status beban mengajar (Jam Pelajaran), dan akun Dapodik SMK Mataram.</p>
            </div>
          </SlideIn>
        </div>
      </FadeIn>

      {chartsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {chartsError}
        </div>
      ) : null}

      {chartGrid}

      <FadeIn>
        <TeachersTable
          key={refreshKey}
          isAdmin={isAdmin}
          onTeacherAdded={() => setRefreshKey(k => k + 1)}
          onAddTeacher={() => setAddTeacherOpen(true)}
          onPlacement={() => setPlacementOpen(true)}
        />
      </FadeIn>

      <AddTeacherDialog open={addTeacherOpen} onOpenChange={setAddTeacherOpen} onSuccess={() => setRefreshKey(k => k + 1)} />
      <AddPlacementDialog open={placementOpen} onOpenChange={setPlacementOpen} onSuccess={() => setRefreshKey(k => k + 1)} />
    </div>
  );
}
