import apiClient from "./apiClient";

const drugScheduleService = {
 // services/userService.js
drugScheduleCreate: async (data) => {

  const res = await apiClient.post("/drug_Schedule", data
);
  return res.data;
},



  drugScheduleget: async () => {
    const { data } = await apiClient.get("/drug_Schedule");
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





