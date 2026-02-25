const { createSlice } = require("@reduxjs/toolkit");
const dispatchSlice=createSlice({
    name:'dispatch',
    initialState:{
        dispatchData:[
            // {
            //     id:"1",
            //     name:"austin12@gmail.com",
            //     address:"Kampong Cham",
            //     date:"02 May 2023",
            //     price:"299",
            //     product:
            //         {
            //             id:1,
            //             proName:"Champion",
            //             proCate:"Beverage",
            //             qty:5,
            //             stock:45,
            //             unitPrice:"$2.00",
            //             total:"$10.00",
            //         }
            // },
        ]
    },
    reducers:{
        // getAlldispatch:(state,action)=>{
        //     state.dispatchData=action.payload;
        // },
        // getDelivered:(state,action)=>{
        //     const itemId = action.payload;
        //     state.dispatchData = state.dispatchData.filter((item) => item.id !== itemId);
        // },
        // removeDisItem(state, action) {
        //     const itemId = action.payload;
        //     state.dispatchData = state.dispatchData.filter((item) => item.id !== itemId);
        // },
    }
})
export const {getAlldispatch, removeDisItem,getDelivered} = dispatchSlice.actions
export default dispatchSlice.reducer;