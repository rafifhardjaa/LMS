import type { Metadata } from "next";
import { StudentChat } from "@/components/student/chat";

export const metadata: Metadata = {
  title: "Chat Siswa | SIMANIS",
  description: "Pusat percakapan siswa dengan teman sekelas, wali kelas, dan guru mapel.",
};

export default function StudentChatPage() {
  return <StudentChat />;
}
