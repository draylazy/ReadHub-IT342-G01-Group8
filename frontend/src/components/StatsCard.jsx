import React from "react";
import "../styles/StatsCard.css";

export default function StatsCard({ title, count, color }) {
  return (
    <div className="stats-card" style={{ borderTop: `4px solid ${color}` }}>
      <h4>{title}</h4>
      <p>{count}</p>
    </div>
  );
}
