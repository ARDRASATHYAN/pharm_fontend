import apiClient from "./apiClient";

const supplierService = {
 // services/userService.js
supplierCreate: async (data) => {

  const res = await apiClient.post("/supplier", data);
  return res.data;
},



 getSupplier: async (filters = {}) => {
  const { page = 1, perPage = 10, search = "" } = filters;
  const { data } = await apiClient.get("/supplier", {
    params: { page, limit: perPage, search },
  });
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