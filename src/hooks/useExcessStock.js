import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

export const useAddExcessStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => apiClient.post("/excess-stock", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["excess-stock"]);
      queryClient.invalidateQueries(["stock"]); // if you have this
    },
  });
};

export const useExcessStock = () => {
  return useQuery({
    queryKey: ["excess-stock"],
    queryFn: async () => {
      const res = await apiClient.get("/excess-stock");
      return res.data;
    },
  });
};
