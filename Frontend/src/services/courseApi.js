import { apiSlice } from './apiSlice';

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. Query to get all courses
    getCourses: builder.mutation({
      query: (year) => ({
        url: '/course/getAllCourses', // Assumes this is your backend route for showBranchDetails
        method: 'POST',
        body:year, // e.g., { branchId: "60d0fe4f5311236168a109ca" }
      }),
      transformResponse: (response) => response.courses, // Extracts the 'branch' object
    }),

    // 2. Mutation to create a new course
    createCourse: builder.mutation({
      query: (newCourseData) => ({
        url: '/course/createCourse',
        method: 'POST',
        body: newCourseData, // e.g., { courseName: "B.Tech", branch: "branchId", ... }
      }),
      // Invalidate the 'Course' list tag to trigger an automatic refetch
      invalidatesTags: ['Course'],
    }),
    
  }),
});

// Export the auto-generated hooks
export const {
  useGetCoursesMutation,
  useCreateCourseMutation,
} = courseApiSlice;