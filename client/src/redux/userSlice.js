import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },

    clearUserData: (state) => {
      state.user = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
