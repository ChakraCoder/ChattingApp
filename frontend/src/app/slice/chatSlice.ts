import {
  Chat,
  ChatDetails,
  ChatState,
  LatestMessage,
  Message,
} from "@/types/chatTypes";
import { UserState } from "@/types/userTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type

const initialState: ChatState = {
  selectedChatData: null,
  selectedChatDetails: null,
  selectedChatMessages: [],
  allExistingChatsData: [],
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
        // Update the latest message of the existing chat
        existingChat.latestMessage = action.payload.latestMessage;
      }
    },
    addChatData: (state, action) => {
      // @ts-expect-error payloadnot defined
      state.allExistingChatsData.push(action.payload);
    },
    setSelectedChatData: (state, action: PayloadAction<UserState | null>) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action: PayloadAction<Message[]>) => {
      state.selectedChatMessages = action.payload;
    },
    selectedChatDetails: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChatDetails = action.payload;
    },
    closeChat: (state) => {
      state.selectedChatDetails = null;
      state.selectedChatData = null;
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
      state.selectedChatData = null;
      state.selectedChatMessages = [];
      state.allExistingChatsData = [];
    },
  },
});

// Export actions and reducer
export const {
  setSelectedChatData,
  selectedChatDetails,
  setSelectedChatMessages,
  setAllExistingChatsData,
  updateLatestMessageOfExistingChat,
  closeChat,
  addMessage,
  clearChat,
  addChatData,
} = chatSlice.actions;
export default chatSlice.reducer;
