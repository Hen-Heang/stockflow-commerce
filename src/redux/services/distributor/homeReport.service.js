import { api } from "../../../utils/api"


export const get_dis_home_report = async (startDate, endDate) => {
  try {

    console.log("Hi start : ", startDate);
    console.log("Hi end : ", endDate);
    const response = await api.get(`/distributor/order_activities/months?startDate=${startDate}&endDated=${endDate}`);  
    return response;
  } catch (e) {
    return e;
  }

};