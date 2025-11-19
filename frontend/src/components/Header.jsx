// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import "../styles/Header.css";
import { useAuth } from "../context/AuthContext";

export default function Header({ onSearch }) {
  const navigate = useNavigate();
  const { user } = useAuth();   // Get user directly from context

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="main-header">

      <div className="header-top">

        {/* Left */}
        <div className="header-left">
          <img src="/cit_logo.png" alt="CIT-U Logo" className="logo-img" />
          <div className="text-group">
            <span className="title">READ HUB</span>
            <span className="subtitle">LIBRARY WEB PORTAL</span>
          </div>
        </div>

        {/* Center */}
        <div className="header-center">
          <input
            type="text"
            placeholder="Search events"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        {/* Right */}
        <div className="header-right">

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
          <Logout />

        </div>
      </div>

      <div className="header-subnav">
        <div className="nav-link" onClick={() => navigate("/dashboard")}>Dashboard</div>
        <div className="nav-link" onClick={() => navigate("/library")}>Library</div>
        <div className="nav-link" onClick={() => navigate("/borrower")}>Borrower</div>
        <div className="nav-link" onClick={() => navigate("/loans")}>Lender</div>
      </div>

    </header>
  );
}
