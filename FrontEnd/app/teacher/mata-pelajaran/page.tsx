import type { Metadata } from "next";
import { SubjectManagement } from "@/components/teacher/subject-management";

export const metadata: Metadata = {
  title: "Mata Pelajaran & Kurikulum",
};

export default function MataPelajaranPage() {
  return <SubjectManagement />;
}
