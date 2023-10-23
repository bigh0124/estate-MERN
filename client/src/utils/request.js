import axios from "axios";

const url = import.meta.env.VITE_PORT || "http://localhost:3000/api/";

const newRequest = axios.create({
  baseURL: url,
  withCredentials: false,
});

export default newRequest;
