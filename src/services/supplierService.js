import apiClient from "./apiClient";

const supplierService = {
 // services/userService.js
supplierCreate: async (data) => {

  const res = await apiClient.post("/supplier", data);
  return res.data;
},



  getSupplier: async () => {
    const { data } = await apiClient.get("/supplier");
    return data;
  },


  getSingleSupplier: async (id) => {
    const { data } = await apiClient.get(`/supplier/${id}`);
    return data;
  },

  deleteSupplier: async (id) => {
    const { data } = await apiClient.delete(`/supplier/${id}`);
    return data;
  },

  updateSupplier: async (id, payload) => {
    const { data } = await apiClient.put(`/supplier/${id}`, payload);
    return data;
  },

}
export default supplierService;