import React from "react";
import { useAuth } from "../context/AuthContext";
import "./UserDashboard.css";

export default function UserDashboard() {
  const { logout, user } = useAuth();

  return (
    <div className="user-page">
      <div className="user-container">
        <h1>Welcome, {user?.firstName}</h1>
        <h3>User Dashboard</h3>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
