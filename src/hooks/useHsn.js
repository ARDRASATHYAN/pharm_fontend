import hsnService from "@/services/hsnService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useHsn({ search = "", page = 1, perPage = 10 } = {}) {
  return useQuery({
    queryKey: ["hsns", search, page, perPage],
    queryFn: () => hsnService.getHsns({ search, page, perPage }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
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
