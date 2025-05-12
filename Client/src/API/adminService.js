import { toast } from "react-toastify";
import axios from "./axiosConfig.js";

export const getAllUser =async ()=>{
    try {
        const res = await axios.get("/admin/all-users")
        toast.success(res.data.message)
        return res
    } catch (error) {
        toast.error(error.response.data.message)
        return error
        
    }
}

export const DeleteUser =async (id)=>{
    try {
        console.log('id----->', id);
        
        const res = await axios.delete(`/admin/delete-user/${id}`)
        toast.success(res.data.message)
        return res
    } catch (error) {
        toast.error(error.response.data.message)
        return error
        
    }
}

export 
          const getAllBooking=async ()=>{
    try {
        const res = await axios.get("/admin/all-booking")
        toast.success(res.data.message)
        return res
    } catch (error) {
        toast.error(error.response.data.message)
        return error
        
    }
}

const getAllProperties =async ()=>{
    try {
        const res = await axios.get("/admin/all-properties")
        toast.success(res.data.message)
        return res
    } catch (error) {
        toast.error(error.response.data.message)
        return error
        
    }
}
const deleteProperty =async ()=>{
    try {
        const res = await axios.get(`/admin/delete-property/${id}`)
        toast.success(res.data.message)
        return res
    } catch (error) {
        toast.error(error.response.data.message)
        return error
        
    }
}
const deleteBooking =async ()=>{
    try {
        const res = await axios.get(`/delete-booking/${id}`)
        toast.success(res.data.message)
        return res
    } catch (error) {
        toast.error(error.response.data.message)
        return error
        
    }
}