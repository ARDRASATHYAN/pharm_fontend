// src/hooks/useSalesReturn.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

// ✅ Create sales return
export const useAddSalesReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post("/sales-returns", data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Sales return created:", data);
      // invalidate if you have list query
      queryClient.invalidateQueries(["sales-returns"]);
    },
    onError: (error) => {
      console.error("Error creating sales return:", error);
    },
  });
};


export function useSalesReturnList() {
  return useQuery({
    queryKey: ["salesreturnlist"],
    queryFn: async () => {
      const res = await apiClient.get("/sales-return");
      return res.data;
    }
  });
}

export function usesalesreturnitems(returnId) {
  return useQuery({
    queryKey: ["salesreturnitem",returnId],
   queryFn: async () => {
      if (!returnId) return [];
      const res = await apiClient.get("/sales-return/item", {
        params: {return_id: returnId },
      });
      return res.data;
    },
     enabled: !!returnId,
  });
}

