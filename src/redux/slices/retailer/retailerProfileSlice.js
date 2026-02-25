import { createSlice } from "@reduxjs/toolkit";

const retailerInfoSlice = createSlice({
    name: 'retailerInfo',
    initialState: {
        retailerInfo: [],
    },
    reducers: {
        // get retailer profile
        getRetailerInfo: (state, action) => {
            state.retailerInfo = action.payload;
        },
    }
});
// action
export const {getRetailerInfo} = retailerInfoSlice.actions;
// reducer
export default retailerInfoSlice.reducer;