import React from "react";
import "../styles/BookChip.css";

export default function BookChip({ title, author, tag }) {
  return (
    <div className="book-chip">
      <h4>{title}</h4>
      <p>{author}</p>
      {tag && <span className="tag">{tag}</span>}
    </div>
  );
}
