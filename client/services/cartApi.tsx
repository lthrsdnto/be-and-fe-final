import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { Products } from "./productApi";

export interface Carts {
  id: number;
  user_id: number;
  shop_id: number;
  product_id: number;
  is_active: boolean;
  product: Products[];
}

export const cartSlice = createApi({
  reducerPath: "cartApi",
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
  tagTypes: ["Carts"],
  endpoints: (builder) => ({
    getCarts: builder.query<Carts[], void>({
      query: () => "/cart",
      transformResponse: (data: any) => data.response,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Carts" as const, id })),
              "Carts",
            ]
          : ["Carts"],
    }),

    addCarts: builder.mutation<any, Carts>({
      query: (data) => ({
        url: "/add-to-cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Carts"],
    }),

    updateCarts: builder.mutation<void, Carts>({
      query: ({ ...data }) => ({
        url: "/update-item",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Carts"],
    }),

    deleteCarts: builder.mutation({
      query: (id) => ({
        url: `/remove-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Carts", id: arg.id }],
    }),

    emptyCarts: builder.mutation({
      query: () => ({
        url: "empty-cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Carts"],
    }),
  }),
});

export const {
  useAddCartsMutation,
  useEmptyCartsMutation,
  useUpdateCartsMutation,
  useDeleteCartsMutation,
  useGetCartsQuery,
} = cartSlice;
