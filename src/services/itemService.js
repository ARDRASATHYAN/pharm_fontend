import apiClient from "./apiClient";

const itemService = {
 // services/userService.js
 itemCreate: async (data) => {
  const res = await apiClient.post("/items",data);
  return res.data;
},



  getitems: async () => {
    const { data } = await apiClient.get("/items");
    return data;
  },


  getSingleitem: async (id) => {
    const { data } = await apiClient.get(`/items/${id}`);
    return data;
  },

  deleteitem: async (id) => {
    const { data } = await apiClient.delete(`/items/${id}`);
    return data;
  },

  updateitem: async (id, payload) => {
    const { data } = await apiClient.put(`/items/${id}`, payload);
    return data;
  },

}
export default  itemService;