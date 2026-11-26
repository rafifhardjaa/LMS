import type { Metadata } from "next";
import { TeacherChat } from "@/components/teacher/chat";

export const metadata: Metadata = {
  title: "Chat Guru | SIMANIS",
  description: "Pusat percakapan guru dengan siswa di kelas yang diampu.",
};

export default function TeacherChatPage() {
  return <TeacherChat />;
}
