import { toast } from "react-toastify";
import axios from "./axiosConfig.js";


 export const  createReview = async (data)=>{
    try {
        console.log('data_---->', data);
        
        const res  =axios.post("/review/create", data)
         toast.success(res?.data?.data?.message)
        return res;
    } catch (error) {
        
        return error;
    }
 }