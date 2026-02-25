import { createSlice } from "@reduxjs/toolkit";
const favoriteSlice=createSlice({
    name:"favorite",
    initialState:{
        data:[      
      ],
      loading:false,
    },
  reducers: {
    setLoadingFavorite: (state, action) => {
      console.log("Loading from slice ", action.payload)
      state.loading = action.payload
    },
    getOnlyBookmark: (state, action) => {
      state.data=action.payload
    },
    deleteBookMark: (state, action) => {

      state.data = state.data.filter((item) => item.id !== action.payload)
      
    }
  },
  
})
export const{getOnlyBookmark,deleteBookMark,setLoadingFavorite}= favoriteSlice.actions
export default favoriteSlice.reducer;



