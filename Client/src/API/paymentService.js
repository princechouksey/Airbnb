import { toast } from "react-toastify";
import axios from "./axiosConfig.js";


export const verifyPaymentService  = async (data) => {
    try {
        console.log('data --->', data);
        
    const res = await axios.post("/payment/payment-verify", data)
    toast.success(res.data.message)
    return res
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error.response.data.message);
        
    }

}

export const getPayments = async () => {
    try {
       
        
    const res = await axios.get("/payment/get-payment")
    toast.success(res.data.message)
    return res
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error.response.data.message);
        
    }

}

export const deletePayment = async (id) => {
    try {
       
        
    const res = await axios.delete(`/payment/payment/${id}`)
    toast.success(res.data.message)
    return res
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error.response.data.message);
        
    }

}