import type { Metadata } from "next";
import { ExportRecap } from "@/components/teacher/export-recap";

export const metadata: Metadata = {
  title: "Rekap Rapor | SIMANIS",
  description:
    "Pusat unduhan leger nilai, rekap presensi, dan berkas sinkronisasi Dapodik serta e-Rapor.",
};

export default function TeacherRekapRaporPage() {
  return <ExportRecap />;
}
