"use client";

import { useEffect, useState } from "react";
import { DataReadinessChart } from "@/components/admin/data-readiness-chart";
import { MetricCards } from "@/components/admin/metric-cards";
import { ScheduleCoverageChart } from "@/components/admin/schedule-coverage-chart";
import { StudentDistributionChart } from "@/components/admin/student-distribution-chart";
import { TeachingLoadChart } from "@/components/admin/teaching-load-chart";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { dashboardApi } from "@/lib/api/dashboard";
import type { DashboardStats } from "@/lib/api/dashboard";
import { useAuthStore } from "@/lib/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const fullName = user?.full_name?.trim() || "Admin";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await dashboardApi.stats();
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat data grafik");
        }
        setStats(res.data?.data ?? null);
        setChartsError(null);
      } catch (error) {
        console.error("Error loading dashboard charts:", error);
        if (active) {
          setStats(null);
          setChartsError("Tidak dapat memuat data grafik. Silakan coba lagi.");
        }
      } finally {
        if (active) setChartsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-7 pt-4">
      {/* Greeting header */}
      <FadeIn>
        <div className="flex flex-col">
          <SlideIn direction="left">
            <h1 className="text-[26px] font-bold tracking-tight">
              Selamat datang, {fullName}! 👋
            </h1>
            <p className="text-sm text-[#4e566c]">
              Ringkasan pengelolaan LMS SMK Mataram • Tahun Ajaran 2026/2027
            </p>
          </SlideIn>
        </div>
      </FadeIn>

      {/* Row 1: metric cards */}
      <MetricCards />

      {chartsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {chartsError}
        </div>
      )}

      {/* Row 2: charts — satu grafik per menu admin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataReadinessChart
          data={stats?.readiness}
          loading={chartsLoading}
        />
        <TeachingLoadChart
          data={stats?.teachingLoad}
          loading={chartsLoading}
        />
        <ScheduleCoverageChart
          data={stats?.scheduleCoverage}
          loading={chartsLoading}
        />
        <StudentDistributionChart
          data={stats?.studentDistribution}
          loading={chartsLoading}
        />
      </div>
    </div>
  );
}
