import React from 'react';

const style = {
  backgroundColor: 'transparent',
  color: 'var(--color-maroon)',
  border: '1px solid var(--color-maroon)',
  padding: '0 24px',
  height: '40px',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%'
};

const SecondaryButton = ({ children, onClick, ...props }) => (
  <button style={style} onClick={onClick} {...props}>
    {children}
  </button>
);

export default SecondaryButton;