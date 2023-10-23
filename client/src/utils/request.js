import axios from "axios";

const string = import.meta.env.PORT || "http://localhost:3000/api/";

const newRequest = axios.create({
  baseURL: string,
  withCredentials: false,
});

export default newRequest;
