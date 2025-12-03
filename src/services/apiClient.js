// apiClient.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) console.error("❌ Missing VITE_API_URL in your .env");

// ---------------- Constants ----------------
const ACCESS_TOKEN_KEY = "accessToken"; 

// ---------------- Axios Instance ----------------
const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // needed for refresh token cookie
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

    // Check for 401 and avoid infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      // Already refreshing → add request to queue
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
        // Call refresh API
        const res = await apiClient.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("No new access token");

        // Save new access token
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process waiting requests
        processQueue(null, newAccessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Clear user session
        localStorage.removeItem(ACCESS_TOKEN_KEY);

        // Redirect to login
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
