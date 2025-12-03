import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { LayoutGrid, History } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BrowseView from './BrowseView';
import ActivityView from './ActivityView';
import UrgentActionModal from '../../components/modals/UrgentActionModal'; // Import Modal
import { useAuth } from '../../context/AuthContext'; // Import Auth
import '../../styles/dashboard.scss';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  
  // --- ADVISORY LOGIC ---
  const [showAdvisory, setShowAdvisory] = useState(false);
  const [overdueItems, setOverdueItems] = useState([]);
  const [dueSoonItems, setDueSoonItems] = useState([]);
  const { token } = useAuth();

  // Helper: Days Remaining (Same as Admin)
  const getDaysRemaining = (dueDateString) => {
    if (!dueDateString) return null;
    const due = new Date(dueDateString);
    const today = new Date();
    due.setHours(0,0,0,0); today.setHours(0,0,0,0);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24)); 
  };

  const checkUrgency = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/transactions/my-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      const activeLoans = data.filter(t => t.status === 'BORROWED' || t.status === 'OVERDUE');
      
      const overdue = activeLoans.filter(t => t.status === 'OVERDUE' || getDaysRemaining(t.dueDate) < 0);
      const dueSoon = activeLoans.filter(t => {
        const days = getDaysRemaining(t.dueDate);
        return days >= 0 && days <= 2; // Due within 2 days
      });

      if (overdue.length > 0 || dueSoon.length > 0) {
        setOverdueItems(overdue);
        setDueSoonItems(dueSoon);
        setShowAdvisory(true);
      }
    } catch(e) { console.error(e); }
  }, [token]);

  useEffect(() => {
    checkUrgency();
  }, [checkUrgency]);

  return (
    <DashboardLayout>
      {/* ... (Existing Action Bar code) ... */}
      <div className="action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', marginTop: '16px' }}>
        <div className="tabs-group" style={{ display: 'flex', gap: '8px', background: '#F3F4F6', padding: '4px', borderRadius: '12px' }}>
          <button 
            className={`tab-btn ${activeTab === 'browse' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('browse')}
            style={{ borderRadius: '8px' }}
          >
            <LayoutGrid size={18} />
            Browse Items
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('activity')}
            style={{ borderRadius: '8px' }}
          >
            <History size={18} />
            My Activity
          </button>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        {activeTab === 'browse' && <BrowseView />}
        {activeTab === 'activity' && <ActivityView />}
      </div>

      {/* --- THE ADVISORY MODAL --- */}
      {showAdvisory && (
        <UrgentActionModal 
          onClose={() => setShowAdvisory(false)}
          overdueItems={overdueItems}
          dueSoonItems={dueSoonItems}
        />
      )}

    </DashboardLayout>
  );
};

export default StudentDashboard;