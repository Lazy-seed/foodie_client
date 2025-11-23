import { apiSlice } from "../../api/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ category, search, sort, page }) => {
                let queryString = `?page=${page}&sort=${sort}`;
                if (category && category !== 'all') queryString += `&category=${category}`;
                if (search) queryString += `&search=${search}`;
                return `/products${queryString}`;
            },
            providesTags: ["Product"],
        }),
        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: ["Product"],
        }),
    }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApiSlice;
