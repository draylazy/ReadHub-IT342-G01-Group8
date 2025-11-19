import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("readhub_token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("readhub_token");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // Load user info on refresh if token exists
  useEffect(() => {
    if (token) {
      API.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      // backend returns token + user
      const { token, user } = response.data;

      localStorage.setItem("readhub_token", token);
      setToken(token);
      setUser(user);

      navigate("/dashboard");

    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      await API.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
