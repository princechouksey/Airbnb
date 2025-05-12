import { toast } from "react-toastify";
import axios from "./axiosConfig.js";


export const getAllProperty = async () => {
    try {
      const res = await axios.get("/property/get-all");
      toast.success(res.data.message);
      return res;
    } catch (error) {
      console.log("error->", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  export const getSingleProperty = async (id) => {
    try { 
      const res = await axios.get(`/property/get/${id}`);

      toast.success(res.data.message);
      return res;
    } catch (error) {
      console.log("error->", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  export const editSingleProperty = async (data, id)=>{
    try {
      // console.log('data from api _------>', data , id , `property/update/${id}`  );
      
    const res = await axios.put(`property/update/${id}`, data)
    toast.success(res.data.message)
    console.log('res ---------->', res);
    
      return res;
    } catch (error) {
       toast.error(error.response.data.message)
      return error
      
    }
  }
    export const deleteSingleProperty = async ( id)=>{
    try {
      // console.log('data from api _------>', data , id , `property/update/${id}`  );
      
    const res = await axios.delete(`property/delete/${id}`)
    toast.success(res.data.message)
    console.log('res ---------->', res);
    
      return res;
    } catch (error) {
       toast.error(error.response.data.message)
      return error
      
    }
  }


  export const createProperty = async (data) => {
    try {
      
      const res = await axios.post("/property/create", data);
      toast.success(res.data.message);
      return res;
    } catch (error) {
      console.log("error->", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  export const getReviewByPropertyId = async (id) => {
    try {
      const res = await axios.get(`/property/get-review/${id}`);
      toast.success(res.data.message);
      return res;
    } catch (error) {
      console.log("error->", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };





