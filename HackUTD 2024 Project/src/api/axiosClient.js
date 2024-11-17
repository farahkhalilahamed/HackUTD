import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5173", // Replace with your backend's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
