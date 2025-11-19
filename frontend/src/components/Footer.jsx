import React from "react";
import "../styles/Footer.css";

export default function Footer({ setPage, onLogout }) {
  return (
    <footer className="app-footer">
      {/* Left Section */}
      <div className="footer-left">
        <p>© 2025 CIT-U | Library Web Portal.</p>
        <p>All rights reserved.</p>
      </div>

      {/* Center Section */}
      <div className="footer-center">
        <div className="footer-logo">
            <img src="cit_logo.png" alt="CIT-U Logo" />
        </div>
      </div>

      {/* Right Section */}
      <div className="footer-right">
        <span className="footer-link" onClick={() => setPage("dashboard")}>Home</span>
        <span className="footer-link" onClick={() => setPage("about")}>About</span>
        <span className="footer-link" onClick={onLogout}>Login</span>
      </div>
    </footer>
  );
}
