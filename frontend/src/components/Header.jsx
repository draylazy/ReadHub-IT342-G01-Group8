import React from "react";
import { Book, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

const Header = ({ onProfileClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="logo-box">
          <Book color="white" size={28} strokeWidth={2} />
        </div>
        <div className="brand-text">
          <h1 className="app-title">ReadHub Book Management</h1>
          <p className="user-greeting">Welcome, {user?.name || "Student User"}</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn-profile" onClick={onProfileClick}>
          <User size={16} /> Profile
        </button>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
