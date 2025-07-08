import { toast } from "react-toastify";
import axios from "./axiosConfig.js";

export const signUpService = async (data) => {
  try {
    const res = await axios.post("/auth/register", data);
    toast.success(res.data.message);
    return res;
  } catch (error) {
    console.log("error->", error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const loginService = async (data) => {
  try {
    const res = await axios.post("/auth/login", data);
    toast.success(res.data.message);
    return res;
  } catch (error) {
    console.log("error->", error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const currentUserService = async () => {
  try {
    const res = await axios.get("/auth/profile");
    toast.success(res.data.message);
     console.log("data from login->", res);
     return res;
  } catch (error) {
    console.log(error);
    
    toast.error(error.response.data.message);
  }
};  
export const logoutService = async () => {
  try {
    const res = await axios.post("/auth/logout" );
    toast.success(res.data.message);
    return res;
  } catch (error) {
    console.log("error->", error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const forgotPasswordService = async (data) => {
  try {
    const res = await axios.post("/auth/forgot-password", data);
    toast.success(res.data.message);
    return res;
  } catch (error) {
    console.log("error -->", error.response.data.message);
    toast.error(error.response.data.message);
  }
}
export const resetPasswordService = async (token, data) => {
  const res = axios.post(`/auth/reset-password/${token}`, data);
  try {
    const response = await res;
    toast.success(response.data.message);
    return response;
  } catch (error) {
    console.log("error -->", error.response.data.message);
    toast.error(error.response.data.message);
  }
}

export const updateUserProfile = async (data) => {
  try {
    const res = await axios.put("/auth/update", data);
    toast.success(res.data.message);
    return res;
  } catch (error) {
    console.log("error -->", error.response.data.message);
    toast.error(error.response.data.message);
  }
}

