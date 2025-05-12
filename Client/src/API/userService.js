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
export const logoutService = async (data) => {
  try {
    const res = await axios.post("/auth/logout");
    toast.success(res.data.message);
    return res;
  } catch (error) {
    console.log("error->", error.response.data.message);
    toast.error(error.response.data.message);
  }
};


