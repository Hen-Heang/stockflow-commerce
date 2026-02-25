import axios from "axios";
import { api } from "../../../utils/api";
import productSlice, {
  setLoading,
} from "../../slices/distributor/productSlice";

export const get_all_product_distributor = async (dispatch) => {
  try {
    // console.log("work");
    dispatch(setLoading(true));
    const response = await api.get(
      `/distributor/products/sort?sort=desc&by=createdDate&pageNumber=1&pageSize=1000`
    );
    // console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};

export const add_new_product_distributor = async (data) => {
  const products = data.map((item) => ({
    name: item.name,
    categoryId: item.categoryId,
    description: item.description,
    image: item.image,
    isPublish: item.isPublish,
    price: parseFloat(item.price),
    qty: parseInt(item.qty),
  }));
  try {
    console.log("data : ", products);
    const response = await api.post(`/distributor/products`, products);
    console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};

export const update_product_distributor = async (data, id) => {
  try {
    console.log("data : ", data);
    console.log("id : ", id);
    console.log("image service : ", data.image);
    const response = await api.put(`/distributor/products/${id}`, data);
    console.log("Response : ",response.data);
    return response;
  } catch (e) {
    console.log("Error :", e);
    return e;
  }
};

export const delete_product_distributor = async (id) => {
  try {
    // console.log("work", id);
    const response = await api.delete(`/distributor/products/${id}`);
    console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e.response;
  }
};

// publish  products
export const publish_product_distributor = async (id) => {
  try {
    console.log("work", id);
    const response = await api.put(`/distributor/products/${id}/publish`);
    console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e;
  }
};
export const unPublish_product_distributor = async (id) => {
  try {
    console.log("work", id);
    const response = await api.put(`/distributor/products/${id}/unlist`);
    console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e;
  }
};
// import products
export const import_product_distributor = async (data) => {
  const payload = [
    {
      id: parseInt(data.id),
      qty: parseInt(data.qty),
      price: parseFloat(data.price)
    }
  ];
  try {
    console.log("payload : ", payload);
    console.log("Data : ", data);
    const response = await api.post(`/distributor/products/import`, payload);
    console.log("Response : ", response);
    return response;
  } catch (e) {
    console.log("Error :", e.response);
    return e;
  }
};
