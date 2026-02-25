import { api } from "../../../utils/api";

export const get_retailer_profile = async () => {
  try {
    const response = await api.get(`/retailer/profiles`);
    return response;
  } catch (e) {
    console.log(e.response);
    return e.response;
  }
};

export const create_retailer_profile = async (payload) => {
  console.log("data service : ", payload);
  try {
    const response = await api.post(`/retailer/profiles`, payload);

    console.log(response);
    return response;
  } catch (e) {
    console.log("error: ", e);
    return e.response;
  }
};

export const edit_retailer_profile = async (payload) => {
    console.log("data service : ", payload);
  try {
    const response = await api.put(`/retailer/profiles`, payload);
    console.log("HTTP  edit: ", response);
    return response;
  } catch (e) {
    console.log("error: ", e);
    return e;
  }
};
