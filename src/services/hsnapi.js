import axios from "axios";

const BASE_URL = "http://localhost:4000";

export const getStores = async () => {
  const response = await axios.get(`${BASE_URL}/hsn`);
  return response.data;
};

export const createStore = async (store) => {
  const response = await axios.post(BASE_URL, store);
  return response.data;
};

export const updateStore = async (id, store) => {
  const response = await axios.put(`${BASE_URL}/${id}`, store);
  return response.data;
};

export const deleteStore = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
