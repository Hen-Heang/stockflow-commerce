import axios from "axios";
import { api } from "../../../utils/api";

export const get_store_distributor_profile = async (distributor) => {
  
  try {
    // console.log("work");
    const response = await api.get(
      "/distributor/stores/user/"
    );
    // console.log("Response : ",response);
    return response;
  } catch (e) {
    console.log("Error :", e);
    return e.response;
  }
  
}; 
export const add_new_store = async (data) => {
  try {
    console.log("data service :", data);
    const response = await api.post(
      "/distributor/stores",data
    );
    console.log("Response : ",response);
    return response;
  } catch (e) {
    console.log("Error aaaaaa :", e.response);
    return e.response;
  }
};

export const update_store_distributor = async (data) => {
  try {
    // console.log("work");
    const response = await api.put(
      "/distributor/stores",data
    );
    console.log("Response : ",response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};





