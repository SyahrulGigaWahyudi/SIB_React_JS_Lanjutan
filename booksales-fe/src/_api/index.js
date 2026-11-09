import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Setiap request otomatis membawa token (kalau sudah login)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau token ditolak (sesi habis), bersihkan data login lalu ke halaman login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthRequest = url === "/login" || url === "/logout";

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;