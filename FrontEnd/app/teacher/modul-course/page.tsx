import type { Metadata } from "next";
import { ModulesManagement } from "@/components/teacher/modul-management";

export const metadata: Metadata = {
  title: "Modul & Course",
};

export default function ModulCoursePage() {
  return <ModulesManagement />;
}
