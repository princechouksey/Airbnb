import { toast } from "react-toastify";
import axios from "./axiosConfig.js";


export const createBookingService = async (data) => {
    try {
  
      const res = await axios.post("/booking/create", data);
      toast.success(res.data.message);
      return res;
    } catch (error) {
      console.log("error->", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  export const AllBooking = async ()=>{
    try {
      const res = await axios.get('/booking/get-all-booking')
      toast.success(res.data.message);
      return res;
    } catch (error) {
      console.log("error->", error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

    export const cancelBooking = async (id)=>{
    try {
      const res = await axios.put(`booking/cancel/${id}`)
      toast.success(res.data.message);
      return res;
    } catch (error) {
      console.log("error->", error.response.data.message);
      toast.error(error.response.data.message);
    }
  }