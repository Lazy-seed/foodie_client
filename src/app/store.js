/**
 * Redux Store Configuration with Persistence
 * 
 * This file configures the Redux store with redux-persist for the application.
 * It combines all the reducers (slices) and persists auth state to localStorage.
 * 
 * Reducers included:
 * - auth: Manages user authentication (login/logout, user data, token) - PERSISTED
 * - settings: Manages app settings (location selection, modal state)
 * - cart: Manages shopping cart (items, quantities, totals)
 * - [api]: RTK Query API slice for data fetching
 * 
 * Persistence: Only auth state is persisted to maintain login across sessions
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from '../api/apiSlice';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import cartReducer from '../features/cart/cartSlice';
import settingsReducer from '../redux/slices/settingSlice';

// Configure persistence for auth reducer only
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'isAuthenticated']
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configure the Redux store
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: persistedAuthReducer,    // Authentication state (persisted)
        settings: settingsReducer,      // App settings (location, etc.)
        ui: uiReducer,                  // UI state (modals, loading, etc.)
        cart: cartReducer,              // Shopping cart state
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;
