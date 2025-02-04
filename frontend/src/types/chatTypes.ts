export interface addIndividualChatPayload {
  isGroupChat: boolean;
  participants: string[];
}

export interface addGroupChatPayload {
  isGroupChat: boolean;
  groupName: string;
  participants: string[];
}

export type Message = {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  fileName: string;
  sender: {
    userName: string;
    profileImage: string;
  };
  readBy: string[];
  mediaUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type Chat = {
  id: string;
  groupName?: string;
  chatType: "GROUP" | "INDIVIDUAL";
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  profileImage: string;
};

export type LatestMessage = {
  id: string;
  type: "TEXT" | "IMAGE" | "FILE";
  content: string | null;
  mediaUrl: string | null;
  fileName: string | null;
  timestamp: string; // ISO date string
  senderId: string;
};

export type ChatDetails = {
  id: string;
  isGroupChat: boolean;
  groupName: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  latestMessage: LatestMessage | null;
  unreadCount: number;
};

// types/chatTypes.ts

export interface ChatState {
  selectedChatDetails: Chat | null;
  selectedChatMessages: Message[];
  allExistingChatsData: ChatDetails[];
  typingIndicator: { [chatId: string]: TypingIndicator | null };
}

export interface TypingIndicator {
  senderId: string;
  userName: string;
  profileImage: string;
}
