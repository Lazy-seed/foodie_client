import { createSlice } from "@reduxjs/toolkit";
import { deleteCookie, getCookie } from "../../utilities/SmallFunctions";

const initialState = {
  user: null, // Stores user information
  isLoggedIn: !!getCookie("authToken"), // Check login status based on the presence of the cookie
  token: getCookie("authToken"), // Initialize token from cookies if it exists
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginInfo(state, action) {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    delLoginInfo(state) {
      // Clear Redux state
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;

      // Remove token from cookies
      deleteCookie("authToken");
    },
    checkLoggedUser(state) {
      // Check if user is logged in
      const token = getCookie("authToken");
      state.isLoggedIn = !!token;
      state.token = token;
    },
  },
});

export const { setLoginInfo, delLoginInfo, checkLoggedUser } = authSlice.actions;
export default authSlice.reducer;
