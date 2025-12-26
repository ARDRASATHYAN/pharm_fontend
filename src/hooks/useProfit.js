import apiClient from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useProfit = ({ page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ["profit", page, perPage], // react-query cache per page/perPage
    queryFn: async () => {
      const res = await apiClient.get("/profit", {
        params: { page, limit: perPage },
      });
      return res.data;
    },
    keepPreviousData: true, // optional, helps smooth page transitions
  });
};
