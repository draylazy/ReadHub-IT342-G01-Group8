import React from "react";
import "../styles/ActionCard.css";

export default function ActionCard({ title, subtitle }) {
  return (
    <div className="action-card">
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
  );
}
