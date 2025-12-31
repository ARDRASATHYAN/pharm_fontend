// src/services/purchaseReturnService.js
import apiClient from "./apiClient";

const purchaseReturnService = {
  createPurchaseReturn: async (payload) => {
    const { data } = await apiClient.post("/purchase-return", payload);
    return data;
  },

  // 📄 List Purchase Returns
getPurchaseReturnList: async (params) => {
  const { data } = await apiClient.get("/purchasereturn", { params });
  return data;
},


  // 📦 Get Purchase Return Items
  getPurchaseReturnItems: async () => {
    const { data } = await apiClient.get("/purchasereturn/items");
    return data;
  },
};

export default purchaseReturnService;
