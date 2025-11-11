import apiClient from "./apiClient";

const CustomerService = {
 // services/userService.js
customerCreate: async (data) => {
  const res = await apiClient.post("/customer", data
);
  return res.data;
},



  customerGet: async () => {
    const { data } = await apiClient.get("/customer");
    return data;
  },


  getSinglecustomer: async (id) => {
    const { data } = await apiClient.get(`/customer/${id}`);
    return data;
  },

  deletecustomer: async (id) => {
    const { data } = await apiClient.delete(`/customer/${id}`);
    return data;
  },

  updatecustomer: async (id, payload) => {
    const { data } = await apiClient.put(`/customer/${id}`, payload);
    return data;
  },


}
export default  CustomerService;





