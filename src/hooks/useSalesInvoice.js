// src/hooks/useSalesInvoice.js
import apiClient from "@/services/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


// ✅ API call function
const createSalesInvoice = async (data) => {
  const res = await apiClient.post("/sales", data); // POST /api/sales
  return res.data;
};

// ✅ Hook to add a new sales invoice
export const useAddSalesInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalesInvoice,   // <-- function, not direct axios call
    onSuccess: (data) => {
      queryClient.invalidateQueries(["sales"]); // if you have a sales list query
      console.log("Sales invoice created:", data);
    },
    onError: (error) => {
      console.error("Error creating sales invoice:", error);
    },
  });
};

export function useSalesInvoiceList() {
  return useQuery({
    queryKey: ["salesinvoice"],
    queryFn: async () => {
      const res = await apiClient.get("/sales");
      return res.data;
    }
  });
}


export function useSalesItemsList() {
  return useQuery({
    queryKey: ["salesitems"],
    queryFn: async () => {
      const res = await apiClient.get("/sales/items");
      return res.data;
    }
  });
}


export const useSaleItems = (saleId) => {
  return useQuery({
    queryKey: ["saleItems", saleId],
    queryFn: async () => {
      if (!saleId) return [];
      
      // Pass saleId as query parameter
      const res = await apiClient.get(`/sales/saleid-item`, {
        params: { sale_id: saleId },
      });
      
      return res.data; // [{ item_id, item_name, rate, qty }, ...]
    },
    enabled: !!saleId, // only run if saleId exists
  });
};



export const useTotalCustomers = (storeId) => {
  return useQuery({
    queryKey: ["totalcustomers", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      // Pass saleId as query parameter
      const res = await apiClient.get(`/sales/sale-customer`, {
        params: { store_id: storeId },
      });
      
      return res.data; // [{ item_id, item_name, rate, qty }, ...]
    },
    enabled: !!storeId, // only run if saleId exists
  });
};

export const useTotalNetAmount = ({ store_id }) => {
  return useQuery({
    queryKey: ["totalNetAmount", store_id],
    queryFn: async () => {
      const res = await apiClient.get("/sales/total-sales", {
        params: { store_id },
      });
      return res.data; // { totalNetAmount: number }
    },
    enabled: !!store_id,
  });
};


export const useTodayNetAmount = ({ store_id }) => {
  return useQuery({
    queryKey: ["todayNetAmount", store_id],
    queryFn: async () => {
      const res = await apiClient.get("/sales/today-sales", {
        params: { store_id },
      });
      return res.data; // { totalNetAmount: number }
    },
    enabled: !!store_id,
  });
};





