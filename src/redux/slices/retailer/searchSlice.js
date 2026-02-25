import { createSlice } from "@reduxjs/toolkit"


const searchSlice = createSlice({
    name: 'searchProduct',
    initialState:{
        item: [],
        loading:false,
        error : false,
        // item1: [],
    },
    reducers:{
        getSearchStore : (state,action) =>{
            console.log("slice :",action.payload)
            state.item = action.payload;
        },
        // getSearchCategory : (state,action)=>{
        //     console.log("slice1: ",action.paylaod)
        //     state.item1 = action.paylaod;
        // },
        setLoading : (state, action)=>{
            state.loading = action.payload;
        },
        setError : (state,action)=>{
            console.log("action : ",action.payload)
            state.error = action.payload;
        }
    }
})
export const {getSearchStore, setLoading,setError} = searchSlice.actions
export default searchSlice.reducer;



