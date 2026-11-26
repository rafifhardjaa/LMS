import type { StudentSummary } from "@/lib/api/master-data";
import type { Conversation } from "./types";

const avatarPalettes = [
  "bg-[#FFEBEB] text-[#b71422]",
  "bg-[#E0F2FE] text-[#0369A1]",
  "bg-[#DCFCE7] text-[#15803D]",
  "bg-[#F3E8FF] text-[#9333EA]",
  "bg-[#FEF3C7] text-[#B45309]",
  "bg-[#DBEAFE] text-[#1D4ED8]",
];

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function buildConversations(
  students: StudentSummary[],
  className: string,
  classId: string,
  seedOffset = 0,
): Conversation[] {
  return students.map((student, index) => {
    const adjustedIndex = index + seedOffset;
    return {
      id: student.id,
      conversationId: null,
      studentId: student.id,
      classId,
      name: student.fullName,
      nisn: student.nisn ?? student.nomorInduk ?? "-",
      className,
      avatarClassName:
        avatarPalettes[adjustedIndex % avatarPalettes.length]!,
      lastMessage: "Belum ada pesan",
      lastMessageAt: null,
      unreadCount: 0,
      messages: [],
    };
  });
}
