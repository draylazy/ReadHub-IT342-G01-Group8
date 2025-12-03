import React from 'react';
import '../../styles/variables.scss';

const styles = {
  container: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' },
  input: {
    width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px',
    border: '1px solid var(--color-border)', fontSize: '14px'
  }
};

const TextInput = ({ label, type = "text", ...props }) => (
  <div style={styles.container}>
    {label && <label style={styles.label}>{label}</label>}
    <input style={styles.input} type={type} {...props} />
  </div>
);

export default TextInput;