import { apiSlice } from './apiSlice';
import { setCredentials } from '../slice/authSlice'; // An action to set user/token

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    sendOtp: builder.mutation({
      query: (body) => ({
        url: '/auth/sendOTP',
        method: 'POST',
        body, // { email: "..." }
      }),
    }),
    
    signUp: builder.mutation({
      query: (body) => ({
        url: '/auth/signUp',
        method: 'POST',
        body, // { firstName, lastName, email, password, otp, etc. }
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials, // { email, password }
      }),
      // Side-effect: After login is successful, save the token and user data
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { user, token } = data;
          console.log(user,token,"dbgdb")
          // Dispatch an action to store credentials
          dispatch(setCredentials({ user, token }));
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),

    resetPasswordToken: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password-token',
        method: 'POST',
        body, // { email }
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body, // { password, confirmPassword, token }
      }),
    }),

    getInstructor: builder.query({
      query: () => '/auth/getInstructor', // The URL path for the endpoint
      // Caching: This query provides a 'Branch' tag.
      // If another mutation 'invalidates' this tag, this query will re-fetch automatically.
      providesTags: ['Instructor'], 
      // Optional: Transform the response if needed
      transformResponse: (response) => response.instructor,
    }),

  }),
});

// Export the auto-generated hooks for use in your components
export const {
  useSendOtpMutation,
  useSignUpMutation,
  useLoginMutation,
  useResetPasswordTokenMutation,
  useResetPasswordMutation,
  useGetInstructorQuery,
} = authApiSlice;