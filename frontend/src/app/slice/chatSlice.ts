import {
  Chat,
  ChatDetails,
  ChatState,
  LatestMessage,
  Message,
} from "@/types/chatTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state using the updated ChatState interface
const initialState: ChatState = {
  selectedChatDetails: null,
  selectedChatMessages: [],
  allExistingChatsData: [],
  typingIndicator: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAllExistingChatsData: (state, action: PayloadAction<ChatDetails[]>) => {
      state.allExistingChatsData = action.payload;
    },
    updateLatestMessageOfExistingChat: (
      state,
      action: PayloadAction<{ latestMessage: LatestMessage; chatId: string }>
    ) => {
      const existingChat = state.allExistingChatsData.find(
        (chat) => chat.id === action.payload.chatId
      );
      if (existingChat) {
        existingChat.latestMessage = action.payload.latestMessage;
      }
    },
    addChatData: (state, action) => {
      state.allExistingChatsData.push(action.payload);
    },
    setSelectedChatMessages: (state, action: PayloadAction<Message[]>) => {
      state.selectedChatMessages = action.payload;
    },
    setSelectedChatDetails: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChatDetails = action.payload;
    },
    readSelectedChatMessages: (state, action) => {
      const { messageId, userId } = action.payload;
      state.selectedChatMessages = state.selectedChatMessages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            readBy: message.readBy
              ? [...new Set([...message.readBy, userId])]
              : [userId],
          };
        }
        return message;
      });
    },
    closeChat: (state) => {
      state.selectedChatDetails = null;
      state.selectedChatMessages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.selectedChatMessages = [
        ...state.selectedChatMessages,
        action.payload,
      ];
    },
    clearChat: (state) => {
      state.selectedChatDetails = null;
      state.selectedChatMessages = [];
      state.allExistingChatsData = [];
    },
    setTypingIndicator: (
      state,
      action: PayloadAction<{
        chatId: string;
        senderId: string;
        userName: string;
        profileImage: string;
      }>
    ) => {
      const { chatId, senderId, userName, profileImage } = action.payload;
      state.typingIndicator[chatId] = { senderId, userName, profileImage };
    },
    clearTypingIndicator: (
      state,
      action: PayloadAction<{ chatId: string }>
    ) => {
      const { chatId } = action.payload;
      state.typingIndicator[chatId] = null;
    },
  },
});

export const {
  setSelectedChatDetails,
  setSelectedChatMessages,
  setAllExistingChatsData,
  updateLatestMessageOfExistingChat,
  readSelectedChatMessages,
  closeChat,
  addMessage,
  clearChat,
  addChatData,
  setTypingIndicator,
  clearTypingIndicator,
} = chatSlice.actions;
export default chatSlice.reducer;
