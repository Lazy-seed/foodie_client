import { createSlice } from "@reduxjs/toolkit";

const initailState= {
    itemList:[],
    totalPrice:0,
    totalQuantity:0,
    shippingAddress:{}
}
export const cartSlice = createSlice({
    name: 'cart',
    initialState: initailState,
    reducers: {
        addItem: (state, action) => {
            const item = action.payload;
            state.itemList.push(item);
            state.totalPrice = state.itemList.reduce((total, item) => total + item.price * item.quantity, 0);
            state.totalQuantity = state.itemList.reduce((total, item) => total + item.quantity, 0);
        },
        removeItem: (state, action) => {
            const productId = action.payload;
            state.itemList = state.itemList.filter(item => item.id !== productId);
            state.totalPrice = state.itemList.reduce((total, item) => total + item.price * item.quantity, 0);
            state.totalQuantity = state.itemList.reduce((total, item) => total + item.quantity, 0);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.itemList.find(item => item.id === productId);
            if (item) {
                item.quantity = quantity;
                state.totalPrice = state.itemList.reduce((total, item) => total + item.price * item.quantity, 0);
                state.totalQuantity = state.itemList.reduce((total, item) => total + item.quantity, 0);
            }
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
        clearCart: (state) => {
            state.itemList = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
        }
    }
})

export const { addItem, removeItem, updateQuantity, setShippingAddress, clearCart } = cartSlice.actions;
export default cartSlice.reducer;