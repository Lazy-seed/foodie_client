/**
 * Authentication Slice
 * 
 * This Redux slice manages the authentication state of the application.
 * It handles user login/logout and stores the user's authentication token.
 * 
 * State Structure:
 * - user: Object containing user information (name, email, etc.)
 * - token: JWT access token for API authentication
 * - isAuthenticated: Boolean flag indicating if user is logged in
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * setCredentials - Called when user successfully logs in
         * Stores user data and access token in Redux state
         * 
         * @param {Object} action.payload - Contains user object and accessToken
         */
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.token = accessToken;
            state.isAuthenticated = true;
        },

        /**
         * logOut - Called when user logs out
         * Clears all authentication data from state
         */
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

// Export actions for use in components
export const { setCredentials, logOut } = authSlice.actions;

// Export reducer to be added to store
export default authSlice.reducer;

// Selector functions to access auth state from components
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
