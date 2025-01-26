import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChatType: null,
  selectedChatData: null,
  selectedChatMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData: (state, action) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = action.payload;
    },
    closeChat: (state) => {
      state.selectedChatType = null;
      state.selectedChatData = null;
      state.selectedChatMessages = [];
    },
  },
});

// Export actions and reducer
export const { setSelectedChatType, setSelectedChatData, closeChat } =
  chatSlice.actions;
export default chatSlice.reducer;
