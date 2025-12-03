import React from 'react';

const style = {
  backgroundColor: 'var(--color-maroon)',
  color: 'white',
  border: 'none',
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

const PrimaryButton = ({ children, onClick, disabled, ...props }) => (
  <button style={style} onClick={onClick} disabled={disabled} {...props}>
    {children}
  </button>
);

export default PrimaryButton;