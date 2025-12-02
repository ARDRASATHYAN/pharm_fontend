import itemService from "@/services/itemService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useItem({ search = "", page = 1, perPage = 10 } = {}) {
  return useQuery({
    queryKey: ["items", search, page, perPage],
    queryFn: () => itemService.getitems({ search, page, perPage }),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdditem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemService.itemCreate,
    onSuccess: () => queryClient.invalidateQueries(["items"]),
  });
}

export function useSingleitem(id) {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => itemService.getSingleitem(id),
    enabled: !!id,
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
    mutationFn: (id) => itemService.deleteitem(id),
    onSuccess: () => queryClient.invalidateQueries(["items"]),
  });
}
