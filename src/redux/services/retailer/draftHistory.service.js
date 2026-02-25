import { api } from "../../../utils/api";
import { setLoadingDraft } from "../../slices/retailer/draftHistorySlice";
import { setLoadingOrder } from "../../slices/retailer/orderSlice";
export const get_draft_history = async (dispatch) => {
  try {
    dispatch(setLoadingDraft(true));
    const response = await api.get(
      `/retailer/history/draft?sort=desc&pageNumber=1&pageSize=1000`
    );
    return response;
  } catch (e) {
    console.log("Error", e);
  }
};
export const delete_draft = async (id) => {
  try {
    const response = await api.delete(`/retailer/history/draft/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const draft_to_request = async (data) => {
    const id = data.id;
  try {
    console.log("Before error",id);
    const response = await api.put(`/retailer/history/draft/${id}`);
    return response;
  } catch (error) {
    console.log("Error service draft_to_request", error);
    return error.response;
  }
};
