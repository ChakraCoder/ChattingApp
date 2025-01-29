import { Chat, ChatDetails, ChatState, Message } from "@/types/chatTypes";
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
  closeChat,
  addMessage,
  clearChat
} = chatSlice.actions;
export default chatSlice.reducer;
