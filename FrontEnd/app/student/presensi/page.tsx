import type { Metadata } from "next";
import { AttendancePage } from "@/components/student/attendance-page";

export const metadata: Metadata = {
  title: "Presensi",
};

export default function MuridPresensiPage() {
  return <AttendancePage />;
}
