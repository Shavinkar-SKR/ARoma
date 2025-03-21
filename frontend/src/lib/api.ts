import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api"; // Replace with your backend URL

export const fetchUserProfile = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, profile: any) => {
  const response = await axios.put(`${API_BASE_URL}/user/${userId}`, profile);
  return response.data;
};

export const fetchOrderHistory = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/orders?userId=${userId}`);
  return response.data;
};

export const reorder = async (orderId: string) => {
  const response = await axios.post(`${API_BASE_URL}/reorder`, { orderId });
  return response.data;
};
