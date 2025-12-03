import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react'; // Added Sparkles icon
import '../../styles/dashboard.scss';

const AddBookModal = ({ onClose, onSubmit, initialData }) => {
  // Static categories matching your backend seeder
  const categories = [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Science' },
      { id: 3, name: 'Fiction' },
      { id: 4, name: 'Self-help' },
      { id: 5, name: 'Other' }
  ];

  // --- NEW: PRESET BOOKS FOR DEMO ---
  const PRESETS = [
    { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", year: 2008, copies: 5, catId: 1 },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "978-0201616224", year: 1999, copies: 3, catId: 1 },
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", year: 2009, copies: 2, catId: 1 },
    { title: "Design Patterns", author: "Erich Gamma", isbn: "978-0201633610", year: 1994, copies: 4, catId: 1 },
    { title: "Sapiens: A Brief History", author: "Yuval Noah Harari", isbn: "978-0062316097", year: 2015, copies: 5, catId: 2 },
    { title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", year: 2018, copies: 10, catId: 4 }
  ];

  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    totalCopies: 1,
    categoryId: 1 
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        publicationYear: initialData.publicationYear || '',
        totalCopies: initialData.totalCopies || 1,
        categoryId: initialData.category?.categoryId || 1
      });
    }
  }, [initialData]);

  // --- NEW: Handle Preset Selection ---
  const handlePresetChange = (e) => {
    const index = e.target.value;
    if (index === "") return; // "Select..." option

    const book = PRESETS[index];
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publicationYear: book.year,
      totalCopies: book.copies,
      categoryId: book.catId
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-title">
            <h2>{initialData ? 'Edit Book' : 'Add Book'}</h2>
            <p>{initialData ? 'Update book details' : 'List a book or resource'}</p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          
          {/* --- NEW: QUICK FILL DROPDOWN (Only for Add Mode) --- */}
          {!initialData && (
            <div style={{ marginBottom: '20px', padding: '12px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#0284C7', marginBottom: '8px' }}>
                <Sparkles size={14} /> Quick Fill (Demo Mode)
              </label>
              <select 
                className="form-input" 
                onChange={handlePresetChange}
                defaultValue=""
                style={{ borderColor: '#BAE6FD' }}
              >
                <option value="">Select a popular book...</option>
                {PRESETS.map((book, idx) => (
                  <option key={idx} value={idx}>{book.title} ({book.author})</option>
                ))}
              </select>
            </div>
          )}

          <form id="add-book-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input 
                className="form-input" 
                placeholder="e.g., Clean Code"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Author / Brand *</label>
                <input 
                  className="form-input" 
                  placeholder="e.g., Robert C. Martin"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select 
                  className="form-input"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
               <div className="form-group">
                <label className="form-label">ISBN / Serial No. *</label>
                <input 
                  className="form-input" 
                  placeholder="e.g., 978-0132350884"
                  value={form.isbn}
                  onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Year</label>
                <input 
                  type="number"
                  className="form-input" 
                  placeholder="2024"
                  value={form.publicationYear}
                  onChange={(e) => setForm({ ...form, publicationYear: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Total Copies *</label>
              <input 
                type="number"
                min="1"
                className="form-input" 
                value={form.totalCopies}
                onChange={(e) => setForm({ ...form, totalCopies: parseInt(e.target.value) })}
                required
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" form="add-book-form" className="btn-confirm">
            {initialData ? 'Save Changes' : 'Add Item'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddBookModal;