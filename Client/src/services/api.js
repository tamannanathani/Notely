import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message === "jwt expired") {
      localStorage.removeItem("token"); // logout
      window.location.href = "/login";  // redirect
    }
    return Promise.reject(error);
  }
);
export default api;
