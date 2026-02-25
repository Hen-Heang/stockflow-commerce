import axios from "axios";
import { api } from "../../../utils/api";

export const get_retailer_report = async () => {
  try {
    const response = await api.get("retailer / reports ? startDate = 2023-06 & endDate=2023-06");
    return response;
  } catch (e) {
    return e;
  }

};

