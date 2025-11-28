// src/api/axiosInstance.js
import axios from "axios";

const API_BASE = "http://localhost:8080/api"; // explicit backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // optional
});

// helper to set/unset token
export function setAuthToken(token) {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

export default axiosInstance;
