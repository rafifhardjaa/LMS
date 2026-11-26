import type { StudentChatContact } from "@/lib/api/types";
import type { Conversation } from "./types";

const avatarPalettes = [
  "bg-[#DCFCE7] text-[#15803D]",
  "bg-[#E0F2FE] text-[#0369A1]",
  "bg-[#F3E8FF] text-[#9333EA]",
  "bg-[#FEF3C7] text-[#B45309]",
  "bg-[#FFE4E6] text-[#BE123C]",
  "bg-[#DBEAFE] text-[#1D4ED8]",
];

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function roleLabel(contact: Conversation | StudentChatContact) {
  const advisor = contact.roles.includes("advisor");
  const teacher = contact.roles.includes("teacher");
  if (advisor && teacher) return "Wali kelas · Guru";
  if (advisor) return "Wali kelas";
  if (teacher) {
    const subjects = contact.subjects ?? [];
    return subjects.length
      ? `Guru · ${subjects.map((subject) => subject.name).join(", ")}`
      : "Guru";
  }
  return `Siswa · ${contact.className}`;
}

export function identifierLabel(contact: Conversation | StudentChatContact) {
  if (!contact.identifier) return "-";
  return `${contact.kind === "student" ? "NISN" : "NIP"} ${contact.identifier}`;
}

export function buildStudentConversations(
  contacts: StudentChatContact[],
): Conversation[] {
  return contacts.map((contact, index) => ({
    id: contact.id,
    conversationId: null,
    contactId: contact.id,
    kind: contact.kind,
    name: contact.name,
    identifier: contact.identifier,
    roles: contact.roles,
    className: contact.className,
    subjects: contact.subjects ?? [],
    avatarClassName: avatarPalettes[index % avatarPalettes.length]!,
    lastMessage: "Belum ada pesan",
    lastMessageAt: null,
    unreadCount: 0,
    messages: [],
  }));
}
