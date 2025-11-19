// pages/LogoutPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LogoutPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth
    setUser(null);
    localStorage.removeItem("authUser");

    // Redirect to login
    navigate("/login");
  }, [setUser, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--bg-primary)",
        color: "white",
        fontFamily: "Inter, sans-serif",
        fontSize: "1.2rem"
      }}
    >
      Logging out...
    </div>
  );
}
