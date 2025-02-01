import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendanceData: null,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setAttendanceData: (state, action) => {
      state.attendanceData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setAttendanceData,
  setError,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
