import apiClient from "./apiClient";

const authService = {
  login: async (username, password) => {
    const { data } = await apiClient.post("/auth/login", { username, password });
    localStorage.setItem("accessToken", data.accessToken);
    return data.user;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("accessToken");
  },

  getCurrentUser: async () => {
    const { data } = await apiClient.get("/auth/profile"); // ✅ Correct endpoint
    console.log("✅ Current user:", data.user);
    return data.user;
  },

};


export default authService;
