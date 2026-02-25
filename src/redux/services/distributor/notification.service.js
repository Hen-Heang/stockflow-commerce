import { api } from "../../../utils/api";
import { setLoadingNewOrder } from "../../slices/distributor/notification/notificationSlice";

export const get_all_notification = async (dispatch) => {
  try {
      dispatch(setLoadingNewOrder(true));
    const response = await api.get(`/distributor/notifications`);
    console.log("All notifications service returned", response);
    return response;
  } catch (e) {
    console.log("Error:", e.response);
    dispatch(setLoadingNewOrder(false));
    return e.response;
  }
};
export const get_all_notification_withoutLoading = async () => {
  try {
    //   dispatch(setLoadingTheOrder(true));
    const response = await api.get(`/distributor/notifications`);
    console.log("All notifications service returned", response);
    return response;
  } catch (e) {
    console.log("Error:", e.response);
    return e.response;
  }
};
export const read_notification_distributor = async (id) => {
  try {
    // console.log("Id from service", id);
    // dispatch(setLoadingTheOrder(true));
    const response = await api.put(`/distributor/notifications/${id}/read`);
    console.log("All notifications service returned", response);
    return response;
  } catch (e) {
    console.log("Error:", e.response);
    return e.response;
  }
};
export const read_all_notification_distributor = async () => {
  try {
    // console.log("Id from service", id);
    // dispatch(setLoadingTheOrder(true));
    const response = await api.put(`/distributor/notifications/read`);
    // console.log("All notifications service returned", response);
    return response;
  } catch (e) {
    console.log("Error:", e.response);
    return e.response;
  }
};
