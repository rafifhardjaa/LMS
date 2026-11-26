export type MessageDirection = "incoming" | "outgoing";

export type ChatMessage = {
  id: string;
  direction: MessageDirection;
  body: string;
  sentAt: string;
  clientMessageId?: string;
};

export type ChatClass = {
  id: string;
  name: string;
  gradeCode: string | null;
  section: string | null;
  studentCount: number;
  isAdvisor: boolean;
};

export type Conversation = {
  id: string;
  conversationId: string | null;
  studentId: string;
  classId: string;
  name: string;
  nisn: string;
  className: string;
  avatarClassName: string;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
  messages: ChatMessage[];
};
