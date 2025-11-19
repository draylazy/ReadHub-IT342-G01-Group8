// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export default function Header({ onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user & logout from context

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="main-header">
      {/* Top Header */}
      <div className="header-top">
        {/* Left: Logo & Branding */}
        <div className="header-left">
          <img src="/cit_logo.png" alt="CIT-U Logo" className="logo-img" />
          <div className="text-group">
            <span className="title">READ HUB</span>
            <span className="subtitle">LIBRARY WEB PORTAL</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="header-center">
          <input
            type="text"
            placeholder="Search events"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        {/* Right: Profile & Logout */}
        <div className="header-right">
          {/* Profile */}
          <div className="header-profile" onClick={handleProfileClick}>
            <div className="avatar">
              {user?.firstName?.[0]?.toUpperCase() || "R"}
            </div>
            <div className="profile-info">
              <span className="greeting">
                Hi, {user?.firstName || "Reader"}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button className="logout-btn" onClick={logout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-label">Log out</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="header-subnav">
        <div className="nav-link" onClick={() => navigate("/dashboard")}>Dashboard</div>
        <div className="nav-link" onClick={() => navigate("/library")}>Library</div>
        <div className="nav-link" onClick={() => navigate("/borrower")}>Borrower</div>
        <div className="nav-link" onClick={() => navigate("/loans")}>Lender</div>
      </div>
    </header>
  );
}
