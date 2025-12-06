import apiClient from "./apiClient";


const purchaseService = {
  createPurchase: async (payload) => {
    const { data } = await apiClient.post("/purchase", payload);
    return data;
  },
  getpurchaseInvoise: async (filters = {}) => {
  const { data } = await apiClient.get("/purchase/invoice", {
    params: filters,   // <-- send page, perPage, search, etc.
  });
  return data;
},

    getpurchasItem: async () => {
      const { data } = await apiClient.get("/purchase/items");
      return data;
    },
    getPurchaseById: async (id) => {
  const { data } = await apiClient.get(`/purchase/${id}`);
  return data;
},


  getPurchaseItemsByPurchaseId: async (purchase_id) => {
  const { data } = await apiClient.get(`/purchase/purchaseid-item`, {
    params: { purchase_id }
  });
  return data;
}
};

export default purchaseService;
