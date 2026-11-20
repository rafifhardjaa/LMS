import type { Metadata } from "next";
import { TaskMaterialManagement } from "@/components/teacher/task-material-management";

export const metadata: Metadata = {
  title: "Kelola Tugas & Penilaian Siswa",
};

export default function ManageTaskPage() {
  return <TaskMaterialManagement />;
}
