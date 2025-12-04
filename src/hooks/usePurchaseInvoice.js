
import itemService from "@/services/itemService";
import purchaseInvoiceService from "@/services/purchaseInvoiceService";
import purchaseService from "@/services/purchaseService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function usepurchaseinvoice(filters) {
  return useQuery({
    queryKey: ["purchaseinvoice", filters],
    queryFn: () => purchaseService.getpurchaseInvoise(filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}



export function usepurchaseitems() {
  return useQuery({
    queryKey: ["purchaseitem"],
    queryFn: purchaseService.getpurchasItem,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function usePurchaseById(id) {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: () => purchaseService.getPurchaseById(id),
    enabled: !!id
  });
}


export function useAddpurchaseinvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:purchaseService.createPurchase,
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
