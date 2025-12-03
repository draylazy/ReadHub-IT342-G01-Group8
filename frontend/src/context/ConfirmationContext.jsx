import React, { createContext, useContext, useState, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import '../styles/confirmation.scss';

const ConfirmationContext = createContext();

export const ConfirmationProvider = ({ children }) => {
  const [dialog, setDialog] = useState({ 
    show: false, 
    title: '', 
    message: '' 
  });

  // We use a ref to store the 'resolve' function of the Promise
  const resolveRef = useRef(null);

  const confirm = (message, title = "Confirm Action") => {
    setDialog({ show: true, title, message });
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleAction = (result) => {
    setDialog({ ...dialog, show: false });
    if (resolveRef.current) {
      resolveRef.current(result); // Resolve true or false
      resolveRef.current = null;
    }
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}

      {dialog.show && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <div className="confirm-icon">
              <AlertTriangle size={24} />
            </div>
            <h3 className="confirm-title">{dialog.title}</h3>
            <p className="confirm-message">{dialog.message}</p>
            
            <div className="confirm-actions">
              <button className="btn-cancel-conf" onClick={() => handleAction(false)}>
                Cancel
              </button>
              <button className="btn-yes-conf" onClick={() => handleAction(true)}>
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmationContext);