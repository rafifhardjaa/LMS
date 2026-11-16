"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";
import type { JadwalPelajaran } from "@/lib/api/master-data";
import { AdminPanel } from "./admin-panel";
import { CourseTable } from "./course-table";
import { CurriculumPanel } from "./curriculum-panel";
import { DapodikPanel } from "./dapodik-panel";
import { KpiGrid } from "./kpi-grid";
import { ModulesHeader } from "./modules-header";
import { adminItems, curriculumModules } from "./data";
import type { Kpi } from "./types";

export function ModulesManagement() {
  const [rows, setRows] = useState<JadwalPelajaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await masterDataApi.jadwalPelajaran.list({ activeOnly: true });
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat jadwal pelajaran");
        }
        setRows(res.data?.data ?? []);
        setError(null);
      } catch (err) {
        console.error("Error loading modules:", err);
        if (active) {
          setRows([]);
          setError("Tidak dapat memuat data modul. Silakan coba lagi.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const subjectCount = new Set(rows.map((row) => row.subjectId)).size;
  const classCount = new Set(rows.map((row) => row.classId)).size;
  const majorCount = new Set(
    rows.map((row) => row.majorCode).filter(Boolean),
  ).size;

  const kpis: Kpi[] = [
    {
      label: "Total Mata Pelajaran",
      value: String(subjectCount),
      unit: "Mapel Diampu",
      unitClassName: "text-[#b71422]",
      icon: BookOpen,
      tone: "primary",
      footerLeft: `${majorCount} Jurusan`,
      dotClassName: "bg-[#22C55E]",
    },
    {
      label: "Rombel Kelas Diajar",
      value: String(classCount),
      unit: "Kelas Aktif",
      unitClassName: "text-[#006398]",
      icon: Users,
      tone: "blue",
      footerLeft: `${rows.length} Sesi Aktif`,
      footerRight: `${majorCount} Jurusan`,
      footerRightClassName: "text-[#1E293B]",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <ModulesHeader sessionCount={rows.length} />

      <KpiGrid kpis={kpis} />

      {error ? (
        <FadeIn>
          <div className="rounded-2xl bg-[#FEE2E2] px-4 py-3 text-[13px] text-[#b91c1c] shadow-sm">
            {error}
          </div>
        </FadeIn>
      ) : loading ? (
        <FadeIn>
          <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="animate-pulse space-y-3 border-b border-[#E2E8F0] px-5 py-4">
              <div className="h-4 w-1/3 rounded bg-[#E2E8F0]" />
              <div className="h-3 w-1/4 rounded bg-[#E2E8F0]" />
            </div>
            <div className="animate-pulse space-y-2 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="h-8 w-full rounded bg-[#F1F5F9]" />
              ))}
            </div>
          </div>
        </FadeIn>
      ) : (
        <CourseTable rows={rows} />
      )}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <FadeIn delay={0.1} className="lg:col-span-7">
          <CurriculumPanel modules={curriculumModules} />
        </FadeIn>

        <FadeIn delay={0.16} className="flex flex-col gap-4 lg:col-span-5">
          <AdminPanel items={adminItems} />
          <DapodikPanel courseCount={classCount} />
        </FadeIn>
      </div>
    </div>
  );
}
