import apiClient from "./apiClient";

const stockService = {
  getStocks: async (filters) => {
    const res = await apiClient.get("/stock", {
      params: filters,
    });

    return res.data; // keep full data with pagination
  },

 getLowStock: async (params) => {
  const res = await apiClient.get("/stock/low-stock", {
    params,
  });
  return res.data;
 },


 getExpiringStock: async (params) => {
  const res = await apiClient.get("/stock/expiring-stock", {
    params,
  });
  return res.data;
 },


 gettotalmedicine:async(params)=>{
  const res=await apiClient.get("/stock/total-stock-medicine",{params})
  return res.data;
 }
}

 


export default stockService;
