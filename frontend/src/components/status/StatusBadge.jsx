import React from 'react';

const getStyles = (status, copies) => {
  const base = { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' };
  
  if (status === 'APPROVED' || status === 'BORROWED' || copies > 0) {
    return { ...base, backgroundColor: '#E6F4EA', color: 'var(--color-success)' }; // Green
  }
  if (status === 'PENDING') {
    return { ...base, backgroundColor: '#FFF4E5', color: 'var(--color-warning)' }; // Yellow
  }
  return { ...base, backgroundColor: '#FCE8E6', color: 'var(--color-danger)' }; // Red
};

const StatusBadge = ({ status, copies = 1, label }) => {
  const text = label || status || (copies > 0 ? 'Available' : 'Out of Stock');
  return <span style={getStyles(status, copies)}>{text}</span>;
};

export default StatusBadge;