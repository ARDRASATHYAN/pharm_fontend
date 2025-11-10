
import itemService from "@/services/itemService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useitem() {
  return useQuery({
    queryKey: ["items"],
    queryFn: itemService.getitems,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function useAdditem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:itemService.itemCreate,
    onSuccess: () => queryClient.invalidateQueries(["items"]),
  });
}


export function useSingleitem() {
  return useMutation({
    mutationFn: (id) => itemService.getSingleitem(id),
  });
}

export function useUpdateitem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => itemService.updateitem(id, data),
    onSuccess: () => queryClient.invalidateQueries(["items"]),
  });
}

export function useDeleteitem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:itemService.deleteitem,
    onSuccess: () => queryClient.invalidateQueries(["items"]),
  });
}
