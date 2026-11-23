import type { Metadata } from "next";
import { ModulesManagement } from "@/components/student/modul-management";

export const metadata: Metadata = {
  title: "Modul & Course",
};

export default function MuridModulesPage() {
  return <ModulesManagement />;
}
