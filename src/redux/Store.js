import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/userSlice";
import settingSlice from './slices/settingSlice'
import cartSlice from "./slices/cartSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    settings:settingSlice,
    cart:cartSlice
  },
});

export default store;
