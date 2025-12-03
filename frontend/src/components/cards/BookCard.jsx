import React from 'react';
import { Calculator, Book, Box, Zap } from 'lucide-react'; 
import '../../styles/dashboard.scss';

// Helper to assign icons based on book title keywords
const getItemIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('calculator')) return <Calculator size={24} />;
  if (t.includes('multimeter') || t.includes('arduino')) return <Zap size={24} />;
  if (t.includes('kit')) return <Box size={24} />;
  return <Book size={24} />;
};

const getIconStyle = (title) => {
  const t = title.toLowerCase();
  if (t.includes('calculator')) return 'icon-box-yellow';
  if (t.includes('multimeter') || t.includes('arduino')) return 'icon-box-orange';
  return 'icon-box-yellow';
};

const BookCard = ({ book, onAction, onView }) => { // Added onView prop
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="book-card">
      <div className="card-header">
        <div className={`item-icon-box ${getIconStyle(book.title)}`}>
          {getItemIcon(book.title)}
        </div>
        <div className="item-info">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
        </div>
      </div>

      <p className="item-description">
        Comprehensive resource for {book.title}. Includes fundamental concepts suitable for students.
      </p>

      <div className="badges-row">
        {isAvailable ? (
          <span className="badge badge-available">Available</span>
        ) : (
          <span className="badge badge-checked-out">Checked Out</span>
        )}
        <span className="badge badge-outline-yellow">
          {book.availableCopies > 3 ? 'Excellent' : 'Good'}
        </span>
      </div>

      <div className="card-actions">
        <button 
          className="btn-view-details" 
          onClick={() => onView(book)} // Trigger the View Modal
        >
          View Details
        </button>
        
        {isAvailable ? (
          <button 
            className="btn-request-book" 
            onClick={() => onAction(book.bookId)}
          >
            Request Book
          </button>
        ) : (
          <button className="btn-disabled" disabled>
            Currently Checked Out
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;