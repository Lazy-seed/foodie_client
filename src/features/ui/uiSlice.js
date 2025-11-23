import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    isSidebarOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
    },
});

export const { setLoading, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
