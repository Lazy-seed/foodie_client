import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api`,
    credentials: "include",
    timeout: 60000, // Increase timeout to 60 seconds for cold starts
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Wrap baseQuery to emit loading events
const baseQueryWithLoading = async (args, api, extraOptions) => {
    // Emit request start event
    window.dispatchEvent(new Event('api-request-start'));

    try {
        const result = await baseQuery(args, api, extraOptions);
        return result;
    } finally {
        // Emit request end event
        window.dispatchEvent(new Event('api-request-end'));
    }
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithLoading,
    tagTypes: ['User', 'Product', 'Cart', 'Order'],
    endpoints: (builder) => ({}),
});
