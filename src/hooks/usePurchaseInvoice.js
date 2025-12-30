
import itemService from "@/services/itemService";
import purchaseInvoiceService from "@/services/purchaseInvoiceService";
import purchaseService from "@/services/purchaseService";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

export function usepurchaseinvoice(filters) {
  return useQuery({
    queryKey: ["purchaseinvoice", filters],
    queryFn: () => purchaseService.getpurchaseInvoise(filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInfinitepurchaseinvoice({ search = "" } = {}) {
  return useInfiniteQuery({
    queryKey: ["purchaseinvoice", search],

    queryFn: ({ pageParam = 1 }) =>
      purchaseService.getpurchaseInvoise({
        search,
        page: pageParam,
        perPage: 10, // keep consistent
      }),

    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
  });
}



export const usePurchaseItemsByPurchaseId = (purchase_id) => {
  return useQuery({
    queryKey: ["purchase-items", purchase_id],
    queryFn: () => purchaseService.getPurchaseItemsByPurchaseId(purchase_id),
    enabled: !!purchase_id,
  });
};




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


export function usePurchaseTodayNetAmount({ store_id } = {}) {
  return useQuery({
    queryKey: ["todayNetamount",store_id],
    queryFn: () =>
      purchaseInvoiceService.getTodayNetAmount({
        store_id,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}


export function usePurchaseTotalNetAmount({ store_id } = {}) {
  return useQuery({
    queryKey: ["totalNetamount",store_id],
    queryFn: () =>
      purchaseInvoiceService.getTotalNetAmount({
        store_id,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}