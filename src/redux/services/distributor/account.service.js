import { api } from "../../../utils/api";

export const get_account_distributor = async () => {
  try {
    const response = await api.get("/distributor/profiles/");
    // console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};

export const add_new_account = async (data) => {
  console.log("Data on service : ",data)
  try {
    const response = await api.post("/distributor/profiles/", data);
    // console.log("Response : ",response);
    return response;
  } catch (e) {
    // console.log("Error :", e.response);
    return e.response;
  }
};

export const update_account = async (data) => {
  try {
    console.log("data server :", data);
    const response = await api.put("/distributor/profiles/", data);
    console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};
