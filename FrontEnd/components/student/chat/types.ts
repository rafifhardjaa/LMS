import type {
  StudentChatContact,
  StudentChatContactRole,
  StudentChatSubject,
} from "@/lib/api/types";

export type MessageDirection = "incoming" | "outgoing";

export type ChatMessage = {
  id: string;
  direction: MessageDirection;
  body: string;
  sentAt: string;
  clientMessageId?: string;
};

export type Conversation = {
  id: string;
  conversationId: string | null;
  contactId: string;
  kind: StudentChatContact["kind"];
  name: string;
  identifier: string | null;
  roles: StudentChatContactRole[];
  className: string;
  subjects: StudentChatSubject[];
  avatarClassName: string;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
  messages: ChatMessage[];
  hasMore?: boolean;
  nextBefore?: string | null;
};

export type ContactFilter = "all" | "classmates" | "teachers" | "advisor";
