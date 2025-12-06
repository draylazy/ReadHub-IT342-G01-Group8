import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./UserDashboard.css";

export default function UserDashboard() {
  const { logout, user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowConfirm(false);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div className="user-page">
      <div className="user-container">
        <h1>Welcome, {user?.firstName}</h1>
        <h3>User Dashboard</h3>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* --- Confirmation Modal --- */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
