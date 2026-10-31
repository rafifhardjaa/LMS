import type { Metadata } from "next";
import { AttendanceManagement } from "@/components/teacher/attendance-management";

export const metadata: Metadata = {
  title: "Presensi & Siswa | SIMANIS",
  description:
    "Pencatatan kehadiran kelas, monitoring sakit dan dispensasi, serta finalisasi presensi siswa.",
};

export default function TeacherAttendancePage() {
  return <AttendanceManagement />;
}
