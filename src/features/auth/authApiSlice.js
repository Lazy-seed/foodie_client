import { apiSlice } from "../../api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/users/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        signup: builder.mutation({
            query: (credentials) => ({
                url: "/users/signup",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/users/logout",
                method: "POST",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut());
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState());
                    }, 1000);
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        refresh: builder.mutation({
            query: () => ({
                url: "/users/refresh",
                method: "POST",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Update both user and token from refresh response
                    if (data.user && data.accessToken) {
                        dispatch(setCredentials({
                            user: data.user,
                            accessToken: data.accessToken
                        }));
                    }
                } catch (err) {
                    console.log('Refresh failed:', err);
                    // Don't dispatch logout here, just log the error
                }
            },
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/users/forgot-password",
                method: "POST",
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ resetToken, password }) => ({
                url: `/users/reset-password/${resetToken}`,
                method: "PUT",
                body: { password },
            }),
        }),
    }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useRefreshMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApiSlice;
