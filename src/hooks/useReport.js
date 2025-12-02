import reportService from "@/services/reportService";
import { useQuery } from "@tanstack/react-query";

export function usePurchaseReport(filters = {}) {
  return useQuery({
    queryKey: ["purchase-report", filters], // refetch when filters change
    queryFn: () => reportService.getpurchasereport(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}


export function useSaleReport(filters = {}) {
  return useQuery({
    queryKey: ["sale-report", filters], // refetch when filters change
    queryFn: () => reportService.getsalereport(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function usePurchaseReturnReport(filters = {}) {
  return useQuery({
    queryKey: ["purchase-return-report", filters], // refetch when filters change
    queryFn: () => reportService.getPurchaseReturnReport(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}


export function useSalesReturnReport(filters = {}) {
  return useQuery({
    queryKey: ["sale-return-report", filters], // refetch when filters change
    queryFn: () => reportService.getSalesReturnReport(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}