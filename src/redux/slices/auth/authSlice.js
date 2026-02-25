import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        loading : false,
        data : []
    },
    reducers : {
        setLoading : (state,action)=>{
            state.loading = action.payload
        },
        setDataLogin : (state,action)=>{
            state.data = action.payload
        }
    }
})

export const {setDataLogin} = authSlice.actions
export default authSlice.reducer;