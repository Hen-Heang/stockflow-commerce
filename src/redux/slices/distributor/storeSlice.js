import { createSlice } from '@reduxjs/toolkit'
// const initialState={
//     data:[],
// }
const shopSlice = createSlice({
    name:'shop',
    initialState: {
        store : []
    },
    reducers:{
        addNewShop:(state, action)=>{
           console.log("data : ", action.payload)   
            state.store =action.payload;
        },
        getDataStore : (state, action) =>{
            // console.log("action",action.payload)
                state.store = action.payload;
        }
    }
});

export const {getDataStore,addNewShop} = shopSlice.actions;
export default shopSlice.reducer;
