// src/pages/LogoutPage.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div style={{ textAlign: "center", padding: "3rem", color: "#701c1c" }}>
      <h2>Logging out...</h2>
      <p>You are being redirected to the login page.</p>
    </div>
  );
}
