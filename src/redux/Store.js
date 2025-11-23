/**
 * Redux Store Configuration
 * 
 * This file configures the Redux store for the application.
 * It combines all the reducers (slices) into a single store.
 * 
 * Reducers included:
 * - auth: Manages user authentication (login/logout, user data, token)
 * - settings: Manages app settings (location selection, modal state)
 * - cart: Manages shopping cart (items, quantities, totals)
 * 
 * Usage: This store is provided to the app via <Provider> in index.js
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import settingSlice from './slices/settingSlice';
import cartSlice from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,        // Authentication state
    settings: settingSlice,   // App settings (location, etc.)
    cart: cartSlice           // Shopping cart state
  },
});

export default store;
