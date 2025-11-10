import hsnService from "@/services/hsnService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useHsn() {
  return useQuery({
    queryKey: ["hsns"],
    queryFn: hsnService.getHsns,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function useAddHsn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:hsnService.hsnCreate,
    onSuccess: () => queryClient.invalidateQueries(["hsns"]),
  });
}


export function useSingleHsn() {
  return useMutation({
    mutationFn: (id) => hsnService.getSinglehsn(id),
  });
}

export function useUpdateHsn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => hsnService.updatehsn(id, data),
    onSuccess: () => queryClient.invalidateQueries(["hsns"]),
  });
}

export function useDeleteHsn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:hsnService.deletehsn,
    onSuccess: () => queryClient.invalidateQueries(["hsns"]),
  });
}
