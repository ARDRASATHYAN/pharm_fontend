import apiClient from "./apiClient";


const stockService = {
 
    getStocks: async () => {
      const res= await apiClient.get("/stock");
      return res.data.data;
    },
};

export default stockService;
