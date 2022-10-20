import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Shops {
  id: number;
  name: string;
  address: string;
  business_type: string;
  is_active: boolean;
  products: Products[];
}

export interface Products {
  id: number;
  product_name: string;
  price: number;
  is_active: boolean;
}

export const shopSlice = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
  }),
  tagTypes: ["Shops"],
  endpoints: (builder) => ({
    getShops: builder.query<Shops[], void>({
      query: () => "/shops-and-items",
      transformResponse: (data: any) => data.response,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Shops" as const, id })),
              "Shops",
            ]
          : ["Shops"],
    }),

    addShops: builder.mutation<any, Shops>({
      query: (data) => ({
        url: "/add-shop",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Shops"],
    }),

    updateShops: builder.mutation<void, Shops>({
      query: ({ ...data }) => ({
        url: "/update-shop/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Shops"],
    }),

    deleteShops: builder.mutation({
      query: (id) => ({
        url: `/delete-shop/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Shops", id: arg.id }],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useAddShopsMutation,
  useUpdateShopsMutation,
  useDeleteShopsMutation,
} = shopSlice;
