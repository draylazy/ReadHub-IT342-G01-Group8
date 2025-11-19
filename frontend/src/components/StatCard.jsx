import React from "react";
import "../styles/StatCard.css";

export default function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}
