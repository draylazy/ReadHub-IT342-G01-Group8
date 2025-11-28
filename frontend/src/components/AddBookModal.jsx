import React, { useState } from "react";
import "../styles/AddBookModal.css";

export default function AddBookModal({ onClose }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [condition, setCondition] = useState("");

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Add Book</h2>
          <button onClick={onClose}>✖</button>
        </div>
        <p>List a book or resource...</p>
        <div className="modal-body">
          <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="book">Book</option>
            <option value="calculator">Calculator</option>
            <option value="device">Device</option>
          </select>
          <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <select value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="">Select Condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="outline-btn" onClick={onClose}>Cancel</button>
          <button className="solid-btn">Add Item</button>
        </div>
      </div>
    </div>
  );
}
