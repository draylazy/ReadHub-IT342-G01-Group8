import React from "react";
import "../styles/Navbar.css";

export default function Navbar({ activeTab, setActiveTab, onAddBookClick }) {
  const tabs = [
    { id: "browse", label: "Browse Items" },
    { id: "my-items", label: "My Items" },
    { id: "my-activity", label: "My Activity" },
  ];

  return (
    <div className="dashboard-navbar">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button className="add-book-btn" onClick={onAddBookClick}>+ Add Book</button>
    </div>
  );
}
