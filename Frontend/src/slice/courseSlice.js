import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    course: [],
};
  
  const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
      setCourse: (state, action) => {
        state.course = action.payload;
      },
      getCourses: (state, action) => {
        state.course = action.payload;
      },
    },
  });
  
  export const { setCourse,getCourses } = courseSlice.actions;
  export default courseSlice.reducer;
  