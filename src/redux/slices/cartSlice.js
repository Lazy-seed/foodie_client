/**
 * Cart Slice
 * 
 * This Redux slice manages the shopping cart state for the application.
 * It handles adding/removing items, updating quantities, and calculating totals.
 * 
 * State Structure:
 * - itemList: Array of cart items, each containing product details and quantity
 * - totalPrice: Sum of all item prices × quantities
 * - totalQuantity: Total number of items in cart (sum of all quantities)
 * - shippingAddress: Object containing delivery address details
 * 
 * Note: This is for local cart state. For logged-in users, cart is also
 * synced with the backend via cartApiSlice.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    itemList: [],
    totalPrice: 0,
    totalQuantity: 0,
    shippingAddress: {}
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        /**
         * addItem - Adds a new item to the cart
         * 
         * @param {Object} action.payload - Product object with:
         *   - id: Product ID
         *   - title: Product name
         *   - price: Product price
         *   - quantity: Number of items to add
         *   - imgUrl: Product image URL
         * 
         * Automatically recalculates totalPrice and totalQuantity
         */
        addItem: (state, action) => {
            const item = action.payload;
            state.itemList.push(item);
            // Recalculate total price (sum of price × quantity for all items)
            state.totalPrice = state.itemList.reduce((total, item) => total + item.price * item.quantity, 0);
            // Recalculate total quantity (sum of all quantities)
            state.totalQuantity = state.itemList.reduce((total, item) => total + item.quantity, 0);
        },

        /**
         * removeItem - Removes an item from the cart by product ID
         * 
         * @param {string} action.payload - Product ID to remove
         */
        removeItem: (state, action) => {
            const productId = action.payload;
            state.itemList = state.itemList.filter(item => item.id !== productId);
            state.totalPrice = state.itemList.reduce((total, item) => total + item.price * item.quantity, 0);
            state.totalQuantity = state.itemList.reduce((total, item) => total + item.quantity, 0);
        },

        /**
         * updateQuantity - Updates the quantity of a specific cart item
         * 
         * @param {Object} action.payload - Contains:
         *   - productId: ID of product to update
         *   - quantity: New quantity value
         */
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.itemList.find(item => item.id === productId);
            if (item) {
                item.quantity = quantity;
                state.totalPrice = state.itemList.reduce((total, item) => total + item.price * item.quantity, 0);
                state.totalQuantity = state.itemList.reduce((total, item) => total + item.quantity, 0);
            }
        },

        /**
         * setShippingAddress - Stores the delivery address for checkout
         * 
         * @param {Object} action.payload - Address object with fields like:
         *   firstName, lastName, addressLine1, city, postcode, contact, etc.
         */
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },

        /**
         * clearCart - Empties the cart (called after successful order placement)
         */
        clearCart: (state) => {
            state.itemList = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
        }
    }
})

// Export actions for use in components
export const { addItem, removeItem, updateQuantity, setShippingAddress, clearCart } = cartSlice.actions;

// Export reducer to be added to store
export default cartSlice.reducer;