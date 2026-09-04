import axios from "axios";

const api = axios.create({
  baseURL: "https://real-estate-nest-production.up.railway.app",
});

let isLoggingOut = false;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (
      error.response?.status === 401 &&
      !isLoggingOut &&
      window.location.pathname !== "/login"
    ) {
      isLoggingOut = true;

      localStorage.removeItem("token");

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
