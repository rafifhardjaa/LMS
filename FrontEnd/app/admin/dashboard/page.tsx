"use client";

import { DataChangeTrendChart } from "@/components/admin/data-change-trend-chart";
import { DataReadinessChart } from "@/components/admin/data-readiness-chart";
import { MetricCards } from "@/components/admin/metric-cards";
import { ScheduleCoverageChart } from "@/components/admin/schedule-coverage-chart";
import { TeachingLoadChart } from "@/components/admin/teaching-load-chart";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { useAuthStore } from "@/lib/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const fullName = user?.full_name?.trim() || "Admin";

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

      {/* Row 2: charts — satu grafik per menu admin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataReadinessChart />
        <TeachingLoadChart />
        <ScheduleCoverageChart />
        <DataChangeTrendChart />
      </div>
    </div>
  );
}
