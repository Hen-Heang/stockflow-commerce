import { createSlice } from "@reduxjs/toolkit";

const invoiceRetailerSlice = createSlice({
    name: 'invoice',
    initialState: {
        data: [],
        value: [],
    },
    reducers: {
        getInvoice: (state, action) => {
            console.log("Get Invoice : ", action.payload)
            state.data = action.payload;
        },
        getOrderInvoice: (state, action) => {
            console.log("Get order Invoice : ", action.payload)
            state.value = action.payload;
        }
    }
})
export const { getInvoice, getOrderInvoice } = invoiceRetailerSlice.actions;
export default invoiceRetailerSlice.reducer;