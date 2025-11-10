import userService from "@/services/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export function useAddUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:userService.userCreate,
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
}


export function useSingleUser() {
  return useMutation({
    mutationFn: (id) => userService.getSingleUser(id),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
}
