import storeService from "@/services/storeService";
import supplierService from "@/services/supplierService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSupplier() {
  return useQuery({
    queryKey: ["supplier"],
    queryFn: supplierService.getSupplier,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function useAddSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:supplierService.supplierCreate,
    onSuccess: () => queryClient.invalidateQueries(["supplier"]),
  });
}


export function useSingleSupplier() {
  return useMutation({
    mutationFn: (id) => supplierService.getSingleSupplier(id),
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => supplierService.updateSupplier(id, data),
    onSuccess: () => queryClient.invalidateQueries(["supplier"]),
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:supplierService.deleteSupplier,
    onSuccess: () => queryClient.invalidateQueries(["supplier"]),
  });
}
