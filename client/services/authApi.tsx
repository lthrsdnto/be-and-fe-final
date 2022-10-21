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
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().authApi.data.token;
    //   // If we have a token in localStorage, lets use it:
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }

    //   return headers;
    // },
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
      transformResponse: (data: any) => data.response,
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
