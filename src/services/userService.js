import apiClient from "./apiClient";

const userService = {
 // services/userService.js
userCreate: async (data) => {
 
  const res = await apiClient.post("/user",data);
  return res.data;
},


  getUsers: async () => {
    const { data } = await apiClient.get("/user");
    return data;
  },


  getSingleUser: async (id) => {
    const { data } = await apiClient.get(`/user/${id}`);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await apiClient.delete(`/user/${id}`);
    return data;
  },

  updateUser: async (id, payload) => {
    const { data } = await apiClient.put(`/user/${id}`, payload);
    return data;
  },

}
export default userService;