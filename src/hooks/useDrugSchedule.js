import drugScheduleService from "@/services/drugScheduleService";
import hsnService from "@/services/hsnService";
import storeService from "@/services/storeService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useDrugSchedule(filters = {}) {
  const { search = "", page = 1, perPage = 10 } = filters;

  return useQuery({
    queryKey: ["drugschedule", search, page, perPage],
    queryFn: () => drugScheduleService.drugScheduleget({ search, page, perPage }),
    staleTime: 1000 * 60 * 5,
  });
}


export function useAddDrugSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:drugScheduleService.drugScheduleCreate,
    onSuccess: () => queryClient.invalidateQueries(["drugschedule"]),
  });
}


export function useSingleDrugSchedule() {
  return useMutation({
    mutationFn: (id) => drugScheduleService.getSingledrugSchedule(id),
  });
}

export function useUpdateDrugSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => drugScheduleService.updatedrugSchedule(id, data),
    onSuccess: () => queryClient.invalidateQueries(["drugschedule"]),
  });
}

export function useDeleteDrugSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:drugScheduleService.deletedrugSchedule,
    onSuccess: () => queryClient.invalidateQueries(["drugschedule"]),
  });
}
