import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

export const useAddDamagedStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => apiClient.post("/damaged-stock", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["damaged-stock"]);
      queryClient.invalidateQueries(["stock"]); // if you have this
    },
  });
};

export const useDamagedStock = () => {
  return useQuery({
    queryKey: ["damaged-stock"],
    queryFn: async () => {
      const res = await apiClient.get("/damaged-stock");
      return res.data;
    },
  });
};
