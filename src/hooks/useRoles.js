import roleService from "@/services/commenService";
import { useQuery} from "@tanstack/react-query";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: roleService.getroles,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}