import authService from "@/services/authService";
import { useQuery } from "@tanstack/react-query";


export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    retry: false,
  });
};
