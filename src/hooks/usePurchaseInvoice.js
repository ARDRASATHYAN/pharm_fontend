
import itemService from "@/services/itemService";
import purchaseInvoiceService from "@/services/purchaseInvoiceService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function usepurchaseinvoice() {
  return useQuery({
    queryKey: ["purchaseinvoice"],
    queryFn: purchaseInvoiceService.getpurchaseInvoice,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function useAddpurchaseinvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:purchaseInvoiceService.purchaseInvoiceCreate,
    onSuccess: () => queryClient.invalidateQueries(["purchaseinvoice"]),
  });
}


export function useSinglepurchaseinvoice() {
  return useMutation({
    mutationFn: (id) => purchaseInvoiceService.getSinglepurchaseInvoice(id),
  });
}

export function useUpdatepurchaseinvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => purchaseInvoiceService.updatepurchaseInvoice(id, data),
    onSuccess: () => queryClient.invalidateQueries(["purchaseinvoice"]),
  });
}

export function useDeletepurchaseinvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:purchaseInvoiceService.deletepurchaseInvoice,
    onSuccess: () => queryClient.invalidateQueries(["purchaseinvoice"]),
  });
}
