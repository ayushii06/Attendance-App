import { createSlice } from "@reduxjs/toolkit";

// Get token from localStorage if it exists
const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
  token: token,
  user: user,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    // Action to set credentials after login
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      // localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    // Action to log out
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;