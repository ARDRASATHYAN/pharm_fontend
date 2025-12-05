import apiClient from "./apiClient";

const stockService = {
  getStocks: async (filters) => {
    const res = await apiClient.get("/stock", {
      params: filters,
    });

    return res.data; // keep full data with pagination
  },
};

export default stockService;
