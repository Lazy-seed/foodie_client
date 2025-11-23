/**
 * Settings Slice
 * 
 * This Redux slice manages application-wide settings, primarily location/store selection.
 * It handles the user's selected store location and the location selection modal state.
 * 
 * State Structure:
 * - locationData: Object containing:
 *   - location: Selected store object (from localStorage or user selection)
 *   - showModal: Boolean to control location selection modal visibility
 * 
 * The location data is persisted in localStorage to remember user's store selection
 * across sessions.
 */

import { createSlice } from "@reduxjs/toolkit"

// Helper function to safely parse localStorage
const getStoredLocation = () => {
    try {
        const stored = localStorage.getItem('foodStoreId');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error parsing stored location:', error);
        return null;
    }
};

const initialState = {
    locationData: {
        // Load saved location from localStorage, or null if not set
        location: getStoredLocation(),
        // Show modal on first visit (when no location is saved)
        showModal: getStoredLocation() ? false : true
    },
}

const settingSlice = createSlice({
    name: "settingSlice",
    initialState,
    reducers: {
        /**
         * setLocation - Updates the selected store location
         * 
         * This is called when:
         * 1. User selects a store from the PincodePop modal
         * 2. User clicks the location icon to toggle the modal
         * 
         * @param {Object} action.payload - Contains:
         *   - location: Store object with _id, name, address, pincode, city
         *   - showModal: Boolean to show/hide the location selection modal
         * 
         * Side effect: Saves location to localStorage for persistence
         */
        setLocation(state, action) {
            state.locationData = action.payload;
            // Persist selected location to localStorage
            localStorage.setItem("foodStoreId", JSON.stringify(action.payload.location));
        }
    }
})

// Export action for use in components
export const { setLocation } = settingSlice.actions

// Export reducer to be added to store
export default settingSlice.reducer