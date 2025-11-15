// src/api/purchaseApi.js
import axios from "axios";

const API_BASE =import.meta.env.VITE_API_URL|| ""; // set e.g. REACT_APP_API_BASE=http://localhost:5000

export const createPurchase = async (payload) => {
  // POST /api/purchase
  const res = await axios.post(`${API_BASE}/purchase`, payload);
  return res.data;
};

export const getMeta = async () => {
  const res = await axios.get(`${API_BASE}/purchase/meta`);
  return res.data;
};

// optional: get purchase by id if backend offers it
export const getPurchaseById = async (id) => {
  const res = await axios.get(`${API_BASE}/purchase/${id}`);
  return res.data;
};
