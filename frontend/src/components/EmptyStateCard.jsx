import React from "react";
import { FileText, Clock } from "lucide-react";
import "../styles/EmptyStateCard.css";

export default function EmptyStateCard({ title, message, icon }) {
  const Icon = icon === "Clock" ? Clock : FileText;

  return (
    <div className="empty-state-card">
      <Icon size={48} color="#666666" />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
