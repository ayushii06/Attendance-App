import { apiSlice } from './apiSlice';

export const branchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranchesByYear: builder.mutation({
      query: (year) => ({
        url: '/branch/showAllBranch', // Assumes this is your backend route for showAllBranch
        method: 'POST',
        body:year, // e.g., { year: "1" }
      }),
      transformResponse: (response) => response.branches
    }),

    // --- MUTATION to get the details of a single branch ---
    // Also a mutation because the backend expects 'branchId' in the request body.
    getBranchDetails: builder.mutation({
      query: (branchId) => ({
        url: '/branch/showBranchDetails', // Assumes this is your backend route for showBranchDetails
        method: 'POST',
        body:branchId, // e.g., { branchId: "60d0fe4f5311236168a109ca" }
      }),
      transformResponse: (response) => response.branch, // Extracts the 'branch' object
    }),

    // --- (This mutation remains the same) ---
    createBranch: builder.mutation({
      query: (newBranchData) => ({
        url: '/branch/createBranch',
        method: 'POST',
        body: newBranchData,
      }),
      invalidatesTags: ['Branch'], // This can still be useful for other queries
    }),
    
  }),
});

// Export the auto-generated hooks. Note they are named with "Mutation".
export const {
  useGetBranchesByYearMutation,
  useGetBranchDetailsMutation,
  useCreateBranchMutation, // Your existing hook
} = branchApiSlice;
