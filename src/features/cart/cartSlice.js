import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    totalAmount: 0,
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.cartItems.find((item) => item._id === newItem._id);
            state.totalQuantity++;
            if (!existingItem) {
                state.cartItems.push({
                    _id: newItem._id,
                    title: newItem.title,
                    image: newItem.image01,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = Number(existingItem.totalPrice) + Number(newItem.price);
            }
            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + Number(item.price) * Number(item.quantity),
                0
            );

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        increaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item._id === id);
            state.totalQuantity++;
            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice = Number(existingItem.totalPrice) + Number(existingItem.price);
            }
            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + Number(item.price) * Number(item.quantity),
                0
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item._id === id);

            if (existingItem) {
                state.cartItems = state.cartItems.filter((item) => item._id !== id);
                state.totalQuantity = state.totalQuantity - existingItem.quantity;
            }

            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + Number(item.price) * Number(item.quantity),
                0
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        decreaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item._id === id);
            state.totalQuantity--;

            if (existingItem.quantity === 1) {
                state.cartItems = state.cartItems.filter((item) => item._id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = Number(existingItem.totalPrice) - Number(existingItem.price);
            }

            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + Number(item.price) * Number(item.quantity),
                0
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
            localStorage.removeItem('cartItems');
        },
        setCart: (state, action) => {
            state.cartItems = action.payload;
            state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
    },
});

export const { addToCart, increaseQuantity, removeFromCart, decreaseQuantity, clearCart, setCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;

export default cartSlice.reducer;
