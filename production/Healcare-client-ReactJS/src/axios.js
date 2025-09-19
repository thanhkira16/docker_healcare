import axios from "axios";
import _ from "lodash";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // withCredentials: true
});

instance.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", response);
    // Original behavior
    return response.data;
  },
  (error) => {
    console.error("Axios Error:", error);
    return Promise.reject(error);
  }
);

export default instance;
