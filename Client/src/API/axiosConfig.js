import axios from "axios";

const instance = axios.create({
  baseURL: "https://airbnb-yfw9.onrender.com/api",
  withCredentials: true,
});

export default instance;
