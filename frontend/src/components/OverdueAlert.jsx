/* src/components/OverdueAlert.jsx */
import React from "react";
import "../styles/OverdueAlert.css";

export default function OverdueAlert() {
  return (
    <section className="overdue-alert">
      <div className="overdue-left">
        <div className="overdue-icon">!</div>
        <div className="overdue-text">
          <h4>You have 1 overdue item(s)</h4>
          <p>Please return these items as soon as possible to avoid penalties.</p>
        </div>
      </div>
      <button className="overdue-button">View Overdue</button>
    </section>
  );
}
