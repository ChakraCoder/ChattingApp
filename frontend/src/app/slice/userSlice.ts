import { SetUser, UpdateUser, UserState } from "@/types/userTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  id: null,
  firstName: null,
  lastName: null,
  userName: null,
  email: null,
  profileImage: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUser>) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    updateUser: (state, action: PayloadAction<UpdateUser>) => {
      state.userName = action.payload.userName;
      state.profileImage = action.payload.profileImage;
    },
    clearUser: (state) => {
      state.id = null;
      state.firstName = null;
      state.lastName = null;
      state.userName = null;
      state.email = null;
      state.profileImage = null;
      state.token = null;
    },
  },
});

// Export actions and reducer
export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
