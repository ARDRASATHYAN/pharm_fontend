import CustomerService from "@/services/customerService";
import storeService from "@/services/storeService";
import supplierService from "@/services/supplierService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCustomer() {
  return useQuery({
    queryKey: ["customer"],
    queryFn: CustomerService.customerGet,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function useAddCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:CustomerService.customerCreate,
    onSuccess: () => queryClient.invalidateQueries(["customer"]),
  });
}


export function useSingleCustomer() {
  return useMutation({
    mutationFn: (id) => CustomerService.getSinglecustomer(id),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => CustomerService.updatecustomer(id, data),
    onSuccess: () => queryClient.invalidateQueries(["customer"]),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:CustomerService.deletecustomer,
    onSuccess: () => queryClient.invalidateQueries(["customer"]),
  });
}
