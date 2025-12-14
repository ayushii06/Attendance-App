import { apiSlice } from './apiSlice';

export const faceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

      createFaceEnrollment:builder.mutation({
            query: (images) => ({
        url: '/face/enrollFace', // Assumes this is your backend route for showBranchDetails
        method: 'POST',
        body:images, // e.g., { branchId: "60d0fe4f5311236168a109ca" }
      }),
      // transformResponse: (response) => response.data, // Extracts the 'branch' object
    
      }),

      VerifyFace:builder.mutation({
        query:(images)=>({
          url:'/face/verifyFace',
          method:'POST',
          body:images,
        }),
        transformResponse:(response)=>response,
      }),
  }),
});

// Export the auto-generated hooks
export const {
  useCreateFaceEnrollmentMutation,
  useVerifyFaceMutation,
} = faceApiSlice;