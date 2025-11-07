// apiClient.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) console.error("❌ Missing VITE_API_URL in your .env");

// Constants
const ACCESS_TOKEN_KEY = "accessToken"; // localStorage key
const REFRESH_INTERVAL = 50 * 1000; // 50s, adjust < access token expiry

// Create Axios instance
const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // send cookies (refresh token)
});

// ---------------- Queue Mechanism ----------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// ---------------- Request Interceptor ----------------
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- Response Interceptor ----------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await apiClient.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("No new access token received");

        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ---------------- Silent Background Refresh ----------------
setInterval(async () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token || isRefreshing) return;

  isRefreshing = true;
  try {
    const res = await apiClient.post("/auth/refresh");
    const newAccessToken = res.data.accessToken;

    if (newAccessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);
      console.log("🔁 Access token auto-refreshed in background");
    }
  } catch (err) {
    processQueue(err, null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = "/";
  } finally {
    isRefreshing = false;
  }
}, REFRESH_INTERVAL);

export default apiClient;
