import React from "react";
import "../styles/RequestCard.css";

export default function RequestCard({ title, author, source, estDate, status }) {
  return (
    <div className="request-card">
      <div className="request-card-header">
        <h4>{title}</h4>
        <span className={`pill ${status.toLowerCase()}`}>{status}</span>
      </div>
      <p className="author">{author}</p>
      <div className="request-card-footer">
        <span className="source">From: {source}</span>
        {status.toLowerCase() === "approved" && <span className="est-date">Est: {estDate}</span>}
      </div>
    </div>
  );
}
