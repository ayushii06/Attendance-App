import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    course: null,
};
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      login: (state, action) => {
        state.user = action.payload.user; // Assign user object
        state.token = action.payload.token; // Assign token
        state.isAuthenticated = true; // Set as authenticated
        state.error = null; // Clear error
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      },
      loginError: (state, action) => {
        state.error = action.payload;
      },
    },
  });
  
  export const { login, logout, loginError } = authSlice.actions;
  export default authSlice.reducer;
  