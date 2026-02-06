import { apiSlice } from "./apiSlice";

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startAttendanceSession: builder.mutation({
      query: (body) => ({
        url: "/attendance/startAttendance",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => response.data,
    }),

    checkSession: builder.mutation({
      query: (course) => ({
        url: "/attendance/checkSession",
        method: "POST",
        body: course,
      }),
      transformResponse: (response) => response,
    }),

    stopAttendanceSession: builder.mutation({
      query: (course) => ({
        url: "/attendance/stopAttendance",
        method: "POST",
        body: course,
      }),
      transformResponse: (response) => response,
    }),

    getCourseAttendance: builder.mutation({
      query: (body) => ({
        url: "/attendance/getCourseAttendance", // Assumes this is your backend route for showBranchDetails
        method: "POST",
        body: body, // e.g., { branchId: "60d0fe4f5311236168a109ca" }
      }),
      transformResponse: (response) => response, // Extracts the 'branch' object
    }),

    getStudentAttendanceByCourse:builder.mutation({
      query:(course)=>({
        url:"/attendance/getStudentAttendanceByCourse",
        method:"POST",
        body:course,
      }),
      transformResponse:(response)=>response,
    }),

    getLectureDatesByCourse:builder.mutation({
      query:(course)=>({
        url:"/attendance/getLectureDatesByCourse",
        method:'POST',
        body:course
      }),
      transformResponse:(response)=>response.data,
    }),

    getLectureDatesByCourseForStudent:builder.mutation({
      query:(course)=>({
        url:"/attendance/getLectureDatesByCourseForStudent",
        method:'POST',
        body:course
      }),
      transformResponse:(response)=>response.data,
    }),

    getMarkAttendance:builder.mutation({
      query:(body)=>({
        url:"/attendance/markAttendance",
        method:'POST',
        body:body
      }),
      transformResponse:(response)=>response,
    }),
  }),
});

// Export the auto-generated hooks for use in your components
export const {
  useStartAttendanceSessionMutation,
  useCheckSessionMutation,
  useStopAttendanceSessionMutation,
  useGetCourseAttendanceMutation,
  useGetStudentAttendanceByCourseMutation,
  useGetLectureDatesByCourseMutation,
  useGetLectureDatesByCourseForStudentMutation,
  useGetMarkAttendanceMutation,
} = attendanceApiSlice;
