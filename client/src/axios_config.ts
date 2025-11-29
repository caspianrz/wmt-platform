import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import toast from "react-hot-toast";

type Headers = Record<string, string>;

const api: AxiosInstance = axios.create({
  baseURL: "https://your-api-url.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("ttt");
    if (token) {
      (config.headers as Headers).Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        toast.error("You are not logged in. Please log in first.");
        // optional: redirect to login page
      } else if (status === 403) {
        toast.error("You do not have permission to perform this action.");
      } else {
        toast.error(`API Error: ${error.response.statusText}`);
      }
    } else {
      toast.error("Network Error or Server is down.");
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
