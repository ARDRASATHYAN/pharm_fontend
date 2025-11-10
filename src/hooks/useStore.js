import storeService from "@/services/storeService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: storeService.getstores,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function useAddStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:storeService.storeCreate,
    onSuccess: () => queryClient.invalidateQueries(["stores"]),
  });
}


export function useSingleStore() {
  return useMutation({
    mutationFn: (id) => storeService.getSinglestore(id),
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => storeService.updatestore(id, data),
    onSuccess: () => queryClient.invalidateQueries(["stores"]),
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:storeService.deletestore,
    onSuccess: () => queryClient.invalidateQueries(["stores"]),
  });
}
