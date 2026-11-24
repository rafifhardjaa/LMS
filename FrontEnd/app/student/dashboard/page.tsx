"use client";

import { FadeIn } from "@/components/ui/animations";
import { StudentPageHeader } from "@/components/student/page-header";
import { Schedule } from "@/components/student/schedule";
import { Trajectory } from "@/components/student/trajectory";

export default function MuridDashboardPage() {
  return (
    <FadeIn>
      <div className="flex flex-col gap-6">
        <StudentPageHeader
          title={"Dashboard Siswa"}
          description="Pantau jadwal pelajaran kelasmu dan lanjutkan kegiatan belajar dari satu tempat."
        />
        <Schedule />
        <Trajectory />
      </div>
    </FadeIn>
  );
}
