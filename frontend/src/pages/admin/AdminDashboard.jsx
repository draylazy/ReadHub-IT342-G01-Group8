import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Library, Clock, Plus, Search, Trash2, Edit2, Users, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/status/StatusBadge';
import AddBookModal from '../../components/modals/AddBookModal'; 
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmationContext';
import '../../styles/dashboard.scss';

const AdminDashboard = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, books: 0, overdue: 0, pending: 0 });
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState(''); 
  
  const [showModal, setShowModal] = useState(false); 
  const [editingBook, setEditingBook] = useState(null); 

  const { token } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  // --- HELPERS ---
  const getDaysRemaining = (dueDateString) => {
    if (!dueDateString) return null;
    const due = new Date(dueDateString);
    const today = new Date();
    due.setHours(0,0,0,0); today.setHours(0,0,0,0);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24)); 
  };

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const txnRes = await fetch('http://localhost:8080/api/transactions', { headers });
      const txnData = await txnRes.json();
      const safeTxn = Array.isArray(txnData) ? txnData : [];
      setTransactions(safeTxn);

      const bookRes = await fetch('http://localhost:8080/api/books', { headers });
      const bookData = await bookRes.json();
      const safeBooks = Array.isArray(bookData) ? bookData : [];
      setInventory(safeBooks);

      const userRes = await fetch('http://localhost:8080/api/users', { headers });
      const userData = await userRes.json();
      const safeUsers = Array.isArray(userData) ? userData : [];
      setUsers(safeUsers);

      // --- IMPROVED OVERDUE CALCULATION ---
      // Count if Status is OVERDUE OR (Status is BORROWED AND Date is Past)
      const realOverdueCount = safeTxn.filter(t => {
        if (t.status === 'OVERDUE') return true;
        if (t.status === 'BORROWED') {
           const days = getDaysRemaining(t.dueDate);
           return days < 0; // Negative days means overdue
        }
        return false;
      }).length;

      setStats({
        users: safeUsers.length,
        books: safeBooks.reduce((acc, b) => acc + b.totalCopies, 0),
        overdue: realOverdueCount, // Use the smart count
        pending: safeTxn.filter(t => t.status === 'PENDING').length
      });

    } catch (err) {
      console.error(err);
      showToast("Failed to load dashboard data", "error");
      setTransactions([]);
      setInventory([]);
      setUsers([]);
    }
  }, [token, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- ACTIONS (Keep existing handleDeleteUser, handleStatusUpdate, etc.) ---
  const handleDeleteUser = async (userId) => {
    const isConfirmed = await confirm("Delete this user? If they have borrowed books in the past, this action will fail to preserve records.", "Delete User");
    if (!isConfirmed) return;
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { showToast("User deleted successfully", 'success'); fetchData(); } 
      else { showToast("Cannot delete user with history.", 'error'); }
    } catch (e) { showToast("Network Error", 'error'); }
  };

  const handleStatusUpdate = async (id, status) => {
    const isConfirmed = await confirm(`Update status to ${status}?`, "Confirm Action");
    if(!isConfirmed) return;
    try {
      const res = await fetch(`http://localhost:8080/api/transactions/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
      if (res.ok) { setTransactions(prev => prev.map(t => t.transactionId === id ? { ...t, status: status } : t)); fetchData(); showToast(`Transaction updated`, 'success'); } 
      else { const d = await res.json(); showToast(`Error: ${d.message}`, 'error'); }
    } catch (err) { showToast("Network Error", 'error'); }
  };

  const handleDeleteBook = async (id) => {
    const isConfirmed = await confirm("Delete book?", "Delete Book");
    if(!isConfirmed) return;
    try {
      const res = await fetch(`http://localhost:8080/api/books/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { showToast("Book deleted", 'success'); fetchData(); } 
      else { showToast("Failed to delete", 'error'); }
    } catch(e) { console.error(e); }
  };

  const handleBookSubmit = async (formData) => {
    try {
      const payload = { title: formData.title, author: formData.author, isbn: formData.isbn, publicationYear: parseInt(formData.publicationYear), totalCopies: parseInt(formData.totalCopies), categoryId: parseInt(formData.categoryId) };
      let url = 'http://localhost:8080/api/books'; let method = 'POST';
      if (editingBook) { url = `http://localhost:8080/api/books/${editingBook.bookId}`; method = 'PUT'; }
      const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { showToast("Saved!", 'success'); setShowModal(false); fetchData(); } 
      else { showToast("Failed", 'error'); }
    } catch (err) { showToast("Network Error", 'error'); }
  };

  const openAddModal = () => { setEditingBook(null); setShowModal(true); };
  const openEditModal = (book) => { setEditingBook(book); setShowModal(true); };

  // --- RENDER FUNCTIONS ---

  const renderOverview = () => (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <div className="stat-card"><span className="stat-label">Pending</span><span className="stat-value pending">{stats.pending}</span></div>
      <div className="stat-card" style={{ borderTop: '4px solid #DC2626' }}><span className="stat-label">Overdue</span><span className="stat-value" style={{ color: '#DC2626' }}>{stats.overdue}</span></div>
      <div className="stat-card"><span className="stat-label">Inventory</span><span className="stat-value total">{stats.books}</span></div>
      <div className="stat-card"><span className="stat-label">Students</span><span className="stat-value" style={{ color: '#4B5563' }}>{stats.users}</span></div>
    </div>
  );

  const renderTransactions = () => (
    <div className="table-wrapper">
      <table>
        <thead><tr><th>Student</th><th>Book</th><th>Status</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
        <tbody>
          {transactions.map(txn => {
            // Calculate overdue status dynamically for visual row
            const daysLeft = getDaysRemaining(txn.dueDate);
            const isLate = (txn.status === 'BORROWED' && daysLeft < 0) || txn.status === 'OVERDUE';

            return (
              <tr key={txn.transactionId} style={isLate ? { backgroundColor: '#FEF2F2' } : {}}>
                <td><div style={{ fontWeight: 600 }}>{txn.user?.firstName} {txn.user?.lastName}</div><div style={{ fontSize: 12, color: '#6B7280' }}>{txn.user?.email}</div></td>
                <td>
                    {txn.book?.title}
                    {isLate && (
                        <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <AlertTriangle size={12} /> OVERDUE {Math.abs(daysLeft)} DAYS
                        </div>
                    )}
                </td>
                <td><StatusBadge status={txn.status === 'BORROWED' && daysLeft < 0 ? 'OVERDUE' : txn.status} /></td>
                <td>{new Date(txn.requestDate).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    {txn.status === 'PENDING' && <><button onClick={() => handleStatusUpdate(txn.transactionId, 'APPROVED')} className="badge badge-available" style={{ border: 'none', cursor: 'pointer' }}>Approve</button><button onClick={() => handleStatusUpdate(txn.transactionId, 'REJECTED')} className="badge badge-checked-out" style={{ border: 'none', cursor: 'pointer' }}>Reject</button></>}
                    {txn.status === 'APPROVED' && <button onClick={() => handleStatusUpdate(txn.transactionId, 'BORROWED')} className="badge badge-outline-green" style={{ cursor: 'pointer' }}>Confirm Pickup</button>}
                    {(txn.status === 'BORROWED' || txn.status === 'OVERDUE') && <button onClick={() => handleStatusUpdate(txn.transactionId, 'RETURNED')} className="badge badge-outline-yellow" style={{ cursor: 'pointer' }}>Mark Returned</button>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderInventory = () => (
    <div className="table-wrapper">
      <table>
        <thead><tr><th>ISBN</th><th>Title</th><th>Category</th><th>Stock</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
        <tbody>
          {inventory.map(book => (
            <tr key={book.bookId}>
              <td style={{ fontFamily: 'monospace', color: '#6B7280' }}>{book.isbn}</td>
              <td style={{ fontWeight: 600 }}>{book.title}</td>
              <td>{book.category?.name}</td>
              <td><span className={`badge ${book.availableCopies > 0 ? 'badge-available' : 'badge-checked-out'}`}>{book.availableCopies}/{book.totalCopies}</span></td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => openEditModal(book)} className="btn-view-details" style={{ padding: '6px' }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteBook(book.bookId)} className="btn-view-details" style={{ padding: '6px', color: '#DC2626', background: '#FEF2F2' }}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsers = () => {
    const filteredUsers = users.filter(u => 
      u.firstName.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.lastName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="search-filter-container" style={{ marginBottom: '24px' }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search students by name or email..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', background: 'white', border: '1px solid var(--border-light)', borderRadius: '8px', fontWeight: '600', color: 'var(--text-sub)' }}>
            {filteredUsers.length} Students
          </div>
        </div>

        <div className="table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student Identity</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.userId} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '50%', 
                        background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontWeight: '700', color: '#821124', fontSize: '18px',
                        backgroundImage: u.avatarUrl ? `url(${u.avatarUrl})` : 'none', 
                        backgroundSize: 'cover', 
                        boxShadow: '0 0 0 2px white, 0 0 0 4px #F3F4F6'
                      }}>
                        {!u.avatarUrl && u.firstName.charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>{u.firstName} {u.lastName}</span>
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {(() => {
                        const hasActiveLoan = transactions.some(t => t.user?.userId === u.userId && (t.status === 'BORROWED' || t.status === 'OVERDUE'));
                        return hasActiveLoan ? (
                            <span className="badge" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' }}>HAS ACTIVE LOAN</span>
                        ) : (
                            <span className="badge" style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' }}>NO ACTIVITY</span>
                        );
                    })()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => handleDeleteUser(u.userId)} title="Delete User" className="btn-view-details" style={{ padding: '10px', color: '#DC2626', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FECACA'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E5E7EB'; }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan="3" style={{ padding: '60px 0', textAlign: 'center' }}><div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', opacity: 0.6 }}><Users size={48} color="#9CA3AF" strokeWidth={1} /><span style={{ color: '#6B7280', fontSize: '14px' }}>{userSearch ? `No students found matching "${userSearch}"` : "No registered students yet."}</span></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="action-bar">
        <div className="tabs-group">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={18} /> Overview</button>
          <button className={`tab-btn ${activeTab === 'transactions' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('transactions')}><Clock size={18} /> Transactions</button>
          <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('inventory')}><Library size={18} /> Inventory</button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('users')}><Users size={18} /> Students</button>
        </div>
        {activeTab === 'inventory' && <button className="btn-add-book" onClick={openAddModal}><Plus size={18} /> Add Book</button>}
      </div>

      {activeTab === 'overview' && <>{renderOverview()}<h3 className="section-title">Recent Transactions</h3>{renderTransactions()}</>}
      {activeTab === 'transactions' && renderTransactions()}
      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'users' && renderUsers()}

      {showModal && <AddBookModal onClose={() => setShowModal(false)} onSubmit={handleBookSubmit} initialData={editingBook} />}
    </DashboardLayout>
  );
};

export default AdminDashboard;