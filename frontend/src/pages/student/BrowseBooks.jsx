// import React, { useEffect, useState } from 'react';
// import { Search, Plus, LayoutGrid, History, Package, Box, Clock } from 'lucide-react';
// import DashboardLayout from '../../components/layout/DashboardLayout';
// import BookCard from '../../components/cards/BookCard';
// import StatusBadge from '../../components/status/StatusBadge'; 
// import { useAuth } from '../../context/AuthContext';
// import '../../styles/dashboard.scss';

// const BrowseBooks = () => {
//   const [books, setBooks] = useState([]);
//   const [history, setHistory] = useState([]); 
//   const [activeTab, setActiveTab] = useState('browse');
//   const [keyword, setKeyword] = useState('');
//   const { token } = useAuth();

//   // 1. Fetch Books (Browse Tab)
//   useEffect(() => {
//     if (activeTab === 'browse') {
//       fetch(`http://localhost:8080/api/books?keyword=${keyword}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(res => res.json())
//       .then(data => setBooks(data))
//       .catch(err => console.error("Error fetching books:", err));
//     }
//   }, [token, keyword, activeTab]);

//   // 2. Fetch History (Activity Tab) - Replaces old StudentDashboard logic
//   useEffect(() => {
//     if (activeTab === 'activity') {
//       fetch('http://localhost:8080/api/transactions/my-history', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(res => res.json())
//       .then(data => setHistory(data))
//       .catch(err => console.error("Error fetching history:", err));
//     }
//   }, [token, activeTab]);

//   // 3. Handle Borrow Action
//   const handleBorrow = async (bookId) => {
//     const res = await fetch('http://localhost:8080/api/transactions/borrow', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ bookId })
//     });
//     if (res.ok) {
//       alert('Request Sent Successfully!');
//       setKeyword(prev => prev + ' '); // Trigger refresh
//     } else {
//       alert('Failed to request book.');
//     }
//   };

//   // 4. Calculate Stats for Activity View
//   const stats = {
//     total: history.length,
//     pending: history.filter(t => t.status === 'PENDING').length,
//     approved: history.filter(t => t.status === 'APPROVED').length,
//     returned: history.filter(t => t.status === 'RETURNED').length
//   };

//   // --- RENDER HELPERS ---

//   const renderBrowseContent = () => (
//     <div style={{ width: '100%' }}>
//       {/* FULL WIDTH SEARCH BAR */}
//       <div className="search-filter-container" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
//         <div className="search-input-wrapper" style={{ flex: 1, position: 'relative' }}>
//           <Search className="search-icon" size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
//           <input 
//             type="text" 
//             className="search-input" 
//             placeholder="Search items by title, author, or ISBN..." 
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             style={{ width: '100%' }}
//           />
//         </div>
//         <div className="filter-wrapper" style={{ minWidth: '200px' }}>
//           <select className="filter-dropdown" style={{ width: '100%' }}>
//             <option>All Categories</option>
//             <option>Books</option>
//             <option>Equipment</option>
//           </select>
//         </div>
//       </div>

//       {/* ITEMS GRID - Fills available space */}
//       <div className="books-grid">
//         {books.map(book => (
//           <BookCard key={book.bookId} book={book} onAction={handleBorrow} />
//         ))}
//       </div>
//     </div>
//   );

//   const renderMyItemsContent = () => (
//     <div style={{ width: '100%', padding: '40px 0' }}>
//       <h3 className="section-title">My Listed Items</h3>
//       <div className="empty-state-card" style={{ width: '100%' }}>
//         <Box size={64} className="empty-icon" strokeWidth={1} />
//         <h4 className="empty-title">You haven't listed any items yet.</h4>
//         <p className="empty-subtitle">Click "Add Book" to start sharing your resources.</p>
//       </div>
//     </div>
//   );

//   const renderActivityContent = () => (
//     <div style={{ width: '100%' }}>
//       {/* STATS GRID - Spans full width */}
//       <div className="stats-grid" style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
//         <div className="stat-card">
//           <span className="stat-label">Total Requests</span>
//           <span className="stat-value total">{stats.total}</span>
//         </div>
//         <div className="stat-card">
//           <span className="stat-label">Pending</span>
//           <span className="stat-value pending">{stats.pending}</span>
//         </div>
//         <div className="stat-card">
//           <span className="stat-label">Approved</span>
//           <span className="stat-value approved">{stats.approved}</span>
//         </div>
//         <div className="stat-card">
//           <span className="stat-label">Returned</span>
//           <span className="stat-value returned">{stats.returned}</span>
//         </div>
//       </div>

//       {/* HISTORY TABLE - Utilizes full width container */}
//       <div className="table-wrapper" style={{ width: '100%', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
//         {history.length > 0 ? (
//           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//             <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
//               <tr>
//                 <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Book Title</th>
//                 <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Author</th>
//                 <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
//                 <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Request Date</th>
//                 <th style={{ padding: '20px 24px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Due Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {history.map(txn => (
//                 <tr key={txn.transactionId} style={{ borderBottom: '1px solid #F3F4F6' }}>
//                   <td style={{ padding: '20px 24px', fontWeight: '600', color: '#111827' }}>{txn.book?.title}</td>
//                   <td style={{ padding: '20px 24px', color: '#6B7280' }}>{txn.book?.author}</td>
//                   <td style={{ padding: '20px 24px' }}><StatusBadge status={txn.status} /></td>
//                   <td style={{ padding: '20px 24px', color: '#4B5563' }}>{new Date(txn.requestDate).toLocaleDateString()}</td>
//                   <td style={{ padding: '20px 24px', color: '#4B5563' }}>{txn.dueDate ? new Date(txn.dueDate).toLocaleDateString() : '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="empty-state-card" style={{ border: 'none', boxShadow: 'none' }}>
//             <Clock size={64} className="empty-icon" strokeWidth={1} />
//             <h4 className="empty-title">No activity yet.</h4>
//             <p className="empty-subtitle">Start browsing items to make your first request!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <DashboardLayout>
//       {/* --- TOP ACTION BAR --- */}
//       <div className="action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', marginTop: '16px' }}>
//         <div className="tabs-group" style={{ display: 'flex', gap: '8px', background: '#F3F4F6', padding: '4px', borderRadius: '12px' }}>
//           <button 
//             className={`tab-btn ${activeTab === 'browse' ? 'active' : 'inactive'}`}
//             onClick={() => setActiveTab('browse')}
//             style={{ borderRadius: '8px' }} // Local override for cleaner look
//           >
//             <LayoutGrid size={18} />
//             Browse Items
//           </button>
//           <button 
//             className={`tab-btn ${activeTab === 'items' ? 'active' : 'inactive'}`}
//             onClick={() => setActiveTab('items')}
//             style={{ borderRadius: '8px' }}
//           >
//             <Package size={18} />
//             My Items
//           </button>
//           <button 
//             className={`tab-btn ${activeTab === 'activity' ? 'active' : 'inactive'}`}
//             onClick={() => setActiveTab('activity')}
//             style={{ borderRadius: '8px' }}
//           >
//             <History size={18} />
//             My Activity
//           </button>
//         </div>

//         <button className="btn-add-book">
//           <Plus size={18} />
//           Add Book
//         </button>
//       </div>

//       {/* --- CONTENT AREA (Switch based on Tab) --- */}
//       <div style={{ width: '100%' }}>
//         {activeTab === 'browse' && renderBrowseContent()}
//         {activeTab === 'items' && renderMyItemsContent()}
//         {activeTab === 'activity' && renderActivityContent()}
//       </div>

//     </DashboardLayout>
//   );
// };

// export default BrowseBooks;