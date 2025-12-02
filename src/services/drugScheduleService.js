import apiClient from "./apiClient";

const drugScheduleService = {
 // services/userService.js
drugScheduleCreate: async (data) => {

  const res = await apiClient.post("/drug_Schedule", data
);
  return res.data;
},



 drugScheduleget: async (filters = {}) => {
  const { search = "", page = 1, perPage = 10 } = filters;

  const { data } = await apiClient.get("/drug_Schedule", {
    params: { search, page, perPage },
  });

  return data;
},



  getSingledrugSchedule: async (id) => {
    const { data } = await apiClient.get(`/drug_Schedule/${id}`);
    return data;
  },

  deletedrugSchedule: async (id) => {
    const { data } = await apiClient.delete(`/drug_Schedule/${id}`);
    return data;
  },

  updatedrugSchedule: async (id, payload) => {
    const { data } = await apiClient.put(`/drug_Schedule/${id}`, payload);
    return data;
  },


}
export default  drugScheduleService;





