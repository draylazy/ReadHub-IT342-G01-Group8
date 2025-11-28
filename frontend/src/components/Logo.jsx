/* Logo.jsx */
import React from 'react';
import '../styles/Logo.css';

export default function Logo() {
  return (
    <div className="logo">
      <div className="logo-circle" aria-hidden>
        {/* white book icon centered in circle */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="logo-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6.5C4.833 5.5 6.667 5 8.5 5S12.167 5.5 14 6.5C15.833 7.5 17.667 8 19.5 8v9c-1.833 0-3.667-.5-5.5-1.5C11.667 15.5 9.833 15 8 15s-3.667.5-5.5 1.5V6.5z"></path>
        </svg>
      </div>

      <div className="logo-text">
        <div className="main-text">PEER ARCHIVE HUB</div>
        <div className="sub-text">LIBRARY WEB PORTAL</div>
      </div>
    </div>
  );
}
