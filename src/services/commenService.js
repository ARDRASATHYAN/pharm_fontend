import apiClient from "./apiClient";

const roleService = {

  getroles: async () => {
    const { data } = await apiClient.get("/role");
    return data.data;
  },

}
export default roleService;