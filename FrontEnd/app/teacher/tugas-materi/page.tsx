import type { Metadata } from "next";
import { TaskMaterialManagement } from "@/components/teacher/task-material-management";

export const metadata: Metadata = {
  title: "Tugas & Materi Pembelajaran",
};

export default function TugasMateriPage() {
  return <TaskMaterialManagement />;
}
