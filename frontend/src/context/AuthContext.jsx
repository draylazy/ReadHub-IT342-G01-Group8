import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("readhub_token") || null);
  const [error, setError] = useState(null);

  // --- LOGOUT ---
  const logout = useCallback(() => {
    localStorage.removeItem("readhub_token");
    setToken(null);
    setUser(null);
    setError(null);
    navigate("/login");
  }, [navigate]);

  // --- FETCH USER PROFILE ---
  const fetchUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      logout(); // Invalid token, log out
    }
  }, [token, logout]);

  // --- useEffect calls fetchUserProfile once on mount or token change ---
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const data = res.data;
      localStorage.setItem("readhub_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setError(null);
    } catch (err) {
      setError(err.response?.data || "Login failed");
      throw err;
    }
  };

  // --- REGISTER ---
  const register = async (payload) => {
    try {
      await axios.post("/api/auth/register", payload);
      setError(null);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
      throw err;
    }
  };

  // --- UPDATE PROFILE ---
  const updateProfile = async (payload) => {
    if (!token) throw new Error("No token");
    try {
      const res = await axios.put("/api/users/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // --- DELETE ACCOUNT ---
  const deleteAccount = async () => {
    if (!token) throw new Error("No token");
    try {
      await axios.delete("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, error, login, register, logout, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}
