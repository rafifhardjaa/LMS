import type { Metadata } from "next";
import { ModulesManagement } from "@/components/teacher/modul-management";

export const metadata: Metadata = {
  title: "Modul Ajar",
};

export default function ModulPage() {
  return <ModulesManagement />;
}
