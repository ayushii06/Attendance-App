import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;


// Define a base query with dynamic headers
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL, // Example: "http://localhost:4000/api/v1"
  prepareHeaders: (headers, { getState }) => {
    // Get the token from your auth slice or local storage
    const token = getState().auth.token || localStorage.getItem("token");
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Create a base API slice.
 * Endpoints are injected from other files to keep this file clean.
 */
export const apiSlice = createApi({
  baseQuery: baseQuery,
  // Tag types are used for caching and invalidation. Optional but recommended.
  tagTypes: ["User"], 
  endpoints: (builder) => ({}), // Endpoints will be injected
});