import type { Metadata } from "next";
import { AnalyticsGrades } from "@/components/teacher/analytics-grades";

export const metadata: Metadata = {
  title: "Kelola Nilai Siswa | SIMANIS",
  description:
    "Dasbor capaian nilai, ketuntasan KKTP, dan tindak lanjut remedial siswa.",
};

export default function TeacherManageValuePage() {
  return <AnalyticsGrades />;
}
