import stockService from "@/services/stockService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function usestock(filters) {
  const { search, page, perPage } = filters;

  return useQuery({
    queryKey: ["stock", search, page, perPage], // primitive values only
    queryFn: () => stockService.getStocks({ search, page, perPage }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}


const fetchStoreStock = async ({ queryKey }) => {
  const [, { store_id, item_id }] = queryKey;

  if (!store_id || !item_id) return [];

  const res = await apiClient.get("/stock/store-stock", {
    params: { store_id, item_id },
  });

  return res.data || [];
};

export const useStoreStock = (store_id, item_id) => {
  return useQuery({
    queryKey: ["storeStock", { store_id, item_id }],
    queryFn: fetchStoreStock,
    enabled: !!store_id && !!item_id, // only fetch when both exist
  });
};


export function useLowStock({ limit = 10, store_id } = {}) {
  return useQuery({
    queryKey: ["lowstock", limit, store_id],
    queryFn: () =>
      stockService.getLowStock({
        limit,
        store_id,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}



export function useExpiringStock({ limit = 10, store_id } = {}) {
  return useQuery({
    queryKey: ["expiringstock", limit, store_id],
    queryFn: () =>
      stockService.getExpiringStock({
        limit,
        store_id,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTotalMedicine({ store_id } = {}) {
  return useQuery({
    queryKey: ["totalmedicine",store_id],
    queryFn: () =>
      stockService.gettotalmedicine({
        store_id,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}


export function useCurrentStock({ page = 1, perPage = 10, store_id } = {}) {
  return useQuery({
    queryKey: ["currentstock", page, perPage, store_id],
    queryFn: () =>
      stockService.getCurrentstock({
        store_id,
        page,
        perPage,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}


export function useOutOfftStock({ page = 1, perPage = 10, store_id } = {}) {
  return useQuery({
    queryKey: ["outoffstock", page, perPage, store_id],
    queryFn: () =>
      stockService.getOutOffstock({
        store_id,
        page,
        perPage,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
