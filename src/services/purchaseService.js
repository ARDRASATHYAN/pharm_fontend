import apiClient from "./apiClient";


const purchaseService = {
  createPurchase: async (payload) => {
    const { data } = await apiClient.post("/purchase", payload);
    return data;
  },
   getpurchaseInvoise: async () => {
      const { data } = await apiClient.get("/purchase/invoice");
      return data;
    },
    getpurchasItem: async () => {
      const { data } = await apiClient.get("/purchase/items");
      return data;
    },
    getPurchaseById: async (id) => {
  const { data } = await apiClient.get(`/purchase/${id}`);
  return data;
}

};

export default purchaseService;
