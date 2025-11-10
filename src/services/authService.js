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
};


export default authService;
