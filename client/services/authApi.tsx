import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: number;
  username: string;
  password: string;
}

export const authSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
  }),

  endpoints: (builder) => ({
    createUser: builder.mutation<any, User>({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),

    loginUser: builder.mutation<any, User>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = authSlice;
