import { apiSlice } from "../../api/apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => "/cart",
            providesTags: ["Cart"],
        }),
        addToCartApi: builder.mutation({
            query: (item) => ({
                url: "/cart/add",
                method: "POST",
                body: item,
            }),
            invalidatesTags: ["Cart"],
        }),
        syncCart: builder.mutation({
            query: (cartItems) => ({
                url: "/cart/sync",
                method: "POST",
                body: { cartItems }
            }),
            invalidatesTags: ["Cart"]
        }),
        updateCartItemApi: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: "/cart/update",
                method: "PUT",
                body: { productId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),
        removeCartItemApi: builder.mutation({
            query: (productId) => ({
                url: "/cart/remove",
                method: "DELETE",
                body: { productId },
            }),
            invalidatesTags: ["Cart"],
        }),
    }),
});

export const { useGetCartQuery, useAddToCartApiMutation, useSyncCartMutation, useUpdateCartItemApiMutation, useRemoveCartItemApiMutation } = cartApiSlice;
