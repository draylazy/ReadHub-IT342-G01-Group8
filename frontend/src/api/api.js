// import axios from "axios";

// const API_URL = "http://localhost:8080/api/auth";

// export const registerUser = async (data) => {
//   return await axios.post(`${API_URL}/register`, data);
// };

// export const loginUser = async (data) => {
//   return await axios.post(`${API_URL}/login`, data);
// };

// src/api/api.js  (optional)
import axiosInstance from "./axiosInstance";

export const api = {
  register: (payload) => axiosInstance.post("/auth/register", payload).then(r => r.data),
  login: (email, password) => axiosInstance.post("/auth/login", { email, password }).then(r => r.data),
  getProfile: () => axiosInstance.get("/users/profile").then(r => r.data),
  updateProfile: (payload) => axiosInstance.put("/users/profile", payload).then(r => r.data),
  deleteProfile: () => axiosInstance.delete("/users/profile").then(r => r.data),
};
