import apiClient from "./apiClient";

const userService = {

  // Create user
  userCreate: async (data) => {
    const res = await apiClient.post("/user", data);
    return res.data;
  },

  // Get all users (with search, filter, pagination, sorting)
getUsers: async (filters = {}) => {
  const { search = "", role = "", is_active = "", page = 1, perPage = 10 } = filters;
  const { data } = await apiClient.get("/user", {
    params: { search, role, is_active, page, perPage },
  });
  return data;
},



  // Get single user by ID
  getSingleUser: async (id) => {
    const { data } = await apiClient.get(`/user/${id}`);
    return data;
  },

  //Update user
  updateUser: async (id, payload) => {
    const { data } = await apiClient.put(`/user/${id}`, payload);
    return data;
  },

  //Delete user
  deleteUser: async (id) => {
    const { data } = await apiClient.delete(`/user/${id}`);
    return data;
  },
};

export default userService;
