"use client";

import { useEffect, useState } from "react";
import { StudentsTable } from "@/components/admin/students-table";
import { AddStudentDialog } from "@/components/admin/add-student-dialog";
import { AddStudentPlacementDialog } from "@/components/admin/add-student-placement-dialog";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";

export default function StudentsPage() {
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    masterDataApi.students
      .stats()
      .then((res) => {
        if (active) setTotalStudents(res.data?.data?.total ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return (
    <div className="flex w-full flex-col gap-7 pt-4">
      <FadeIn>
        <div className="flex flex-col gap-5">
          <SlideIn direction="left">
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[32px]">Manajemen Siswa &amp; Peserta Didik</h1>
            <p className="mt-2 text-sm leading-6 text-[#4e566c]">Kelola data {totalStudents !== null ? totalStudents.toLocaleString("id-ID") : "…"} siswa aktif, distribusi rombel kelas, status aktivasi akun SSO Dapodik, dan rekap kelengkapan administrasi peserta didik SMK Mataram.</p>
          </SlideIn>
        </div>
      </FadeIn>
      <FadeIn>
        <StudentsTable
          key={refreshKey}
          onAddStudent={() => setAddStudentOpen(true)}
          onPlacement={() => setPlacementOpen(true)}
        />
      </FadeIn>

      <AddStudentDialog
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        onSuccess={() => setRefreshKey((key) => key + 1)}
      />

      <AddStudentPlacementDialog
        open={placementOpen}
        onOpenChange={setPlacementOpen}
        onSuccess={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  );
}
