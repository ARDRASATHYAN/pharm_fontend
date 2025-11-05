import axios from "axios";

const BASE_URL = "http://localhost:4000";

export const fetchdrug = async () => {
  const response = await axios.get(`${BASE_URL}/drug_schedule_master`);
  return response.data;
};

export const createdrug = async (store) => {
  const response = await axios.post(BASE_URL, store);
  return response.data;
};

export const updatedrug= async (id, store) => {
  const response = await axios.put(`${BASE_URL}/${id}`, store);
  return response.data;
};

export const deletedrug = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
