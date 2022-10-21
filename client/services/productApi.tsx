import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Products {
  id: number;
  shop_id: number;
  product_name: string;
  price: number;
  is_active: boolean;
}

export interface Carts {
  id: number;
  user_id: number;
  shop_id: number;
  product_id: number;
  is_active: boolean;
  quantity: number;
}

export const productSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<Products[], void>({
      query: () => "/products",
      transformResponse: (data: any) => data.response,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Products" as const, id })),
              "Products",
            ]
          : ["Products"],
    }),

    addProducts: builder.mutation<any, Products>({
      query: (data) => ({
        url: "/add-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    addCarts: builder.mutation<any, Carts>({
      query: (data) => ({
        url: "/add-to-cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProducts: builder.mutation<void, Products>({
      query: ({ ...data }) => ({
        url: "/update-product",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProducts: builder.mutation({
      query: (id) => ({
        url: `/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductsMutation,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
  useAddCartsMutation,
} = productSlice;
