import axios from "axios";
import { useNavigate } from "react-router-dom";

// export const getTOkenFromLocalStorage = () => {
//     // console.log("Token in method : ", localStorage.getItem("token"));
//     return localStorage.getItem("token");
//   };

export const registerService = async ({ email, password }, id) => {
  const data = {
    email: email,
    password: password,
    roleId: id,
  };
  try {
    // console.log("auth in service", auth);
    const response = await axios.post(
      "http://localhost:8888/authorization/register",
      data
    );
    // console.log("Response", response);
    return response;
  } catch (e) {
    // console.log("error : ", e.response.data.detail);
    return e.response;
  }
};
export const generateCodeService = async ({ email }) => {
  try {
    console.log("email", email);
    const response = await axios.post(
      `http://localhost:8888/authorization/api/v1/otp/generate?email=${email}`
    );
    // console.log("Response", response);
    return response;
  } catch (e) {
    console.log("error", e.response);
    return e.response;
  }
};
export const verifyEmailService = async ({ email }, otp) => {
  try {
    console.log("email format", email);
    // console.log("email", email);
    const response = await axios.post(
      `http://localhost:8888/authorization/api/v1/otp/verify?otp=${otp}&email=${email}`
    );
    console.log("Response", response);
    return response;
  } catch (e) {
    console.log("error", e.response);
    return e.response;
  }
};

// login
export const loginService = async (data) => {
  try {
    console.log("email", data);
    const response = await axios.post(
      "http://localhost:8888/authorization/login",
      data
    );
    console.log("Response", response);
    return response;
  } catch (e) {
    console.log("error login", e);
    return e.response;
    // console.log("error", e.response.data.detail);
  }
};

export const forget_password = async (data) => {
  const otp = data.otp;
  const email = data.email;
  const password = data.password;
  console.log(data)
  console.log("OTP :", otp)
  console.log("email :", email)
  console.log("password :", password)
  try {
    // console.log("email", email);
    const response = await axios.put(
      `http://localhost:8888/authorization/forget?otp=${otp}&email=${email}&newPassword=${password}`
    );
    console.log("Response", response);
    return response;
  } catch (e) {
    console.log("error login", e);
    return e.response;
    // console.log("error", e.response.data.detail);
  }
};
export const change_password = async (data) => {
  console.log(data)
  try {
    // console.log("email", email);
    const response = await axios.put(
      `http://localhost:8888/authorization/change-password`,data
    );
    console.log("Response", response);
    return response;
  } catch (e) {
    console.log("error login", e);
    return e.response;
    // console.log("error", e.response.data.detail);
  }
};

//  login
// export const loginService = async (data) => {
//   try {
//     let response = await axios.post("http://localhost:8888/authorization/login", data);
//     return response;
//   } catch (e) {
//     // console.log("error", e.response.data.detail);
//     return e.response.data.detail;
//   }
// };
