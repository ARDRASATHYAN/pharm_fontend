import apiClient from "./apiClient";


const reportService = {

  // src/hooks/useReport.js or wherever your service is
getpurchasereport: async (filters = {}) => {
  const { data } = await apiClient.get("/purchase/report", { params: filters });
  return data;   
},





     getsalereport: async (filters = {}) => {
      const { data } = await apiClient.get("/reports/sale",{params: filters} );
      return data.data;
    },

    getPurchaseReturnReport: async (filters = {}) => {
      const { data } = await apiClient.get("/purchase-return/purchase-return",{params: filters} );
      return data.data;
    },

     getSalesReturnReport: async (filters = {}) => {
      const { data } = await apiClient.get("/reports/sale-return",{params: filters} );
      return data.data;
    },
 
};



export default reportService;
