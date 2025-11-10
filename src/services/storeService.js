import apiClient from "./apiClient";

const storeService = {
 // services/userService.js
storeCreate: async (data) => {

  const res = await apiClient.post("/store", data);
  return res.data;
},



  getstores: async () => {
    const { data } = await apiClient.get("/store");
    return data;
  },


  getSinglestore: async (id) => {
    const { data } = await apiClient.get(`/store/${id}`);
    return data;
  },

  deletestore: async (id) => {
    const { data } = await apiClient.delete(`/store/${id}`);
    return data;
  },

  updatestore: async (id, payload) => {
    const { data } = await apiClient.put(`/store/${id}`, payload);
    return data;
  },

}
export default storeService;