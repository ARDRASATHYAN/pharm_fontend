import apiClient from "./apiClient";

const purchaseInvoiceService = {
 // services/userService.js
purchaseInvoiceCreate: async (data) => {
  const res = await apiClient.post("/purchase_invoice",data);
  return res.data;
},



  getpurchaseInvoice: async () => {
    const { data } = await apiClient.get("/purchase_invoice");
    return data;
  },


  getSinglepurchaseInvoice: async (id) => {
    const { data } = await apiClient.get(`/purchase_invoice/${id}`);
    return data;
  },

  deletepurchaseInvoice: async (id) => {
    const { data } = await apiClient.delete(`/purchase_invoice/${id}`);
    return data;
  },

  updatepurchaseInvoice: async (id, payload) => {
    const { data } = await apiClient.put(`/purchase_invoice/${id}`, payload);
    return data;
  },

}
export default purchaseInvoiceService;