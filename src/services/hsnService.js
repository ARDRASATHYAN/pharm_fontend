import apiClient from "./apiClient";

const hsnService = {
 // services/userService.js
 hsnCreate: async (data) => {
  const res = await apiClient.post("/hsn", data);
  return res.data;
},



  getHsns: async (filters = {}) => {
     const { search = "", page = 1, perPage = 10 } = filters;
    const { data } = await apiClient.get("/hsn", {
    params: { search,page, perPage },
  });
    return data;
  },
 

  getSinglehsn: async (id) => {
    const { data } = await apiClient.get(`/hsn/${id}`);
    return data;
  },

  deletehsn: async (id) => {
    const { data } = await apiClient.delete(`/hsn/${id}`);
    return data;
  },

  updatehsn: async (id, payload) => {
    const { data } = await apiClient.put(`/hsn/${id}`, payload);
    return data;
  },

}
export default  hsnService;