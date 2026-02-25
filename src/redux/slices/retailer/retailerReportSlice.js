import { createSlice } from "@reduxjs/toolkit";

const retailerReportSlice = createSlice({

  name: "retailerReport",
  initialState: {
    retailerReport: {},
  },
  reducers: {
    getRetailerReport: (state, action) => {
      //console.log("Hello in slice", action.payload);
      state.retailerReport = action.payload;
  },
}
})

export const { getRetailerReport } = retailerReportSlice.actions
export default retailerReportSlice.reducer;
