import type { Metadata } from "next";
import { AnalyticsGrades } from "@/components/teacher/analytics-grades";

export const metadata: Metadata = {
  title: "Analitik & Nilai | SIMANIS",
  description:
    "Dasbor analitik capaian, ketuntasan KKTP, dan tindak lanjut remedial siswa.",
};

export default function TeacherAnalyticsPage() {
  return <AnalyticsGrades />;
}
