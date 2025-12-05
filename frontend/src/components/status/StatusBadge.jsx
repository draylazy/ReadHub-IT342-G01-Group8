import React from 'react';

const getStyles = (status, copies) => {
  const base = { 
    padding: '4px 10px', 
    borderRadius: '12px', 
    fontSize: '11px', 
    fontWeight: 700, 
    textTransform: 'uppercase' 
  };

  // APPROVED
  if (status === 'APPROVED') {
    return { ...base, backgroundColor: '#DCFCE7', color: '#166534' }; // green
  }

  // BORROWED
  if (status === 'BORROWED') {
    return { ...base, backgroundColor: '#DBEAFE', color: '#1D4ED8' }; // blue
  }

  // PENDING
  if (status === 'PENDING') {
    return { ...base, backgroundColor: '#FEF9C3', color: '#CA8A04' }; // yellow
  }

  // REJECTED
  if (status === 'REJECTED') {
    return { ...base, backgroundColor: '#FEE2E2', color: '#B91C1C' }; // red
  }

  // Default / fallback
  return { ...base, backgroundColor: '#F3F4F6', color: '#374151' };
};

const StatusBadge = ({ status, copies = 1, label }) => {
  const text = label || status || (copies > 0 ? 'Available' : 'Out of Stock');
  return <span style={getStyles(status, copies)}>{text}</span>;
};

export default StatusBadge;
