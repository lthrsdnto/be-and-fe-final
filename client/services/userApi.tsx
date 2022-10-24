import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export interface Users {
  id: number;
  username: string;
  password: string;
  confirmPassword: string;
}

export const userSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<Users[], void>({
      query: () => "/users",
      transformResponse: (data: any) => data.response,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Users" as const, id })),
              "Users",
            ]
          : ["Users"],
    }),

    addUsers: builder.mutation<any, Users>({
      query: (data) => ({
        url: "/sign-up",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Users"],
    }),

    updateUsers: builder.mutation<void, Users>({
      query: ({ ...data }) => ({
        url: `/update-user`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUsers: builder.mutation({
      query: (id) => ({
        url: `/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Users", id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
} = userSlice;
