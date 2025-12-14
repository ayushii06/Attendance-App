import { createSlice } from "@reduxjs/toolkit";

// Get token from localStorage if it exists
const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;

const initialState = {
  token: token,
  user: null,
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