import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      console.log("Logging in:", action.payload);
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    currentuser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    logout(state, action) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginSuccess, logout, currentuser } = userSlice.actions;

export default userSlice.reducer;
