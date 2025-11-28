import React, { useState } from "react";
import "../styles/SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <div className="dashboard-search">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <select
        className="category-dropdown"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="book">Books</option>
        <option value="calculator">Calculators</option>
        <option value="device">Devices</option>
      </select>
    </div>
  );
}
