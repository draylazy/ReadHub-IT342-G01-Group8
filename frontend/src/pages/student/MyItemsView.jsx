import React from 'react';
import { Box } from 'lucide-react';

const MyItemsView = () => {
  return (
    <div style={{ width: '100%', padding: '40px 0' }}>
      <h3 className="section-title">My Listed Items</h3>
      <div className="empty-state-card" style={{ width: '100%' }}>
        <Box size={64} className="empty-icon" strokeWidth={1} />
        <h4 className="empty-title">You haven't listed any items yet.</h4>
        <p className="empty-subtitle">Click "Add Book" to start sharing your resources.</p>
      </div>
    </div>
  );
};

export default MyItemsView;