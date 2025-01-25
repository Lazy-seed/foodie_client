import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    locationData:{
        location:JSON.parse(localStorage.getItem('foodStoreId') ?? null),
        showModal:JSON.parse(localStorage.getItem('foodStoreId') ?? null) ? false : true
    },
}

const settingSlice = createSlice({
    name:"settingSlice",
    initialState,
    reducers:{
        setLocation(state, action) {
            state.locationData = action.payload;
            localStorage.setItem("foodStoreId", JSON.stringify(action.payload.location));
          }
    }
})


export const {setLocation} = settingSlice.actions
export default settingSlice.reducer