import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL?.trim();

const normalizedBaseUrl = (() => {
  if (!rawBaseUrl) return "http://localhost:5000/api";
  const withoutTrailingSlash = rawBaseUrl.replace(/\/+$/, "");
  return /\/api$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
})();

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default api;
