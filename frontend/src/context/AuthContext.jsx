// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAuthToken } from "../api/axiosInstance";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("readhub_token"));
  const [error, setError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // apply token to axios every change
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // logout
  const logout = useCallback(() => {
    localStorage.removeItem("readhub_token");
    setToken(null);
    setUser(null);
    setError(null);
    setAuthToken(null);
    navigate("/login");
  }, [navigate]);

  // fetch profile
  const fetchUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingProfile(true);
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("PROFILE FETCH FAILED", err);
      logout();
    } finally {
      setLoadingProfile(false);
    }
  }, [token, logout]);

  // fetch profile only if token exists AND after login sets token
  useEffect(() => {
    if (token) fetchUserProfile();
  }, [token, fetchUserProfile]);

  // login
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      const receivedToken =
        data.token || data.accessToken || data.jwt || null;

      if (!receivedToken) {
        throw new Error("Backend returned no token");
      }

      localStorage.setItem("readhub_token", receivedToken);
      setToken(receivedToken);
      setAuthToken(receivedToken);

      // if backend sends user directly, use it
      if (data.user) {
        setUser(data.user);
      } else {
        await fetchUserProfile();
      }

      setError(null);
      return data;
    } catch (err) {
      console.error("LOGIN ERROR:", err?.response || err);
      setError(err.response?.data || "Login failed");
      throw err;
    }
  };

  // register
  const register = async (payload) => {
    try {
      await axiosInstance.post("/auth/register", payload);
      setError(null);
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err?.response || err);
      setError(err.response?.data || "Registration failed");
      throw err;
    }
  };

  // update profile
  const updateProfile = async (payload) => {
    try {
      const res = await axiosInstance.put("/users/profile", payload);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      await axiosInstance.delete("/users/profile");
      logout();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        loadingProfile,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
