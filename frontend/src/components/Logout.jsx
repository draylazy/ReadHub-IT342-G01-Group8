// src/components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         // AuthContext handles removing token + user
    navigate("/login");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      <span className="logout-icon">🚪</span>
      <span className="logout-label">Log out</span>
    </button>
  );
}
