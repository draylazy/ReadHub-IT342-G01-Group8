import React from "react";
import { Book, Calculator, Zap } from "lucide-react";
import "../styles/Card.css";

export default function Card({ item }) {
  const renderIcon = () => {
    switch (item.type) {
      case "book": return <Book color="#d97706" size={24} />;
      case "calculator": return <Calculator color="#d97706" size={24} />;
      case "device": return <Zap color="#d97706" size={24} />;
      default: return <Book color="#d97706" size={24} />;
    }
  };

  const renderButtons = () => {
    switch (item.status) {
      case "Available":
        return (
          <>
            <button className="outline-btn">View Details</button>
            <button className="solid-btn">Request Book</button>
          </>
        );
      case "Checked Out":
        return (
          <>
            <button className="outline-btn">View Details</button>
            <button className="disabled-btn">Currently Checked Out</button>
          </>
        );
      case "Pending":
        return <button className="outline-btn full-width">View Details</button>;
      default:
        return null;
    }
  };

  const badgeColor = {
    "Available": { bg: "#E6F4EA", text: "#1E7E34" },
    "Checked Out": { bg: "#FDECEA", text: "#C62828" },
    "Pending": { bg: "#FEF7E0", text: "#B06000" }
  };

  return (
    <div className="dashboard-card">
      <div className="card-icon">{renderIcon()}</div>
      <h3>{item.title}</h3>
      <p className="author">{item.author}</p>
      <div className="badges">
        <span className="badge" style={{ backgroundColor: badgeColor[item.status].bg, color: badgeColor[item.status].text }}>
          {item.status}
        </span>
        <span className="badge condition">{item.condition}</span>
      </div>
      <div className="card-buttons">{renderButtons()}</div>
    </div>
  );
}
