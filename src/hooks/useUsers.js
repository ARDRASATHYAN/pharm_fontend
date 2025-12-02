import userService from "@/services/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Get all users with optional filters
export function useUsers({ search = "", role = "", is_active = "", page = 1, perPage = 10 } = {}) {
  return useQuery({
    queryKey: ["users", search, role, is_active, page, perPage],
    queryFn: () => userService.getUsers({ search, role, is_active, page, perPage }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // cache 5 mins
  });
}




//Add user
export function useAddUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.userCreate,
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
}

// Get single user by ID
export function useSingleUser(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getSingleUser(id),
    enabled: !!id, // only run if id exists
  });
}

//Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
}

//Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
}
