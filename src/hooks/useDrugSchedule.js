import drugScheduleService from "@/services/drugScheduleService";
import hsnService from "@/services/hsnService";
import storeService from "@/services/storeService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useDrugSchedule() {
  return useQuery({
    queryKey: ["drugschedule"],
    queryFn: drugScheduleService.drugScheduleget,
    staleTime: 1000 * 60 * 5, // 5 min cache
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
