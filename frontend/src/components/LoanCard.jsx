import React from "react";
import "../styles/LoanCard.css";

export default function LoanCard({ title, author, lender, dueDate, status, showRenew }) {
  return (
    <div className="loan-card">
      <div className="loan-card-header">
        <h4>{title}</h4>
        <span className="pill">{status}</span>
      </div>
      <p className="author">{author}</p>
      <div className="loan-card-footer">
        <span className="lender">Lender: {lender}</span>
        <span className="due-date">Due: {dueDate}</span>
      </div>
      {showRenew && <button className="renew-btn">Renew Loan</button>}
    </div>
  );
}
