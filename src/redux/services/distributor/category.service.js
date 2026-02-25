import axios from "axios";
import { api } from "../../../utils/api";
import { setLoadingCategory } from "../../slices/distributor/categorySlice";

export const get_all_category = async (dispatch) => {
  // console.log("pageNumber ", pageNumber);
  try {
    // console.log("work");
    dispatch(setLoadingCategory(true));
    const response = await api.get(
      `/distributor/categories?pageNumber=1&pageSize=1000`
    );
    // console.log("Response : ", response);
    return response;
  } catch (e) {
    // console.log("Error :", e.response);
    return e.response;
  }
};

export const add_new_category = async (data) => {
  console.log("category ", data);

  const category = data.name;
  try {
    // console.log("try block");
    const response = await api.post(`distributor/categories?name=${category}`);
    console.log("Response :", response.data);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};

// delete the category
export const delete_category = async (id) => {
  console.log("category ID ", id);
  try {
    // console.log("work");
    const response = await api.delete(`/distributor/categories/${id}`);
    // console.log("Response : ",response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response.data;
  }
};
// delete the category
export const update_category = async (data, id) => {
  // const id = data.id;
  // const name = data.name;
  // console.log("category ID ", id);
  // console.log("category data ", data);
  // const category = data.name;
  // console.log("category ", category);
  try {
    // console.log("work");
    const response = await api.put(`distributor/categories/${id}?name=${data}`);
    console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};
