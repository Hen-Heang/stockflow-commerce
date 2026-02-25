import { api } from "../../../utils/api"
export const rating_star=async(storeId,ratedStar)=>{
    try {
        console.log("store id ",storeId);
        console.log("rating star ",ratedStar);
      const response = await api.post(`/retailer/stores/${storeId}/rating`, { "ratedStar": ratedStar } );
      console.log("rating", response); // Log the response object
      return response;
    } catch (error) {
      console.log("rat Error", error);
      return error.response;
      // return error.response;
    }
}
